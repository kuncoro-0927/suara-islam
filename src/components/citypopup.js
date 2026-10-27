"use client";

import { useState, useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { IconSearch, IconTimes, IconMapMarker } from "./icons";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
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
        `https://api.myquran.com/v2/sholat/kota/cari/${keyword}`,
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
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pilih kota"
    >
      <div
        className={`${jakarta.className} bg-white rounded-lg shadow-xl w-full max-w-[500px] max-h-[600px] overflow-hidden`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-emerald-600">
          <h2 className="text-xl font-semibold text-white">Pilih Kota</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Tutup dialog"
          >
            <IconTimes size={20} />
          </button>
        </div>

        {/* Current City */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center text-gray-600">
            <IconMapMarker size={14} className="mr-2 text-emerald-600" />
            <span className="text-sm">Kota saat ini: </span>
            <span className="font-medium ml-1">{currentCity}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6">
          <div className="relative mb-4">
            <IconSearch
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
          </div>

          {/* Search Results */}
          <div className="max-h-[300px] overflow-y-auto">
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-gray-500">{error}</p>
              </div>
            )}

            {!loading && !error && searchTerm.length < 2 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Masukkan minimal 2 karakter untuk mencari kota
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              cities.length === 0 &&
              searchTerm.length >= 2 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada kota yang ditemukan</p>
                </div>
              )}

            {!loading && cities.length > 0 && (
              <div className="space-y-2">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-emerald-600 group"
                  >
                    <div className="flex items-center">
                      <IconMapMarker
                        size={14}
                        className="mr-3 text-gray-400 group-hover:text-emerald-600 transition-colors"
                      />
                      <div>
                        <p className="font-medium text-gray-800 group-hover:text-emerald-600 transition-colors">
                          {city.lokasi}
                        </p>
                        <p className="text-sm text-gray-500">ID: {city.id}</p>
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
  );
}
