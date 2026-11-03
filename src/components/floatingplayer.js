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

const sliderClass = `h-1 cursor-pointer appearance-none rounded-full outline-none
  [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-700
  [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-700`;

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

  // elemen yang dipakai di dua tempat (mobile: baris atas, desktop: posisi semula)
  const progressSlider = (
    <>
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
        className={`${sliderClass} min-w-0 flex-1`}
      />
      <span className="w-9 shrink-0 text-[11px] tabular-nums text-gray-500">
        {formatTime(duration)}
      </span>
    </>
  );

  const replayButton = (
    <button
      onClick={() => skip(-SKIP_SECONDS)}
      aria-label={`Mundur ${SKIP_SECONDS} detik`}
      className="cursor-pointer rounded-full p-1 hover:bg-emerald-50"
    >
      <RiReplay10Line className="text-xl" />
    </button>
  );

  const forwardButton = (
    <button
      onClick={() => skip(SKIP_SECONDS)}
      aria-label={`Maju ${SKIP_SECONDS} detik`}
      className="cursor-pointer rounded-full p-1 hover:bg-emerald-50"
    >
      <RiForward10Fill className="text-xl" />
    </button>
  );

  return (
    <div
      role="region"
      aria-label="Pemutar audio"
      className={`${jakarta.className} fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2
        grid grid-cols-[1fr_auto_1fr] items-center gap-x-2 gap-y-2
        sm:flex sm:gap-4
        rounded-2xl border border-emerald-600/20 bg-white/40 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6`}
    >
      {/* kiri + tengah: info + kontrol utama (+ progress di desktop).
          Mobile: `contents` -> anak-anaknya jadi item grid (kolom 1 & 2).
          sm ke atas: kembali jadi flex seperti semula. */}
      <div className="contents sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-center sm:gap-4">
        {/* info surah (kolom 1 di mobile) */}
        <div className="min-w-0 sm:mr-auto sm:shrink-0 md:w-28 lg:w-32">
          <p className="mb-1 truncate text-base font-semibold leading-tight text-emerald-700">
            {surahName}
          </p>
          <p className="text-xs font-medium text-[#6c6c6c]">
            Ayat {ayah}
            {totalAyah ? ` dari ${totalAyah}` : ""}
          </p>
        </div>

        {/* kontrol utama (kolom 2 di mobile -> otomatis di tengah) */}
        <div className="flex shrink-0 items-center gap-1 justify-self-center text-emerald-700 sm:gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="Ayat sebelumnya"
            className="cursor-pointer rounded-full p-2 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <TbPlayerSkipBackFilled />
          </button>

          <button
            onClick={onToggle}
            aria-label={isPlaying ? "Jeda" : "Putar"}
            className="cursor-pointer rounded-full bg-emerald-700 p-2.5 text-white hover:bg-emerald-800"
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
            className="cursor-pointer rounded-full p-2 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <TbPlayerSkipForwardFilled />
          </button>
        </div>

        {/* DESKTOP ONLY - progress di samping kontrol */}
        <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
          {progressSlider}
        </div>
      </div>

      {/* kanan: (desktop: skip 10s) + mute + volume + tutup.
          Mobile: kolom 3, rata kanan */}
      <div className="flex shrink-0 items-center gap-1 justify-self-end text-emerald-700">
        {/* DESKTOP ONLY - skip 10 detik */}
        <div className="hidden items-center gap-1 sm:flex">
          {replayButton}
          {forwardButton}
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
          className={`${sliderClass} hidden w-20 md:block`}
        />

        <button
          onClick={onClose}
          aria-label="Tutup pemutar"
          className="ml-1 translate-x-1 cursor-pointer rounded-full p-2 text-[#6c6c6c] hover:bg-gray-100 hover:text-gray-600"
        >
          <CloseIcon />
        </button>
      </div>

      {/* MOBILE ONLY - baris atas: replay 10s | progress | forward 10s */}
      <div className="col-span-3 flex items-center gap-1 text-emerald-700 sm:hidden">
        <div className="flex min-w-0 -translate-x-3.5 flex-1 items-center gap-2">
          {progressSlider}
        </div>
        {replayButton}
        {forwardButton}
      </div>
    </div>
  );
}
