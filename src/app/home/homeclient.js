"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Poppins, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";
import JadwalSholatCard from "../widgets/JadwalShalat";
import Header from "../../components/header";
import { SuratUtama } from "../../components/data";
import Link from "next/link";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const BATCH_SIZE = 12;

export default function Beranda({ initialSurahList = [], initialJadwal = {} }) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loaderRef = useRef(null);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + BATCH_SIZE, initialSurahList.length),
    );
  }, [initialSurahList.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleSurahs = initialSurahList.slice(0, visibleCount);

  return (
    <main id="main-content" className="">
      <div className="flex m-0 p-0">
        <Navbar />

        <div className="md:flex-1   min-h-screen p-10">
          <Header
            Title="Suara Islam"
            Description="Al - Quran, Hadis, Doa, dan Lainnya"
          />

          <JadwalSholatCard
            initialJadwal={initialJadwal?.jadwal}
            initialTanggalHijri={initialJadwal?.tanggalHijri}
          />

          <div className="flex flex-col items-start gap-3 my-8">
            <span className="font-medium text-sm text-slate-400">
              Pilihan Cepat & Surat Populer
            </span>
            <nav
              className="flex flex-wrap justify-center items-center gap-3"
              aria-label="Surat pilihan"
            >
              {SuratUtama.map((surat) => (
                <Link
                  key={surat.id}
                  href={
                    surat.isSpecialPage ? surat.route : `/alquran/${surat.id}`
                  }
                >
                  <div className="flex justify-center items-center px-5 py-2 rounded-full border bg-white shadow-sm border-black/10 transition-all duration-200 efek-opacity text-[#6c6c6c] hover:text-emerald-800 hover:bg-emerald-100/40 hover:border-emerald-600 hover:shadow-xs">
                    <div className="flex items-center gap-2">
                      <surat.icon size={18} className="text-emerald-600" />
                      <span
                        className={`${jakarta.className} text-xs font-medium`}
                      >
                        {" "}
                        {surat.surah}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          <section
            className="w-full mt-4 grid grid-cols-2 justify-center items-stretch gap-5 pb-6"
            aria-label="Daftar surat Al-Quran"
          >
            {initialSurahList.length === 0 && (
              <div className="text-gray-400 py-10">Memuat daftar surat...</div>
            )}
            {visibleSurahs.map((surat) => (
              <Link
                href={`/alquran/${surat.number}`}
                key={surat.number}
                className="no-underline "
              >
                <article className="flex h-full w-full items-start gap-4 rounded-xl border border-black/10 shadow-xs bg-white p-4 transition-all duration-200 hover:border-emerald-600 hover:shadow-sm cursor-pointer">
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
                      <h2 className="text-[16px] font-medium text-gray-800">
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
                        className={`${openSans.className} text-[13px] text-gray-600`}
                      >
                        {`${surat.translation_id} - ${surat.revelation_id} `}
                      </p>

                      <p
                        className={`${openSans.className} text-[13px] text-right text-gray-600`}
                      >
                        {`${surat.number_of_verses}`} ayat
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
            {visibleCount < initialSurahList.length && (
              <div ref={loaderRef} className="w-full flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
