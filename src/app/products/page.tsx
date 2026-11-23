"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { fetchCategories, fetchProducts } from "@/lib/supabase";
import { Category, Product } from "@/types";
import { RefreshCw, Factory, Sparkles } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categoryParam ? Number(categoryParam) : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [catsRes, prodsRes] = await Promise.all([fetchCategories(), fetchProducts()]);
      setCategories(catsRes.data);
      setProducts(prodsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategoryId(Number(categoryParam));
    }
  }, [categoryParam]);

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

      <main className="py-10">
        {/* Top Hero Banner for Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-xl group">
            {/* Red Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-xs font-mono text-red-600 font-bold shadow-sm">
                <Factory className="w-3.5 h-3.5 text-red-600" />
                <span>WHOLESALE OEM CATALOG • LOW MOQ TIERS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
                High-End Sportswear &amp; <span className="text-red-600">Apparel Lines</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                All styles shown below are manufactured in Sialkot, Pakistan. Select garments, customize your target volume, and add to your spec sheet to receive factory-direct FOB/CIF proforma pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Product Catalog Component */}
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
              Loading Products &amp; MOQ Tiers from Sialkot...
            </p>
          </div>
        ) : (
          <ProductCatalog
            initialProducts={products}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
            title="All Sportswear & Equipment"
            subtitle="DanFit Industry Engineering Spec Sheet"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#eaebf2] text-[#08080a] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
