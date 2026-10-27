const edgeCache = new Map();
const CACHE_DURATION = 31536000000; 

export async function GET(request) {
  try {
    const cacheKey = 'arbain-all-42';
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

    console.log('Fetching all 42 Arbain hadis...');

    const promises = Array.from({ length: 42 }, (_, i) => i + 1).map(async (num) => {
      try {
        const res = await fetch(`https://api.myquran.com/v2/hadits/arbain/${num}`, {
          next: { 
            revalidate: 31536000, 
            tags: [`hadis-arbain-${num}`] 
          },
          signal: AbortSignal.timeout(8000),
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Hadis-NextJS/1.0',
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch Arbain ${num}: ${res.status}`);
          return null;
        }

        const data = await res.json();

        if (!data.status || !data.data) {
          console.error(`Invalid data for Arbain ${num}`);
          return null;
        }

        return {
          id: `arbain-${data.data.no}`,
          category: "Arbain",
          no: data.data.no,
          judul: data.data.judul,
          rawi: data.data.rawi,
          arab: data.data.arab,
          indo: data.data.indo,
        };
      } catch (err) {
        console.error(`Error fetching Arbain ${num}:`, err.message);
        return null;
      }
    });

    const results = await Promise.allSettled(promises);
    
    const arbainHadis = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value)
      .sort((a, b) => a.no - b.no);

    if (arbainHadis.length === 0) {
      return Response.json(
        { error: "Failed to fetch Arbain hadis" },
        { status: 500 }
      );
    }

    console.log(`Successfully fetched ${arbainHadis.length}/42 Arbain hadis`);

    edgeCache.set(cacheKey, {
      data: arbainHadis,
      timestamp: now
    });

    // Cleanup old cache
    if (edgeCache.size > 100) {
      const oldestKeys = Array.from(edgeCache.keys()).slice(0, 20);
      oldestKeys.forEach(key => edgeCache.delete(key));
    }

    return Response.json(arbainHadis, {
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400, max-age=31536000',
        'X-Cache-Status': 'MISS-STORED',
        'CDN-Cache-Control': 'public, s-maxage=31536000',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000',
        'Expires': new Date(now + CACHE_DURATION).toUTCString(),
      },
    });

  } catch (error) {
    console.error('Arbain API Route Error:', error);
    return Response.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}