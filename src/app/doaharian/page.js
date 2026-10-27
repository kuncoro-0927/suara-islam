import DoaHarianClient from './doaclient'

export const metadata = {
  title: 'Doa Harian - Kumpulan Doa Sehari-hari',
  description: 'Kumpulan doa harian lengkap dengan arab, latin, dan terjemahan.',
  keywords: ['doa harian', 'doa islam', 'kumpulan doa', 'doa sehari hari', 'doa lengkap', 'doa pendek'],
  openGraph: {
    title: 'Doa Harian - Kumpulan Doa Sehari-hari',
    description: 'Kumpulan doa harian lengkap dengan arab, latin, dan terjemahan.',
    url: 'https://islam.suara.com/doaharian',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Islam Suara.com',
  },
  alternates: {
    canonical: 'https://islam.suara.com/doaharian',
  },
  robots: {
    index: true,
    follow: true,
  }
}

async function getDoaData() {
  try {
    const res = await fetch("https://api.myquran.com/v2/doa/semua", {
      method: 'GET',
      cache: 'no-store', // <--- Memaksa Next.js untuk selalu mengambil data baru tanpa menyimpan cache error
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Tetap menyamar sebagai browser normal agar lolos filter bot/Cloudflare
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data, status: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching doa:", error);
    return null;
  }
}

export default async function DoaHarianPage() {
  const doaData = await getDoaData();
  
  return <DoaHarianClient initialData={doaData} />
}