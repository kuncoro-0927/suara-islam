"use client";
import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function MonthPopup({
  isOpen,
  onClose,
  onMonthSelect,
  currentMonth,
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i,
  );

  const handleMonthClick = (month) => {
    onMonthSelect(`${selectedYear}-${month}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-[10px] w-[90%] md:w-[500px] max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-emerald-600 text-white p-4 rounded-t-[10px] flex justify-between items-center">
          <h2 className={`${jakarta.className} text-[18px] font-semibold`}>
            Pilih Bulan
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
            Tahun:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Month Grid */}
        <div className="p-4 grid grid-cols-3 gap-3">
          {months.map((month) => (
            <button
              key={month.value}
              onClick={() => handleMonthClick(month.value)}
              className={`${jakarta.className} p-3 rounded-[8px] border border-gray-300 hover:bg-emerald-600 hover:text-white transition-colors text-[14px] font-medium ${
                currentMonth === `${selectedYear}-${month.value}`
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
