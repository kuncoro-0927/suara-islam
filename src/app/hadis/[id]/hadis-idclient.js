"use client";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/navbar";
import { IconArrowLeft, IconArrowRight } from "../../../components/icons";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";

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

        <div className="w-full flex flex-col justify-center items-center pt-[72px] md:pt-0">
          <div className="flex justify-center items-center flex-col h-auto w-[90%] md:w-[950px] mt-25 md:mt-5 border border-black/20 shadow-xl rounded-[10px] py-5 mb-5">
            <div className="primary2 w-[90%] h-[52px] rounded-[10px] flex justify-center items-center">
              <button
                onClick={goBack}
                className={`${jakarta.className} flex justify-center items-center w-auto efek-opacity cursor-pointer bg-transparent border-none`}
                aria-label="Kembali"
              >
                <IconArrowLeft size={14} className="text-white mr-2 ml-3" />
                <span className="text-white font-normal text-[12px] md:text-[16px]">
                  Kembali
                </span>
              </button>

              <div
                className={`${jakarta.className} flex justify-center items-center flex-1`}
              >
                <p className="font-semibold text-[12px] text-center w-[70%] md:text-[18px] text-white">
                  {title}
                </p>
              </div>

              <button
                onClick={canNext ? () => navigate(currentId + 1) : undefined}
                className={`${jakarta.className} flex justify-center items-center w-auto bg-transparent border-none ${
                  canNext
                    ? "efek-opacity cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
                aria-label="Selanjutnya"
                disabled={!canNext}
              >
                <span className="text-white font-normal text-[12px] md:text-[16px]">
                  Selanjutnya
                </span>
                <IconArrowRight size={14} className="text-white ml-2 mr-3" />
              </button>
            </div>

            {hadis ? (
              <>
                <div
                  className={`${jakarta.className} flex justify-center items-center flex-col text-center px-4`}
                >
                  <h1 className="text-black text-[22px] md:text-[36px] font-semibold w-full md:w-[700px] h-auto mt-6 leading-tight">
                    {hadis.judul || title}
                  </h1>
                  <p className="text-black/50 text-[16px] md:text-[22px] font-semibold h-auto mt-2">
                    {hadis.rawi || displayName}
                  </p>
                  <hr
                    className="border border-black/20 w-full md:w-[250px] mt-6 mb-9"
                    aria-hidden="true"
                  />
                </div>

                <div
                  className={`${jakarta.className} flex flex-col justify-center items-center text-center w-[350px] md:w-[850px] h-auto px-4`}
                >
                  {arabText && (
                    <h2
                      className="text-[20px] md:text-[28px] mb-6 leading-loose text-right w-[300px] md:w-[90%]"
                      dir="rtl"
                    >
                      {arabText}
                    </h2>
                  )}
                  {indoText && (
                    <p className="text-[15px] md:text-[20px] leading-relaxed text-justify w-[300px] md:w-[90%]">
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
