import HadisClient from './hadisclient'

async function getRandomHadis() {
  const shuffle = (array) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const fetchOne = async (url, transform) => {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.data) return null;
      return transform(data);
    } catch { return null; }
  };

  const calls = [];

  for (let i = 0; i < 5; i++) {
    const num = randomNum(1, 42);
    calls.push(fetchOne(`https://api.myquran.com/v2/hadits/arbain/${num}`, (data) => ({
      id: `arbain-${data.data.no}`,
      category: "Arbain",
      no: data.data.no,
      judul: data.data.judul,
      rawi: data.data.rawi,
      arab: data.data.arab,
      indo: data.data.indo,
    })));
  }

  for (let i = 0; i < 5; i++) {
    const num = randomNum(1, 1359);
    calls.push(fetchOne(`https://api.myquran.com/v2/hadits/bm/${num}`, (data) => ({
      id: `bm-${data.data.no}`,
      category: "Bulughul Maram",
      no: data.data.no,
      judul: `Bulughul Maram No.${data.data.no}`,
      rawi: "Bulughul Maram",
      ar: data.data.ar,
      id_text: data.data.id,
    })));
  }

  const perawiList = ["bukhari", "muslim", "abu-dawud", "ahmad", "tirmidzi", "nasai", "ibnu-majah", "malik", "darimi"];
  const selectedPerawi = shuffle(perawiList).slice(0, 5);
  for (const slug of selectedPerawi) {
    const num = randomNum(1, 80);
    calls.push(fetchOne(`https://api.myquran.com/v2/hadits/${slug}/${num}`, (data) => ({
      id: `${slug}-${data.data.number}`,
      category: data.info?.perawi?.name || slug,
      no: data.data.number,
      judul: data.data.judul || `${slug} No.${data.data.number}`,
      rawi: data.info?.perawi?.name || slug,
      arab: data.data.arab || data.data.ar,
      indo: data.data.indo || data.data.id,
    })));
  }

  const results = await Promise.allSettled(calls);
  const hadis = results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value);

  return shuffle(hadis);
}

export const metadata = {
  title: 'Hadis - Kumpulan Hadis Lengkap',
  description: 'Kumpulan hadis lengkap dari berbagai kitab lengkap dengan terjemahan.',
  keywords: ['hadis', 'hadis lengkap', 'kumpulan hadis', 'hadis nabi', 'hadis shahih', 'hadis dan terjemahan', 'hadis arbain'],
  openGraph: {
    title: 'Hadis - Kumpulan Hadis Lengkap',
    description: 'Kumpulan hadis lengkap dari berbagai kitab lengkap dengan terjemahan.',
    url: 'https://islam.suara.com/hadis',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Islam Suara.com',
  },
  alternates: {
    canonical: 'https://islam.suara.com/hadis',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default async function HadisPage() {
  const initialHadis = await getRandomHadis();
  return <HadisClient  initialHadis={initialHadis} />
}
