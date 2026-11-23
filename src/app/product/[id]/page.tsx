"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  ShieldCheck,
  PhoneCall,
  Factory,
  RefreshCw,
  Clock,
  Scissors,
  CheckCircle,
  Truck,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Product } from "@/types";
import { fetchProductById, fetchProducts } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const WA = "923285850057";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Racing Red");
  const [quantity, setQuantity] = useState(25);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!params?.id) return;
      setLoading(true);
      const id = Number(params.id);
      const { data } = await fetchProductById(id);

      if (data) {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0].name);

        const { data: allProds } = await fetchProducts();
        const related = allProds.filter((p) => p.id !== data.id && p.category_id === data.category_id);
        setRelatedProducts(related.slice(0, 4));
      }
      setLoading(false);
    }
    loadData();
  }, [params?.id]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaebf2] text-[#08080a] flex flex-col justify-between font-['DM_Sans',sans-serif]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
              Loading DanFit Engineering Specs...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#eaebf2] text-[#08080a] flex flex-col justify-between font-['DM_Sans',sans-serif]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-2 font-['Bricolage_Grotesque',sans-serif]">
            Garment Spec Not Found
          </h2>
          <p className="text-sm text-slate-600 mb-6 font-sans">
            The requested style could not be retrieved from the catalog.
          </p>
          <Link
            href="/products"
            className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider font-mono shadow-lg shadow-red-600/30"
          >
            Back to Products &amp; MOQs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToQuote = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setIsAdded(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#ff0000", "#ffffff", "#08080a"],
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppQuote = () => {
    let message = `*DANFIT INDUSTRY - GARMENT QUOTE & MOQ INQUIRY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Garment:* ${product.title}\n`;
    message += `*SKU:* ${product.sku || `DF-${product.id}`}\n`;
    message += `*MOQ Standard:* ${product.moq || "20 Pcs"}\n`;
    message += `*Requested Volume:* ${quantity} units\n`;
    message += `*Colorway:* ${selectedColor}\n`;
    message += `*Target Size:* ${selectedSize} (and full graded size run)\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Please confirm factory FOB unit quote and sample lead time.`;

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(message)}`, "_blank");
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-red-600 font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>
        </div>

        {/* Garment Layout: Gallery Left, Technical Specs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl group">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-6xl text-slate-300 font-['Bricolage_Grotesque',sans-serif]">
                  DANFIT
                </div>
              )}
              <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-lg">
                {product.moq || "MOQ: 20 Pcs"}
              </span>
            </div>

            {/* Quick Factory Assurance Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                <Scissors className="w-4 h-4 text-red-600 mx-auto" />
                <span className="text-[11px] font-mono font-bold text-slate-800 block">Flatlock Stitch</span>
                <span className="text-[10px] text-slate-500 block">Zero Chafe Seams</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                <Truck className="w-4 h-4 text-red-600 mx-auto" />
                <span className="text-[11px] font-mono font-bold text-slate-800 block">DHL Worldwide</span>
                <span className="text-[10px] text-slate-500 block">Express Delivery</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-red-600 mx-auto" />
                <span className="text-[11px] font-mono font-bold text-slate-800 block">QC Inspected</span>
                <span className="text-[10px] text-slate-500 block">100% Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Garment Information & Quote Builder */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-mono font-bold uppercase">
                  SKU: {product.sku || `DF-${product.id}`}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">
                  Made in Sialkot, Pakistan
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase text-slate-950 font-['Bricolage_Grotesque',sans-serif] leading-tight">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-red-600 font-['Bricolage_Grotesque',sans-serif]">
                  OEM Factory Direct
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">
                  • {product.moq || "Low MOQ Tier (15-20 Pcs)"}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {product.description ||
                "Engineered from high-density compression fabrics with kinetic paneling, reinforced flatlock seams, and sublimated aerodynamic design. Custom branding, Pantone color matching, and woven private labels available."}
            </p>

            {/* Customization Options */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-lg">
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-slate-600 font-bold block">
                    Target Prototype Size (Full Run XS - 4XL Available)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`w-11 h-11 rounded-xl text-xs font-mono font-bold uppercase transition ${
                          selectedSize === sz
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colorway Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-slate-600 font-bold block">
                    Selected Colorway: <span className="text-red-600 font-mono">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 border transition ${
                          selectedColor === c.name
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase text-slate-600 font-bold">
                    Order Quantity (MOQ: {product.moq || "20 Pcs"})
                  </label>
                  <span className="text-xs font-mono text-red-600 font-semibold">
                    {quantity >= 100 ? "Wholesale Rate Tier" : "Low MOQ Tier"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(15, quantity - 5))}
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 font-black text-lg transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="flex-1 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-center font-bold text-base focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 5)}
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 font-black text-lg transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToQuote}
                  className="flex-1 py-4 rounded-full bg-slate-900 hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4 text-red-500" />
                  <span>{isAdded ? "Added to Spec Sheet!" : "Add to Spec Sheet"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppQuote}
                  className="flex-1 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Factory Quote</span>
                </button>
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-md">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
                Technical Specifications
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Stitching Method</span>
                  <span className="font-bold text-slate-900">4-Needle 6-Thread Flatlock</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Standard MOQ</span>
                  <span className="font-bold text-red-600">{product.moq || "15 - 20 Pcs"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Lead Time</span>
                  <span className="font-bold text-slate-900">7-12 Business Days</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Customization</span>
                  <span className="font-bold text-slate-900">Sublimation, Puff, Silicone</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Garments */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
                Complementary <span className="text-red-600">Apparel Specs</span>
              </h2>
              <Link
                href="/products"
                className="text-xs font-mono uppercase tracking-wider text-red-600 hover:text-red-700 font-bold"
              >
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out, box-shadow 0.3s" }}
                  className="rounded-3xl bg-white border border-slate-200 hover:border-red-600/50 transition-all p-3 shadow-md hover:shadow-xl"
                >
                  <Link href={`/product/${p.id}`} className="block">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-contain group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-400">
                          DF
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-mono font-bold shadow">
                        {p.moq || "MOQ: 20"}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 truncate font-['Bricolage_Grotesque',sans-serif]">
                      {p.title}
                    </h3>
                    <p className="text-[11px] font-mono text-red-600 font-semibold mt-1">
                      OEM Direct • {p.moq || "Low MOQ"}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}