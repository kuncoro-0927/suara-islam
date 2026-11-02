"use client";

import { useState } from "react";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import Search from "../../components/search";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function AsmaulhusnaClient({ initialData }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter berdasarkan search
  const filteredAsmaul = initialData
    ? initialData.filter(
        (asmaul) =>
          asmaul.indo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asmaul.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(asmaul.id).includes(searchQuery),
      )
    : [];

  if (!initialData) {
    return (
      <p className="p-5 text-red-500">
        Error: Failed to load Asmaul Husna data
      </p>
    );
  }

  return (
    <>
      <main>
        <div className="flex m-0 p-0">
          <div>
            <Navbar />
          </div>

          <div className=" w-full p-10 bg-white/40 backdrop-blur-md my-4 mr-4 border border-white rounded-2xl">
            <Header
              Title="Asmaul Husna"
              subtitle="99 nama terbaik milik Allah"
              Description="Asmaul Husna dan Terjemahan"
            >
              <div className="mt-4">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Header>

            <div className="grid grid-cols-3 gap-6 mt-12">
              {filteredAsmaul.map((asmaul) => (
                <div key={asmaul.id} className="h-full">
                  <div className="flex h-full w-full items-stretch gap-4 rounded-xl border border-black/10 shadow-xs bg-white/40 backdrop-blur-md p-4 transition-all duration-200 hover:border-emerald-600 hover:bg-emerald-100/40 hover:shadow-sm cursor-pointer">
                    {/* Nomor: selalu di atas */}
                    <div className="self-start flex justify-center items-center border border-emerald-800 leading-none rounded-full shrink-0 w-6 h-6">
                      <span
                        className={`${jakarta.className} text-[12px] font-medium text-emerald-800`}
                      >
                        {asmaul.id}
                      </span>
                    </div>

                    {/* Teks: setinggi kartu, isi di tengah */}
                    <div
                      className={`${jakarta.className} flex gap-2 justify-between items-center text-center leading-[1.3] flex-1 `}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold text-sm text-emerald-800">
                          {asmaul.latin}
                        </span>
                        <p className="font-medium text-[12px] text-[#6c6c6c]">
                          {asmaul.indo}
                        </p>
                      </div>

                      <span className="font-semibold text-[20px] md:text-[27px] text-emerald-800">
                        {asmaul.arab}
                      </span>
                    </div>
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
