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

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
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

          <div className="flex flex-col w-full">
            <Header
              Title="Asmaul Husna"
              Description="Asmaul Husna dan Terjemahan"
            >
              <div className="mt-4">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Header>

            <div className="flex flex-wrap justify-center items-center gap-5 md:ml-10 mt-5 mb-3">
              {filteredAsmaul.map((asmaul) => (
                <div
                  key={asmaul.id}
                  className="flex justify-center items-center"
                >
                  <div className="border border-black/20 w-[250px] md:w-[425px] h-[160px] shadow-xl rounded-[10px] flex">
                    <div className="flex justify-center w-[40px] h-full ">
                      <div
                        className={`${jakarta.className} text-[14px] flex justify-center items-center text-white w-[26px] h-[26px] primary2 ring-2 ring-emerald-700 rounded-full mt-3 ml-3`}
                      >
                        {asmaul.id}
                      </div>
                    </div>

                    <div
                      className={`${jakarta.className} flex flex-col justify-center items-center text-center leading-[1.3] w-full h-auto mr-9 md:mr-7`}
                    >
                      <h2 className="font-semibold text-[20px] md:text-[27px] text-black">
                        {asmaul.arab}
                      </h2>
                      <h1 className="font-semibold text-[20px] md:text-[27px] text-black">
                        {asmaul.latin}
                      </h1>
                      <p className="font-semibold text-[12px] md:text-[13px] text-emerald-600">
                        {asmaul.indo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full px-5 mb-10"></div>
      </main>
    </>
  );
}
