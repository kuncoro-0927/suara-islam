"use client";
import Link from "next/link";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { hadisService } from "../../app/hadis/hadisService";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

function extractCleanTitle(hadis, category) {
  if (category === "Bulughul Maram") {
    return hadis.judul || `Bulughul Maram No.${hadis.no}`;
  }

  if (category === "Arbain") {
    return hadis.judul || "Arbain";
  }

  if (hadis.judul && hadis.judul.trim()) {
    return hadis.judul;
  }

  return `Hadis ${category} No.${hadis.no}`;
}

export default function HadisCard({
  hadis,
  index = 0,
  searchQuery = "",
  showPreview = false,
  fromPath = "/hadis",
}) {
  const title = extractCleanTitle(hadis, hadis.category);
  const preview = showPreview
    ? hadisService.generatePreviewText(hadis, 80)
    : "";

  return (
    <Link
      href={`/hadis/${hadis.no || index + 1}?category=${encodeURIComponent(hadis.category)}&from=${encodeURIComponent(fromPath)}`}
    >
      <div className={`${jakarta.className} flex h-full`}>
        <div className="flex flex-col gap-1 text-left justify-center items-start w-full h-full px-4 py-3 border border-black/10 bg-white/40 backdrop-blur-md shadow-xs rounded-xl hover:shadow-sm hover:border-emerald-600 transition-all duration-200">
          {hadis.no && (
            <p className="text-[12px] text-[#6c6c6c] font-medium">No. {hadis.no}</p>
          )}
          <h1 className="font-semibold text-[12px] md:text-[14px] text-emerald-800 line-clamp-2">
            {searchQuery ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: hadisService.highlightSearchTerm(title, searchQuery),
                }}
              />
            ) : (
              title
            )}
          </h1>

          {showPreview && preview && (
            <div className="mt-2 px-2 flex-1 flex items-center">
              <p className="text-[13px] md:text-sm text-gray-600 line-clamp-3 text-left">
                {searchQuery ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: hadisService.highlightSearchTerm(
                        preview,
                        searchQuery,
                      ),
                    }}
                  />
                ) : (
                  preview
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
