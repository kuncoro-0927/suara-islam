import SurahClient from "./surahclient";

async function getSurahDetail(id) {
  try {
    const res = await fetch(`https://api.myquran.com/v2/quran/surat/${id}`, {
      method: 'GET',
      cache: 'no-store', // <--- Memaksa Next.js mengambil data segar dari API, bypass cache build lama
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Menggunakan User-Agent browser asli agar lolos dari verifikasi bot/Cloudflare API
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch surah detail, status: ${res.status}`);
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching surah detail:", error);
    return null;
  }
}

async function getFirstAyatBatch(id, totalVerses) {
  if (!totalVerses) return [];
  const end = Math.min(30, totalVerses);
  try {
    const res = await fetch(
      `https://api.myquran.com/v2/quran/ayat/${id}/1-${end}`,
      {
        method: 'GET',
        cache: 'no-store', // <--- Memaksa Next.js mengambil data segar dari API, bypass cache build lama
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Menggunakan User-Agent browser asli agar lolos dari verifikasi bot/Cloudflare API
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error(`Error fetching ayat batch for surah ${id}:`, error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const surah = await getSurahDetail(id);

  if (!surah) {
    return {
      title: "Surah tidak ditemukan",
      description: "Halaman surah yang Anda cari tidak ditemukan",
    };
  }

  const nameLatin = surah.name_id || `Surat ${id}`;
  const nameArabic = surah.name_short || surah.name_long || "";
  const translation = surah.translation_id || "";
  const revelation = surah.revelation_id || "";
  const ayatCount = surah.number_of_verses || "?";
  const nomorsurat = surah.number || id;

  return {
    title: `Surat ${nameLatin} (${nameArabic}) - Ayat 1-${ayatCount}`,
    description: `Baca Surat ${nameLatin} (${translation}) ayat 1–${ayatCount} lengkap dengan terjemahan bahasa Indonesia, tafsir, dan audio murottal. Surat ${revelation} yang terdiri dari ${ayatCount} ayat.`,
    keywords: [
      `surat ${nameLatin}`,
      `surah ${nameLatin}`,
      nameArabic,
      `${nameLatin} terjemahan`,
      `${nameLatin} tafsir`,
      `al-quran surat ${id}`,
      `quran surah ${nameLatin}`,
      "al-quran indonesia",
      `baca surat ${nameLatin} online`,
    ],
    openGraph: {
      title: `Surat ${nameLatin} (${nameArabic}) - Al-Quran`,
      description: `${translation} - Surat ${revelation} (${ayatCount} ayat). ${surah.tafsir?.substring(0, 150)}...`,
      type: "article",
      url: `https://islam.suara.com/alquran/${id}`,
      locale: "id_ID",
      siteName: "Islam Suara.com",
    },
    twitter: {
      card: "summary_large_image",
      title: `Surat ${nameLatin} (${nameArabic})`,
      description: `${translation} - ${ayatCount} ayat | Baca lengkap dengan terjemahan`,
    },
    alternates: {
      canonical: `https://islam.suara.com/alquran/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// export async function generateStaticParams() {
//   return Array.from({ length: 114 }, (_, i) => ({
//     id: String(i + 1),
//   }));
// }

function SurahJsonLd({ surah, id }) {
  if (!surah) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Surat ${surah.name_id} (${surah.name_short || ""})`,
    description: `${surah.translation_id || ""} - ${surah.number_of_verses} ayat`,
    url: `https://islam.suara.com/alquran/${id}`,
    inLanguage: "id-ID",
    isPartOf: {
      "@type": "WebSite",
      name: "Suara Islam",
      url: "https://islam.suara.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://islam.suara.com/alquran/${id}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Suara.com",
      url: "https://www.suara.com",
    },
    about: {
      "@type": "CreativeWork",
      name: "Al-Quran",
      inLanguage: "ar",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://islam.suara.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Al-Quran",
        item: "https://islam.suara.com/alquran",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Surat ${surah.name_id}`,
        item: `https://islam.suara.com/alquran/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}

export default async function SurahPage({ params }) {
  const { id } = params;
  const surahDetail = await getSurahDetail(id);
  const initialAyat = await getFirstAyatBatch(
    id,
    surahDetail?.number_of_verses
  );

  return (
    <>
      <SurahJsonLd surah={surahDetail} id={id} />
      <SurahClient
        initialDetail={surahDetail}
        surahId={id}
        initialAyat={initialAyat}
      />
    </>
  );
}
