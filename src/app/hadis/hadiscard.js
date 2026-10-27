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
      <div className={`${jakarta.className} flex`}>
        <div
          className={`flex flex-col text-center justify-center items-center w-full ${
            showPreview ? "h-[220px]" : "h-[175px]"
          } border border-black/20 shadow-md rounded-lg efek-click hover:shadow-xl transition-shadow duration-200 bg-white mt-3 md:mt-5 p-3`}
        >
          <h1 className="font-semibold text-[16px] md:text-[18px] mx-3 mt-3 text-black line-clamp-2">
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

          {hadis.no && (
            <p className="text-[13px] text-gray-500 mt-1">No. {hadis.no}</p>
          )}

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
