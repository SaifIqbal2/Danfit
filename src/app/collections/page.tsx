"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Factory, Sparkles, Layers } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { fetchCategories, fetchProducts } from "@/lib/supabase";
import { Category, Product } from "@/types";

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [catsRes, prodsRes] = await Promise.all([fetchCategories(), fetchProducts()]);
      setCategories(catsRes.data);
      setProducts(prodsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  const displayedCategories = selectedCatId
    ? categories.filter((c) => c.id === selectedCatId)
    : categories;

  return (
    <div className="min-h-screen bg-[#eaebf2] text-[#08080a] selection:bg-red-600 selection:text-white font-['DM_Sans',sans-serif]">
      <Navbar />
      <CartDrawer />

      {/* Marquee Ticker */}
      <div className="mq border-t border-b border-black">
        <div>
          <span>✦ SIALKOT SPORTSWEAR OEM ✦ WORLDWIDE EXPRESS ✦ 100% QUALITY GUARANTEED ✦ LOW MOQ 15-20 PCS ✦ CUSTOM SAMPLES 5-7 DAYS ✦ DANFIT INDUSTRY ✦ </span>
          <span>✦ SIALKOT SPORTSWEAR OEM ✦ WORLDWIDE EXPRESS ✦ 100% QUALITY GUARANTEED ✦ LOW MOQ 15-20 PCS ✦ CUSTOM SAMPLES 5-7 DAYS ✦ DANFIT INDUSTRY ✦ </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-xs font-mono text-red-600 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>DANFIT INDUSTRY • SPORTING DIVISIONS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
            Curated Collections &amp; <span className="text-red-600">Manufacturing Lines</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            Explore our specialized apparel categories. Each collection is engineered at our Sialkot manufacturing facility with precision pattern grading, reinforced kinetic flatlock stitching, and flexible B2B Minimum Order Quantities (MOQs).
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-slate-200">
          <button
            onClick={() => setSelectedCatId(null)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
              selectedCatId === null
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            All Collections ({categories.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCatId(c.id === selectedCatId ? null : c.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                c.id === selectedCatId
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Collections Editorial Grid */}
        <div className="space-y-16">
          {loading ? (
            <div className="grid grid-cols-1 gap-16">
              {[1, 2].map((item) => (
                <div key={item} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                  <div className="lg:col-span-5 h-72 rounded-3xl bg-slate-200" />
                  <div className="lg:col-span-7 h-72 rounded-3xl bg-slate-200" />
                </div>
              ))}
            </div>
          ) : displayedCategories.map((cat) => {
            const catProducts = products.filter((p) => p.category_id === cat.id);

            return (
              <div
                key={cat.id}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
                className="rounded-3xl bg-white border border-slate-200 hover:border-red-600/50 transition-all duration-300 overflow-hidden p-6 sm:p-10 space-y-8 shadow-xl hover:shadow-2xl relative group"
              >
                {/* Glow Backdrop */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/10 transition" />

                {/* Category Banner Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-mono uppercase font-bold">
                        Division #{cat.id}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">
                        {catProducts.length} Developed Styles
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-slate-950 uppercase tracking-tight font-['Bricolage_Grotesque',sans-serif]">
                      {cat.name}
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed font-sans">
                      {cat.description ||
                        "Engineered for competitive athletics, extreme durability, and unrestricted kinetic movement. Tailored to international federation specifications in Sialkot."}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        href={`/products?category=${cat.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition shadow-lg shadow-red-600/30 font-mono"
                      >
                        <span>Explore Division Styles</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/custom-manufacturing"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono text-slate-800 font-bold transition"
                      >
                        <Factory className="w-3.5 h-3.5 text-red-600" />
                        <span>Request Custom OEM Quote</span>
                      </Link>
                    </div>
                  </div>

                  {/* Featured Category Image */}
                  <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-lg">
                    <Image
                      src={cat.image_url || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd"}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/50 text-xs font-mono text-slate-900 shadow-xl">
                      <span className="font-semibold text-slate-600">MOQ Baseline:</span>
                      <span className="font-bold text-red-600">15-25 Pcs / Style (Low MOQ)</span>
                    </div>
                  </div>
                </div>

                {/* Product Teasers within this Division */}
                {catProducts.length > 0 && (
                  <div className="pt-6 border-t border-slate-200 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                        Top Styles in {cat.name}
                      </span>
                      <Link
                        href={`/products?category=${cat.id}`}
                        className="text-xs text-red-600 hover:text-red-700 font-bold uppercase tracking-wider flex items-center gap-1 font-mono"
                      >
                        View All ({catProducts.length}) →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {catProducts.slice(0, 4).map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          className="group/prod p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-600/50 hover:bg-white transition-all shadow-sm hover:shadow-md block"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 mb-2.5">
                            {p.image_url ? (
                              <Image
                                src={p.image_url}
                                alt={p.title}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-contain group-hover/prod:scale-105 transition duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-400">
                                DF
                              </div>
                            )}
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-mono font-bold shadow">
                              {p.moq || "MOQ: 20 Pcs"}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate font-['Bricolage_Grotesque',sans-serif]">
                            {p.title}
                          </p>
                          <p className="text-[11px] font-mono text-red-600 font-semibold mt-0.5">
                            OEM Direct • {p.moq || "Low MOQ"}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
