"use client";
import { useState, useMemo } from "react";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import HadisCard from "../hadis/hadiscard";
import Link from "next/link";
import Search from "../../components/search";
import { FaScroll } from "react-icons/fa";

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
          <div className="w-full p-10 bg-white/40 backdrop-blur-md my-4 mr-4 border border-white rounded-2xl">
            <Header
              subtitle="Hadis dan terjemahan"
              Title="Hadis"
              Description="Kumpulan Hadis dan terjemahan"
            >
              <div className="mt-8">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Header>

            {/* Navigation Buttons */}

            <div className="flex my-2 py-3 gap-3 md:justify-start items-center overflow-x-auto whitespace-nowrap no-scrollbar">
              <Link href="/hadis/arbain">
                <button
                  className="px-5 flex items-center gap-2 py-2.5 rounded-full border border-black/10 text-sm bg-white/40 backdrop-blur-md text-[#6c6c6c] shadow-xs hover:border-emerald-600 hover:bg-emerald-100/40 hover:text-emerald-800 cursor-pointer transition-colors duration-200"
                  aria-label="Hadits Arbain"
                >
                  <FaScroll className="text-emerald-600" />
                  Hadits Arbain
                </button>
              </Link>

              <Link href="/hadis/bulughul-maram">
                <button
                  className="px-5 flex items-center gap-2 py-2.5 rounded-full border border-black/10 text-sm bg-white/40 backdrop-blur-md text-[#6c6c6c] shadow-xs hover:border-emerald-600 hover:bg-emerald-100/40 hover:text-emerald-800 cursor-pointer transition-colors duration-200"
                  aria-label="Bulughul Maram"
                >
                  {" "}
                  <FaScroll className="text-emerald-600" />
                  Bulughul Maram
                </button>
              </Link>

              <Link href="/hadis/perawi">
                <button
                  className="px-5 flex items-center gap-2 py-2.5 rounded-full border border-black/10 text-sm bg-white/40 backdrop-blur-md text-[#6c6c6c] shadow-xs hover:border-emerald-600 hover:bg-emerald-100/40 hover:text-emerald-800 cursor-pointer transition-colors duration-200"
                  aria-label="9 Perawi"
                >
                  {" "}
                  <FaScroll className="text-emerald-600" />9 Perawi
                </button>
              </Link>
            </div>

            {/* Hadis List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center items-stretch gap-6 mb-10">
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
                  <p className="text-[#6c6c6c]">
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
