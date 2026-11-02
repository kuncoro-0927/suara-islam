"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { IoIosClose } from "react-icons/io";
import { PiShareNetwork, PiCodeBold, PiCheck } from "react-icons/pi";
import Portal from "./portal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function ShareEmbedButton({
  url,
  embedUrl,
  OverrideStyle = "",
  size,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const copyText = async (text, setFlag) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlag(true);
      setTimeout(() => setFlag(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  const embedCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="100%" 
  frameborder="0" 
  style="border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
</iframe>`;

  const shareUrl = `${url}`;

  return (
    <>
      {/* Tombol Bagikan */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${jakarta.className} flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-xs duration-200 ${OverrideStyle}`}
        aria-label="Bagikan halaman ini"
      >
        <PiShareNetwork size={14} />
        <span className="hidden text-xs font-medium md:inline">Bagikan</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6 py-4"
            role="dialog"
            aria-modal="true"
            aria-label="Bagikan"
            onClick={() => setIsOpen(false)}
          >
            <div
              className={`${jakarta.className} max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold leading-none">
                    Bagikan
                  </h2>
                  <span className="text-sm text-[#6c6c6c]">
                    Salin link atau kode embed
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="transition-colors"
                  aria-label="Tutup dialog"
                >
                  <IoIosClose
                    size={24}
                    className="cursor-pointer duration-200 hover:scale-110"
                  />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-6 p-6">
                {/* Tautan */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tautan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-[#6c6c6c] focus:outline-none"
                    />
                    <button
                      onClick={() => copyText(shareUrl, setCopiedLink)}
                      className={`flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg px-4 py-2 text-xs font-medium text-white transition-colors ${
                        copiedLink
                          ? "bg-emerald-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <PiCheck size={16} />
                          Tersalin!
                        </>
                      ) : (
                        "Salin"
                      )}
                    </button>
                  </div>
                </div>

                {/* Kode Embed */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <PiCodeBold size={14} />
                    <label className="block text-sm font-medium">
                      Kode Embed
                    </label>
                  </div>

                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg border border-gray-300 bg-gray-100 p-4 text-xs text-[#6c6c6c]">
                      <code>{embedCode}</code>
                    </pre>

                    <button
                      onClick={() => copyText(embedCode, setCopiedEmbed)}
                      className={`absolute right-2 top-2 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        copiedEmbed
                          ? "border border-transparent bg-emerald-600 text-white"
                          : "border border-gray-300 bg-white text-[#6c6c6c] hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {copiedEmbed ? (
                        <span className="flex items-center gap-1">
                          <PiCheck size={14} />
                          Tersalin!
                        </span>
                      ) : (
                        "Salin kode"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
