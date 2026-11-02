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

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
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
        <div className="flex m-0 p-0">
          <div>
            <Navbar />
          </div>

          <div className="h-full p-10 bg-white/40 rounded-2xl my-4 mr-4 backdrop-blur-md border border-white">
            <Header
              Title="Doa Harian"
              subtitle="Doa-doa pilihan sehari-hari"
              Description="Doa Harian dan Terjemahan"
            >
              <div className="mt-4">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Header>

            {/* Doa List */}
            <div
              className={`${jakarta.className} grid grid-cols-3 gap-6 items-stretch h-full mt-12`}
            >
              {filteredDoa.map((doa, index) => (
                <Link key={index} href={`/doaharian/${index + 1}`}>
                  <div className="flex flex-col text-left justify-center items-start bg-white/40 backdrop-blur-md rounded-xl shadow-xs h-full px-4 py-2 border-[1px] border-black/20 hover:border-emerald-600 hover:bg-emerald-100/40 duration-200">
                    <p className="text-[12px] text-[#6c6c6c] font-medium">
                      Doa Harian
                    </p>
                    <h1 className="font-semibold text-[14px]  text-emerald-800">
                      {doa.judul}
                    </h1>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
