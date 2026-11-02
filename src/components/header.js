import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function Header({ Title, subtitle, Description, children }) {
  return (
    <div className={`${jakarta.className} w-full`}>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-100/40 text-emerald-800 border border-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          {subtitle}
        </span>
      </div>

      <h1
        className={`${jakarta.className} text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold mt-2`}
      >
        {Title}
      </h1>
      <p
        className={`${jakarta.className} font-medium text-sm lg:text-sm text-[#6c6c6c]`}
      >
        {Description}
      </p>

      {children}
    </div>
  );
}
