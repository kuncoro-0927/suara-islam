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
        <div className="flex m-0 p-0">
          <div>
            <Navbar />
          </div>

          {/* Content */}
          <div className="w-full flex flex-col justify-start items-start p-10 bg-white/40 backdrop-blur-md my-4 mr-4 rounded-2xl border border-white">
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
            <div className="flex flex-col gap-6">
              {dataTahlil.map((ayat, index) => (
                <div
                  key={ayat.id || index}
                  className="flex flex-col bg-white/40 backdrop-blur-md border border-black/10 shadow-xs rounded-xl w-full h-auto p-8"
                >
                  {/* Title */}
                  {ayat.title && (
                    <div
                      className={`${openSans.className} text-left text-[14px] md:text-[18px] text-emerald-800 font-semibold mb-3`}
                    >
                      {ayat.title}
                    </div>
                  )}

                  {/* Arabic Text */}
                  <div
                    className={`${jakarta.className} text-[30px] leading-[1.8] w-full text-right mt-3 mb-5`}
                    style={{ direction: "rtl" }}
                  >
                    {ayat.arabic}
                  </div>

                  {/* Translation */}
                  <div
                    className={`${jakarta.className} text-justify text-[14px] text-[#6c6c6c] font-normal`}
                  >
                    {ayat.translation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
