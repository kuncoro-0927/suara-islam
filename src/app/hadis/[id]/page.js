import HadisDetailClient from "./hadis-idclient";

const categoryConfig = {
  "Bulughul Maram": { endpoint: "bm", maxHadis: 1359 },
  "Arbain": { endpoint: "arbain", maxHadis: 42 },
  "Abu Dawud": { endpoint: "abu-dawud", maxHadis: 4590 },
  "Ahmad": { endpoint: "ahmad", maxHadis: 26363 },
  "Bukhari": { endpoint: "bukhari", maxHadis: 7008 },
  "Darimi": { endpoint: "darimi", maxHadis: 3367 },
  "Ibnu Majah": { endpoint: "ibnu-majah", maxHadis: 4341 },
  "Malik": { endpoint: "malik", maxHadis: 1594 },
  "Muslim": { endpoint: "muslim", maxHadis: 5362 },
  "Nasai": { endpoint: "nasai", maxHadis: 5662 },
  "Tirmidzi": { endpoint: "tirmidzi", maxHadis: 3891 },
};

async function fetchHadis(category, id) {
  const config = categoryConfig[category];
  if (!config) return null;

  try {
    const res = await fetch(
      `https://api.myquran.com/v2/hadits/${config.endpoint}/${id}`,
      {
        method: 'GET',
        cache: 'no-store', // <--- Memaksa Next.js mengambil data segar dari API, bypass cache build lama
        signal: AbortSignal.timeout(5000),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Menggunakan User-Agent browser asli agar lolos dari verifikasi bot/Cloudflare API
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
      }
    );
    if (!res.ok) return null;
    const result = await res.json();
    if (!result.status || !result.data) return null;
    return { ...result.data, category, endpoint: config.endpoint };
  } catch (error) {
    console.error(`Error fetching hadis ${config.endpoint} ID ${id}:`, error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }) {
  const { id } = params;
  const category = searchParams.category || 'Arbain';

  const hadis = await fetchHadis(category, id);

  if (!hadis) {
    return {
      title: `Hadis ${category} No.${id}`,
      description: `Baca dan pelajari Hadis ${category} nomor ${id} dalam bahasa Arab dan terjemahan Indonesia.`,
    };
  }

  const description = hadis.indo || hadis.id || '';
  const truncatedDesc = description.length > 160
    ? description.substring(0, 157) + '...'
    : description;

  return {
    title: hadis.judul || `Hadis ${category} No.${id}`,
    description: truncatedDesc || `Hadis ${category} nomor ${id} - ${hadis.rawi || category}`,
    keywords: `hadis ${category.toLowerCase()}, hadis nomor ${id}, ${hadis.rawi || ''}, hadis arab, hadis indonesia`,
    authors: [{ name: hadis.rawi || category }],
    openGraph: {
      title: hadis.judul || `Hadis ${category} No.${id}`,
      description: truncatedDesc,
      type: 'article',
      locale: 'id_ID',
      siteName: 'Islam Suara.com',
    },
    twitter: {
      card: 'summary',
      title: hadis.judul || `Hadis ${category} No.${id}`,
      description: truncatedDesc,
    },
    alternates: {
      canonical: `https://islam.suara.com/hadis/${id}?category=${encodeURIComponent(category)}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HadisDetailPage({ params, searchParams }) {
  const { id } = params;
  const category = searchParams.category || 'Arbain';
  const from = searchParams.from || null;

  const hadis = await fetchHadis(category, id);

  return <HadisDetailClient initialHadis={hadis} id={id} category={category} from={from} />;
}

export const revalidate = 31536000;
