import { BsSearch } from "react-icons/bs";

export default function Search({
  value,
  onChange,
  placeholder = "Cari..",
  searchMode = "title", // "title" atau "content"
  onSearchModeChange = null,
}) {
  // Tentukan placeholder berdasarkan searchMode
  const dynamicPlaceholder =
    searchMode === "content" ? "Cari dalam isi hadis..." : placeholder;

  return (
    <div className="relative w-full md:w-[300px] justify-center items-center flex flex-col gap-2">
      <div className="relative w-full">
        <input
          type="text"
          placeholder={dynamicPlaceholder}
          value={value}
          onChange={onChange}
          className="border-[1px] text-sm bg-white/40 backdrop-blur-md border-black/10 shadow-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100/40 rounded-full w-full px-3 py-2 pl-12 pr-5 outline-none placeholder-[#6c6c6c] text-[#6c6c6c]"
        />

        <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c6c6c] w-4 h-4" />
      </div>

      {/* Toggle search mode - hanya tampil di halaman yang support content search */}
      {onSearchModeChange && (
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => onSearchModeChange("title")}
            className={`px-3 py-1 rounded-full transition-colors ${
              searchMode === "title"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Cari Judul
          </button>
          <button
            onClick={() => onSearchModeChange("content")}
            className={`px-3 py-1 rounded-full transition-colors ${
              searchMode === "content"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Cari Isi Hadis
          </button>
        </div>
      )}
    </div>
  );
}
