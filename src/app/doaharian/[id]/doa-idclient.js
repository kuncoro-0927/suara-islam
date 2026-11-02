// Server Component — tidak perlu "use client"
// Semua data sudah tersedia dari server via initialData (SSR/SSG)
// Navigasi prev/next menggunakan <Link> sehingga tidak butuh useState/useEffect

import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
export default function DoaContent({ initialData: doa, doaId }) {
  const currentId = parseInt(doaId);
  const canGoPrev = currentId > 1;
  const canGoNext = currentId < 108;

  // Jika tidak ada data (misal ID tidak valid)
  if (!doa) {
    return (
      <main>
        <div className="flex m-0 p-0">
          <div>
            <Navbar />
          </div>
          <div className="w-full flex flex-col justify-center items-center pt-[72px] md:pt-0">
            <div className="flex justify-center items-center flex-col h-auto w-[90%] md:w-[950px] mt-25 md:mt-5 border border-black/20 shadow-xl rounded-[10px] py-10 mb-5">
              <p className="text-red-600 text-[16px] mb-4">
                Doa tidak ditemukan.
              </p>
              <Link
                href="/doaharian"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[14px] hover:bg-emerald-700 transition-colors"
              >
                Kembali ke Doa Harian
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <div className="flex m-0 p-0">
        <div>
          <Navbar />
        </div>

        <div className="w-full flex flex-col justify-start items-center p-10 bg-white/40 rounded-2xl backdrop-blur-md border border-white my-4 mr-4">
          <div className="flex w-full justify-center items-center flex-col ">
            {/* Header Navigasi */}

            <nav
              className="flex w-full items-center justify-between"
              aria-label="Navigasi doa"
            >
              {/* Kembali */}
              <Link
                href="/doaharian"
                aria-label="Kembali ke daftar doa"
                className={`${jakarta.className} group flex items-center justify-center gap-1 font-medium text-[#6c6c6c] duration-200 hover:text-emerald-800`}
              >
                <IoIosArrowRoundBack
                  size={22}
                  className="duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="text-[12px] md:text-[14px]">Kembali</span>
              </Link>

              {/* Selanjutnya */}
              {canGoNext ? (
                <Link
                  href={`/doaharian/${currentId + 1}`}
                  aria-label={`Doa selanjutnya, No.${currentId + 1}`}
                  className={`${jakarta.className} group flex items-center justify-center gap-1 font-medium text-[#6c6c6c] duration-200 hover:text-emerald-800`}
                >
                  <span className="text-[12px] md:text-[14px]">
                    Selanjutnya
                  </span>
                  <IoIosArrowRoundForward
                    size={22}
                    className="duration-200 group-hover:scale-110"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={`${jakarta.className} flex cursor-not-allowed items-center justify-center gap-1 font-medium text-[#6c6c6c] opacity-50`}
                >
                  <span className="text-[12px] md:text-[14px]">
                    Selanjutnya
                  </span>
                  <IoIosArrowRoundForward size={22} aria-hidden="true" />
                </span>
              )}
            </nav>

            {/* Konten Doa */}
            <div className="flex w-full justify-center items-center flex-col text-center my-12 ">
              <p
                className={`${jakarta.className} text-[14px] font-semibold text-emerald-800`}
              >
                Doa Harian No.{currentId}
              </p>
              <h1 className="text-emerald-800 text-[28px] font-semibold w-full h-auto mt-2 leading-tight">
                {doa.judul}
              </h1>
            </div>

            <div
              className={`${jakarta.className} w-full flex flex-col justify-center items-start h-auto bg-white/40 backdrop-blur-md p-8 border border-black/10 shadow-xs rounded-xl`}
            >
              <span className="text-emerald-800 text-[16px] font-semibold w-full h-auto mb-4 leading-tight">
                {doa.judul}
              </span>
              <p
                className="text-[34px] mb-4 leading-loose text-right w-[90%] ml-auto"
                dir="rtl"
                lang="ar"
              >
                {doa.doa}
              </p>

              {/* Terjemahan */}
              <p className="text-[16px] text-[#6c6c6c] leading-relaxed text-justify">
                {doa.artinya}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
