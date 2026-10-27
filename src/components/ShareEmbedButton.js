"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { IconShare, IconTimes, IconCheck, IconCode } from "./icons";

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
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="100%" 
  frameborder="0" 
  style="border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
</iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const shareUrl = `${url}`;

  return (
    <>
      {/* Share Button - mirip YouTube */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${jakarta.className} flex justify-center items-center gap-3 primary2 efek-opacity text-white font-semibold px-3 py-2.5 rounded-xl shadow ${OverrideStyle}`}
        aria-label="Bagikan halaman ini"
      >
        <IconShare size={14} />
        <span className="hidden md:inline text-xs font-medium">Bagikan Jadwal</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className={`${jakarta.className} bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Share</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Tutup dialog"
              >
                <IconTimes size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Share Link Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Embed Code Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <IconCode size={16} className="text-gray-600" />
                  <label className="block text-sm font-medium text-gray-700">
                    Embed Code
                  </label>
                </div>

                <div className="relative">
                  <pre className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-xs text-gray-700 overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>

                  <button
                    onClick={copyToClipboard}
                    className={`absolute top-2 right-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {copied ? (
                      <span className="flex items-center gap-1">
                        <IconCheck size={12} />
                        Copied!
                      </span>
                    ) : (
                      "Copy code"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
