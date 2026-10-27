const edgeCache = new Map();
const CACHE_DURATION = 31536000000; 

const PERAWI_CONFIG = {
  "abu-dawud": { name: "Abu Dawud", maxHadis: 4590, batchSize: 50 },
  "ahmad": { name: "Ahmad", maxHadis: 26363, batchSize: 50 },
  "bukhari": { name: "Bukhari", maxHadis: 7008, batchSize: 50 },
  "darimi": { name: "Darimi", maxHadis: 3367, batchSize: 50 },
  "ibnu-majah": { name: "Ibnu Majah", maxHadis: 4341, batchSize: 50 },
  "malik": { name: "Malik", maxHadis: 1594, batchSize: 50 },
  "muslim": { name: "Muslim", maxHadis: 5362, batchSize: 50 },
  "nasai": { name: "Nasai", maxHadis: 5662, batchSize: 50 },
  "tirmidzi": { name: "Tirmidzi", maxHadis: 3891, batchSize: 50 },
};

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const perPage = parseInt(searchParams.get('perPage')) || 30;

    // Validate perawi
    const perawiConfig = PERAWI_CONFIG[slug];
    if (!perawiConfig) {
      return Response.json(
        { error: "Invalid perawi slug" }, 
        { status: 404 }
      );
    }

    if (page < 1 || perPage < 1 || perPage > 100) {
      return Response.json(
        { error: "Invalid parameters" }, 
        { status: 400 }
      );
    }

    const cacheKey = `perawi-${slug}-page-${page}-${perPage}`;
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

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, perawiConfig.maxHadis);

    if (startIndex >= perawiConfig.maxHadis) {
      return Response.json(
        { error: "Page out of range" }, 
        { status: 404 }
      );
    }

    console.log(`Fetching ${perawiConfig.name} page ${page} (${startIndex + 1}-${endIndex})...`);

    const hadisNumbers = [];
    for (let i = startIndex + 1; i <= endIndex; i++) {
      hadisNumbers.push(i);
    }

    const promises = hadisNumbers.map(async (num) => {
      try {
        const res = await fetch(`https://api.myquran.com/v2/hadits/${slug}/${num}`, {
          next: { 
            revalidate: 31536000,
            tags: [`hadis-${slug}-${num}`] 
          },
          signal: AbortSignal.timeout(8000),
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Hadis-NextJS/1.0',
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch ${slug} ${num}: ${res.status}`);
          return null;
        }

        const data = await res.json();

        if (!data.status || !data.data) {
          console.error(`Invalid data for ${slug} ${num}`);
          return null;
        }

        const perawiName = data.info?.perawi?.name || perawiConfig.name;
        return {
          id: `${slug}-${data.data.number}`,
          category: perawiName,
          no: data.data.number,
          judul: data.data.judul || `${perawiName} No.${data.data.number}`,
          rawi: perawiName,
          arab: data.data.arab || data.data.ar,
          indo: data.data.indo || data.data.id,
        };
      } catch (err) {
        console.error(`Error fetching ${slug} ${num}:`, err.message);
        return null;
      }
    });

    const results = await Promise.allSettled(promises);
    
    const hadisData = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value)
      .sort((a, b) => a.no - b.no);

    if (hadisData.length === 0) {
      return Response.json(
        { error: "Failed to fetch hadis data" },
        { status: 500 }
      );
    }

    const responseData = {
      data: hadisData,
      perawi: {
        slug: slug,
        name: perawiConfig.name,
        maxHadis: perawiConfig.maxHadis,
      },
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalHadis: perawiConfig.maxHadis,
        totalPages: Math.ceil(perawiConfig.maxHadis / perPage),
        hasNextPage: endIndex < perawiConfig.maxHadis,
        hasPrevPage: page > 1,
      }
    };

    console.log(`Successfully fetched ${hadisData.length} hadis for ${perawiConfig.name} page ${page}`);

    edgeCache.set(cacheKey, {
      data: responseData,
      timestamp: now
    });

    if (edgeCache.size > 300) {
      const oldestKeys = Array.from(edgeCache.keys()).slice(0, 100);
      oldestKeys.forEach(key => edgeCache.delete(key));
    }

    return Response.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400, max-age=31536000',
        'X-Cache-Status': 'MISS-STORED',
        'CDN-Cache-Control': 'public, s-maxage=31536000',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000',
        'Expires': new Date(now + CACHE_DURATION).toUTCString(),
      },
    });

  } catch (error) {
    console.error('Perawi API Route Error:', error);
    return Response.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}