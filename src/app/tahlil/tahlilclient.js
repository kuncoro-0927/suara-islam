"use client";

import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";
import Header from "@/components/header";
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

export default function TahlilClient({ initialData }) {
  const dataTahlil = Array.isArray(initialData) ? initialData : [];

  if (!initialData || dataTahlil.length === 0) {
    return (
      <main>
        <div className="flex m-0 p-0">
          <div>
            <Navbar />
          </div>
          <div className="w-full flex flex-col justify-center items-center pt-[72px] md:pt-0">
            <p className="p-5 text-red-500">
              Error: Failed to load Tahlil data
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main>
        <div className="flex m-0 p-0 lg:h-dvh lg:overflow-hidden">
          <Navbar />

          <div className="min-w-0 flex-1 lg:h-dvh lg:overflow-y-auto lg:overscroll-contain no-scrollbar lg:py-4 lg:pr-4">
            <div className="m-2 mt-[90px] sm:mx-4 sm:mb-4 lg:m-0 lg:min-h-[calc(100dvh-2rem)] min-h-screen rounded-xl border border-white bg-white/40 p-4 backdrop-blur-md lg:rounded-2xl lg:p-6">
              {/* Header */}
              <div className="mb-8">
                {" "}
                <Header
                  Title="Tahlil"
                  subtitle="Tahlil dan Terjemahan"
                  Description="Bacaan tahlil lengkap dan terjemahan"
                ></Header>
              </div>

              {/* Render ayat */}
              <div className="flex flex-col gap-3 lg:gap-5">
                {dataTahlil.map((ayat, index) => (
                  <div
                    key={ayat.id || index}
                    className="flex flex-col bg-white/40 backdrop-blur-md border border-black/10 shadow-xs rounded-xl w-full h-auto p-6 lg:p-8"
                  >
                    {/* Title */}
                    {ayat.title && (
                      <div
                        className={`${openSans.className} text-left text-[16px] text-emerald-700 font-semibold mb-3`}
                      >
                        {ayat.title}
                      </div>
                    )}

                    {/* Arabic Text */}
                    <div
                      className={`${jakarta.className} text-[30px] lg:text-[34px] leading-[1.8] w-full text-right mt-3 mb-5`}
                      style={{ direction: "rtl" }}
                    >
                      {ayat.arabic}
                    </div>

                    {/* Translation */}
                    <div
                      className={`${jakarta.className} text-justify text-[14px] lg:text-[16px] text-[#6c6c6c] font-normal`}
                    >
                      {ayat.translation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
