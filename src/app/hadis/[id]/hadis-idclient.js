"use client";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const categoryConfig = {
  "Bulughul Maram": {
    displayName: "Bulughul Maram",
    maxHadis: 1359,
    route: "/hadis/bulughul-maram",
  },
  Arbain: {
    displayName: "Arbain Nawawi",
    maxHadis: 42,
    route: "/hadis/arbain",
  },
  "Abu Dawud": {
    displayName: "Abu Dawud",
    maxHadis: 4590,
    route: "/hadis/perawi",
  },
  Ahmad: { displayName: "Ahmad", maxHadis: 26363, route: "/hadis/perawi" },
  Bukhari: { displayName: "Bukhari", maxHadis: 7008, route: "/hadis/perawi" },
  Darimi: { displayName: "Darimi", maxHadis: 3367, route: "/hadis/perawi" },
  "Ibnu Majah": {
    displayName: "Ibnu Majah",
    maxHadis: 4341,
    route: "/hadis/perawi",
  },
  Malik: { displayName: "Malik", maxHadis: 1594, route: "/hadis/perawi" },
  Muslim: { displayName: "Muslim", maxHadis: 5362, route: "/hadis/perawi" },
  Nasai: { displayName: "Nasa'i", maxHadis: 5662, route: "/hadis/perawi" },
  Tirmidzi: { displayName: "Tirmidzi", maxHadis: 3891, route: "/hadis/perawi" },
};

export default function HadisDetail({ initialHadis, id, category, from }) {
  const router = useRouter();
  const hadis = initialHadis;
  const config = categoryConfig[category];
  const currentId = Number(id);
  const canNext = config && currentId < config.maxHadis;
  const canPrev = currentId > 1;

  const displayName = config?.displayName || category;
  const nomor = hadis?.no || id;
  const title = `Hadis ${displayName} No.${nomor}`;

  const goBack = () => {
    if (from) {
      router.push(from);
      return;
    }
    router.push("/hadis");
  };

  const navigate = (newId) => {
    const fromParam = from ? `&from=${encodeURIComponent(from)}` : "";
    router.push(
      `/hadis/${newId}?category=${encodeURIComponent(category)}${fromParam}`,
    );
  };

  const arabText = hadis?.arab || hadis?.ar;
  const indoText = hadis?.indo || hadis?.id;

  return (
    <main id="main-content">
      <div className="flex m-0 p-0">
        <div>
          <Navbar />
        </div>

        <div className="w-full flex flex-col justify-start items-center p-10 bg-white/40 backdrop-blur-md my-4 mr-4 border border-white rounded-2xl">
          <div className="w-full flex justify-center items-center flex-col h-auto ">
            <div className=" w-full flex justify-between items-center">
              <button
                onClick={goBack}
                aria-label="Kembali"
                className={`${jakarta.className} group flex items-center justify-center gap-1 font-medium text-[#6c6c6c] hover:text-emerald-800 duration-200 cursor-pointer`}
              >
                <IoIosArrowRoundBack
                  size={22}
                  className="group-hover:scale-110 duration-200"
                />
                <span className="text-[12px] md:text-[14px]">Kembali</span>
              </button>

              <button
                onClick={canNext ? () => navigate(currentId + 1) : undefined}
                disabled={!canNext}
                aria-label="Selanjutnya"
                className={`${jakarta.className} group flex items-center justify-center gap-1 font-medium text-[#6c6c6c] duration-200 ${
                  canNext
                    ? "cursor-pointer hover:text-emerald-800"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <span className="text-[12px] md:text-[14px]">Selanjutnya</span>
                <IoIosArrowRoundForward
                  size={22}
                  className={
                    canNext ? "group-hover:scale-110 duration-200" : ""
                  }
                />
              </button>
            </div>

            {hadis ? (
              <>
                <div
                  className={`${jakarta.className} flex justify-center w-full items-center flex-col text-center px-4 my-12`}
                >
                  <p className="font-semibold text-[14px] text-emerald-800 mb-2">
                    {title}
                  </p>

                  <h1 className="text-emerald-800 text-[28px] font-semibold w-full h-auto max-w-lg leading-tight">
                    {hadis.judul || title}
                  </h1>
                </div>

                <div
                  className={`${jakarta.className} w-full bg-white/40 backdrop-blur-md flex border border-black/10 shadow-xs flex-col items-start p-8 rounded-xl`}
                >
                  <p className="text-emerald-800 text-[16px] font-semibold text-left leading-none mb-4">
                    {hadis.judul || title}
                  </p>
                  {arabText && (
                    <h2
                      className="ml-auto text-[30px] md:text-[34px] max-w-[90%] mb-4 leading-loose text-right"
                      dir="rtl"
                    >
                      {arabText}
                    </h2>
                  )}
                  {indoText && (
                    <p className="text-justify flex text-[16px] text-[#6c6c6c] font-normal  leading-relaxed">
                      {indoText}
                    </p>
                  )}
                  {!arabText && !indoText && (
                    <p className="text-gray-500">Konten hadis tidak tersedia</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-10 px-4">
                <p className="text-gray-600 mb-4 text-[14px] md:text-[16px]">
                  Hadis tidak ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
