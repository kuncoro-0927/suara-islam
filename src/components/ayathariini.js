import { PiHeartStraightFill } from "react-icons/pi";

const AYAT = [
  {
    teks: "Maka sesungguhnya bersama kesulitan ada kemudahan.",
    ref: "QS. Al-Insyirah: 5",
  },
  {
    teks: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    ref: "QS. Al-Baqarah: 286",
  },
  {
    teks: "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    ref: "QS. Ar-Ra'd: 28",
  },
  {
    teks: "Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.",
    ref: "QS. At-Talaq: 3",
  },
  {
    teks: "Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.",
    ref: "QS. Al-Baqarah: 153",
  },
  {
    teks: "Janganlah kamu merasa lemah, dan janganlah pula bersedih hati.",
    ref: "QS. Ali 'Imran: 139",
  },
  {
    teks: "Maka ingatlah kepada-Ku, Aku pun akan ingat kepadamu.",
    ref: "QS. Al-Baqarah: 152",
  },
  {
    teks: "Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu.",
    ref: "QS. Ibrahim: 7",
  },
  {
    teks: "Berdoalah kepada-Ku, niscaya akan Aku kabulkan bagimu.",
    ref: "QS. Gafir: 60",
  },
  {
    teks: "Janganlah kamu berputus asa dari rahmat Allah.",
    ref: "QS. Az-Zumar: 53",
  },
  {
    teks: "Tuhanmu tidak meninggalkan engkau dan tidak (pula) membencimu.",
    ref: "QS. Ad-Duha: 3",
  },
];

// Hari ke-N sejak 1970 berdasarkan tanggal WIB.
// Pakai timezone tetap supaya hasil server dan browser sama (tidak hydration mismatch).
const getAyatHariIni = () => {
  const tanggal = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  }); // contoh: "2026-10-27"
  const hari = Math.floor(Date.parse(`${tanggal}T00:00:00Z`) / 86400000);
  return AYAT[hari % AYAT.length];
};

export default function AyatHariIni({ className = "" }) {
  const ayat = getAyatHariIni();

  return (
    <div
      className={`mx-auto bg-emerald-100/20 p-4 rounded-xl border border-emerald-200 text-center flex flex-col gap-3 items-center ${className}`}
    >
      <span className="h-9 w-9 flex items-center justify-center bg-emerald-100/70 rounded-full">
        <PiHeartStraightFill className="text-emerald-600" />
      </span>

      <span className="font-medium text-sm">Ayat hari ini</span>
      <span className="italic text-xs text-slate-400">
        &quot;{ayat.teks}&quot;
      </span>
      <span className="text-emerald-800 bg-emerald-100/60 text-[11px] px-2 py-1 rounded-full font-semibold">
        {ayat.ref}
      </span>
    </div>
  );
}
