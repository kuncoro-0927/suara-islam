"use client";
import { useState, useEffect, useCallback } from "react";
import { Poppins, Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../../../components/navbar";
import Header from "../../../components/header";
import Link from "next/link";

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

const bmCache = new Map();

function EnhancedSearch({ value, onChange, onSearch }) {
  return (
    <div className="relative w-full md:w-[500px] mt-3 justify-center items-center flex flex-col gap-2">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Cari berdasarkan nomor hadis..."
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="border-[1px] bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-full w-full h-[38px] md:h-[44px] pl-12 pr-5 outline-none placeholder-gray-400 text-gray-800"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p className="text-xs text-gray-500">
        Contoh: cari &quot;123&quot; untuk hadis nomor 123
      </p>
    </div>
  );
}

function HadisCard({ hadis, index = 0 }) {
  const title = hadis.judul || `Bulughul Maram No.${hadis.no}`;

  return (
    <Link href={`/hadis/${hadis.no}?category=Bulughul Maram`}>
      <div className={`${jakarta.className} flex`}>
        <div className="flex flex-col text-center justify-center items-center w-full h-[175px] border border-black/20 shadow-md rounded-lg efek-click hover:shadow-xl transition-shadow duration-200 bg-white p-3">
          <h1 className="font-semibold text-[16px] md:text-[18px] mx-3 mt-3 text-black line-clamp-2">
            {title}
          </h1>
          {hadis.no && (
            <p className="text-[12px] text-gray-500 mt-1">No. {hadis.no}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HadisBulughulMaram() {
  const [hadisList, setHadisList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHadis] = useState(1359);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const hadisPerPage = 30;

  const fetchBulughulMaramPage = useCallback(
    async (page) => {
      const cacheKey = `bm-page-${page}-${hadisPerPage}`;

      if (bmCache.has(cacheKey)) {
        const cached = bmCache.get(cacheKey);
        const now = Date.now();
        if (now - cached.timestamp < 31536000000) {
          setHadisList(cached.data.data);
          setTotalPages(cached.data.pagination.totalPages);
          console.log(
            "Loaded from client cache:",
            cached.data.data.length,
            "hadis",
          );
          return;
        }
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching Bulughul Maram page ${page} dari API route...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const res = await fetch(
          `/hadis/api/bulughul-maram?page=${page}&perPage=${hadisPerPage}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const responseData = await res.json();

        if (responseData.error) {
          throw new Error(responseData.error);
        }

        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Invalid response format");
        }

        console.log(
          `Successfully fetched ${responseData.data.length} hadis for page ${page}`,
        );

        bmCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now(),
        });

        setHadisList(responseData.data);
        setTotalPages(responseData.pagination.totalPages);
      } catch (err) {
        console.error("Failed to fetch Bulughul Maram page:", err);

        if (err.name === "AbortError") {
          setError("Request timeout - Coba refresh halaman");
        } else {
          setError(err.message || "Gagal memuat hadis Bulughul Maram");
        }
        setHadisList([]);
      } finally {
        setLoading(false);
      }
    },
    [hadisPerPage],
  );

  const handleSearch = useCallback(() => {
    const query = searchQuery.trim();
    if (!query) {
      // Reset to page 1 if search cleared
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchBulughulMaramPage(1);
      }
      return;
    }

    const hadisNo = parseInt(query);
    if (isNaN(hadisNo) || hadisNo < 1 || hadisNo > totalHadis) {
      setError(`Nomor hadis harus antara 1-${totalHadis}`);
      return;
    }

    const targetPage = Math.ceil(hadisNo / hadisPerPage);
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
    } else {
      fetchBulughulMaramPage(targetPage);
    }
  }, [
    searchQuery,
    currentPage,
    totalHadis,
    hadisPerPage,
    fetchBulughulMaramPage,
  ]);

  useEffect(() => {
    fetchBulughulMaramPage(currentPage);
  }, [currentPage, fetchBulughulMaramPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchQuery(""); // Clear search when changing page
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
    const cacheKey = `bm-page-${currentPage}-${hadisPerPage}`;
    bmCache.delete(cacheKey);
    fetchBulughulMaramPage(currentPage);
  };

  return (
    <>
      <main>
        <div className="flex m-0 p-0">
          <div>
            <Navbar />
          </div>
          <div className="w-full">
            <Header
              Title="Bulughul Maram"
              Description="Koleksi lengkap hadis Bulughul Maram"
            >
              <div className="mt-4">
                <EnhancedSearch
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                />
              </div>
            </Header>

            {/* Back Button */}
            <div className="mx-5 my-3">
              <Link href="/hadis">
                <button
                  className="px-3 sm:px-4 md:px-6 
                          py-1.5 sm:py-2 md:py-2.5 
                          bg-emerald-600 text-white rounded-md 
                          hover:bg-emerald-800 transition-colors duration-200 
                          flex items-center gap-2 
                          text-xs sm:text-sm md:text-base md:ml-5"
                >
                  <FaChevronLeft className="text-sm sm:text-base md:text-lg" />
                  Kembali ke Hadis
                </button>
              </Link>
            </div>

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
                  <p className="mt-3 text-gray-600">
                    Memuat hadis Bulughul Maram...
                  </p>
                </div>
              </div>
            )}

            {/* Hadis List */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-5 px-4">
                  {hadisList.length > 0 ? (
                    hadisList.map((hadis, index) => (
                      <HadisCard
                        key={`bm-${hadis.no}-${index}`}
                        hadis={hadis}
                        index={index}
                        fromPath="/hadis/bulughul-maram"
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-600">Tidak ada hadis ditemukan</p>
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
                <div className="text-center text-gray-500 text-sm mb-8">
                  Halaman {currentPage} dari {totalPages} | Menampilkan:{" "}
                  {hadisList.length} hadis dari total {totalHadis} hadis
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
