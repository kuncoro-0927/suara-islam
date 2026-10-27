const edgeCache = new Map();
const CACHE_DURATION = 31536000000; 

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const perPage = parseInt(searchParams.get('perPage')) || 30;
    const totalHadis = 1359;

    // Validate parameters
    if (page < 1 || perPage < 1 || perPage > 100) {
      return Response.json(
        { error: "Invalid parameters" }, 
        { status: 400 }
      );
    }

    const cacheKey = `bm-page-${page}-${perPage}`;
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
    const endIndex = Math.min(startIndex + perPage, totalHadis);

    if (startIndex >= totalHadis) {
      return Response.json(
        { error: "Page out of range" }, 
        { status: 404 }
      );
    }

    console.log(`Fetching Bulughul Maram page ${page} (${startIndex + 1}-${endIndex})...`);

    const hadisNumbers = [];
    for (let i = startIndex + 1; i <= endIndex; i++) {
      hadisNumbers.push(i);
    }

    const promises = hadisNumbers.map(async (num) => {
      try {
        const res = await fetch(`https://api.myquran.com/v2/hadits/bm/${num}`, {
          next: { 
            revalidate: 31536000,
            tags: [`hadis-bm-${num}`] 
          },
          signal: AbortSignal.timeout(8000),
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Hadis-NextJS/1.0',
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch BM ${num}: ${res.status}`);
          return null;
        }

        const data = await res.json();

        if (!data.status || !data.data) {
          console.error(`Invalid data for BM ${num}`);
          return null;
        }

        return {
          id: `bm-${data.data.no}`,
          category: "Bulughul Maram",
          no: data.data.no,
          judul: `Bulughul Maram No.${data.data.no}`,
          rawi: "Bulughul Maram",
          ar: data.data.ar,
          id_text: data.data.id,
        };
      } catch (err) {
        console.error(`Error fetching BM ${num}:`, err.message);
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
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalHadis: totalHadis,
        totalPages: Math.ceil(totalHadis / perPage),
        hasNextPage: endIndex < totalHadis,
        hasPrevPage: page > 1,
      }
    };

    console.log(`Successfully fetched ${hadisData.length} hadis for page ${page}`);

    edgeCache.set(cacheKey, {
      data: responseData,
      timestamp: now
    });

    if (edgeCache.size > 200) {
      const oldestKeys = Array.from(edgeCache.keys()).slice(0, 50);
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
    console.error('Bulughul Maram API Route Error:', error);
    return Response.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}