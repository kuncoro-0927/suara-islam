import HadisBulughulMaramClient from "./bm-client";

export const metadata = {
  title: "Bulughul Maram - 1359 Hadis Lengkap",
  description: "Koleksi lengkap 1359 hadis Bulughul Maram karya Imam Ibnu Hajar Al-Asqalani dalam bahasa Arab dan terjemahan Indonesia. Hadis-hadis hukum fiqih yang sahih dan terpercaya.",
  keywords: "bulughul maram, hadis bulughul maram, ibnu hajar al asqalani, hadis fiqih, hadis hukum islam, islamic hadith, hadith collection, 1359 hadis",
  openGraph: {
    title: "Bulughul Maram - 1359 Hadis Lengkap",
    description: "Koleksi lengkap 1359 hadis Bulughul Maram karya Imam Ibnu Hajar Al-Asqalani dalam bahasa Arab dan terjemahan Indonesia",
    type: "website",
    url: "https://islam.suara.com/hadis/bulughul-maram",
    locale: "id_ID",
    siteName: "Islam Suara.com",
  },
  alternates: {
    canonical: "https://islam.suara.com/hadis/bulughul-maram",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HadisBulughulMaramPage() {
  return <HadisBulughulMaramClient />;
}