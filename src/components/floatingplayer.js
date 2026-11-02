"use client";

import { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
} from "react-icons/tb";
import { RiReplay10Line, RiForward10Fill } from "react-icons/ri";

const formatTime = (s) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${sec}`;
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const VolumeIcon = ({ level }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    {level === "mute" && (
      <>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    )}
    {(level === "low" || level === "high") && (
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    )}
    {level === "high" && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
  </svg>
);

const SKIP_SECONDS = 10;

export default function FloatingPlayer({
  audio,
  surahName,
  ayah,
  totalAyah,
  isPlaying,
  hasPrev,
  hasNext,
  onToggle,
  onPrev,
  onNext,
  onClose,
}) {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const progress = duration ? (time / duration) * 100 : 0;

  // progress
  useEffect(() => {
    if (!audio) return;
    const update = () => {
      setTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    update();
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, [audio]);

  // volume: diterapkan ulang tiap ganti ayat (tiap ayat punya elemen <audio> sendiri)
  useEffect(() => {
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [audio, volume, muted]);

  const handleSeek = (e) => {
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setTime(audio.currentTime);
  };

  const skip = (seconds) => {
    if (!audio) return;
    const max = audio.duration || Infinity;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), max);
    setTime(audio.currentTime);
  };

  const handleVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    setMuted(v === 0);
  };

  const toggleMute = () => {
    // kalau volume sudah 0, unmute sekaligus naikkan volume
    if (muted && volume === 0) setVolume(0.5);
    setMuted((m) => !m);
  };

  const shownVolume = muted ? 0 : volume;

  const volumeLevel =
    shownVolume === 0 ? "mute" : shownVolume < 0.5 ? "low" : "high";
  const volumePercent = shownVolume * 100;
  return (
    <div
      role="region"
      aria-label="Pemutar audio"
      className={` ${jakarta.className} fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 items-center gap-4 rounded-2xl border border-emerald-600/20 bg-white/40 backdrop-blur-md px-6 py-3 shadow-lg`}
    >
      {/* kiri: info + kontrol + progress (mengisi sisa lebar) */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="w-32 shrink-0">
          <p className="truncate text-base font-semibold text-emerald-800 leading-tight mb-1">
            {surahName}
          </p>
          <p className="text-xs text-[#6c6c6c] font-medium">
            Ayat {ayah}
            {totalAyah ? ` dari ${totalAyah}` : ""}
          </p>
        </div>

        {/* kontrol utama */}
        <div className="flex shrink-0 items-center gap-1 text-emerald-600 sm:gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="Ayat sebelumnya"
            className="rounded-full p-2 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            <TbPlayerSkipBackFilled />
          </button>

          <button
            onClick={onToggle}
            aria-label={isPlaying ? "Jeda" : "Putar"}
            className="rounded-full bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 cursor-pointer"
          >
            {isPlaying ? (
              <TbPlayerPauseFilled size={18} />
            ) : (
              <TbPlayerPlayFilled size={18} />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Ayat berikutnya"
            className="rounded-full p-2 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            <TbPlayerSkipForwardFilled />
          </button>
        </div>

        {/* progress: ambil semua sisa lebar */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-gray-500">
            {formatTime(time)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={time}
            onChange={handleSeek}
            aria-label="Posisi audio"
            style={{
              background: `linear-gradient(to right, #059669 ${progress}%, #d1fae5 ${progress}%)`,
            }}
            className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full outline-none
          [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600
          [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-600"
          />
          <span className="w-9 shrink-0 text-[11px] tabular-nums text-gray-500">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* kanan: skip 10 detik, volume, tutup (lebar tetap) */}
      <div className="flex shrink-0 items-center gap-1  text-emerald-600">
        <div className="flex items-center gap-1">
          <button
            onClick={() => skip(-SKIP_SECONDS)}
            aria-label={`Mundur ${SKIP_SECONDS} detik`}
            className="rounded-full p-1 hover:bg-emerald-50"
          >
            <RiReplay10Line className="cursor-pointer text-xl" />
          </button>
          <button
            onClick={() => skip(SKIP_SECONDS)}
            aria-label={`Maju ${SKIP_SECONDS} detik`}
            className="rounded-full p-1 hover:bg-emerald-50"
          >
            <RiForward10Fill className="cursor-pointer text-xl" />
          </button>
        </div>
        <button
          onClick={toggleMute}
          aria-label={shownVolume === 0 ? "Suarakan" : "Bisukan"}
          className="cursor-pointer rounded-full p-2 hover:bg-emerald-50"
        >
          <VolumeIcon level={volumeLevel} />
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step="0.05"
          value={shownVolume}
          onChange={handleVolume}
          aria-label="Volume"
          style={{
            background: `linear-gradient(to right, #059669 ${volumePercent}%, #d1fae5 ${volumePercent}%)`,
          }}
          className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full outline-none sm:block
        [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600
        [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-600"
        />

        <button
          onClick={onClose}
          aria-label="Tutup pemutar"
          className="ml-1 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
