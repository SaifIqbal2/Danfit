"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Send,
  Clock,
  CheckCircle,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { createInquiry, fetchProducts } from "@/lib/supabase";
import type { Product } from "@/types";

const WA = "923285850057";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Inquiry on Sportswear Production",
    productName: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchProducts().then(({ data }) => setProducts(data));
  }, []);

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
    setSubmitting(true);
    setSubmitError("");

    const { error } = await createInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      product_name: formData.productName,
      message: formData.message,
      source: "contact",
    });

    if (error) {
      setSubmitError(error);
      setSubmitting(false);
      return;
    }

    let text = `*DANFIT INDUSTRY - CONTACT FORM DISPATCH*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*Sender:* ${formData.name}\n`;
    text += `*Email:* ${formData.email}\n`;
    if (formData.phone) text += `*Phone:* ${formData.phone}\n`;
    text += `*Subject:* ${formData.subject}\n`;
    if (formData.productName) text += `*Product:* ${formData.productName}\n`;
    text += `*Message:* ${formData.message}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Origin: danfitindustry.com Official Website`;

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, "_blank");

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#ff0000", "#ffffff", "#08080a"],
    });

    setSubmitted(true);
    setSubmitting(false);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-xs font-mono text-red-600 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIALKOT FACTORY &amp; GLOBAL HEADQUARTERS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
            Let&apos;s Connect &amp; <span className="text-red-600">Build Together</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-sans leading-relaxed">
            Whether you want to discuss custom technical sportswear, verify low MOQs, or request samples, our Sialkot manufacturing desk is at your disposal.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
              className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xl hover:shadow-2xl"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold block">
                Direct Communication
              </span>
              <h2 className="text-2xl font-black uppercase text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
                Factory Contact Info
              </h2>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Reach us directly via WhatsApp for immediate quotes, sample schedules, and order status.
              </p>

              <div className="pt-4 border-t border-slate-200 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">WhatsApp / Phone</span>
                    <a
                      href={`https://wa.me/${WA}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-bold text-slate-950 hover:text-red-600 font-mono transition"
                    >
                      +92 328 5850057
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Email Address</span>
                    <a
                      href="mailto:info@danfitindustry.com"
                      className="text-base font-bold text-slate-950 hover:text-red-600 font-mono transition"
                    >
                      info@danfitindustry.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-500 uppercase block">Industrial Location</span>
                    <p className="text-sm font-bold text-slate-900 font-sans">
                      DanFit Industry
                      <br />
                      <span className="text-xs font-normal text-slate-600">
                        Sialkot, Punjab, Pakistan
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials Card */}
            <div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl hover:shadow-2xl space-y-3"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold block">
                Official Channels
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://facebook.com/danfitindustry"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://instagram.com/danfit_industry"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold block">
                Direct Dispatch Form
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
                Send an Inquiry
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Interested Product
                    </label>
                    <select
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition"
                    >
                      <option value="">General Inquiry / No specific product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.title}>
                          {product.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                    Message / Spec Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your apparel requirements, target quantities, fabrics, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-red-600 transition font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider font-mono transition flex items-center justify-center gap-2 shadow-xl shadow-red-600/30"
                >
                  <Send className={`w-4 h-4 ${submitting ? "animate-pulse" : ""}`} />
                  <span>{submitting ? "Saving Inquiry..." : "Send Inquiry"}</span>
                </button>
                {submitError && (
                  <p className="text-xs font-mono text-red-600 text-center">{submitError}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
