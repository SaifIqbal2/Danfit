"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, PhoneCall, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WA = "923285850057";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "Products & MOQs", href: "/products" },
    { name: "B2B OEM", href: "/custom-manufacturing" },
    { name: "About Factory", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top International OEM Announcement Bar */}
      <div className="bg-[#0a0a0d] text-white/90 py-1.5 px-3 sm:px-4 text-center text-[9px] sm:text-[11px] font-mono tracking-wide sm:tracking-wider flex items-center justify-center gap-2 sm:gap-4 border-b border-black/10 relative z-50">
        <span className="flex items-center gap-1.5 text-red-500 font-bold">
          <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="truncate">DANFIT INDUSTRY • SIALKOT PAKISTAN</span>
        </span>
        <span className="hidden md:inline text-white/20">|</span>
        <span className="hidden md:inline text-white/80">
          Your Custom Sportswear Manufacturer &amp; Exporter
        </span>
        <span className="hidden lg:inline text-white/20">|</span>
        <a
          href={`https://wa.me/${WA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-red-500 hover:text-white transition font-bold"
        >
          <PhoneCall className="w-2.5 h-2.5" />
          WhatsApp: +92 328 5850057
        </a>
      </div>

      {/* Main Dark Header */}
      <header
        className={`sticky top-0 z-40 bg-[#08080a]/95 backdrop-blur-xl border-b border-white/10 text-white transition-all duration-300 ${
          isScrolled ? "shadow-lg py-3" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo with Geometric DF Monogram */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="DanFit Industry Home">
            <svg width="36" height="22" viewBox="0 0 120 76" fill="none" className="transition-transform duration-300 group-hover:scale-105">
              <path
                d="M4 6H48C60 6 66 13 62 25L50 56C47 63 42 66 36 62L8 34H26L39 47L46 26C48 21 45 18 39 18H16L4 6Z"
                fill="#08080a"
              />
              <path
                d="M46 68L68 16C71 9 77 6 85 6H118L106 18H84C80 18 78 20 76 24L73 31H104L93 43H68L58 66C55 72 50 74 46 68Z"
                fill="#ff0000"
              />
            </svg>
            <div className="font-extrabold text-xl sm:text-2xl tracking-tighter text-white font-['Bricolage_Grotesque',sans-serif]">
              DAN<span className="text-red-600">FIT</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition duration-200 tracking-wide font-['DM_Sans',sans-serif] ${
                    isActive
                      ? "text-red-600 font-bold"
                      : "text-white/80 hover:text-red-500"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: WhatsApp + Bag Drawer + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WA}?text=Hi%20DanFit%20Industry,%20I%20want%20to%20inquire%20about%20sportswear%20manufacturing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-600/30"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Quote on WA</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 hover:border-red-600/50 text-white text-xs font-bold transition group"
              aria-label="View Inquiry Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
              <span>Bag</span>
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-mono font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:text-red-500 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#08080a] border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block text-base font-bold tracking-wide py-2 ${
                  pathname === link.href ? "text-red-500" : "text-white/80 hover:text-red-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Direct WhatsApp Chat
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
