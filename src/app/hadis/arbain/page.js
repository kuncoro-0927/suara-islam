import HadisArbainClient from "./arbainclient";

export const metadata = {
  title: "Hadis Arbain Nawawi - 42 Hadis Pilihan",
  description: "Koleksi lengkap 42 Hadis Arbain Nawawi dalam bahasa Arab dan terjemahan Indonesia.",
  keywords: "hadis arbain, arbain nawawi, 40 hadis, hadis pilihan, hadis islam, islamic hadith, imam nawawi",
  openGraph: {
    title: "Hadis Arbain Nawawi - 42 Hadis Pilihan",
    description: "Koleksi lengkap 42 Hadis Arbain Nawawi dalam bahasa Arab dan terjemahan Indonesia",
    type: "website",
    locale: "id_ID",
    sitename: "Islam Suara.com",
    url: "https://islam.suara.com/hadis/arbain",
  },
  alternates: {
    canonical: "https://islam.suara.com/hadis/arbain",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HadisArbainPage() {
  return <HadisArbainClient />;
}