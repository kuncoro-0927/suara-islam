// Server Component — tidak perlu "use client"
// Semua data sudah tersedia dari server via initialData (SSR/SSG)
// Navigasi prev/next menggunakan <Link> sehingga tidak butuh useState/useEffect

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Navbar from "@/components/navbar";
import Link from "next/link";

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

        <div className="w-full flex flex-col justify-center items-center pt-[72px] md:pt-0">
          <div className="flex justify-center items-center flex-col h-auto w-[90%] md:w-[950px] mt-25 md:mt-5 border border-black/20 shadow-xl rounded-[10px] py-5 mb-5">
            {/* Header Navigasi */}
            <nav
              className="primary2 w-[90%] h-[52px] rounded-[10px] flex justify-center items-center"
              aria-label="Navigasi doa"
            >
              {/* Kembali */}
              <Link
                href="/doaharian"
                className="flex justify-center items-center w-auto efek-opacity"
                // style={{ fontFamily: 'var(--font-poppins)' }}
                aria-label="Kembali ke daftar doa"
              >
                <FaArrowLeft
                  className="text-white mr-2 ml-3"
                  aria-hidden="true"
                />
                <span className="text-white font-normal text-[10px] md:text-[16px]">
                  Kembali
                </span>
              </Link>

              {/* Judul tengah */}
              <div
                className="flex justify-center items-center flex-1"
                // style={{ fontFamily: 'var(--font-poppins)' }}
              >
                <p className="font-semibold text-[12px] text-center w-[70%] md:text-[18px] text-white">
                  Doa Harian No.{currentId}
                </p>
              </div>

              {/* Selanjutnya */}
              {canGoNext ? (
                <Link
                  href={`/doaharian/${currentId + 1}`}
                  className="flex justify-center items-center w-auto efek-opacity"
                  // style={{ fontFamily: "var(--font-poppins)" }}
                  aria-label={`Doa selanjutnya, No.${currentId + 1}`}
                >
                  <span className="text-white font-normal text-[10px] md:text-[16px]">
                    Selanjutnya
                  </span>
                  <FaArrowRight
                    className="text-white ml-2 mr-3"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <span
                  className="flex justify-center items-center w-auto opacity-50 cursor-not-allowed"
                  // style={{ fontFamily: "var(--font-poppins)" }}
                  aria-disabled="true"
                >
                  <span className="text-white font-normal text-[10px] md:text-[16px]">
                    Selanjutnya
                  </span>
                  <FaArrowRight
                    className="text-white ml-2 mr-3"
                    aria-hidden="true"
                  />
                </span>
              )}
            </nav>

            {/* Konten Doa */}
            <div
              className="flex justify-center items-center flex-col text-center px-4"
              // style={{ fontFamily: "var(--font-poppins)" }}
            >
              {/* Satu h1 per halaman — judul doa */}
              <h1 className="text-black text-[22px] md:text-[36px] font-semibold w-full md:w-[700px] h-auto mt-6 leading-tight">
                {doa.judul}
              </h1>
              <p className="text-black/50 text-[16px] md:text-[22px] font-semibold h-auto mt-2">
                Doa Harian
              </p>
              <hr className="border border-black/20 w-full md:w-[250px] mt-6 mb-9" />
            </div>

            <div
              className="flex flex-col justify-center items-center text-center w-[350px] md:w-[850px] h-auto px-4"
              // style={{ fontFamily: "var(--font-poppins)" }}
            >
              {/* Teks Arab — pakai <p> bukan <h1> (sudah ada h1 di atas) */}
              <p
                className="text-[28px] md:text-[40px] mb-6 leading-loose text-right w-[90%]"
                dir="rtl"
                lang="ar"
              >
                {doa.doa}
              </p>

              {/* Latin transliterasi (jika ada) */}
              {doa.latin && (
                <p
                  className="text-[14px] md:text-[18px] leading-relaxed text-center w-[90%] italic text-gray-500 mb-6"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {doa.latin}
                </p>
              )}

              {/* Terjemahan */}
              <p
                className="text-[16px] md:text-[20px] leading-relaxed text-justify w-[90%]"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                {doa.artinya}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
