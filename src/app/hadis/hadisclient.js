"use client";
import { useState, useMemo } from "react";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import HadisCard from "../hadis/hadiscard";
import Link from "next/link";
import Search from "../../components/search";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

function extractCleanTitle(hadis, category) {
  if (category === "Arbain") {
    return hadis.judul || "Arbain";
  }

  if (hadis.judul && hadis.judul.trim()) {
    return hadis.judul;
  }

  return `Hadis ${category} No.${hadis.no}`;
}

export default function Hadis({ initialHadis = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHadis = useMemo(() => {
    if (!searchQuery) return initialHadis;

    return initialHadis.filter((hadis) => {
      const title = extractCleanTitle(hadis, hadis.category).toLowerCase();
      const category = hadis.category.toLowerCase();
      const hadisNo = String(hadis.no || "");
      const query = searchQuery.toLowerCase();

      return (
        title.includes(query) ||
        category.includes(query) ||
        hadisNo.includes(query)
      );
    });
  }, [initialHadis, searchQuery]);

  return (
    <>
      <main id="main-content">
        <div className="flex m-0 p-0">
          <div>
            <Navbar />
          </div>
          <div className="w-full">
            <Header Title="Hadis" Description="Kumpulan Hadis dan terjemahan">
              <div className="mt-4">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Header>

            {/* Navigation Buttons */}
            <div className="relative mx-5 my-3 pt-3">
              <div className="flex gap-3 md:justify-center items-center overflow-x-auto whitespace-nowrap no-scrollbar">
                <Link href="/hadis/arbain">
                  <button
                    className="md:w-[200px] w-[300px] px-5 py-2 rounded-md font-semibold transition-colors duration-200 bg-emerald-600 text-white hover:bg-emerald-800"
                    aria-label="Hadits Arbain"
                  >
                    Hadits Arbain
                  </button>
                </Link>

                <Link href="/hadis/bulughul-maram">
                  <button
                    className="md:w-[200px] w-[300px] px-5 py-2 rounded-md font-semibold transition-colors duration-200 bg-emerald-600 text-white hover:bg-emerald-800"
                    aria-label="Bulughul Maram"
                  >
                    Bulughul Maram
                  </button>
                </Link>

                <Link href="/hadis/perawi">
                  <button
                    className="md:w-[200px] w-[140px] px-5 py-2 rounded-md font-semibold transition-colors duration-200 bg-emerald-600 text-white hover:bg-emerald-800"
                    aria-label="9 Perawi"
                  >
                    9 Perawi
                  </button>
                </Link>
              </div>
            </div>

            {/* Hadis List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-10 px-4">
              {filteredHadis.length > 0 ? (
                filteredHadis.map((hadis, index) => (
                  <HadisCard
                    key={`${hadis.id || hadis.no}-${index}`}
                    hadis={hadis}
                    index={index}
                    searchQuery=""
                    showPreview={false}
                    fromPath="/hadis"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-600">
                    {searchQuery
                      ? "Tidak ada hadis ditemukan dengan pencarian tersebut"
                      : "Tidak ada hadis ditemukan"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
