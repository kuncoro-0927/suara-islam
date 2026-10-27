import AsmaulhusnaClient from './asmaulclient'

export const metadata = {
  title: 'Asmaul Husna - 99 Nama Allah',
  description: '99 Asmaul Husna lengkap dengan arti, latin, dan penjelasan.',
  keywords: ['asmaul husna', '99 nama allah', 'asmaul husna dan artinya', 'asmaul husna lengkap', 'asmaul husna latin'],
  category: "religi > islami > asmaul husna", 
  openGraph: {
    title: 'Asmaul Husna - 99 Nama Allah',
    description: '99 Asmaul Husna lengkap dengan arti, latin, dan penjelasan.',
    url: 'https://islam.suara.com/asmaulhusna',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Islam Suara.com',
  },
    alternates: {
    canonical: 'https://islam.suara.com/asmaulhusna',
  },
   robots: {
    index: true,
    follow: true,
  }
}
async function getAsmaulData() {
  try {
    const res = await fetch("https://api.myquran.com/v2/husna/semua", {
      method: 'GET', // <--- Menegaskan method request
      cache: 'no-store', // <--- Memaksa bypass cache build lama
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Menyaru sebagai browser normal agar tidak dicekal oleh Cloudflare API
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data, status: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching asmaul husna:", error);
    return null;
  }
}

export default async function AsmaulhusnaPage() {
  const asmaulData = await getAsmaulData();
  
  return <AsmaulhusnaClient initialData={asmaulData} />
}