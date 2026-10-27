const edgeCache = new Map();
const CACHE_DURATION = 31536000000; 

// Konfigurasi kategori hadis
const categoryConfig = {
  "Bulughul Maram": {
    endpoint: "bm",
    maxHadis: 1359,
  },
  "Arbain": {
    endpoint: "arbain",
    maxHadis: 42,
  },
  "Abu Dawud": {
    endpoint: "abu-dawud",
    maxHadis: 4590,
  },
  "Ahmad": {
    endpoint: "ahmad",
    maxHadis: 26363,
  },
  "Bukhari": {
    endpoint: "bukhari",
    maxHadis: 7008,
  },
  "Darimi": {
    endpoint: "darimi",
    maxHadis: 3367,
  },
  "Ibnu Majah": {
    endpoint: "ibnu-majah",
    maxHadis: 4341,
  },
  "Malik": {
    endpoint: "malik",
    maxHadis: 1594,
  },
  "Muslim": {
    endpoint: "muslim",
    maxHadis: 5362,
  },
  "Nasai": {
    endpoint: "nasai",
    maxHadis: 5662,
  },
  "Tirmidzi": {
    endpoint: "tirmidzi",
    maxHadis: 3891,
  },
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const hadisId = parseInt(id);
    
    // Ambil category dari query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'Arbain';
    if (isNaN(hadisId) || hadisId < 1) {
      return Response.json(
        { error: "Invalid ID format" }, 
        { status: 400 }
      );
    }

    const config = categoryConfig[category];
    if (!config) {
      return Response.json(
        { error: `Unknown category: ${category}` },
        { status: 400 }
      );
    }

    if (hadisId > config.maxHadis) {
      return Response.json(
        { error: `Hadis ID ${hadisId} exceeds maximum ${config.maxHadis} for ${category}` },
        { status: 404 }
      );
    }

    const cacheKey = `hadis-${config.endpoint}-${hadisId}`;
    const now = Date.now();

    if (edgeCache.has(cacheKey)) {
      const cached = edgeCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        return Response.json(cached.data, {
          headers: {
            'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400, max-age=31536000',
            'X-Cache-Status': 'HIT-EDGE',
          },
        });
      }
    }

    console.log(`Fetching hadis ${category} #${hadisId}...`);

    // Fetch hadis dengan timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(
        `https://api.myquran.com/v2/hadits/${config.endpoint}/${hadisId}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Hadis-NextJS/1.0',
            'Connection': 'keep-alive',
          },
          next: { 
            revalidate: 31536000,
            tags: [`hadis-${config.endpoint}-${hadisId}`]
          },
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`External API error for ${category} #${hadisId}:`, res.status);
        
        if (res.status === 404) {
          return Response.json(
            { error: `Hadis ${category} #${hadisId} not found` },
            { status: 404 }
          );
        }
        
        return Response.json(
          { error: "Failed to fetch hadis from external API" },
          { status: 500 }
        );
      }

      const result = await res.json();

      if (!result.status || !result.data) {
        return Response.json(
          { error: "Invalid data structure from API" },
          { status: 500 }
        );
      }

      const hadisData = {
        ...result.data,
        category: category,
        endpoint: config.endpoint,
      };

      edgeCache.set(cacheKey, {
        data: hadisData,
        timestamp: now
      });

      if (edgeCache.size > 200) {
        const oldestKeys = Array.from(edgeCache.keys()).slice(0, 50);
        oldestKeys.forEach(key => edgeCache.delete(key));
      }

      console.log(`Successfully fetched hadis ${category} #${hadisId}`);

      return Response.json(hadisData, {
        headers: {
          'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400, max-age=31536000',
          'X-Cache-Status': 'MISS-STORED',
          'CDN-Cache-Control': 'public, s-maxage=31536000',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000',
          'Expires': new Date(now + CACHE_DURATION).toUTCString(),
          'ETag': `hadis-${config.endpoint}-${hadisId}-${now}`,
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return Response.json(
          { error: "Request timeout" },
          { status: 408 }
        );
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Hadis API Route Error:', error);
    return Response.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
