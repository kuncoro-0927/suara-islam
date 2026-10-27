import Fuse from "fuse.js";

class HadisService {
  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.maxConcurrent = 25;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + 20 * 60 * 1000,
    });
    
    if (this.cache.size > 200) {
      this.cleanExpiredCache();
    }
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  cleanExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expires < now) {
        this.cache.delete(key);
      }
    }
  }

  async queueRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, options, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const batch = this.requestQueue.splice(0, this.maxConcurrent);

      const promises = batch.map(async ({ url, options, resolve, reject }) => {
        try {
          const cacheKey = url;
          const cached = this.getCache(cacheKey);
          if (cached) {
            resolve(cached);
            return;
          }

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 7000);

          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              ...options.headers,
            },
            // Browser cache untuk client-side
            cache: 'force-cache',
          });

          clearTimeout(timeout);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const result = await response.json();

          // API internal langsung return data, tidak ada wrapper result.status
          if (result) {
            this.setCache(cacheKey, result);
            resolve(result);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error(`Request failed for ${url}:`, error);
          resolve(null);
        }
      });

      await Promise.allSettled(promises);

      if (this.requestQueue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 51));
      }
    }

    this.isProcessingQueue = false;
  }

  // shuffle
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // generate sample numbers
  generateSampleNumbers(min, max, count) {
    const numbers = [];
    const used = new Set();

    while (numbers.length < count && numbers.length < max - min + 1) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!used.has(num)) {
        used.add(num);
        numbers.push(num);
      }
    }

    return numbers.sort((a, b) => a - b);
  }

  // Fetch hadis dari perawi menggunakan /api/perawi/[slug]/route.js
  async fetchHadisFromPerawi(
    slug,
    maxFetch = 20,
    startNum = 1,
    onProgress = null
  ) {
    const perawiCategories = {
      "abu-dawud": { name: "Abu Dawud", maxHadis: 4590, sampleRange: [1, 150] },
      ahmad: { name: "Ahmad", maxHadis: 26363, sampleRange: [1, 150] },
      bukhari: { name: "Bukhari", maxHadis: 7008, sampleRange: [1, 150] },
      darimi: { name: "Darimi", maxHadis: 3367, sampleRange: [1, 150] },
      "ibnu-majah": { name: "Ibnu Majah", maxHadis: 4341, sampleRange: [1, 150] },
      malik: { name: "Malik", maxHadis: 1594, sampleRange: [1, 100] },
      muslim: { name: "Muslim", maxHadis: 5362, sampleRange: [1, 150] },
      nasai: { name: "Nasai", maxHadis: 5662, sampleRange: [1, 150] },
      tirmidzi: { name: "Tirmidzi", maxHadis: 3891, sampleRange: [1, 150] },
    };

    const perawiInfo = perawiCategories[slug];
    if (!perawiInfo) {
      return [];
    }

    try {
      // Generate smart sample numbers
      const [min, max] = perawiInfo.sampleRange;
      const endRange = Math.min(max, startNum + maxFetch - 1);
      const numbers = this.generateSampleNumbers(startNum, endRange, maxFetch);

      let completed = 0;
      const hadisPromises = numbers.map(async (num) => {
        // Gunakan route /api/perawi/[slug]
        const url = `/api/perawi/${slug}?id=${num}`;
        const result = await this.queueRequest(url);

        completed++;
        if (onProgress) {
          onProgress(completed, numbers.length);
        }

        if (result) {
          return {
            id: `${slug}-${result.no || num}`,
            category: perawiInfo.name,
            no: result.no || num,
            judul: result.judul || `${perawiInfo.name} No.${result.no || num}`,
            rawi: result.rawi || perawiInfo.name,
            arab: result.arab || result.ar,
            indo: result.indo || result.id,
          };
        }
        return null;
      });

      const results = await Promise.allSettled(hadisPromises);
      return results
        .filter(
          (result) => result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);
    } catch (err) {
      console.error(`Error fetching from ${slug}:`, err);
      return [];
    }
  }

  // Fetch Bulughul Maram menggunakan /api/bulughul-maram/route.js
  async fetchBulughulMaram(maxCount = 100) {
    try {
      const numbers = Array.from({ length: maxCount }, (_, i) => i + 1);
      let completed = 0;

      const promises = numbers.map(async (num) => {
        // Gunakan route /api/bulughul-maram
        const url = `/api/bulughul-maram?id=${num}`;
        const result = await this.queueRequest(url);

        completed++;

        if (result) {
          return {
            id: `bm-${result.no || num}`,
            category: "Bulughul Maram",
            no: result.no || num,
            judul: result.judul || `Bulughul Maram No.${result.no || num}`, 
            rawi: result.rawi || "Bulughul Maram",
            arab: result.arab || result.ar,
            indo: result.indo || result.id || result.id_text,
          };
        }
        return null;
      });

      const results = await Promise.allSettled(promises);
      return results
        .filter(
          (result) => result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);
    } catch (err) {
      console.error("Error fetching Bulughul Maram:", err);
      return [];
    }
  }

  // Fetch Arbain menggunakan hadis/api/arbain/route.js
  async fetchArbain() {
    try {
      const promises = Array.from({ length: 42 }, (_, i) => {
        const hadisId = i + 1;
        // Gunakan route hadis/api/arbain
        const url = `/hadis/api/arbain?id=${hadisId}`;
        return this.queueRequest(url);
      });

      const results = await Promise.allSettled(promises);

      return results
        .filter(r => r.status === "fulfilled" && r.value !== null)
        .map((r, index) => {
          const result = r.value;
          const hadisId = index + 1;

          return {
            id: `arbain-${result.no || hadisId}`,
            category: "Arbain",
            no: result.no || hadisId,
            judul: result.judul || `Arbain No.${result.no || hadisId}`,
            rawi: result.rawi || "Arbain Nawawi",
            arab: result.arab || result.ar,
            indo: result.indo || result.id,
          };
        });

    } catch (err) {
      console.error("Error fetching Arbain:", err);
      return [];
    }
  }
 
  // Fitur Search
  searchHadis(query, hadisList, searchInContent = false) {
    if (!query || !hadisList || hadisList.length === 0) return hadisList;

    if (searchInContent) {
      const fuse = new Fuse(hadisList, {
        keys: [
          { name: "judul", weight: 0.3 },
          { name: "indo", weight: 0.4 },
          { name: "arab", weight: 0.1 }, 
          { name: "no", weight: 0.2 },
          { name: "category", weight: 0.2 }
        ],
        threshold: 0.4,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 2,
        ignoreLocation: true, 
        findAllMatches: true  
      });

      return fuse.search(query).map(r => r.item);
    }

    const fuse = new Fuse(hadisList, {
      keys: [
        { name: "judul", weight: 0.6 },
        { name: "no", weight: 0.3 },
        { name: "category", weight: 0.3 }
      ],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true 
    });

    return fuse.search(query).map(r => r.item);
  }

  highlightSearchTerm(text, searchTerm) {
    if (!text || !searchTerm) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
    );
  }
}

// Export singleton instance
export const hadisService = new HadisService();