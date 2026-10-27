import Beranda from "./kalenderclient";

export const metadata = {
  title: "Jadwal Sholat & Kalender Hijriyah",
  description:
    "Lihat dan download jadwal sholat harian berdasarkan kota pilihan Anda, lengkap dengan kalender masehi dan hijriyah.",
    keywords: ['jadwal sholat', 'kalender hijriyah', 'jadwal sholat hari ini', 'jadwal sholat lengkap', 'jadwal sholat berdasarkan kota', 'kalender islam', 'kalender hijriyah 2025'],
  category: "religi > islami > jadwal sholat",
  openGraph: {
    title: "Jadwal Sholat & Kalender Hijriyah",
    description:
      "Dapatkan jadwal sholat lengkap dan kalender hijriyah setiap bulan.",
    type: "website",
    url: "https://islam.suara.com/kalender",
    siteName: "Islam suara.com",
  },
    alternates: {
    canonical: 'https://islam.suara.com/kalender',
  }
};

async function getInitialJadwal() {
  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");

    const [jadwalRes, hijriRes] = await Promise.allSettled([
      fetch(`https://api.myquran.com/v2/sholat/jadwal/1301/${y}/${m}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      }),
      fetch(`https://api.myquran.com/v2/cal/hijr/?adj=-1`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    let jadwal = [];
    let hijriData = null;

    if (jadwalRes.status === "fulfilled" && jadwalRes.value.ok) {
      const data = await jadwalRes.value.json();
      if (data?.status === true && data?.data?.jadwal) {
        jadwal = data.data.jadwal;
      }
    }

    if (hijriRes.status === "fulfilled" && hijriRes.value.ok) {
      const data = await hijriRes.value.json();
      if (data?.status === true && data?.data) {
        hijriData = data.data;
      }
    }

    return { jadwal, hijriData };
  } catch {
    return { jadwal: [], hijriData: null };
  }
}

export default async function Page() {
  const initialData = await getInitialJadwal();
  return <Beranda initialJadwal={initialData.jadwal} initialHijriData={initialData.hijriData} />;
}
