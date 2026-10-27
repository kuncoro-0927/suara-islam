"use client";

import { Poppins, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";

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
          <div className="w-full flex flex-col justify-center items-center pt-[72px] md:pt-0">
            {/* Header */}
            <div className="flex justify-center items-center flex-col h-auto w-[90%] md:w-[1000px] mt-25 md:mt-5 border border-black/20 shadow-xl rounded-[10px] py-5">
              <div className="primary2 w-[90%] md:w-[975px] h-[52px] rounded-[10px] flex justify-center items-center">
                <div
                  className={`${jakarta.className} flex justify-center items-center flex-1`}
                >
                  <p className="font-semibold text-[18px] md:text-[24px] text-white">
                    Tahlil
                  </p>
                </div>
              </div>
            </div>

            {/* Render ayat */}
            {dataTahlil.map((ayat, index) => (
              <div
                key={ayat.id || index}
                className="flex flex-col border border-black/20 shadow-xl rounded-[10px] w-[90%] md:w-[1000px] h-auto my-3 p-10"
              >
                {/* Title */}
                {ayat.title && (
                  <div
                    className={`${openSans.className} text-left text-[16px] md:text-[20px] text-black font-semibold mb-3`}
                  >
                    {ayat.title}
                  </div>
                )}

                {/* Arabic Text */}
                <div
                  className={`${jakarta.className} text-[33px] md:text-[48px] leading-[1.8] w-full text-right mt-3 mb-5`}
                  style={{ direction: "rtl" }}
                >
                  {ayat.arabic}
                </div>

                {/* Translation */}
                <div
                  className={`${openSans.className} text-justify text-[16px] md:text-[20px] text-black/80 font-normal`}
                >
                  {ayat.translation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
