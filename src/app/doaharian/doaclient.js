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

          <div className="w-full">
            <Header Title="Doa Harian" Description="Doa Harian dan Terjemahan">
              <div className="mt-4">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Header>

            {/* Doa List */}
            <div className="flex justify-center items-center flex-wrap gap-6 mt-5 mb-10">
              {filteredDoa.map((doa, index) => (
                <Link key={index} href={`/doaharian/${index + 1}`}>
                  <div
                    className={`${jakarta.className} flex justify-center w-[375px] md:w-[90%] items-center mt-5`}
                  >
                    <div className="flex flex-col text-center justify-center items-center w-[65%] md:w-[255px] h-[175px] border-[1px] border-black/20 shadow-xl rounded-[10px] efek-click">
                      <h1 className="font-semibold text-[18px] mx-3 text-black">
                        {doa.judul}
                      </h1>
                      <p className="text-[13px] text-black/80 mt-3">
                        Doa Harian
                      </p>
                    </div>
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
