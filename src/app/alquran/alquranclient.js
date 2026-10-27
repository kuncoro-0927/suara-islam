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
    <main className="min-h-screen bg-stone-50">
      <div className="flex">
        <Navbar />
        <div className="flex-1 min-h-screen">
          <Header
            Title="Al - Quran"
            Description="Baca Al - Quran dan Terjemahan"
          >
            <div className="flex items-center gap-3 mt-4">
              <Search
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <ShareEmbedButton
                url={shareUrl}
                embedUrl={embedCode}
                OverrideStyle="p-[5px] md:p-3"
              />
            </div>
          </Header>

          <section
            className="md:ml-10 mt-5 flex flex-wrap justify-center items-start gap-5 pb-6 px-4"
            aria-label="Daftar surah Al-Quran"
          >
            {filteredSurat.map((surat) => (
              <Link
                href={`/alquran/${surat.number}`}
                key={surat.number}
                className="no-underline"
              >
                <article className="bg-white border border-gray-100 w-[350px] md:w-[353px] h-[110px] shadow-sm hover:shadow-md rounded-xl flex efek-click cursor-pointer transition-shadow duration-200">
                  <div className="flex justify-center mt-4 w-[44px] h-full">
                    <div
                      className={`${jakarta.className} text-[13px] flex justify-center items-center text-white w-[28px] h-[28px] bg-emerald-600 rounded-full`}
                    >
                      {surat.number}
                    </div>
                  </div>
                  <div
                    className={`${jakarta.className} flex flex-1 flex-col justify-center items-center md:items-start text-left leading-[1.3] md:w-[180px] h-auto mx-2`}
                  >
                    <h2 className="text-[24px] font-semibold text-gray-800">
                      {surat.name_id}
                    </h2>
                    <p
                      className={`${openSans.className} text-[12px] text-gray-500`}
                    >
                      {`${surat.translation_id} · ${surat.revelation_id} · ${surat.number_of_verses}`}
                    </p>
                  </div>
                  <div
                    className="flex flex-1 flex-col justify-center items-center w-auto h-auto text-[28px] text-emerald-700"
                    aria-hidden="true"
                  >
                    {surat.name_short}
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
