"use client";
import { useState, useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { IoIosClose, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Portal from "./portal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const THIS_YEAR = new Date().getFullYear();
const MIN_YEAR = THIS_YEAR - 5;
const MAX_YEAR = THIS_YEAR + 4;

const months = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export default function MonthPopup({
  isOpen,
  onClose,
  onMonthSelect,
  currentMonth,
}) {
  const [selectedYear, setSelectedYear] = useState(THIS_YEAR);

  // tiap modal dibuka, mulai dari tahun bulan yang sedang aktif
  useEffect(() => {
    if (isOpen) {
      setSelectedYear(Number(currentMonth?.slice(0, 4)) || THIS_YEAR);
    }
  }, [isOpen, currentMonth]);

  const handleMonthClick = (month) => {
    onMonthSelect(`${selectedYear}-${month}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Pilih bulan"
        onClick={onClose}
      >
        <div
          className={`${jakarta.className} max-h-[80vh] w-full max-w-[450px] overflow-y-auto rounded-2xl bg-white shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold leading-none">
                Pilih Bulan
              </h2>
              <span className="text-sm text-[#6c6c6c]">
                Pilih bulan untuk melihat jadwal sholat
              </span>
            </div>

            <button
              onClick={onClose}
              className="transition-colors"
              aria-label="Tutup dialog"
            >
              <IoIosClose
                size={24}
                className="cursor-pointer duration-200 hover:scale-110"
              />
            </button>
          </div>

          {/* Year Navigator */}
          <div className="flex items-center justify-between gap-6 px-6 pt-6">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              disabled={selectedYear <= MIN_YEAR}
              aria-label="Tahun sebelumnya"
              className="rounded-full p-2 text-[#6c6c6c] transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-[#6c6c6c] cursor-pointer"
            >
              <IoIosArrowBack size={16} />
            </button>

            <span
              className="text-sm font-semibold text-emerald-800"
              aria-live="polite"
            >
              {selectedYear}
            </span>

            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              disabled={selectedYear >= MAX_YEAR}
              aria-label="Tahun berikutnya"
              className="rounded-full p-2 text-[#6c6c6c] transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-[#6c6c6c] cursor-pointer"
            >
              <IoIosArrowForward size={16} />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-3 p-6">
            {months.map((month) => {
              const isActive =
                currentMonth === `${selectedYear}-${month.value}`;
              return (
                <button
                  key={month.value}
                  onClick={() => handleMonthClick(month.value)}
                  className={`cursor-pointer rounded-[8px] border px-3 py-2.5 text-[14px] transition-colors ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-300 bg-white text-[#6c6c6c] hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                  }`}
                >
                  {month.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Portal>
  );
}
