"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Factory,
  Layers,
  Scissors,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  PhoneCall,
  Send,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { createInquiry } from "@/lib/supabase";

const WA = "923285850057";

export default function CustomManufacturingPage() {
  const [b2bForm, setB2bForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    productCategory: "Custom Sportswear & Gym Apparel",
    targetVolume: "20 - 50 Pcs (Low MOQ)",
    details: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInquiry({
      name: b2bForm.contactPerson,
      email: b2bForm.email,
      phone: b2bForm.phone,
      subject: `Custom OEM - ${b2bForm.productCategory}`,
      product_name: b2bForm.productCategory,
      message: `Company: ${b2bForm.companyName}\nVolume: ${b2bForm.targetVolume}\nDetails: ${b2bForm.details}`,
      source: "custom_manufacturing",
    });
    let text = `*DANFIT INDUSTRY - CUSTOM OEM MANUFACTURING INQUIRY*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Brand/Club:* ${b2bForm.companyName}\n`;
    text += `*Contact Person:* ${b2bForm.contactPerson}\n`;
    text += `*Email:* ${b2bForm.email}\n`;
    if (b2bForm.phone) text += `*WhatsApp/Phone:* ${b2bForm.phone}\n`;
    text += `*Category:* ${b2bForm.productCategory}\n`;
    text += `*Volume Tier:* ${b2bForm.targetVolume}\n`;
    text += `*Technical Details:* ${b2bForm.details}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Requesting factory-direct proforma quotation, sample lead time, and shipping rates from Sialkot.`;

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, "_blank");

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#ff0000", "#ffffff", "#08080a"],
    });

    setSubmitted(true);
  };

  const moqTiers = [
    {
      tier: "Sample Prototyping",
      moq: "1 - 2 Pcs",
      leadTime: "5 - 7 Business Days",
      bestFor: "Tech pack verification, fit testing, physical sample approval before bulk run.",
      features: ["CAD pattern drafting", "Custom fabric swatches", "Express DHL delivery", "100% sample fee credited to bulk order"],
      highlight: false,
    },
    {
      tier: "Low MOQ Club & Teamwear",
      moq: "15 - 25 Pcs / Style",
      leadTime: "10 - 14 Business Days",
      bestFor: "Gyms, combat academies, crossfit boxes, and sports clubs wanting custom uniforms.",
      features: ["Full sublimation / embroidery", "Custom player names & numbers", "Multiple size breakdown (XS-4XL)", "Reinforced flatlock stitching"],
      highlight: true,
    },
    {
      tier: "Emerging Sportswear Brands",
      moq: "30 - 50 Pcs / Style",
      leadTime: "12 - 16 Business Days",
      bestFor: "Luxury hoodies, tracksuits, oversized tees, and activewear collections.",
      features: ["Custom woven neck labels", "Puff print, screen print & 3D silicone", "Custom color dyeing / Pantone match", "Branded frosted zip packaging"],
      highlight: false,
    },
    {
      tier: "Mass OEM & Enterprise",
      moq: "200 - 10,000+ Pcs",
      leadTime: "18 - 25 Business Days",
      bestFor: "Established athletic apparel brands, retail chains, and international federations.",
      features: ["Lowest factory-direct unit cost", "Dedicated automated production floor", "Full third-party QC inspection support", "Sea & Air freight forwarding"],
      highlight: false,
    },
  ];

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
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-xs font-mono text-red-600 font-bold">
            <Factory className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>SIALKOT INDUSTRIAL FACILITY • OEM &amp; PRIVATE LABEL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-950 leading-tight font-['Bricolage_Grotesque',sans-serif]">
            Custom Athletic Wear &amp; <span className="text-red-600">B2B Manufacturing</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            DanFit Industry operates a cutting-edge apparel manufacturing facility in Sialkot, Pakistan. We bring athletic brands, sports clubs, and gyms from concept to global distribution with low MOQs, precision flatlock stitching, and worldwide express export.
          </p>
        </div>

        {/* 4 Core Capabilities with 3D Tilt */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
              Manufacturing <span className="text-red-600">Capabilities</span>
            </h2>
            <span className="text-xs font-mono text-slate-500 uppercase">
              End-to-End Production
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Printer className="w-6 h-6" />,
                title: "Digital Sublimation",
                desc: "Italian Epson precision digital sublimation printers ensuring razor-sharp graphics that never peel, crack, or fade under intense athletic use.",
                tag: "Ultra-Vibrant Inks",
              },
              {
                icon: <Scissors className="w-6 h-6" />,
                title: "Cut, Sew & Flatlock",
                desc: "High-speed 4-needle 6-thread flatlock machines engineered for seamless chafe-free athletic compression rashguards, leggings, and jerseys.",
                tag: "Reinforced Seams",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "3D Embroidery & Silicone",
                desc: "Computerized Tajima multi-head embroidery rigs and high-density 3D silicone heat transfers for pro sports branding and luxury lifestyle wear.",
                tag: "Tactile Finishes",
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Custom Fabrics & GSM",
                desc: "Polyester-spandex interlock, moisture-wicking dry-fit mesh, heavy 460GSM fleece, French terry, and anti-odor antimicrobial weaves.",
                tag: "Custom Knits",
              },
            ].map((cap, i) => (
              <div
                key={i}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-red-600/50 transition duration-300 space-y-4 h-full flex flex-col justify-between shadow-lg hover:shadow-2xl"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
                    {cap.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 uppercase font-['Bricolage_Grotesque',sans-serif]">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {cap.desc}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-red-600 font-bold">● {cap.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MOQ Tiers Grid with 3D Parallax */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">
                Transparent Volume Tiers
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
                Minimum Order <span className="text-red-600">Quantities (MOQs)</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm font-sans">
              Designed to support growing apparel brands as well as enterprise athletic institutions with low entry barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {moqTiers.map((tier, idx) => (
              <div
                key={idx}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
                className={`p-6 rounded-3xl transition duration-300 space-y-6 flex flex-col justify-between relative shadow-lg hover:shadow-2xl ${
                  tier.highlight
                    ? "bg-white border-2 border-red-600 shadow-red-600/10"
                    : "bg-white border border-slate-200 hover:border-slate-400"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                    Most Popular for Gyms
                  </span>
                )}

                <div className="space-y-4">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
                    Tier 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-bold text-slate-950 uppercase font-['Bricolage_Grotesque',sans-serif]">
                    {tier.tier}
                  </h3>
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-red-600 font-['Bricolage_Grotesque',sans-serif] block">
                      {tier.moq}
                    </span>
                    <span className="text-xs font-mono text-slate-500 block">
                      Lead Time: {tier.leadTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {tier.bestFor}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi DanFit, I am interested in your ${tier.tier} (${tier.moq}) for my brand.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-3 rounded-full text-center text-xs font-bold uppercase tracking-wider font-mono transition ${
                    tier.highlight
                      ? "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                  }`}
                >
                  Inquire This Tier
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Custom B2B Tech Pack Submission Form */}
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-slate-200 shadow-2xl relative overflow-hidden" id="inquiry">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold block">
                Factory Direct Dispatch
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-slate-950 font-['Bricolage_Grotesque',sans-serif] leading-tight">
                Submit Your <span className="text-red-600">Tech Pack</span> or Concept
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Our Sialkot production engineers review tech packs, mockups, or reference links within 24 hours. We provide transparent proforma quotations, Pantone color options, and sample dispatch times.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-700">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span>24-Hour Quotation Turnaround</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-700">
                  <Truck className="w-4 h-4 text-red-600" />
                  <span>Express DHL / FedEx Door-to-Door Worldwide</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-700">
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span>Direct WhatsApp Line: +92 328 5850057</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Brand / Academy / Club *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Apex Combat Club"
                      value={b2bForm.companyName}
                      onChange={(e) => setB2bForm({ ...b2bForm, companyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Contact Person *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. David Miller"
                      value={b2bForm.contactPerson}
                      onChange={(e) => setB2bForm({ ...b2bForm, contactPerson: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="david@brand.com"
                      value={b2bForm.email}
                      onChange={(e) => setB2bForm({ ...b2bForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 555 019 2834"
                      value={b2bForm.phone}
                      onChange={(e) => setB2bForm({ ...b2bForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Product Category
                    </label>
                    <select
                      value={b2bForm.productCategory}
                      onChange={(e) => setB2bForm({ ...b2bForm, productCategory: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    >
                      <option>Custom Sportswear &amp; Gym Apparel</option>
                      <option>Compression Gear &amp; BJJ Rashguards</option>
                      <option>Boxing Gloves &amp; Combat Equipment</option>
                      <option>Heavyweight Hoodies &amp; Streetwear</option>
                      <option>Club Football / Soccer Uniforms</option>
                      <option>Custom Varsity &amp; Leather Jackets</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Target Volume
                    </label>
                    <select
                      value={b2bForm.targetVolume}
                      onChange={(e) => setB2bForm({ ...b2bForm, targetVolume: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    >
                      <option>1 - 2 Pcs (Sample Prototyping)</option>
                      <option>15 - 25 Pcs (Club &amp; Teamwear)</option>
                      <option>30 - 50 Pcs (Brand Launch)</option>
                      <option>100 - 500 Pcs (Wholesale OEM)</option>
                      <option>1,000+ Pcs (Enterprise Volume)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                    Project Specifications, Fabrics, or Tech Pack Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Specify target fabric GSM, stitching style (flatlock, overlock), printing requirements (sublimation, silicone, puff), and delivery deadline..."
                    value={b2bForm.details}
                    onChange={(e) => setB2bForm({ ...b2bForm, details: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider font-mono transition flex items-center justify-center gap-2 shadow-xl shadow-red-600/30"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Quote Request to Sialkot Factory</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
