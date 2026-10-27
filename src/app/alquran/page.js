import AlQuranClient from "./alquranclient";

async function getAllSurah() {
  try {
    const res = await fetch("https://api.myquran.com/v2/quran/surat/semua", {
      method: 'GET',
      cache: 'no-store', // <--- Memaksa Next.js mengambil data segar dari API, bypass cache build lama
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Menggunakan User-Agent browser asli agar lolos dari verifikasi bot/Cloudflare
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch surah list, status: ${res.status}`);
    }

    const response = await res.json();

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching surah list:", error);
    return [];
  }
}

export const metadata = {
  title: "Al-Quran 30 Juz - 114 Surat & Terjemahan",
  description:
    "Baca Al-Quran online lengkap 30 juz, 114 surat dengan terjemahan bahasa Indonesia, latin, tafsir dan audio murottal.",
  keywords: [
    "al-quran",
    "quran online",
    "baca quran",
    "quran dan terjemahan",
    "alquran 30 juz",
    "alquran lengkap",
    "surah alquran",
    "alquran bahasa indonesia",
    "tafsir alquran",
    "quran digital",
  ],
  category: "religi > islami > alquran",
  openGraph: {
    title: "Al-Quran 30 Juz - 114 Surat & Terjemahan",
    description:
      "Baca Al-Quran online lengkap 30 juz, 114 surat lengkap dengan latin, terjemahan bahasa Indonesia dan tafsir.",
    url: "https://islam.suara.com/alquran",
    type: "website",
    locale: "id_ID",
    siteName: "Islam Suara.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Quran Lengkap 30 Juz",
    description:
      "Baca Al-Quran online lengkap 30 juz, 114 surat dengan terjemahan bahasa Indonesia.",
  },
  alternates: {
    canonical: "https://islam.suara.com/alquran",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const alquranJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Al-Quran Lengkap 30 Juz",
  description:
    "Baca Al-Quran online lengkap 30 juz, 114 surat dengan terjemahan bahasa Indonesia.",
  url: "https://islam.suara.com/alquran",
  inLanguage: "id-ID",
  isPartOf: {
    "@type": "WebSite",
    name: "Suara Islam",
    url: "https://islam.suara.com",
  },
  mainEntity: {
    "@type": "Book",
    name: "Al-Quran",
    inLanguage: "ar",
    numberOfPages: 604,
  },
};

export default async function AlQuranPage() {
  const surahList = await getAllSurah();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(alquranJsonLd) }}
      />
      <AlQuranClient initialData={surahList} />
    </>
  );
}
