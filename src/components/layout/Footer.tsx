"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  Award,
  Zap,
} from "lucide-react";

const WA = "923285850057";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08080a] text-white pt-10 sm:pt-12 pb-5 px-4 sm:px-6 lg:px-14 border-t-2 border-red-600 relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Brand Highlights Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-6 mb-7 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-500 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-sm font-black uppercase text-white font-['Bricolage_Grotesque',sans-serif]">
                Sialkot Craftsmanship
              </p>
              <p className="text-[10px] sm:text-xs text-white/50">World capital of sports apparel</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-sm font-black uppercase text-white font-['Bricolage_Grotesque',sans-serif]">
                Worldwide Express
              </p>
              <p className="text-[10px] sm:text-xs text-white/50">DHL &amp; FedEx Door-to-Door</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-sm font-black uppercase text-white font-['Bricolage_Grotesque',sans-serif]">
                Custom OEM &amp; Low MOQs
              </p>
              <p className="text-[10px] sm:text-xs text-white/50">Sublimation, embroidery, cut &amp; sew</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-500 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-sm font-black uppercase text-white font-['Bricolage_Grotesque',sans-serif]">
                Direct WhatsApp Line
              </p>
              <p className="text-[10px] sm:text-xs text-white/50">Instant tech-pack &amp; quote dispatch</p>
            </div>
          </div>
        </div>

        {/* Big Editorial Heading */}
        {/* 4 Columns Contact & Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 mb-4">
          <div>
            <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-4">
              Factory Location
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              <span className="font-bold text-white">DanFit Industry</span>
              <br />
              Sialkot, Punjab, Pakistan
              <br />
              <span className="text-xs text-slate-400">The Global Capital of Athletic Apparel</span>
            </p>
          </div>

          <div>
            <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-4">
              Phone / WhatsApp
            </h4>
            <p className="text-sm text-slate-300">
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-500 border-b border-white/20 pb-0.5 transition font-mono font-bold"
              >
                +92 328 5850057
              </a>
              <br />
              <span className="text-xs text-slate-400 mt-1 block">
                Available 24/7 for export queries
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-4">
              Email Inquiries
            </h4>
            <p className="text-sm text-slate-300">
              <a
                href="mailto:info@danfitindustry.com"
                className="hover:text-red-500 border-b border-white/20 pb-0.5 transition font-mono font-bold"
              >
                info@danfitindustry.com
              </a>
              <br />
              <span className="text-xs text-slate-400 mt-1 block">
                Direct B2B orders &amp; tech packs
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-4">
              Official Socials
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <a
                href="https://facebook.com/danfitindustry"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-500 flex items-center gap-2 transition"
              >
                <Facebook className="w-4 h-4 text-red-500" />
                <span>Facebook: DanFit Industry</span>
              </a>
              <a
                href="https://instagram.com/danfit_industry"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-500 flex items-center gap-2 transition"
              >
                <Instagram className="w-4 h-4 text-red-500" />
                <span>Instagram: @danfit_industry</span>
              </a>
            </div>
          </div>
        </div>

        {/* Giant Outline Watermark Text matching Home Page */}
        <div className="giant-outline select-none pointer-events-none">DANFIT</div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} DanFit Industry · danfitindustry.com · Sialkot, Pakistan</p>
          <div className="flex items-center gap-6">
            <Link href="/collections" className="hover:text-white transition">
              Collections
            </Link>
            <Link href="/products" className="hover:text-white transition">
              Catalog &amp; MOQs
            </Link>
            <Link href="/custom-manufacturing" className="hover:text-white transition">
              OEM Specs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
