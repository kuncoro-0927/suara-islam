import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function Header({ Title, Description, children }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Waktu Sholat Realtime
        </span>
      </div>

      <h1
        className={`${jakarta.className} text-xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold mt-2`}
      >
        {Title}
      </h1>
      <p
        className={`${jakarta.className} font-medium text-sm lg:text-sm text-slate-400`}
      >
        {Description}
      </p>

      {children}
    </div>
  );
}
