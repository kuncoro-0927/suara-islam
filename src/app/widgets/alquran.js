"use client";

import { useState, useEffect } from "react";
import { Poppins, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

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

export default function AlQuranEmbed({ initialData }) {
  const [isInIframe, setIsInIframe] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const insideIframe = window.self !== window.top;
    setIsInIframe(insideIframe);
    setChecked(true);

    if (!insideIframe) {
      window.location.href = "/alquran";
    }
  }, []);

  const surahList = Array.isArray(initialData) ? initialData : [];

  if (!checked) {
    return null;
  }

  if (!isInIframe) {
    return null;
  }

  if (!initialData || surahList.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="p-5 text-red-500">Error: Failed to load Al-Quran data</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Surah List */}
        <div className="flex flex-wrap justify-center items-start gap-3 sm:gap-6">
          {surahList.map((surat) => (
            <Link
              href={`/alquran/${surat.number}`}
              key={surat.number}
              className="no-underline w-full sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="border border-black/20 w-full sm:w-[350px] md:w-[353px] h-[100px] sm:h-[114px] shadow-xl rounded-[10px] flex efek-click cursor-pointer hover:shadow-2xl transition-shadow">
                <div className="flex justify-center mt-3 w-[35px] sm:w-[40px] h-full">
                  <div
                    className={`${jakarta.className} text-[12px] sm:text-[14px] flex justify-center items-center text-white w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] primary2 ring-2 ring-emerald-700 rounded-full`}
                  >
                    {surat.number}
                  </div>
                </div>
                <div
                  className={`${jakarta.className} flex flex-1 flex-col justify-center items-start text-left leading-[1.3] h-auto mx-2`}
                >
                  <h1 className="text-[20px] sm:text-[26px] font-medium text-left">
                    {surat.name_id}
                  </h1>
                  <p
                    className={`${openSans.className} text-[10px] sm:text-[12px] text-black/90`}
                  >
                    {`${surat.translation_id} · ${surat.revelation_id} · ${surat.number_of_verses}`}
                  </p>
                </div>
                <div className="flex flex-1 flex-col justify-center items-center w-auto h-auto text-[22px] sm:text-[28px] pr-2">
                  {surat.name_short}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
