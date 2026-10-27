"use client";

import AlQuranEmbed from "../widgets/alquran";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

async function getAllSurah() {
  try {
    const res = await fetch('https://api.myquran.com/v2/quran/surat/semua', {
      method: 'GET',
      cache: 'no-store', // <--- Memaksa Next.js mengambil data segar dari API, bypass cache build lama
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Menggunakan User-Agent browser asli agar lolos dari verifikasi bot/Cloudflare
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    if (!res.ok) {
      throw new Error(`Failed to fetch surah list, status: ${res.status}`)
    }
    
    const response = await res.json()
    
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching surah list:', error)
    return []
  }
}

function EmbedContent({ initialData }) {
  return <AlQuranEmbed initialData={initialData} />;
}

export default function Page() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [surahList, setSurahList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const insideIframe = window.self !== window.top;

    if (!insideIframe) {
      router.push("/alquran");
    } else {
      setAllowed(true);
      // Fetch data ketika di dalam iframe
      getAllSurah().then(data => {
        setSurahList(data);
        setLoading(false);
      });
    }

    setChecked(true);
  }, [router]);

  if (!checked) return null;

  if (!allowed) return null;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbedContent initialData={surahList} />
    </Suspense>
  );
}