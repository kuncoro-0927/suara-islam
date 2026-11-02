"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import Navbar from "../../components/navbar";
import Header from "../../components/header";
import { Open_Sans, Poppins, Plus_Jakarta_Sans } from "next/font/google";
import {
  IconMapMarker,
  IconCalendar,
  IconDownload,
  IconLink,
  IconCheck,
} from "../../components/icons";
import { BsSearch } from "react-icons/bs";
import { fetchTanggalMasehi, fetchJadwalSholat, fetchHijriToday } from "./api";
import ShareEmbedButton from "../../components/ShareEmbedButton";
import { PiMoonStarsFill } from "react-icons/pi";
import { PiSunFill } from "react-icons/pi";
const CityPopup = lazy(() => import("../../components/citypopup"));
const HijriMonthPopup = lazy(() => import("../../components/hijripopup"));
const MonthPopup = lazy(() => import("../../components/monthpopup"));

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

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function Beranda({
  initialJadwal = [],
  initialHijriData = null,
}) {
  const [copied, setCopied] = useState(false);
  const [jadwal, setJadwal] = useState(initialJadwal);
  const [loading, setLoading] = useState(initialJadwal.length === 0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHijriPopupOpen, setIsHijriPopupOpen] = useState(false);
  const [isMonthPopupOpen, setIsMonthPopupOpen] = useState(false);
  const [mode, setMode] = useState("masehi");
  const [hijriYear, setHijriYear] = useState(1447);
  const [hijriMonth, setHijriMonth] = useState(1);
  const [jadwalHijri, setJadwalHijri] = useState([]);
  const [tanggalHijri, setTanggalHijri] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");

  const hijriMonths = [
    "Muharram",
    "Safar",
    "Rabiul Awal",
    "Rabiul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rajab",
    "Sya'ban",
    "Ramadhan",
    "Syawwal",
    "Dzulqa'dah",
    "Dzulhijjah",
  ];

  const monthNames = [
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

  // Default bulan = bulan sekarang
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const [selectedMonth, setSelectedMonth] = useState(`${year}-${month}`);

  // Default kota
  const [selectedCity, setSelectedCity] = useState({
    id: "1301",
    lokasi: "KOTA JAKARTA",
  });
  const toTitleCase = (str = "") =>
    str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const isToday = (tanggalString) => {
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const datePart = tanggalString.split(",")[1]?.trim();
    return datePart === todayStr;
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsPopupOpen(false);
  };

  const handleMonthSelect = (monthValue) => {
    setSelectedMonth(monthValue);
  };

  const handleHijriMonthSelect = (month, year) => {
    setHijriMonth(month);
    setHijriYear(year);
  };

  useEffect(() => {
    const origin = window.location.origin;
    const href = window.location.href;

    setCurrentUrl(origin);
    setShareUrl(href);
    setEmbedCode(`${origin}/kalender-hijrah`);
  }, []);

  // Format bulan untuk ditampilkan
  const getFormattedMonth = (monthString) => {
    const [y, m] = monthString.split("-");
    const monthIndex = parseInt(m) - 1;
    return `${monthNames[monthIndex]} ${y}`;
  };

  useEffect(() => {
    const today = async () => {
      try {
        const hijriData = initialHijriData || (await fetchHijriToday());

        const num = hijriData.num;
        const numLength = num.length;

        const yearHijri = hijriData.num[numLength - 1];
        const monthHijri = hijriData.num[numLength - 2];

        setHijriMonth(monthHijri);
        setHijriYear(yearHijri);
      } catch (err) {
        // silently fail
      }
    };
    today();
  }, [initialHijriData]);

  // Konversi hijriyah ke masehi untuk API
  useEffect(() => {
    if (mode === "hijriyah") {
      const getTanggal = async () => {
        setLoading(true);
        setErrorMsg("");
        if (hijriYear < 1447) {
          setJadwalHijri([]);
          setLoading(false);
          setErrorMsg("Kalender Tidak Ditemukan");
          return;
        }
        try {
          const dataTanggal = await fetchTanggalMasehi(hijriMonth, hijriYear);
          if (!dataTanggal || dataTanggal.length === 0) {
            setJadwalHijri([]);
            setErrorMsg("Kalender Tidak Ditemukan");
            setLoading(false);
            return;
          }
          const TahunPertama = dataTanggal[0].gregorian.year;
          const TahunTerakhir =
            dataTanggal[dataTanggal.length - 1].gregorian.year;
          const bulanPertama = dataTanggal[0].gregorian.month.number;
          const bulanTerakhir =
            dataTanggal[dataTanggal.length - 1].gregorian.month.number;
          const tanggalPertama = dataTanggal[0].gregorian.day;
          const tanggalKedua =
            dataTanggal[dataTanggal.length - 1].gregorian.day;

          const jadwalSatu = await fetchJadwalSholat(
            selectedCity.id,
            TahunPertama,
            bulanPertama,
          );
          const jadwalDua = await fetchJadwalSholat(
            selectedCity.id,
            TahunTerakhir,
            bulanTerakhir,
          );

          const jadwalSatuFiltered = jadwalSatu.filter((j) => {
            const tanggalHari = Number(
              j.tanggal.split(",")[1].split("/")[0].trim(),
            );
            return tanggalHari >= tanggalPertama;
          });

          const jadwalDuaFiltered = jadwalDua.filter((j) => {
            const tanggalHari = Number(
              j.tanggal.split(",")[1].split("/")[0].trim(),
            );
            return tanggalHari <= tanggalKedua;
          });

          setTanggalHijri(dataTanggal);
          setJadwalHijri([...jadwalSatuFiltered, ...jadwalDuaFiltered]);
        } catch (err) {
          setJadwalHijri([]);
          setErrorMsg("Kalender Tidak Ditemukan");
        } finally {
          setLoading(false);
        }
      };
      getTanggal();
    }
  }, [hijriYear, hijriMonth, mode, selectedCity.id]);

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad && initialJadwal.length > 0 && mode === "masehi") {
      setInitialLoad(false);
      return;
    }
    setInitialLoad(false);
    async function fetchJadwal() {
      setLoading(true);
      try {
        const [y, m] = selectedMonth.split("-");
        const res = await fetch(
          `https://api.myquran.com/v2/sholat/jadwal/${selectedCity.id}/${y}/${m}`,
        );
        const data = await res.json();

        if (
          !data ||
          data.status !== true ||
          !data.data ||
          !Array.isArray(data.data.jadwal) ||
          data.data.jadwal.length === 0
        ) {
          setJadwal([]);
          setErrorMsg("Kalender Tidak Ditemukan");
        } else {
          setJadwal(data.data.jadwal);
          setErrorMsg("");
        }
      } catch (err) {
        setJadwal([]);
        setErrorMsg("Kalender Tidak Ditemukan");
      } finally {
        setLoading(false);
      }
    }
    if (mode === "masehi") {
      fetchJadwal();
    }
  }, [selectedCity.id, selectedMonth, mode]);

  const handleDownloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();

    const imgData = `data:image/png;base64,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`;
    doc.addImage(imgData, "PNG", 145, 13, 50, 5.6);

    doc.setFontSize(16);
    doc.text("Suara Islam Jadwal Sholat", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Kota: ${selectedCity.lokasi} | Bulan: ${getFormattedMonth(selectedMonth)}`,
      14,
      22,
    );

    const tableColumn = [
      "Tanggal",
      "Imsyak",
      "Subuh",
      "Terbit",
      "Dhuha",
      "Dzuhur",
      "Ashr",
      "Maghrib",
      "Isya",
    ];
    const tableRows = jadwal.map((day) => [
      day.tanggal,
      day.imsak,
      day.subuh,
      day.terbit,
      day.dhuha,
      day.dzuhur,
      day.ashar,
      day.maghrib,
      day.isya,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: "#059669", textColor: "#fff" },
      didParseCell: function (data) {
        if (data.section === "body") {
          if (data.row.index % 2 === 0) {
            data.cell.styles.fillColor = "#f0fdf4";
            data.cell.styles.textColor = "#000";
          } else {
            data.cell.styles.fillColor = "#ffffff";
            data.cell.styles.textColor = "#000";
          }
        }
      },
    });

    doc.save(`jadwal-sholat-${selectedCity.lokasi}-${selectedMonth}.pdf`);
  };

  const handleDownloadPDFHijri = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();

    const imgData = `data:image/png;base64,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`;
    doc.addImage(imgData, "PNG", 145, 13, 50, 5.6);

    doc.setFontSize(16);
    doc.text("Suara Islam Jadwal Sholat (Hijriyah)", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Kota: ${selectedCity.lokasi} | Bulan Hijriyah: ${hijriMonths[hijriMonth - 1]} ${hijriYear}`,
      14,
      22,
    );

    const tableColumn = [
      "Tanggal Hijriyah",
      "Imsyak",
      "Subuh",
      "Terbit",
      "Dhuha",
      "Dzuhur",
      "Ashr",
      "Maghrib",
      "Isya",
    ];
    const tableRows = jadwalHijri.map((day, index) => [
      tanggalHijri && tanggalHijri[index]
        ? `${tanggalHijri[index].hijri.date.replace(/\s+/g, "")} // ${day.tanggal.trim()}`
        : day.tanggal,
      day.imsak,
      day.subuh,
      day.terbit,
      day.dhuha,
      day.dzuhur,
      day.ashar,
      day.maghrib,
      day.isya,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: "#059669", textColor: "#fff" },
      columnStyles: {
        0: { cellWidth: 60 },
      },
      didParseCell: function (data) {
        if (data.section === "body") {
          if (data.row.index % 2 === 0) {
            data.cell.styles.fillColor = "#f0fdf4";
            data.cell.styles.textColor = "#000";
          } else {
            data.cell.styles.fillColor = "#ffffff";
            data.cell.styles.textColor = "#000";
          }
        }
      },
    });

    doc.save(
      `jadwal-sholat-hijriyah-${selectedCity.lokasi}-${hijriMonths[hijriMonth - 1]}-${hijriYear}.pdf`,
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="flex">
          <Navbar />
          <div className="flex-1 min-h-screen flex flex-col justify-center items-center pt-[72px] md:pt-0">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-gray-600 text-lg">
                Memuat Kalender...
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex m-0 p-0">
        <div>
          <Navbar />
        </div>

        <div className="w-full p-10 overflow-hidden bg-white/40 backdrop-blur-md my-4 mr-4 rounded-2xl border border-white">
          <Header
            Title="Jadwal Sholat"
            subtitle="Jadwal Sholat Realtime"
            Description="Jadwal Sholat Selama Satu Bulan"
          />

          <div className="mt-8">
            <div className="flex items-center shadow-xs bg-white/40 backdrop-blur-md gap-0.5 border rounded-lg border-black/10 mb-4 w-fit p-0.5 ">
              <button
                className={`flex items-center rounded-lg gap-2 py-1.5 px-3 text-sm transition-colors cursor-pointer ${
                  mode === "masehi"
                    ? "text-white bg-emerald-600"
                    : "text-[#6c6c6c]  hover:bg-emerald-100/40 hover:text-emerald-800"
                }`}
                onClick={() => setMode("masehi")}
              >
                <PiSunFill />
                Masehi
              </button>

              <button
                className={`flex items-center rounded-lg gap-2 py-1.5 px-3 text-sm transition-colors cursor-pointer ${
                  mode === "hijriyah"
                    ? "text-white  bg-emerald-600 "
                    : "text-[#6c6c6c]  hover:bg-emerald-100/40 hover:text-emerald-800"
                }`}
                onClick={() => setMode("hijriyah")}
              >
                <PiMoonStarsFill />
                Hijriyah
              </button>
            </div>
            {/* Info Bar: City + Month */}
            <div className="flex flex-col  px-8 py-4 border border-emerald-600 shadow-sm bg-emerald-100/40 backdrop-blur-md rounded-xl mb-8">
              <div className="flex items-center justify-between">
                <div>
                  {" "}
                  <p
                    className={`${jakarta.className} text-emerald-900 font-semibold text-xl  flex items-center flex-wrap`}
                  >
                    <span>
                      Jadwal Sholat untuk {toTitleCase(selectedCity.lokasi)},{" "}
                      {mode === "masehi"
                        ? getFormattedMonth(selectedMonth)
                        : `${hijriMonths[hijriMonth - 1]} ${hijriYear} H`}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={
                      mode === "masehi"
                        ? handleDownloadPDF
                        : handleDownloadPDFHijri
                    }
                    className="flex items-center gap-2 px-3 text-xs py-1 rounded-full bg-white/60 w-fit text-emerald-800 border border-emerald-600 backdrop-blur-xs shadow-sm hover:bg-white/80 duration-200 cursor-pointer"
                    disabled={
                      loading ||
                      (mode === "masehi"
                        ? jadwal.length === 0
                        : jadwalHijri.length === 0)
                    }
                    aria-label="Download PDF"
                  >
                    <IconDownload size={12} />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                  <ShareEmbedButton
                    url={shareUrl}
                    embedUrl={embedCode}
                    OverrideStyle="bg-white/40 border border-emerald-600 text-emerald-800 shadow-sm hover:bg-white/80"
                  />
                </div>
              </div>

              <span className="flex items-center gap-2 text-sm text-gray-600">
                Lokasi terpilih:
                <IconMapMarker size={12} />{" "}
                <span className="-translate-y-px -translate-x-1">
                  {toTitleCase(selectedCity.lokasi)}
                </span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="mt-4 flex items-center gap-2 px-4 text-sm py-2 rounded-full bg-white/60 w-fit text-emerald-800 border border-emerald-600 backdrop-blur-xs shadow-sm hover:bg-white/80 duration-200 cursor-pointer"
                >
                  <BsSearch size={12} />
                  <span> Pilih Kota</span>
                </button>

                <button
                  onClick={() =>
                    mode === "masehi"
                      ? setIsMonthPopupOpen(true)
                      : setIsHijriPopupOpen(true)
                  }
                  className="mt-4 flex items-center gap-2 px-4 text-sm py-2 rounded-full bg-white/60 w-fit text-emerald-800 border border-emerald-600 backdrop-blur-xs shadow-sm hover:bg-white/80 duration-200 cursor-pointer"
                >
                  <IconCalendar size={12} />
                  <span> Pilih Bulan</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
              {loading ? (
                <p className="p-4">Loading...</p>
              ) : mode === "masehi" ? (
                jadwal.length > 0 ? (
                  <table className="w-full border-collapse text-center">
                    <thead>
                      <tr>
                        {[
                          "Tanggal",
                          "Imsyak",
                          "Subuh",
                          "Terbit",
                          "Dhuha",
                          "Dzuhur",
                          "Ashr",
                          "Maghrib",
                          "Isya",
                        ].map((head) => (
                          <th
                            key={head}
                            className="bg-emerald-600 text-white px-3 py-2.5 text-xs md:text-sm font-medium whitespace-nowrap"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jadwal.map((day, index) => {
                        const isTodayRow = isToday(day.tanggal);
                        const cellClass = isTodayRow
                          ? "border-b border-gray-200 px-3 py-2.5 bg-emerald-100/60 font-semibold text-emerald-800 text-sm"
                          : index % 2
                            ? "border-b border-gray-200 px-3 py-2.5 text-sm text-gray-700"
                            : "border-b border-gray-200 px-3 py-2.5 bg-gray-50/50 text-sm text-gray-700";

                        return (
                          <tr key={index}>
                            <td className={cellClass}>{day.tanggal}</td>
                            <td className={cellClass}>{day.imsak}</td>
                            <td className={cellClass}>{day.subuh}</td>
                            <td className={cellClass}>{day.terbit}</td>
                            <td className={cellClass}>{day.dhuha}</td>
                            <td className={cellClass}>{day.dzuhur}</td>
                            <td className={cellClass}>{day.ashar}</td>
                            <td className={cellClass}>{day.maghrib}</td>
                            <td className={cellClass}>{day.isya}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-red-600">Tidak ada data.</p>
                )
              ) : errorMsg ? (
                <p className="p-4 text-red-600">{errorMsg}</p>
              ) : jadwalHijri.length > 0 ? (
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      {[
                        "Tanggal",
                        "Imsyak",
                        "Subuh",
                        "Terbit",
                        "Dhuha",
                        "Dzuhur",
                        "Ashr",
                        "Maghrib",
                        "Isya",
                      ].map((head) => (
                        <th
                          key={head}
                          className="bg-emerald-600 text-white px-3 py-2.5 text-xs md:text-sm font-medium whitespace-nowrap"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalHijri.map((day, index) => {
                      const isTodayRow = isToday(day.tanggal);
                      const cellClass = isTodayRow
                        ? "border-b border-gray-200 px-3 py-2.5 bg-emerald-100 font-semibold text-emerald-800 text-sm"
                        : index % 2
                          ? "border-b border-gray-200 px-3 py-2.5 text-sm text-gray-700"
                          : "border-b border-gray-200 px-3 py-2.5 bg-gray-50/50 text-sm text-gray-700";

                      return (
                        <tr key={index}>
                          <td className={cellClass}>
                            {tanggalHijri && tanggalHijri[index] ? (
                              <>
                                {tanggalHijri[index].hijri.month.en},{" "}
                                {tanggalHijri[index].hijri.date}
                                <br />
                                {jadwalHijri[index].tanggal}
                              </>
                            ) : (
                              day.tanggal
                            )}
                          </td>
                          <td className={cellClass}>{day.imsak}</td>
                          <td className={cellClass}>{day.subuh}</td>
                          <td className={cellClass}>{day.terbit}</td>
                          <td className={cellClass}>{day.dhuha}</td>
                          <td className={cellClass}>{day.dzuhur}</td>
                          <td className={cellClass}>{day.ashar}</td>
                          <td className={cellClass}>{day.maghrib}</td>
                          <td className={cellClass}>{day.isya}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="p-4 text-red-600">Tidak ada data.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popups - lazy loaded */}
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

      {isMonthPopupOpen && (
        <Suspense fallback={null}>
          <MonthPopup
            isOpen={isMonthPopupOpen}
            onClose={() => setIsMonthPopupOpen(false)}
            onMonthSelect={handleMonthSelect}
            currentMonth={selectedMonth}
          />
        </Suspense>
      )}

      {isHijriPopupOpen && (
        <Suspense fallback={null}>
          <HijriMonthPopup
            isOpen={isHijriPopupOpen}
            onClose={() => setIsHijriPopupOpen(false)}
            onMonthSelect={handleHijriMonthSelect}
            currentMonth={hijriMonth}
            currentYear={hijriYear}
          />
        </Suspense>
      )}
    </main>
  );
}
