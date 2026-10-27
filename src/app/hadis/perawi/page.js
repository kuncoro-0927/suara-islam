import HadisPerawiClient from "./perawiclient";

export const metadata = {
  title: "Hadis 9 Perawi Lengkap",
  description: "Koleksi lengkap hadis dari 9 perawi utama: Bukhari, Muslim, Abu Dawud, Ahmad, Tirmidzi, Nasai, Ibnu Majah, Malik, dan Darimi dalam bahasa Arab dan terjemahan Indonesia.",
  keywords: "hadis bukhari, hadis muslim, hadis abu dawud, hadis ahmad, hadis tirmidzi, hadis nasai, hadis ibnu majah, hadis malik, hadis darimi, 9 perawi, kutubussittah, hadis shahih, islamic hadith, hadith collection",
  openGraph: {
    title: "Hadis 9 Perawi - Koleksi Lengkap dari 9 Imam Hadis",
    description: "Koleksi lengkap hadis dari 9 perawi utama: Bukhari, Muslim, Abu Dawud, Ahmad, Tirmidzi, Nasai, Ibnu Majah, Malik, dan Darimi",
    type: "website",
    url: "https://islam.suara.com/hadis/perawi",
    locale: "id_ID",
    siteName: "Islam Suara.com",
  },
  alternates: {
    canonical: "https://islam.suara.com/hadis/perawi",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "hadith:narrators": "Bukhari, Muslim, Abu Dawud, Ahmad, Tirmidzi, Nasai, Ibnu Majah, Malik, Darimi",
    "hadith:total": "58,578 hadis",
    "hadith:category": "9 Perawi Utama",
  },
};

export default function HadisPerawiPage() {
  return <HadisPerawiClient />;
}