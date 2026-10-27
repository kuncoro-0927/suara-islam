"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/navbar";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlay,
  IconPause,
  BookOpenLightIcon,
} from "@/components/icons";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";

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

export default function SurahClient({
  initialDetail,
  surahId,
  initialAyat = [],
}) {
  const [suratDetail] = useState(initialDetail || {});
  const [suratAyat, setSuratAyat] = useState(initialAyat);
  const [loadingMore, setLoadingMore] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const [error, setError] = useState(null);
  const [nextStart, setNextStart] = useState(
    initialAyat.length > 0
      ? Math.min(
          initialAyat.length + 1,
          (initialDetail?.number_of_verses || 0) + 1,
        )
      : 1,
  );

  const loaderRef = useRef(null);
  const audioRefs = useRef({});
  const isFetchingRef = useRef(false);

  const fetchAyatBatch = useCallback(async () => {
    if (isFetchingRef.current) return;
    if (!suratDetail.number_of_verses) return;
    if (nextStart > suratDetail.number_of_verses) return;

    const end = Math.min(nextStart + 29, suratDetail.number_of_verses);
    const range = `${nextStart}-${end}`;

    try {
      isFetchingRef.current = true;
      setLoadingMore(true);

      const res = await fetch(
        `https://api.myquran.com/v2/quran/ayat/${surahId}/${range}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // PERBAIKAN: Menambahkan User-Agent agar request client-side tidak diblokir Cloudflare
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data.data)) {
        throw new Error("Invalid ayat data format");
      }

      setSuratAyat((prev) => [...prev, ...data.data]);
      setNextStart(end + 1);
    } catch (err) {
      console.error("Error fetching ayat batch:", err);
      setError(`Error loading ayat: ${err.message}`);
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  }, [surahId, suratDetail.number_of_verses, nextStart]);

  useEffect(() => {
    if (
      suratDetail.number_of_verses &&
      suratAyat.length === 0 &&
      initialAyat.length === 0
    ) {
      fetchAyatBatch();
    }
  }, [
    suratDetail.number_of_verses,
    suratAyat.length,
    initialAyat.length,
    fetchAyatBatch,
  ]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          observer.unobserve(loaderRef.current);
          fetchAyatBatch().finally(() => {
            if (loaderRef.current) observer.observe(loaderRef.current);
          });
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchAyatBatch]);

  const handlePlayPause = (ayah) => {
    const audio = audioRefs.current[ayah];
    if (!audio) return;

    if (audioPlaying === ayah) {
      audio.pause();
      setAudioPlaying(null);
    } else {
      Object.values(audioRefs.current).forEach((a) => a.pause());
      audio.play();
      setAudioPlaying(ayah);
    }
  };

  const handleAudioEnded = () => {
    setAudioPlaying(null);
  };

  const handleRetry = () => {
    setError(null);
    fetchAyatBatch();
  };

  const ayatBadgePoints = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 === 0 ? 48 : 40; // ujung luar & lekuk dalam
    const a = (Math.PI / 12) * i - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

  if (!initialDetail) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="flex">
          <Navbar />
          <div className="flex-1 min-h-screen flex flex-col justify-center items-center pt-[72px] md:pt-0">
            <p className="p-5 text-red-500">Error: Surah tidak ditemukan</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="flex">
        <Navbar />
        <div className="flex-1 min-h-screen flex flex-col justify-center items-center overflow-hidden pb-10 pt-[72px] md:pt-0">
          {/* Error Display */}
          {error && (
            <div className="w-[90%] md:w-[800px] mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-center mb-3">{error}</p>
              <div className="text-center">
                <button
                  onClick={handleRetry}
                  className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  aria-label="Coba muat ulang ayat"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-center items-center flex-col h-auto w-[90%] md:w-[800px] px-8 mt-20 md:mt-8 bg-white border border-black/20 shadow-xs rounded-2xl py-8">
            <div className="bg-emerald-600 w-full h-[48px] rounded-xl flex justify-center items-center">
              <Link href="/alquran" aria-label="Kembali ke daftar surah">
                <div
                  className={`${jakarta.className} flex justify-center items-center w-auto efek-opacity`}
                >
                  <IconArrowLeft size={14} className="text-white mr-2 ml-3" />
                  <span className="text-white font-normal text-[11px] md:text-[15px]">
                    Kembali
                  </span>
                </div>
              </Link>
              <div
                className={`${jakarta.className} flex justify-center items-center flex-1`}
              >
                <span className="font-semibold text-[13px] md:text-[17px] text-white">
                  Surah - {suratDetail.number}
                </span>
              </div>

              <Link
                href={`/alquran/${
                  suratDetail.number < 114
                    ? parseInt(suratDetail.number) + 1
                    : 114
                }`}
                aria-label="Surah selanjutnya"
              >
                <div
                  className={`${jakarta.className} flex justify-center items-center w-auto efek-opacity`}
                >
                  <span className="text-white font-normal text-[11px] md:text-[15px]">
                    Selanjutnya
                  </span>
                  <IconArrowRight size={14} className="text-white ml-2 mr-3" />
                </div>
              </Link>
            </div>

            <div
              className={`${jakarta.className} flex justify-center text-left items-center flex-col  leading-tight mt-8 w-[100%] md:w-[800px]`}
            >
              <p
                className="text-[28px] font-medium text-emerald-800"
                aria-hidden="true"
              >
                {suratDetail.arab}
              </p>
              <h1 className="text-[28px] font-semibold text-emerald-800 mt-1">
                {suratDetail.name_id}
              </h1>
              <p
                className={`${openSans.className} font-normal text-[14px] text-gray-500 mt-1`}
              >
                {suratDetail.revelation_id} · {suratDetail.number_of_verses}{" "}
                ayat
              </p>

              <hr className="border border-gray-200 w-[180px] mt-6 mb-6" />
              <div className="bg-emerald-100/30 border border-emerald-300 backdrop-blur-md px-4 py-8 mx-8 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-600 w-fit p-2.5 rounded-full">
                    <BookOpenLightIcon className="text-white" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="flex text-emerald-800 font-medium">
                      Tafsir Surah {suratDetail.name_id}
                    </span>

                    <p
                      className={`${openSans.className} font-normal  text-[12px]  md:text-[15px] text-emerald-800 leading-relaxed`}
                    >
                      {suratDetail.tafsir}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Render ayat */}
          {suratAyat.map((ayat, index) => (
            <article
              key={ayat.ayah || index}
              className="flex flex-col bg-white border border-black/20 shadow-xs rounded-2xl w-[90%] md:w-[800px] h-auto my-3 p-8"
            >
              <div className="flex gap-3 items-center">
                {/* <div
                  className={`${jakarta.className} text-[13px] flex justify-center items-center text-white w-[28px] h-[28px] bg-emerald-600 rounded-full`}
                  aria-label={`Ayat ${ayat.ayah}`}
                >
                  {ayat.ayah}
                </div> */}
                <div>
                  <button
                    onClick={() => handlePlayPause(ayat.ayah)}
                    aria-label={
                      audioPlaying === ayat.ayah
                        ? `Jeda audio ayat ${ayat.ayah}`
                        : `Putar audio ayat ${ayat.ayah}`
                    }
                    className="p-1 rounded-full hover:bg-emerald-50 transition-colors"
                  >
                    {audioPlaying === ayat.ayah ? (
                      <IconPause size={26} className="text-emerald-600" />
                    ) : (
                      <IconPlay size={26} className="text-emerald-600" />
                    )}
                  </button>
                  <audio
                    ref={(el) => (audioRefs.current[ayat.ayah] = el)}
                    src={ayat.audio}
                    onEnded={handleAudioEnded}
                  />
                </div>
              </div>

              <div
                className={`${jakarta.className} w-full ml-auto text-right mt-2 text-[30px] md:text-[30px]  max-w-[95%] leading-[1.8] text-gray-800`}
                dir="rtl"
                lang="ar"
              >
                {ayat.arab}

                <span
                  className="relative mx-4 inline-flex h-[30px] w-[30px] items-center justify-center align-middle"
                  aria-label={`Ayat ${ayat.ayah}`}
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    <polygon
                      points={ayatBadgePoints}
                      className="fill-white stroke-emerald-600"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`${jakarta.className} mt-0.5 relative text-[11px] font-medium leading-none text-emerald-700`}
                  >
                    {ayat.ayah}
                  </span>
                </span>
              </div>

              <div
                className={`${openSans.className} text-justify flex text-[16px] md:text-[18px] text-emerald-700 font-normal mt-4 italic`}
              >
                {ayat.latin}
              </div>

              <div
                className={`${openSans.className} text-justify flex text-[15px] md:text-[14px] text-gray-600 font-normal mt-3 leading-relaxed`}
              >
                {ayat.text}
              </div>
            </article>
          ))}

          {/* Infinite Scroll Loader */}
          {nextStart <= suratDetail.number_of_verses && (
            <div ref={loaderRef} className="py-10 text-gray-400 text-center">
              {loadingMore ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500 mr-2"></div>
                  <span>Memuat ayat...</span>
                </div>
              ) : (
                <span>Scroll untuk memuat lebih banyak ayat...</span>
              )}
            </div>
          )}

          {/* End Message */}
          {nextStart > suratDetail.number_of_verses && suratAyat.length > 0 && (
            <div className="py-10 text-gray-400 text-center">
              <p>— Selesai —</p>
              <p className="text-sm mt-2">
                Surah {suratDetail.name_id} ({suratDetail.number_of_verses}{" "}
                Ayat)
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
