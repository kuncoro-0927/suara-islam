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
    <div className="relative w-full md:w-[500px] justify-center items-center flex flex-col gap-2">
      <div className="relative w-full">
        <input
          type="text"
          placeholder={dynamicPlaceholder}
          value={value}
          onChange={onChange}
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
