"use client";

import { useState, useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { IconMapMarker } from "./icons";
import { IoIosClose } from "react-icons/io";
import Portal from "./portal";
import { BsSearch } from "react-icons/bs";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const toTitleCase = (str = "") =>
  str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export default function CityPopup({
  isOpen,
  onClose,
  onCitySelect,
  currentCity,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const delayDebounceFn = setTimeout(() => {
        searchCities(searchTerm);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setCities([]);
    }
  }, [searchTerm]);

  const searchCities = async (keyword) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(keyword)}`,
      );
      const data = await response.json();

      if (data.status && data.data) {
        setCities(data.data);
      } else {
        setCities([]);
        setError("Kota tidak ditemukan");
      }
    } catch (err) {
      setError("Gagal mencari kota");
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    onCitySelect(city);
    onClose();
    setSearchTerm("");
    setCities([]);
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
    setCities([]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Pilih kota"
        onClick={handleClose}
      >
        <div
          className={`${jakarta.className} max-h-[600px] w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold leading-none">
                Pilih Kota
              </h2>
              <span className="text-sm text-[#6c6c6c]">
                Cari kota untuk melihat jadwal sholat di daerahmu
              </span>
            </div>

            <button
              onClick={handleClose}
              className="transition-colors"
              aria-label="Tutup dialog"
            >
              <IoIosClose
                size={24}
                className="cursor-pointer duration-200 hover:scale-110"
              />
            </button>
          </div>

          {/* Current City */}
          <div className="flex items-center gap-1 rounded-xl px-6 py-3">
            <span className="text-sm font-medium">Kota saat ini: </span>
            <div className="flex items-center">
              <IconMapMarker size={12} className="text-emerald-600" />
              <span className="ml-1 text-sm font-semibold text-emerald-800">
                {toTitleCase(currentCity)}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 px-6">
            <div className="relative mb-4">
              <BsSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari nama kota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-50"
              />
            </div>

            {/* Search Results */}
            <div className="no-scrollbar max-h-[300px] overflow-y-auto pb-4">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
                </div>
              )}

              {error && (
                <div className="pb-4 text-left">
                  <p className="text-sm text-[#6c6c6c]">{error}</p>
                </div>
              )}

              {!loading && !error && searchTerm.length < 2 && (
                <div className="pb-4 text-left">
                  <p className="text-sm text-[#6c6c6c]">
                    Masukkan minimal 2 karakter untuk mencari kota
                  </p>
                </div>
              )}

              {!loading &&
                !error &&
                cities.length === 0 &&
                searchTerm.length >= 2 && (
                  <div className="pb-4 text-left">
                    <p className="text-sm text-[#6c6c6c]">
                      Tidak ada kota yang ditemukan
                    </p>
                  </div>
                )}

              {!loading && cities.length > 0 && (
                <div className="space-y-2">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="group w-full cursor-pointer rounded-lg border border-black/10 p-3 text-left shadow-xs transition-colors hover:border-emerald-600 hover:bg-emerald-100/40"
                    >
                      <div className="flex items-center">
                        <IconMapMarker
                          size={14}
                          className="mr-3 text-emerald-600 transition-colors"
                        />
                        <div className="flex w-full flex-row items-center justify-between">
                          <p className="text-sm font-medium text-[#6c6c6c] transition-colors group-hover:text-emerald-800">
                            {toTitleCase(city.lokasi)}
                          </p>
                          <p className="text-xs text-gray-500">ID: {city.id}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
