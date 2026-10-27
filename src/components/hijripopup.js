"use client";
import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function HijriMonthPopup({
  isOpen,
  onClose,
  onMonthSelect,
  currentMonth,
  currentYear,
}) {
  const [selectedYear, setSelectedYear] = useState(currentYear || 1447);

  const hijriMonths = [
    { value: 1, label: "Muharram" },
    { value: 2, label: "Safar" },
    { value: 3, label: "Rabiul Awal" },
    { value: 4, label: "Rabiul Akhir" },
    { value: 5, label: "Jumadil Awal" },
    { value: 6, label: "Jumadil Akhir" },
    { value: 7, label: "Rajab" },
    { value: 8, label: "Sya'ban" },
    { value: 9, label: "Ramadhan" },
    { value: 10, label: "Syawwal" },
    { value: 11, label: "Dzulqa'dah" },
    { value: 12, label: "Dzulhijjah" },
  ];

  const years = Array.from({ length: 54 }, (_, i) => 1447 + i); // 1447-1500

  const handleMonthClick = (month) => {
    onMonthSelect(month, selectedYear);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-[10px] w-[90%] md:w-[500px] max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-emerald-600 text-white p-4 rounded-t-[10px] flex justify-between items-center">
          <h2 className={`${jakarta.className} text-[18px] font-semibold`}>
            Pilih Bulan Hijriah
          </h2>
          <button
            onClick={onClose}
            className="text-white text-[24px] hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {/* Year Selector */}
        <div className="p-4 border-b">
          <label
            className={`${jakarta.className} text-[14px] font-medium mb-2 block`}
          >
            Tahun Hijriah:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year} H
              </option>
            ))}
          </select>
        </div>

        {/* Month Grid */}
        <div className="p-4 grid grid-cols-3 gap-3">
          {hijriMonths.map((month) => (
            <button
              key={month.value}
              onClick={() => handleMonthClick(month.value)}
              className={`${jakarta.className} p-3 rounded-[8px] border border-gray-300 hover:bg-emerald-600 hover:text-white transition-colors text-[14px] font-medium ${
                currentMonth === month.value && currentYear === selectedYear
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
