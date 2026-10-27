"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { IconMapMarker, IconCalendar } from "../../components/icons";
import Image from "next/image";
import ShareEmbedButton from "../../components/ShareEmbedButton";
import { IoChevronDown } from "react-icons/io5";

const CityPopup = lazy(() => import("../../components/citypopup"));

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

const formatMasehiFull = () => {
  const today = new Date();
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const tanggal = today.getDate();
  const namaBulan = bulan[today.getMonth()];
  const tahun = today.getFullYear();
  return `${tanggal} ${namaBulan} ${tahun}`;
};

const toMinutes = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function JadwalSholatCard({
  cityId = "1301",
  initialJadwal,
  initialTanggalHijri,
}) {
  const [jadwal, setJadwal] = useState(initialJadwal || null);
  const [tanggalHijri, setTanggalHijri] = useState(initialTanggalHijri || null);
  const [selectedCity, setSelectedCity] = useState({
    id: cityId,
    lokasi: "KOTA JAKARTA",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [cityChanged, setCityChanged] = useState(false);
  const [nowMinutes, setNowMinutes] = useState(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!cityChanged) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    fetch(
      `https://api.myquran.com/v2/sholat/jadwal/${selectedCity.id}/${dateStr}`,
    )
      .then((res) => res.json())
      .then((data) => setJadwal(data.data.jadwal))
      .catch(() => setJadwal(null));
  }, [selectedCity, cityChanged]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCityChanged(true);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const origin = window.location.origin;
    const href = window.location.href;

    setShareUrl(href);
    setEmbedCode(`${origin}/jadwal-sholat?city=${selectedCity.id}`);
  }, [selectedCity]);

  const prayers = [
    { name: "Imsyak", icon: "IMSAK", value: jadwal?.imsak },
    { name: "Subuh", icon: "SUBUH", value: jadwal?.subuh },
    { name: "Terbit", icon: "TERBIT", value: jadwal?.terbit },
    { name: "Dhuha", icon: "DHUHA", value: jadwal?.dhuha },
    { name: "Dzuhur", icon: "DZUHUR", value: jadwal?.dzuhur },
    { name: "Asar", icon: "ASAR", value: jadwal?.ashar },
    { name: "Magrib", icon: "MAGHRIB", value: jadwal?.maghrib },
    { name: "Isya", icon: "ISYA", value: jadwal?.isya },
  ];

  let nextName = null;
  if (nowMinutes !== null && jadwal) {
    const next = prayers.find((p) => toMinutes(p.value) > nowMinutes);
    nextName = (next ?? prayers[0]).name;
  }

  return (
    <div className="flex w-full justify-center items-center mt-8 ">
      <div className="flex flex-col justify-center items-center w-full  h-auto border border-black/10 shadow-md bg-white rounded-2xl px-4 md:p-6 ">
        {/* Kota & Tanggal */}
        <div
          className={`${jakarta.className}  font-normal flex flex-col md:flex-row md:justify-between items-start md:items-center w-full h-auto  rounded-xl gap-2 md:gap-3`}
        >
          <button
            className="group flex items-center gap-2 border border-black/10  px-4 py-2.5 rounded-xl cursor-pointer transition hover:border-emerald-600 hover:shadow-sm duration-200 w-fit"
            onClick={() => setIsPopupOpen(true)}
            aria-label={`Pilih kota, saat ini ${selectedCity.lokasi}`}
          >
            <IconMapMarker size={14} className="text-emerald-600" />
            <span className="text-xs font-medium">{selectedCity.lokasi}</span>

            <IoChevronDown className="text-slate-400 group-hover:text-emerald-600" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10">
            <IconCalendar size={14} className="text-emerald-600" />
            <span className="text-[13px] md:text-[12px] font-medium text-[#6c6c6c]">
              {tanggalHijri &&
                `${tanggalHijri.hari}, ${tanggalHijri.hijri} | ${formatMasehiFull()}`}
            </span>
          </div>
        </div>

        <div
          className="w-full my-6 h-px bg-black/5 scale-y-50 origin-center"
          aria-hidden="true"
        />
        {/* Jadwal Sholat Grid */}
        <div
          className="grid md:grid-cols-8 grid-cols-4 justify-between w-full gap-3"
          role="list"
          aria-label="Jadwal sholat hari ini"
        >
          {prayers.map((item) => {
            const isNext = item.name === nextName;

            return (
              <div
                key={item.name}
                role="listitem"
                className={`${jakarta.className} relative text-center flex justify-center items-center flex-col font-semibold border p-4 rounded-xl cursor-pointer hover:shadow-xs hover:border-emerald-500 transition-colors ${
                  isNext
                    ? "border-emerald-500 bg-emerald-100/40"
                    : "border-black/10"
                }`}
                aria-label={`${item.name} ${item.value || "belum tersedia"}${isNext ? ", berikutnya" : ""}`}
              >
                {isNext && (
                  <span className="absolute bg-emerald-600 -top-2.5 left-1/2 -translate-x-1/2 px-2.5 h-5 inline-flex items-center text-white text-[10px]  rounded-xl whitespace-nowrap">
                    Berikutnya
                  </span>
                )}

                {/* isi card tetap sama seperti sebelumnya */}
                <div className="leading-none">
                  <span
                    className={`text-[12px] font-semibold transition-colors ${
                      isNext
                        ? " bg-emerald-100/40 text-emerald-700"
                        : " text-[#6c6c6c]"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <Image
                    width={38}
                    height={38}
                    src={`/icons-jadwal/${item.icon}.svg`}
                    className="w-full h-full object-contain"
                    alt=""
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <span className="text-[16px] md:text-[18px] font-bold tabular-nums">
                    {item.value || "--:--"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end items-center w-full mt-8">
          <ShareEmbedButton
            url={shareUrl}
            embedUrl={embedCode}
            OverrideStyle="bg-emerald-700/50 hover:bg-emerald-700"
          />
        </div>
      </div>
      {isPopupOpen && (
        <Suspense fallback={null}>
          <CityPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onCitySelect={handleCitySelect}
            currentCity={selectedCity.lokasi}
          />
        </Suspense>
      )}
    </div>
  );
}
