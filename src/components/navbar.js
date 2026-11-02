"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  IconHome,
  IconBook,
  IconScroll,
  IconPray,
  IconStar,
  IconArrowRight,
  IconBars,
  IconCalendar,
  IconQuran,
} from "./icons";
import { IoIosClose } from "react-icons/io";
import { PiHeartStraightFill } from "react-icons/pi";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRef, useEffect } from "react";
import AyatHariIni from "./ayathariini";
import Portal from "./portal";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const update = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };

    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { href: "/home", icon: <IconHome size={20} />, label: "Home" },
    { href: "/alquran", icon: <IconBook size={20} />, label: "Al - Quran" },
    { href: "/hadis", icon: <IconScroll size={20} />, label: "Hadis" },
    { href: "/doaharian", icon: <IconPray size={20} />, label: "Doa Harian" },
    {
      href: "/asmaulhusna",
      icon: <IconStar size={20} />,
      label: "Asmaul Husna",
    },
    {
      href: "/kalender",
      icon: <IconCalendar size={20} />,
      label: "Kalender Sholat",
    },
    { href: "/tahlil", icon: <IconQuran size={20} />, label: "Tahlil" },
  ];

  return (
    <>
      <header className="fixed inset-x-2 py-3 top-2 z-49 flex items-center justify-between rounded-xl lg:rounded-2xl border border-white shadow-xs bg-white/40 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center">
          <Image
            src="/suaraislam.png"
            alt="Suara Islam"
            width={300}
            height={324}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <button
          onClick={toggleMenu}
          className="w-10 h-10 flex items-center justify-center text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
          aria-label="Buka menu navigasi"
          aria-expanded={isMenuOpen}
        >
          <IconBars size={22} />
        </button>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/5 z-50 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
      <Portal>
        <aside
          className={`${jakarta.className} fixed inset-x-2 top-0 z-50 max-h-[calc(100vh-1rem)] overflow-y-auto rounded-b-2xl bg-white/60 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden ${
            isMenuOpen
              ? "translate-y-0 shadow-2xl"
              : "-translate-y-[calc(100%+3rem)] shadow-none"
          }`}
          aria-label="Menu navigasi"
          aria-hidden={!isMenuOpen}
        >
          <div className="px-4">
            <div className="flex h-16 w-full items-center justify-between border-b border-black/10">
              <div className="flex items-center text-lg font-medium text-emerald-800">
                <span>Menu</span>
              </div>
              <button
                onClick={toggleMenu}
                className="rounded-lg p-1 text-emerald-700 transition-colors hover:bg-emerald-50"
                aria-label="Tutup menu navigasi"
              >
                <IoIosClose size={28} />
              </button>
            </div>
          </div>

          <nav
            className="flex flex-col p-4 gap-1"
            aria-label="Menu navigasi mobile"
          >
            {menuItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center w-full h-[54px] cursor-pointer rounded-2xl transition-colors ${
                    active
                      ? "bg-emerald-100/40 text-emerald-700 border border-emerald-600"
                      : "text-[#6c6c6c] hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                  onClick={toggleMenu}
                  aria-current={active ? "page" : undefined}
                >
                  <div
                    className={`w-[56px] flex justify-center items-center ml-3 ${active ? "text-emerald-600" : "text-[#6c6c6c]"}`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-[16px] ${active ? "font-semibold" : "font-medium"} w-full ml-3`}
                    // style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </Portal>
      <div
        ref={sidebarRef}
        className={`${jakarta.className} bg-white/40 backdrop-blur-md hidden md:flex flex-col w-[290px] m-4 shrink-0 self-start h-fit sticky border rounded-2xl p-6 border-white`}
      >
        <div className="w-full flex items-end gap-3">
          <Link href="/home">
            <Image
              src="/suaraislam.png"
              alt="Suara Islam - Halaman utama"
              width={200}
              height={324}
              className="h-[50px] w-auto object-contain"
              priority
            />
          </Link>
          <div className="flex flex-col leading-none translate-y-1">
            <span className="font-bold text-xl leading-tight">Suara Islam</span>
            <span className="text-sm text-[#6c6c6c] font-medium">
              Al-Quran & Referensi Islami
            </span>
          </div>
        </div>

        <nav
          className="flex flex-col gap-2 font-normal mt-8"
          aria-label="Menu navigasi utama"
        >
          {menuItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={index}
                href={item.href}
                className={`group flex items-center transition-all rounded-lg duration-200 py-3 ${
                  active
                    ? "bg-emerald-600 text-white border border-emerald-200"
                    : "text-[#6c6c6c] hover:bg-emerald-50 hover:text-emerald-600"
                }`}

                aria-current={active ? "page" : undefined}
              >
                <div
                  className={`w-[48px] flex justify-center items-center ml-3 duration-200 transition-all ${active ? "text-white" : "text-[#6c6c6c] group-hover:text-emerald-600"}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[15px] ${active ? "font-semibold" : "font-medium"} w-full ml-2`}
                  // style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mx-auto mt-14 text-center mb-8 flex flex-col gap-3 items-center">
          <AyatHariIni />
        </div>
      </div>
    </>
  );
}
