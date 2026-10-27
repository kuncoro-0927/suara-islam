export async function GET() {
  const edgeCache = new Map();
  const CACHE_DURATION = 31536000000;
  
  try {
    const now = Date.now();
    const perawiCategories = {
      "abu-dawud": { name: "Abu Dawud", sampleRange: [1, 100] },
      "ahmad": { name: "Ahmad", sampleRange: [1, 100] },
      "bukhari": { name: "Bukhari", sampleRange: [1, 100] },
      "darimi": { name: "Darimi", sampleRange: [1, 100] },
      "ibnu-majah": { name: "Ibnu Majah", sampleRange: [1, 100] },
      "malik": { name: "Malik", sampleRange: [1, 80] },
      "muslim": { name: "Muslim", sampleRange: [1, 100] },
      "nasai": { name: "Nasai", sampleRange: [1, 100] },
      "tirmidzi": { name: "Tirmidzi", sampleRange: [1, 100] },
    };

    const generateRandomNumbers = (min, max, count) => {
      const numbers = new Set();
      while (numbers.size < count && numbers.size < max - min + 1) {
        numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      return Array.from(numbers);
    };

    const shuffle = (array) => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    let allHadits = [];

    // Fetch Bulughul Maram
    const bmNumbers = generateRandomNumbers(1, 1359, 10);
    const bmPromises = bmNumbers.map(async (num) => {
      try {
        const res = await fetch(`https://api.myquran.com/v2/hadits/bm/${num}`, {
          next: { revalidate: 31536000 },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.data) return null;
        return {
          id: `bm-${data.data.no}`,
          category: "Bulughul Maram",
          no: data.data.no,
          judul: `Bulughul Maram No.${data.data.no}`,
          rawi: "Bulughul Maram",
          ar: data.data.ar,
          id_text: data.data.id,
        };
      } catch { return null; }
    });

    const bmResults = await Promise.allSettled(bmPromises);
    const bmHadis = bmResults.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value);
    allHadits.push(...bmHadis);

    // Fetch Arbain
    const arbainNumbers = generateRandomNumbers(1, 42, 10);
    const arbainPromises = arbainNumbers.map(async (num) => {
      try {
        const res = await fetch(`https://api.myquran.com/v2/hadits/arbain/${num}`, {
          next: { revalidate: 31536000 },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.data) return null;
        return {
          id: `arbain-${data.data.no}`,
          category: "Arbain",
          no: data.data.no,
          judul: data.data.judul,
          rawi: data.data.rawi,
          arab: data.data.arab,
          indo: data.data.indo,
        };
      } catch { return null; }
    });

    const arbainResults = await Promise.allSettled(arbainPromises);
    const arbainHadis = arbainResults.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value);
    allHadits.push(...arbainHadis);

    // Fetch dari perawi
    const perawiPromises = Object.entries(perawiCategories).map(async ([slug, info]) => {
      try {
        const [min, max] = info.sampleRange;
        const numbers = generateRandomNumbers(min, max, 4);
        
        const promises = numbers.map(async (num) => {
          try {
            const res = await fetch(`https://api.myquran.com/v2/hadits/${slug}/${num}`, {
              next: { revalidate: 31536000 },
              signal: AbortSignal.timeout(5000),
            });
            if (!res.ok) return null;
            const data = await res.json();
            if (!data.data) return null;
            
            const perawiName = data.info?.perawi?.name || info.name;
            return {
              id: `${slug}-${data.data.number}`,
              category: perawiName,
              no: data.data.number,
              judul: data.data.judul || `${perawiName} No.${data.data.number}`,
              rawi: perawiName,
              arab: data.data.arab || data.data.ar,
              indo: data.data.indo || data.data.id,
            };
          } catch { return null; }
        });

        const results = await Promise.allSettled(promises);
        return results.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value);
      } catch { return []; }
    });

    const perawiResults = await Promise.allSettled(perawiPromises);
    const allPerawiHadis = perawiResults.filter(r => r.status === 'fulfilled').map(r => r.value).flat();
    allHadits.push(...allPerawiHadis);

    const shuffledHadits = shuffle(allHadits).slice(0, 50);

    return Response.json(shuffledHadits, {
      headers: {
        'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error('Random API Error:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}