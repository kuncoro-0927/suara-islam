"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { BsSearch } from "react-icons/bs";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowRoundBack,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import Navbar from "../../../components/navbar";
import Header from "../../../components/header";
import Link from "next/link";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const perawiCache = new Map();

function EnhancedSearch({ value, onChange, onSearch }) {
  return (
    <div
      className={`${jakarta.className}relative w-full md:w-[300px] justify-start items-start flex flex-col gap-2`}
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Cari berdasarkan nomor hadis..."
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="border-[1px] text-sm bg-white/40 backdrop-blur-md border-black/10 shadow-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100/40 rounded-full w-full px-3 py-2 pl-12 pr-5 outline-none placeholder-[#6c6c6c] text-[#6c6c6c]"
        />

        <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c6c6c] w-4 h-4" />
      </div>
      <p className="text-sm text-[#6c6c6c]">
        Contoh: cari &quot;123&quot; untuk hadis nomor 123
      </p>
    </div>
  );
}

export default function HadisPerawi() {
  const [hadisList, setHadisList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerawi, setSelectedPerawi] = useState("bukhari");
  const [showPerawiDropdown, setShowPerawiDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [perawiInfo, setPerawiInfo] = useState(null);
  const [error, setError] = useState(null);

  const hadisPerPage = 30;

  const perawiCategories = useMemo(
    () => ({
      "abu-dawud": { name: "Abu Dawud", maxHadis: 4590 },
      ahmad: { name: "Ahmad", maxHadis: 26363 },
      bukhari: { name: "Bukhari", maxHadis: 7008 },
      darimi: { name: "Darimi", maxHadis: 3367 },
      "ibnu-majah": { name: "Ibnu Majah", maxHadis: 4341 },
      malik: { name: "Malik", maxHadis: 1594 },
      muslim: { name: "Muslim", maxHadis: 5362 },
      nasai: { name: "Nasai", maxHadis: 5662 },
      tirmidzi: { name: "Tirmidzi", maxHadis: 3891 },
    }),
    [],
  );

  const fetchPerawiPage = useCallback(
    async (perawi, page) => {
      const cacheKey = `perawi-${perawi}-page-${page}-${hadisPerPage}`;

      if (perawiCache.has(cacheKey)) {
        const cached = perawiCache.get(cacheKey);
        const now = Date.now();
        if (now - cached.timestamp < 31536000000) {
          setHadisList(cached.data.data);
          setTotalPages(cached.data.pagination.totalPages);
          setPerawiInfo(cached.data.perawi);
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
        console.log(
          `Fetching ${perawiCategories[perawi].name} page ${page} dari API route...`,
        );

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const res = await fetch(
          `/hadis/api/perawi/${perawi}?page=${page}&perPage=${hadisPerPage}`,
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

        perawiCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now(),
        });

        setHadisList(responseData.data);
        setTotalPages(responseData.pagination.totalPages);
        setPerawiInfo(responseData.perawi);
      } catch (err) {
        console.error("Failed to fetch perawi page:", err);

        if (err.name === "AbortError") {
          setError("Request timeout - Coba refresh halaman");
        } else {
          setError(
            err.message ||
              `Gagal memuat hadis ${perawiCategories[perawi].name}`,
          );
        }
        setHadisList([]);
      } finally {
        setLoading(false);
      }
    },
    [perawiCategories, hadisPerPage],
  );

  const handleSearch = useCallback(() => {
    const query = searchQuery.trim();
    if (!query) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchPerawiPage(selectedPerawi, 1);
      }
      return;
    }

    const maxHadis = perawiCategories[selectedPerawi]?.maxHadis;

    // Parse nomor hadis
    const hadisNo = parseInt(query);
    if (isNaN(hadisNo) || hadisNo < 1 || hadisNo > maxHadis) {
      setError(
        `Nomor hadis harus antara 1-${maxHadis} untuk ${perawiCategories[selectedPerawi]?.name}`,
      );
      return;
    }

    const targetPage = Math.ceil(hadisNo / hadisPerPage);
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
    } else {
      fetchPerawiPage(selectedPerawi, targetPage);
    }
  }, [
    searchQuery,
    currentPage,
    selectedPerawi,
    perawiCategories,
    hadisPerPage,
    fetchPerawiPage,
  ]);

  useEffect(() => {
    fetchPerawiPage(selectedPerawi, currentPage);
  }, [selectedPerawi, currentPage, fetchPerawiPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSearchQuery(""); // Clear search when changing page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePerawiChange = (perawi) => {
    setSelectedPerawi(perawi);
    setShowPerawiDropdown(false);
    setCurrentPage(1);
    setSearchQuery("");
    setError(null);
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
    const cacheKey = `perawi-${selectedPerawi}-page-${currentPage}-${hadisPerPage}`;
    perawiCache.delete(cacheKey);
    fetchPerawiPage(selectedPerawi, currentPage);
  };

  return (
    <main>
      <div className="flex m-0 p-0">
        <div>
          <Navbar />
        </div>
        <div className="w-full p-10 bg-white/40 backdrop-blur-md my-4 mr-4 border border-white rounded-2xl">
          {/* Header and Search Layout */}
          <Header
            Title="Hadis 9 Perawi"
            subtitle="Pondasi ajaran Islam"
            Description="Koleksi hadis dari 9 perawi utama"
          >
            <div className="mt-4">
              <EnhancedSearch
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
              />
            </div>
          </Header>

          {/* Back Button and Filter */}
          <div className="flex flex-row items-center justify-between gap-3">
            <div className=" w-fit my-6">
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

            {/* Filter Perawi */}
            <div className="relative ">
              <button
                onClick={() => setShowPerawiDropdown(!showPerawiDropdown)}
                className={`pl-5 pr-4 py-2.5 bg-white/40 backdrop-blur-md transition-colors duration-200 flex items-center gap-2 border shadow-xs rounded-full justify-between text-sm cursor-pointer
                   ${showPerawiDropdown ? "border-emerald-600 text-emerald-800 bg-emerald-100/40" : "border-black/10 text-[#6c6c6c] hover:border-emerald-600 hover:bg-emerald-100/40 hover:text-emerald-800"}`}
              >
                <span>{perawiCategories[selectedPerawi]?.name}</span>
                {showPerawiDropdown ? (
                  <IoIosArrowUp className="text-emerald-600" />
                ) : (
                  <IoIosArrowDown />
                )}
              </button>

              {showPerawiDropdown && (
                <div className="absolute top-full space-y-1 right-0 mt-2 p-4 w-[200px] bg-white/40 backdrop-blur-md rounded-xl border border-black/10 shadow-lg z-50 max-h-60 overflow-y-auto no-scrollbar">
                  {Object.entries(perawiCategories).map(([slug, info]) => (
                    <button
                      key={slug}
                      onClick={() => handlePerawiChange(slug)}
                      className={`block w-full text-left px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-sm  transition-colors cursor-pointer ${
                        selectedPerawi === slug
                          ? "bg-emerald-600 text-white rounded-lg "
                          : "hover:bg-emerald-600 hover:text-white rounded-lg text-[#6c6c6c] "
                      }`}
                    >
                      {info.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className=" mb-3">
              <p className="text-red-700 text-center text-sm mb-3">{error}</p>
              <div className="text-center">
                <button
                  onClick={handleRetry}
                  className="px-4 text-sm leading-none py-2.5 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center mt-10 py-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-3 text-gray-600">
                  Memuat hadis {perawiCategories[selectedPerawi]?.name}...
                </p>
              </div>
            </div>
          )}

          {/* Hadis List */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {hadisList.length > 0 ? (
                  hadisList.map((hadis, index) => (
                    <Link
                      key={`perawi-${hadis.id || hadis.no}-${index}`}
                      href={`/hadis/${hadis.no}?category=${encodeURIComponent(hadis.category)}`}
                    >
                      <div className={`${jakarta.className} flex h-full`}>
                        <div className="flex flex-col gap-1 text-left justify-start items-start w-full h-full px-4 py-3 border border-black/10 bg-white/40 backdrop-blur-md shadow-xs rounded-xl hover:shadow-sm hover:bg-emerald-100/40 hover:border-emerald-600 transition-all duration-200">
                          {hadis.no && (
                            <p className="text-[12px] text-[#6c6c6c] font-medium">
                              No. {hadis.no}
                            </p>
                          )}
                          <h1 className="font-semibold text-[12px] md:text-[14px] text-emerald-800 line-clamp-2">
                            {hadis.judul || `${hadis.category} No.${hadis.no}`}
                          </h1>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-600">Tidak ada hadis ditemukan</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 my-6 mt-12 px-4">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`rounded-md mr-6 text-sm leading-none inline-flex items-center justify-center gap-1 ${
                      currentPage === 1
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-emerald-800 cursor-pointer"
                    }`}
                  >
                    <IoIosArrowBack
                      size={12}
                      className="shrink-0 translate-y-[1.5px]"
                    />
                    <span>Prev</span>
                  </button>

                  {/* Page Numbers */}
                  {generatePageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-8 w-8 mx-0.5 leading-none flex items-center justify-center text-sm rounded-full transition-all cursor-pointer ${
                        page === currentPage
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100/70"
                          : "text-[#6c6c6c] hover:bg-emerald-600 hover:text-white hover:ring-4 hover:ring-emerald-100/70"
                      }`}
                    >
                      <span className="-translate-y-px">{page}</span>
                    </button>
                  ))}
                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-6 rounded-md text-sm flex items-center gap-1 ${
                      currentPage === totalPages
                        ? " text-gray-500 cursor-not-allowed"
                        : "text-emerald-800 cursor-pointer"
                    }`}
                  >
                    Next
                    <IoIosArrowForward size={12} />
                  </button>
                </div>
              )}

              {/* Page Info */}
              <div className="text-center text-gray-500 text-sm mb-8">
                Halaman {currentPage} dari {totalPages} | Menampilkan:{" "}
                {hadisList.length} hadis -{" "}
                {perawiInfo?.name || perawiCategories[selectedPerawi]?.name}
                {perawiInfo && ` (Total: ${perawiInfo.maxHadis} hadis)`}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
