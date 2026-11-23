"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Factory,
  Award,
  ShieldCheck,
  PhoneCall,
  Cpu,
  Users,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const WA = "923285850057";

export default function AboutPage() {
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  return (
    <div className="min-h-screen bg-[#eaebf2] text-[#08080a] selection:bg-red-600 selection:text-white font-['DM_Sans',sans-serif]">
      <Navbar />
      <CartDrawer />

      {/* Signature Red Marquee Ticker */}
      <div className="mq border-t border-b border-black">
        <div>
          <span>✦ SIALKOT SPORTSWEAR OEM ✦ WORLDWIDE EXPRESS ✦ 100% QUALITY GUARANTEED ✦ LOW MOQ 15-20 PCS ✦ CUSTOM SAMPLES 5-7 DAYS ✦ DANFIT INDUSTRY ✦ </span>
          <span>✦ SIALKOT SPORTSWEAR OEM ✦ WORLDWIDE EXPRESS ✦ 100% QUALITY GUARANTEED ✦ LOW MOQ 15-20 PCS ✦ CUSTOM SAMPLES 5-7 DAYS ✦ DANFIT INDUSTRY ✦ </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-24">
        {/* Editorial Brand Intro */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-xs font-mono text-red-600 font-bold">
            <Award className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>SIALKOT INDUSTRIAL HERITAGE • SINCE DECADES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-950 leading-tight font-['Bricolage_Grotesque',sans-serif]">
            Artisan Mastery Meets <span className="text-red-600">Kinetic Engineering</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            DanFit Industry is an international manufacturer and exporter based in Sialkot, Pakistan—the globally recognized epicentre of sports equipment and athletic apparel manufacturing.
          </p>
        </div>

        {/* Big Heritage Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl overflow-hidden p-6 sm:p-12 shadow-xl relative">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
              The Sialkot Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-950 leading-tight font-['Bricolage_Grotesque',sans-serif]">
              Generational Craftsmanship in Every Fiber
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              For over a century, master artisans in Sialkot have supplied equipment to the world&apos;s biggest tournaments, premier boxing rings, and elite football clubs worldwide.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              DanFit Industry bridges this artisan stitching heritage with computerized CAD grading, aerodynamic fabric knitting, and 3D circular knit seamless technologies. We ensure that emerging and established brands get direct factory access without middleman markup.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-2xl font-black text-slate-900 block font-['Bricolage_Grotesque',sans-serif]">40+</span>
                <span className="text-slate-500 font-medium">Export Nations</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-2xl font-black text-red-600 block font-['Bricolage_Grotesque',sans-serif]">100K+</span>
                <span className="text-slate-500 font-medium">Garments Produced</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-2xl font-black text-slate-900 block font-['Bricolage_Grotesque',sans-serif]">Low MOQ</span>
                <span className="text-slate-500 font-medium">15-20 Pcs Starts</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
            <Image
              src="/images/hero-showroom.jpg"
              alt="DanFit Industry Showroom & Technical Garment Facility"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 text-xs font-mono text-slate-900 font-bold shadow-xl">
              ★ DanFit Industry • Showroom &amp; Technical Manufacturing, Sialkot, Pakistan
            </div>
          </div>
        </div>

        {/* 3 Core Pillars of DanFit Industry with 3D Parallax */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-red-600/50 transition space-y-4 shadow-lg hover:shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 uppercase font-['Bricolage_Grotesque',sans-serif]">
              Automated Precision
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              State-of-the-art computerized pattern grading, laser fabric cutting tables, and Japanese sewing machines eliminate human error and ensure millimeter-exact seam placement across every batch.
            </p>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-red-600/50 transition space-y-4 shadow-lg hover:shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 uppercase font-['Bricolage_Grotesque',sans-serif]">
              Rigorous Quality Control
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              4-tier quality assurance: raw fabric tensile testing, dye fastness verification, in-line seam pull checks, and pre-dispatch carton inspection before worldwide courier export.
            </p>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-red-600/50 transition space-y-4 shadow-lg hover:shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 uppercase font-['Bricolage_Grotesque',sans-serif]">
              Ethical Standards
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              100% fair living wages, climate-controlled safe production floors, zero child labor enforcement, and non-toxic water-based certified sublimation inks safe for athletes and nature.
            </p>
          </div>
        </div>

        {/* Global Export Network & Call To Action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
              Global Partnership Desk
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
              Ready to Engineer Your <span className="text-red-600">Next Collection?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Whether you need 20 customized team jerseys or 5,000 compression rashguards, our Sialkot factory is ready to prototype and scale your brand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/custom-manufacturing"
              className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider text-center transition shadow-lg shadow-red-600/30 font-mono"
            >
              View OEM Tiers &amp; MOQs
            </Link>
            <a
              href={`https://wa.me/${WA}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-xs font-mono font-bold uppercase tracking-wider text-center transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>WhatsApp Production Line</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
