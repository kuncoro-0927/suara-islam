"use client";

import { useState, useEffect } from "react";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import Link from "next/link";
import Search from "@/components/search";
import ShareEmbedButton from "../../components/ShareEmbedButton";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function AlQuranClient({ initialData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");

  const surahList = Array.isArray(initialData) ? initialData : [];
  const filteredSurat = surahList.filter((surat) => {
    if (!surat) return false;

    const query = searchQuery.toLowerCase();

    return (
      (surat.name_id && surat.name_id.toLowerCase().includes(query)) ||
      (surat.translation_id &&
        surat.translation_id.toLowerCase().includes(query)) ||
      (surat.name_short && surat.name_short.includes(searchQuery)) ||
      (surat.number && String(surat.number).includes(searchQuery))
    );
  });

  useEffect(() => {
    const origin = window.location.origin;
    const href = window.location.href;

    setShareUrl(href);
    setEmbedCode(`${origin}/alquranwidget`);
  }, []);

  if (!initialData || surahList.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="flex">
          <Navbar />
          <div className="flex-1 min-h-screen flex flex-col justify-center items-center pt-[72px] md:pt-0">
            <p className="p-5 text-red-500">
              Error: Failed to load Al-Quran data
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="flex">
        <Navbar />
        <div className="flex-1 bg-white/40 backdrop-blur-md border border-white my-4 mr-4 rounded-2xl min-h-screen p-10">
          <Header
            Title="Al - Quran"
            subtitle="114 surah dan terjemahan"
            Description="Baca Al - Quran dan Terjemahan"
          >
            <div className="flex items-center gap-3 mt-8">
              <Search
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ShareEmbedButton
                url={shareUrl}
                embedUrl={embedCode}
                OverrideStyle="py-2.5 bg-emerald-600 w-fit text-white border border-emerald-600 backdrop-blur-xs shadow-sm hover:bg-emerald-700 hover:border-emerald-700"
              />
            </div>
          </Header>

          <section
            className="w-full mt-4 grid grid-cols-2 justify-center items-stretch gap-5 pb-6"
            aria-label="Daftar surah Al-Quran"
          >
            {filteredSurat.map((surat) => (
              <Link
                href={`/alquran/${surat.number}`}
                key={surat.number}
                className="no-underline"
              >
                <article className="flex h-full w-full items-start gap-4 rounded-xl border border-black/10 shadow-xs bg-white/40 backdrop-blur-md p-4 transition-all duration-200 hover:border-emerald-600 hover:bg-emerald-100/40 hover:shadow-sm cursor-pointer">
                  <div className="flex justify-center border border-emerald-800  leading-none rounded-full shrink-0 w-6 h-6">
                    <div
                      className={`${jakarta.className} text-[12px] font-medium flex justify-center items-center text-emerald-800 `}
                    >
                      {surat.number}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center leading-tight w-full">
                    <div
                      className={`${jakarta.className} flex justify-between w-full items-center text-left h-auto mx-2`}
                    >
                      <h2 className="text-[16px] font-semibold text-emerald-800">
                        {surat.name_id}
                      </h2>

                      <div
                        className="text-[24px] text-emerald-700"
                        aria-hidden="true"
                      >
                        {surat.name_short}
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <p
                        className={`${jakarta.className} text-[12px] font-medium text-[#6c6c6c]`}
                      >
                        {`${surat.translation_id} - ${surat.revelation_id} `}
                      </p>

                      <p
                        className={`${jakarta.className} text-[12px] text-right font-medium text-[#6c6c6c]`}
                      >
                        {`${surat.number_of_verses}`} ayat
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
