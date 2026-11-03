"use client";
import { PiBookOpenTextFill, PiBookBookmarkFill } from "react-icons/pi";
import { useId } from "react";

// Keyframes + aturan animasi. Hanya aktif kalau <svg> punya class "pi-on".
const ANIM_CSS = `
@keyframes pi-spin { to { transform: rotate(360deg); } }
@keyframes pi-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
@keyframes pi-drift { 0%,100% { transform: translateX(-2px); } 50% { transform: translateX(2.5px); } }
@keyframes pi-float { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-1.5px) rotate(4deg); } }
@keyframes pi-twinkle { 0%,100% { transform: scale(0.55); opacity: 0.45; } 50% { transform: scale(1.2); opacity: 1; } }

.pi-on .pi-spin    { animation: pi-spin 24s linear infinite; }
.pi-on .pi-pulse   { animation: pi-pulse 3.2s ease-in-out infinite; }
.pi-on .pi-drift   { animation: pi-drift 5s ease-in-out infinite; }
.pi-on .pi-float   { animation: pi-float 4.5s ease-in-out infinite; }
.pi-on .pi-twinkle { animation: pi-twinkle 2.4s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .pi-on .pi-spin, .pi-on .pi-pulse, .pi-on .pi-drift,
  .pi-on .pi-float, .pi-on .pi-twinkle { animation: none; }
}
`;

function Base({ size = 56, className = "", animated = true, children }) {
  const uid = `pi${useId().replace(/:/g, "")}`;
  const ids = {
    sun: `${uid}s`,
    moon: `${uid}m`,
    cd: `${uid}d`, // awan tua
    cm: `${uid}c`, // awan sedang
    cp: `${uid}p`, // awan terang
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 48"
      width={size}
      height={size * 0.75}
      overflow="visible"
      className={`${animated ? "pi-on" : ""} ${className}`}
      style={{ filter: "drop-shadow(0 2px 2px rgba(4,120,87,0.25))" }}
      aria-hidden="true"
    >
      <style>{ANIM_CSS}</style>
      <defs>
        <linearGradient id={ids.sun} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>

        <linearGradient id={ids.moon} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>

        {[
          [ids.cd, "#059669", "#047857"], // tua: 600 -> 700
          [ids.cm, "#10b981", "#059669"], // sedang: 500 -> 600
          [ids.cp, "#34d399", "#10b981"], // terang: 400 -> 500
        ].map(([id, top, bottom]) => (
          <linearGradient
            key={id}
            id={id}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="22"
          >
            <stop offset="0" stopColor={top} />
            <stop offset="1" stopColor={bottom} />
          </linearGradient>
        ))}
      </defs>
      {children(ids)}
    </svg>
  );
}

// ---------- bagian-bagian ----------
const Sun = ({ ids, cx, cy, r, r1, r2 }) => {
  const origin = { transformOrigin: `${cx}px ${cy}px` };
  return (
    <>
      {/* sinar: berputar pelan */}
      <g className="pi-spin" style={origin}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const t = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={(cx + r1 * Math.cos(t)).toFixed(2)}
              y1={(cy + r1 * Math.sin(t)).toFixed(2)}
              x2={(cx + r2 * Math.cos(t)).toFixed(2)}
              y2={(cy + r2 * Math.sin(t)).toFixed(2)}
              stroke="#10b981"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          );
        })}
      </g>
      {/* lingkaran: berdenyut */}
      <circle
        className="pi-pulse"
        style={origin}
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#${ids.sun})`}
      />
    </>
  );
};

// <g transform> luar = posisi statis, <g class> dalam = animasi
// (dipisah supaya animasi CSS tidak menimpa atribut transform)
const Moon = ({ ids, x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className="pi-float" style={{ transformOrigin: "12px 12px" }}>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill={`url(#${ids.moon})`}
      />
    </g>
  </g>
);

const Cloud = ({
  x,
  y,
  s = 1,
  gid,
  delay = 0,
  duration = 5,
  reverse = false,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g
      className="pi-drift"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      <g fill={`url(#${gid})`}>
        <circle cx="9" cy="13" r="9" />
        <circle cx="19" cy="10" r="10" />
        <circle cx="28" cy="15" r="7" />
        <rect x="3" y="13" width="30" height="9" rx="4.5" />
      </g>
    </g>
  </g>
);

const Sparkle = ({ cx, cy, s = 4, delay = 0 }) => (
  <path
    className="pi-twinkle"
    style={{
      transformOrigin: `${cx}px ${cy}px`,
      animationDelay: `${delay}s`,
    }}
    fill="#10b981"
    d={`M${cx} ${cy - s}Q${cx} ${cy} ${cx + s} ${cy}Q${cx} ${cy} ${cx} ${cy + s}Q${cx} ${cy} ${cx - s} ${cy}Q${cx} ${cy} ${cx} ${cy - s}Z`}
  />
);

// ---------- delapan ikon ----------
export const IconImsyak = (p) => (
  <Base {...p}>
    {(ids) => (
      <>
        <Moon ids={ids} x={10.8} y={4.8} s={1.6} />
        <Sparkle cx={47} cy={17} s={5} />
      </>
    )}
  </Base>
);

export const IconSubuh = (p) => (
  <Base {...p}>
    {(ids) => (
      <>
        <Sun ids={ids} cx={19} cy={17} r={7.5} r1={11} r2={15} />
        <Cloud x={24} y={19} s={1.05} gid={ids.cp} />
      </>
    )}
  </Base>
);

export const IconTerbit = (p) => (
  <Base {...p}>
    {(ids) => (
      <>
        <Sun ids={ids} cx={19} cy={17} r={7.5} r1={11} r2={15} />
        <Cloud x={24} y={19} s={1.05} gid={ids.cd} />
      </>
    )}
  </Base>
);

export const IconDhuha = (p) => (
  <Base {...p}>
    {(ids) => (
      <>
        <Sun ids={ids} cx={19} cy={17} r={7.5} r1={11} r2={15} />
        <Cloud x={24} y={19} s={1.05} gid={ids.cm} />
      </>
    )}
  </Base>
);

export const IconDzuhur = (p) => (
  <Base {...p}>
    {(ids) => <Sun ids={ids} cx={32} cy={24} r={9} r1={13.5} r2={19} />}
  </Base>
);

export const IconAsar = (p) => (
  <Base {...p}>
    {(ids) => (
      <>
        <Cloud x={36} y={8} s={0.6} gid={ids.cp} duration={4} reverse />
        <Cloud x={10} y={18} s={1.1} gid={ids.cd} duration={6} delay={-1.5} />
      </>
    )}
  </Base>
);

export const IconMaghrib = (p) => (
  <Base {...p}>
    {(ids) => (
      <>
        <Moon ids={ids} x={30.8} y={2.8} s={1.1} />
        <Sparkle cx={57} cy={10} s={3.5} />
        <Cloud x={8} y={20} gid={ids.cm} />
      </>
    )}
  </Base>
);

export const IconIsya = (p) => (
  <Base {...p}>
    {(ids) => (
      <>
        <Moon ids={ids} x={30.8} y={2.8} s={1.1} />
        <Sparkle cx={57} cy={10} s={3.5} />
        <Cloud x={8} y={20} gid={ids.cd} />
      </>
    )}
  </Base>
);

export const PrayerIcons = {
  imsyak: IconImsyak,
  imsak: IconImsyak,
  subuh: IconSubuh,
  fajr: IconSubuh,
  terbit: IconTerbit,
  dhuha: IconDhuha,
  dzuhur: IconDzuhur,
  zhuhur: IconDzuhur,
  zuhur: IconDzuhur,
  asar: IconAsar,
  ashar: IconAsar,
  maghrib: IconMaghrib,
  isya: IconIsya,
  isha: IconIsya,
};

export const SuratUtama = [
  {
    id: 56,
    surah: "Al-Waqi'ah",
    icon: PiBookBookmarkFill,
  },
  {
    id: 36,
    surah: "Ya-Sin",
    icon: PiBookBookmarkFill,
  },
  {
    id: 67,
    surah: "Al-Mulk",
    icon: PiBookBookmarkFill,
  },
  {
    id: 18,
    surah: "Al-Kahfi",
    icon: PiBookBookmarkFill,
  },
  {
    id: 55,
    surah: "Ar-Rahman",
    icon: PiBookBookmarkFill,
  },
  {
    id: "tahlil",
    surah: "Tahlil",
    isSpecialPage: true,
    route: "/tahlil",
    icon: PiBookOpenTextFill,
  },
];
