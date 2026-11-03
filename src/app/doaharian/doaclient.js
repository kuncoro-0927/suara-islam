"use client";

import { useState } from "react";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import Link from "next/link";
import Search from "../../components/search";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function DoaHarianClient({ initialData }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter berdasarkan search
  const filteredDoa = initialData
    ? initialData.filter(
        (doa) =>
          doa.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(doa.id).includes(searchQuery),
      )
    : [];

  if (!initialData) {
    return <p className="p-5 text-red-500">Error: Failed to load doa data</p>;
  }

  return (
    <>
      <main>
        <div className="flex m-0 p-0 lg:h-dvh lg:overflow-hidden">
          <Navbar />

          <div className="min-w-0 flex-1 lg:h-dvh lg:overflow-y-auto lg:overscroll-contain no-scrollbar lg:py-4 lg:pr-4">
            <div className="m-2 mt-[90px] sm:mx-4 sm:mb-4 lg:m-0 lg:min-h-[calc(100dvh-2rem)] min-h-screen rounded-xl border border-white bg-white/40 p-4 backdrop-blur-md lg:rounded-2xl lg:p-6">
              <Header
                Title="Doa Harian"
                subtitle="Doa-doa pilihan sehari-hari"
                Description="Doa Harian dan Terjemahan"
              >
                <div className="mt-8">
                  <Search
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </Header>

              {/* Doa List */}
              <div
                className={`${jakarta.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 items-stretch h-full mt-4`}
              >
                {filteredDoa.map((doa, index) => (
                  <Link key={index} href={`/doaharian/${index + 1}`}>
                    <div className="flex flex-col gap-0.5 text-left justify-center items-start bg-white/40 backdrop-blur-md rounded-xl shadow-xs h-full px-4 py-2 border-[1px] border-black/10 hover:border-emerald-600 hover:bg-emerald-100/40 duration-200">
                      <p className="text-[12px] text-[#6c6c6c] font-medium">
                        Doa Harian
                      </p>
                      <span className="font-semibold text-[14px]  text-emerald-700">
                        {doa.judul}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
