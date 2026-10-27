import Beranda from "./homeclient";

async function getAllSurah() {
  try {
    const res = await fetch("https://api.myquran.com/v2/quran/surat/semua", {
      next: { revalidate: 31536000 },
      cache: "force-cache",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

async function getJadwalSholat(cityId = "1301") {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const [jadwalRes, hijriRes] = await Promise.allSettled([
      fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${dateStr}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      }),
      fetch(`https://api.myquran.com/v2/cal/hijr/?adj=-1`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      }),
    ]);

    let jadwal = null;
    let tanggalHijri = null;

    if (jadwalRes.status === "fulfilled" && jadwalRes.value.ok) {
      const data = await jadwalRes.value.json();
      jadwal = data?.data?.jadwal || null;
    }

    if (hijriRes.status === "fulfilled" && hijriRes.value.ok) {
      const data = await hijriRes.value.json();
      if (data?.status === true && data?.data) {
        tanggalHijri = {
          hari: data.data.date[0],
          hijri: data.data.date[1],
          masehi: data.data.date[2],
        };
      }
    }

    return { jadwal, tanggalHijri };
  } catch {
    return { jadwal: null, tanggalHijri: null };
  }
}

export const metadata = {
  title: "Al-Quran, Hadis, Doa & Jadwal Sholat",
  description:
    "Suara Islam menyediakan Al-Quran digital dengan terjemahan, hadis, jadwal sholat, doa harian, dan konten Islami lengkap.",
  keywords: [
    "alquran digital",
    "doa harian",
    "tahlil",
    "website islami",
    "jadwal sholat",
    "islami",
    "quran online",
    "hadis",
    "suara islam",
  ],
  openGraph: {
    title: "Suara Islam | Al-Quran, Hadis, Doa & Jadwal Sholat",
    description:
      "Website islami lengkap dengan Al-Quran, Hadis, Jadwal sholat, doa dan tahlil di Islam suara.com.",
    type: "website",
    url: "https://islam.suara.com/home",
    locale: "id_ID",
    siteName: "Islam Suara.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suara Islam | Al-Quran, Hadis & Jadwal Sholat",
    description:
      "Website islami lengkap dengan Al-Quran, Hadis, Jadwal sholat, doa dan tahlil.",
  },
  alternates: {
    canonical: "https://islam.suara.com/home",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function HomePage() {
  const [surahList, jadwalData] = await Promise.all([
    getAllSurah(),
    getJadwalSholat(),
  ]);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Suara Islam",
    alternateName: "Islam Suara.com",
    url: "https://islam.suara.com",
    description:
      "Al-Quran digital, doa harian, hadis, tahlil, jadwal sholat, dan Asmaul Husna.",
    inLanguage: "id-ID",
    publisher: {
      "@type": "Organization",
      name: "Suara.com",
      url: "https://www.suara.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Beranda initialSurahList={surahList} initialJadwal={jadwalData} />
    </>
  );
}
