import { Geist, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export const metadata = {
  metadataBase: new URL("https://islam.suara.com"),
  title: {
    default: "Suara Islam | Al-Quran, Doa Harian, Hadis, Jadwal Sholat",
    template: "%s | Suara Islam",
  },
  description:
    "Suara Islam menyediakan Al-Quran digital lengkap dengan terjemahan, doa harian, hadis pilihan, tahlil, jadwal sholat, dan Asmaul Husna. Sumber Islami terpercaya untuk menemani ibadah sehari-hari.",
  keywords: [
    "alquran digital",
    "doa harian",
    "hadis",
    "tahlil",
    "jadwal sholat",
    "asmaul husna",
    "islami",
    "quran online",
    "doa sehari-hari",
    "suara islam",
  ],
  openGraph: {
    title:
      "Suara Islam | Al-Quran, Doa Harian, Hadis, Jadwal Sholat & Asmaul Husna",
    description:
      "Al-Quran digital, doa harian, hadis, tahlil, jadwal sholat, dan Asmaul Husna dalam satu platform Islami.",
    url: "https://islam.suara.com/",
    locale: "id_ID",
    type: "website",
    siteName: "Islam Suara.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suara Islam | Al-Quran, Doa Harian, Hadis, Jadwal Sholat",
    description:
      "Al-Quran digital, doa harian, hadis, tahlil, jadwal sholat, dan Asmaul Husna dalam satu platform Islami.",
  },
  alternates: {
    canonical: "https://islam.suara.com/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96" },
      {
        url: "/favicon/android-icon-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      { url: "/favicon/favicon.ico", type: "image/png", sizes: "256x256" },
    ],
    apple: [
      {
        url: "/favicon/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${jakarta.variable} ${openSans.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        >
          Lewati ke konten utama
        </a>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8Y8FG7WS9B"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8Y8FG7WS9B');
          `}
        </Script>
      </body>
    </html>
  );
}
