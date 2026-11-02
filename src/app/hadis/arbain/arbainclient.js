"use client";
import { useState, useEffect, useCallback } from "react";
import { Poppins, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../../../components/navbar";
import Header from "../../../components/header";
import Link from "next/link";
import Search from "../../../components/search";
import { IoIosArrowRoundBack } from "react-icons/io";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function HadisArbain() {
  const [hadisList, setHadisList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allHadis, setAllHadis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const hadisPerPage = 30;

  const fetchArbainHadis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Mengambil semua hadis Arbain dari API route...");
      const response = await fetch("/hadis/api/arbain?id=all");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);

      let results = [];

      if (Array.isArray(data)) {
        results = data.map((item) => ({
          ...(item.data || item),
          category: "Arbain",
        }));
      } else if (data.data && Array.isArray(data.data)) {
        results = data.data.map((item) => ({
          ...(item.data || item),
          category: "Arbain",
        }));
      } else if (data.data) {
        results = [
          {
            ...data.data,
            category: "Arbain",
          },
        ];
      }

      if (results.length === 0) {
        throw new Error("Tidak ada data hadis yang ditemukan");
      }

      setAllHadis(results);

      console.log(`Total hadis Arbain berhasil dimuat: ${results.length}`);
      console.log("Sample hadis pertama:", results[0]);
      console.log("Judul hadis pertama:", results[0].judul);
    } catch (err) {
      console.error("Failed to fetch Arbain hadis:", err);
      setError(err.message || "Gagal memuat hadis Arbain. Silakan coba lagi.");
      setAllHadis([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDisplayedHadis = useCallback(() => {
    const filtered = allHadis.filter((hadis) => {
      const title = (hadis.judul || `Arbain No.${hadis.no}`).toLowerCase();
      const hadisNo = String(hadis.no || "");
      const query = searchQuery.toLowerCase();

      return title.includes(query) || hadisNo.includes(query);
    });

    if (searchQuery && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    const dataToUse = searchQuery ? filtered : allHadis;
    const newTotalPages = Math.ceil(dataToUse.length / hadisPerPage);
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * hadisPerPage;
    const endIndex = startIndex + hadisPerPage;
    const displayedHadis = dataToUse.slice(startIndex, endIndex);
    setHadisList(displayedHadis);
  }, [currentPage, allHadis, searchQuery, hadisPerPage]);

  useEffect(() => {
    fetchArbainHadis();
  }, [fetchArbainHadis]);

  useEffect(() => {
    if (allHadis.length > 0) {
      updateDisplayedHadis();
    }
  }, [updateDisplayedHadis, allHadis]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleRetry = () => {
    fetchArbainHadis();
  };

  const filteredCount = searchQuery
    ? allHadis.filter((hadis) => {
        const title = (hadis.judul || `Arbain No.${hadis.no}`).toLowerCase();
        const hadisNo = String(hadis.no || "");
        const query = searchQuery.toLowerCase();
        return title.includes(query) || hadisNo.includes(query);
      }).length
    : allHadis.length;

  return (
    <>
      <main>
        <div className={`${jakarta.className} flex m-0 p-0`}>
          <div>
            <Navbar />
          </div>
          <div className="w-full p-10 bg-white/40 backdrop-blur-md rounded-2xl my-4 mr-4 border border-white">
            <Header
              Title="Hadis Arbain"
              subtitle="Pondasi ajaran Islam"
              Description="Koleksi 42 Hadis Arbain Nawawi"
            >
              <div className="mt-8">
                <Search
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Header>

            {/* Back Button */}
            <div className=" w-fit mt-8">
              <Link href="/hadis" className="">
                <button
                  className="s duration-200 
                          flex items-center gap-1 
                          text-xs sm:text-sm font-medium text-[#6c6c6c] hover:text-emerald-800 cursor-pointer
                          "
                >
                  <IoIosArrowRoundBack className="text-xl" />
                  Kembali ke Hadis
                </button>
              </Link>
            </div>

            {/* Search Results Info */}
            {searchQuery && !loading && !error && (
              <div className="mt-8">
                <p className="text-sm text-[#6c6c6c]">
                  {filteredCount > 0
                    ? `Ditemukan ${filteredCount} hadis untuk pencarian "${searchQuery}"`
                    : `Tidak ada hadis ditemukan untuk pencarian "${searchQuery}"`}
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mx-5 mb-3 p-4 bg-red-50 border border-red-200 rounded-lg md:ml-5">
                <p className="text-red-700 text-center mb-3">{error}</p>
                <div className="text-center">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center mt-10 py-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Memuat hadis Arbain...</p>
                </div>
              </div>
            )}

            {/* Hadis List */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-5">
                  {hadisList.length > 0 ? (
                    hadisList.map((hadis, index) => (
                      <Link
                        key={`arbain-${hadis.no}-${index}`}
                        href={`/hadis/${hadis.no}?category=Arbain`}
                      >
                        <div className={`${jakarta.className} flex h-full`}>
                          <div className="flex flex-col gap-1 text-left justify-start items-start w-full h-full px-4 py-3 border border-black/10 bg-white/40 backdrop-blur-md shadow-xs rounded-xl hover:shadow-sm hover:border-emerald-600 transition-all duration-200">
                            {hadis.no && (
                              <p className="text-[12px] text-[#6c6c6c] font-medium">
                                No. {hadis.no}
                              </p>
                            )}
                            <h1 className="font-semibold text-[12px] md:text-[14px] text-emerald-800 line-clamp-2">
                              {hadis.judul || `Arbain No.${hadis.no}`}
                            </h1>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-600">
                        {searchQuery
                          ? ""
                          : "Tidak ada hadis ditemukan"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 my-8 px-4">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md flex items-center gap-1 ${
                        currentPage === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-800"
                      }`}
                    >
                      <FaChevronLeft size={12} />
                      Prev
                    </button>

                    {/* Page Numbers */}
                    {generatePageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md font-semibold ${
                          page === currentPage
                            ? "bg-emerald-800 text-white"
                            : "bg-emerald-600 text-white hover:bg-emerald-800"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md flex items-center gap-1 ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-800"
                      }`}
                    >
                      Next
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                )}

                {/* Page Info */}
                <div className="text-center text-gray-500 text-sm mt-12">
                  {searchQuery ? (
                    <>
                      Menampilkan hasil pencarian: {hadisList.length} dari{" "}
                      {filteredCount} hadis
                    </>
                  ) : (
                    <>
                      Halaman {currentPage} dari {totalPages} | Menampilkan:{" "}
                      {hadisList.length} hadis - Hadis Arbain Nawawi (Total: 42
                      hadis)
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
