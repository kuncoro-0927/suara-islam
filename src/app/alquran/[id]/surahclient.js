"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/navbar";
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from "react-icons/tb";
import { IconPlay, IconPause, BookOpenLightIcon } from "@/components/icons";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import FloatingPlayer from "@/components/floatingplayer";
import Portal from "@/components/portal";
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

const pad = (n) => String(n).padStart(3, "0");
const audioUrl = (surah, ayah) =>
  `https://verses.quran.foundation/Alafasy/mp3/${pad(surah)}${pad(ayah)}.mp3`;

const toArabicNumber = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
export default function SurahClient({
  initialDetail,
  surahId,
  initialAyat = [],
}) {
  const [suratDetail] = useState(initialDetail || {});
  const [suratAyat, setSuratAyat] = useState(initialAyat);
  const [loadingMore, setLoadingMore] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const [autoPlayAfter, setAutoPlayAfter] = useState(null);
  const [currentAyah, setCurrentAyah] = useState(null);
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
        { headers: { Accept: "application/json" } },
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

  const playAyah = async (ayah) => {
    const audio = audioRefs.current[ayah];
    if (!audio) return;

    setCurrentAyah(ayah);

    Object.values(audioRefs.current).forEach((a) => {
      if (a && a !== audio) {
        a.pause();
        a.currentTime = 0;
      }
    });

    try {
      await audio.play();
      setAudioPlaying(ayah);
    } catch (err) {
      console.error("Gagal play ayat", ayah, audio.src, err);
      setAudioPlaying(null);
    }
  };

  const handlePlayPause = (ayah) => {
    if (audioPlaying === ayah) {
      audioRefs.current[ayah]?.pause();
      setAudioPlaying(null);
      return;
    }
    playAyah(ayah);
  };

  const goNext = (fromAyah) => {
    const i = suratAyat.findIndex((a) => a.ayah === fromAyah);
    const next = suratAyat[i + 1];

    if (next) {
      playAyah(next.ayah);
      return;
    }

    setAudioPlaying(null);
    if (nextStart <= Number(suratDetail.number_of_verses)) {
      setAutoPlayAfter(fromAyah);
      fetchAyatBatch();
    }
  };

  const goPrev = () => {
    const i = suratAyat.findIndex((a) => a.ayah === currentAyah);
    const prev = suratAyat[i - 1];
    if (prev) playAyah(prev.ayah);
  };

  const closePlayer = () => {
    audioRefs.current[currentAyah]?.pause();
    setAudioPlaying(null);
    setCurrentAyah(null);
  };

  const handleAudioEnded = (ayah) => goNext(ayah);

  const currentIndex = suratAyat.findIndex((a) => a.ayah === currentAyah);
  const hasPrev = currentIndex > 0;
  const hasNext =
    currentIndex < suratAyat.length - 1 ||
    nextStart <= Number(suratDetail.number_of_verses);

  // begitu batch baru masuk, putar ayat yang tadi tertunda
  useEffect(() => {
    if (autoPlayAfter == null) return;
    const i = suratAyat.findIndex((a) => a.ayah === autoPlayAfter);
    const next = suratAyat[i + 1];
    if (next) {
      setAutoPlayAfter(null);
      playAyah(next.ayah);
    }
  }, [suratAyat, autoPlayAfter]);

  const handleRetry = () => {
    setError(null);
    fetchAyatBatch();
  };

  useEffect(() => {
    if (audioPlaying == null) return;
    document
      .getElementById(`ayat-${audioPlaying}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [audioPlaying]);

  // hentikan semua audio & tutup player saat komponen hilang
  useEffect(() => {
    const refs = audioRefs.current;
    return () => {
      Object.values(refs).forEach((a) => {
        if (!a) return;
        a.pause();
        a.removeAttribute("src");
        a.load(); // lepaskan sumber audio supaya benar-benar berhenti
      });
    };
  }, []);

  // kalau pindah ke surah lain tapi komponen dipakai ulang, reset juga
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((a) => a?.pause());
      setAudioPlaying(null);
      setCurrentAyah(null);
      setAutoPlayAfter(null);
    };
  }, [surahId]);

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
    <main className="min-h-screen">
      <div className="flex">
        <Navbar />
        <div className="flex-1 m-2 lg:mx-0 p-4 mt-[90px] lg:mt-0 lg:p-10 min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white/40 backdrop-blur-md border border-white lg:my-4 lg:mr-4 rounded-xl lg:rounded-2xl">
          {/* Error Display */}
          {error && (
            <div className="w-full mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
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
          <div className="flex justify-center items-center flex-col w-full rounded-2xl mb-4">
            <div className=" w-full flex justify-between items-center">
              <Link href="/alquran" aria-label="Kembali ke daftar surah">
                <div
                  className={`${jakarta.className} group flex gap-1 justify-center items-center font-medium text-[#6c6c6c] hover:text-emerald-800 duration-200`}
                >
                  <IoIosArrowRoundBack
                    size={22}
                    className="group-hover:scale-110 duration-200"
                  />
                  <span className="text-[12px] md:text-[14px]">Kembali</span>
                </div>
              </Link>

              <Link
                href={`/alquran/${
                  suratDetail.number < 114
                    ? parseInt(suratDetail.number) + 1
                    : 114
                }`}
                aria-label="Surah selanjutnya"
              >
                <div
                  className={`${jakarta.className} group flex gap-1 justify-center items-center font-medium text-[#6c6c6c] hover:text-emerald-800 duration-200`}
                >
                  <span className="text-[12px] md:text-[14px]">
                    Selanjutnya
                  </span>
                  <IoIosArrowRoundForward
                    size={22}
                    className="group-hover:scale-110 duration-200"
                  />
                </div>
              </Link>
            </div>

            <div
              className={`${jakarta.className} flex justify-center text-left items-center flex-col  leading-tight mt-8 w-full`}
            >
              <div
                className={`${jakarta.className} flex justify-center items-center `}
              >
                <span className="font-semibold text-[14px] md:text-[14px] leading-tight text-emerald-800">
                  Surah ke {suratDetail.number}
                </span>
              </div>

              <div className="text-[28px] flex items-center gap-2 font-semibold text-emerald-800 mt-6">
                <span>{suratDetail.name_id}</span> -
                {/* <span>{suratDetail.translation_id}</span> */}
                <span className=" text-[34px]  leading-none">
                  {" "}
                  {suratDetail.name_short}
                </span>
              </div>

              <div className="flex items-start gap-6 mt-2 text-sm">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-medium text-[rgb(108,108,108)]">
                    Golongan
                  </span>
                  <span className="text-emerald-800 font-medium text-lg">
                    {suratDetail.revelation_id}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <span className="font-medium text-[#6c6c6c]">Arti surah</span>
                  <span className="text-emerald-800 font-medium text-lg">
                    {suratDetail.translation_id}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <span className="font-medium text-[#6c6c6c]">
                    Jumlah ayat
                  </span>
                  <span className="text-emerald-800 font-medium text-lg">
                    {suratDetail.number_of_verses}
                  </span>
                </div>
              </div>
              <div className="bg-emerald-100/40 backdrop-blur-md border border-emerald-600 backdrop-blur-md px-4 py-6 lg:py-8 mt-8 rounded-2xl">
                <div className="flex flex-col lg:flex-row items-start gap-4">
                  <div className=" flex items-center gap-3">
                    <div className="bg-emerald-600 w-fit p-2.5 rounded-full">
                      <BookOpenLightIcon className="text-white" />
                    </div>
                    <span className="flex md:hidden text-emerald-800 font-medium">
                      Tafsir Surah {suratDetail.name_id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="hidden md:flex text-emerald-800 font-medium">
                      Tafsir Surah {suratDetail.name_id}
                    </span>

                    <p
                      className={`${openSans.className} font-normal  text-[12px] md:text-[14px] text-emerald-800 leading-relaxed`}
                    >
                      {suratDetail.tafsir}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Render ayat */}
          {suratAyat.map((ayat, index) => {
            const isActive = audioPlaying === ayat.ayah;

            return (
              <article
                id={`ayat-${ayat.ayah}`}
                key={ayat.ayah || index}
                className={`flex flex-col border shadow-xs rounded-2xl w-full h-auto my-2 lg:my-3 p-8 transition-colors duration-200 ${
                  isActive
                    ? "bg-emerald-100/40 backdrop-blur-md border-emerald-600"
                    : "bg-white/40 backdrop-blur-md border-black/10"
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div>
                    <button
                      onClick={() => handlePlayPause(ayat.ayah)}
                      aria-label={
                        isActive
                          ? `Jeda audio ayat ${ayat.ayah}`
                          : `Putar audio ayat ${ayat.ayah}`
                      }
                      className="p-1 rounded-full bg-emerald-600 hover:ring-5 hover:ring-emerald-50 cursor-pointer transition-colors"
                    >
                      {isActive ? (
                        <TbPlayerPauseFilled size={18} className="text-white" />
                      ) : (
                        <TbPlayerPlayFilled size={18} className="text-white" />
                      )}
                    </button>
                    <audio
                      ref={(el) => (audioRefs.current[ayat.ayah] = el)}
                      src={audioUrl(surahId, ayat.ayah)}
                      preload="none"
                      onEnded={() => handleAudioEnded(ayat.ayah)}
                      onError={(e) =>
                        console.error("Audio error:", e.currentTarget.src)
                      }
                    />
                  </div>
                </div>

                <div
                  className={`${jakarta.className} w-full ml-auto text-right mt-4 text-[30px] md:text-[34px] max-w-[95%] leading-[1.8] text-gray-800`}
                  dir="rtl"
                  lang="ar"
                >
                  {ayat.arab}

                  <span
                    className="relative mx-4 inline-flex h-[34px] w-[34px] items-center justify-center align-middle"
                    aria-label={`Ayat ${ayat.ayah}`}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    >
                      <polygon
                        points={ayatBadgePoints}
                        className={`stroke-emerald-600 transition-colors duration-200 ${
                          isActive ? "fill-emerald-600" : "fill-white"
                        }`}
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={`${jakarta.className} mt-0.5 relative text-[14px] font-medium leading-none transition-colors duration-200 ${
                        isActive ? "text-white" : "text-emerald-700"
                      }`}
                    >
                      {toArabicNumber(ayat.ayah)}
                    </span>
                  </span>
                </div>

                <div
                  className={`${jakarta.className} text-justify flex text-[16px] md:text-[18px] text-emerald-700 font-normal mt-4 italic`}
                >
                  {ayat.latin}
                </div>

                <div
                  className={`${jakarta.className} text-justify flex text-[16px] text-gray-600 font-normal mt-3 leading-relaxed`}
                >
                  {ayat.text}
                </div>
              </article>
            );
          })}

          {currentAyah != null && (
            <Portal>
              <FloatingPlayer
                audio={audioRefs.current[currentAyah]}
                surahName={suratDetail.name_id}
                ayah={currentAyah}
                totalAyah={suratDetail.number_of_verses}
                isPlaying={audioPlaying === currentAyah}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onToggle={() => handlePlayPause(currentAyah)}
                onPrev={goPrev}
                onNext={() => goNext(currentAyah)}
                onClose={closePlayer}
              />
            </Portal>
          )}

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
            <div className="py-10 text-[#6c6c6c] text-center">
              <p className="text-sm">— Selesai —</p>
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
