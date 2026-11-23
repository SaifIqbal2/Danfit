"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Navbar } from "@/components/layout/Navbar";
import { fetchCategories, fetchProducts } from "@/lib/supabase";
import type { Category, Product } from "@/types";

// Color Palette
const WA = "923285850057";
const C = {
  red: "#ff0000",
  crimson: "#990000",
  black: "#08080a",
  carbon: "#18181d",
  steel: "#3a3a44",
  white: "#ffffff",
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface ProductItem {
  id: number;
  n: string;
  cat: string;
  k: "tee" | "shorts" | "hoodie" | "pants" | "jacket";
  price: number;
  tag?: string;
  moq?: string;
  cl: [string, string][];
  image_url?: string;
}

function getGarmentKind(product: Product): ProductItem["k"] {
  const text = `${product.title} ${product.category_name || ""}`.toLowerCase();
  if (text.includes("short")) return "shorts";
  if (text.includes("pant") || text.includes("trouser")) return "pants";
  if (text.includes("hoodie") || text.includes("sweatshirt")) return "hoodie";
  if (text.includes("jacket") || text.includes("windbreaker") || text.includes("outerwear")) return "jacket";
  return "tee";
}

function toProductItem(product: Product): ProductItem {
  const colors: [string, string][] =
    product.colors && product.colors.length > 0
      ? product.colors.map((color) => [color.name, color.hex])
      : [["Standard", C.black]];

  return {
    id: product.id,
    n: product.title,
    cat: product.category_name || "Sportswear",
    k: getGarmentKind(product),
    price: product.price,
    tag: product.is_featured ? "Featured" : undefined,
    moq: product.moq,
    cl: colors,
    image_url: product.image_url || "",
  };
}

const PATH = {
  tee: "M30 15 L42 12 Q50 22 58 12 L70 15 L90 34 L77 46 L68 38 L68 88 L32 88 L32 38 L23 46 L10 34 Z",
  hoodie:
    "M30 22 L42 14 Q50 26 58 14 L70 22 L93 56 L80 64 L72 52 L72 90 L28 90 L28 52 L20 64 L7 56 Z",
  jacket:
    "M30 22 L42 14 Q50 26 58 14 L70 22 L93 60 L81 67 L72 54 L72 90 L28 90 L28 54 L19 67 L7 60 Z",
  shorts: "M26 20 L74 20 L81 76 L56 76 L50 46 L44 76 L19 76 Z",
  pants: "M30 10 L70 10 L75 92 L56 92 L50 38 L44 92 L25 92 Z",
};

// SVG Garment Component
const GarmentSVG: React.FC<{ k: keyof typeof PATH; col: string; className?: string }> = ({
  k,
  col,
  className = "",
}) => {
  const isLight = col === C.white;
  const strokeCol = isLight ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.35)";
  const accentCol = col === C.red ? "#ffffff" : "#ff0000";

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: "drop-shadow(0 16px 18px rgba(0,0,0,.45))" }}
    >
      <path
        d={PATH[k]}
        fill={col}
        stroke={strokeCol}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {(k === "hoodie" || k === "jacket") && (
        <path d="M40 14Q50 32 60 14" fill="none" stroke={accentCol} strokeWidth="1.5" />
      )}
      {k === "jacket" && <path d="M50 26V90" stroke={accentCol} strokeWidth="1.6" />}
      {k === "hoodie" && (
        <rect
          x="38"
          y="64"
          width="24"
          height="13"
          rx="3"
          fill="rgba(0,0,0,.22)"
          stroke={accentCol}
          strokeWidth="0.6"
        />
      )}
      {k === "tee" && <path d="M36 44H64" stroke={accentCol} strokeWidth="1.8" />}
      {k === "shorts" && <path d="M26 28H74" stroke={accentCol} strokeWidth="1.8" />}
    </svg>
  );
};

const CHAPTERS = [
  [
    "01 / Fabric",
    "It starts with the cloth",
    "Combed cotton, heavyweight fleece and stretch-knit sourced for structure, breathability and a hand-feel built for athletes.",
  ],
  [
    "02 / Precision",
    "Every seam is counted",
    "Sialkot stitching floors build sportswear for the world's biggest names. Ours is cut, flat-locked and inspected piece by piece.",
  ],
  [
    "03 / Performance",
    "Then it has to move",
    "Sprint, lift, commute, repeat. Patterns are tested for full range of motion before they ever reach the rack.",
  ],
  [
    "04 / Direct",
    "And it reaches you",
    "Packed in Sialkot, confirmed directly on WhatsApp, and delivered fast to your doorstep across Pakistan and globally.",
  ],
];

const CUBE_FACES: [keyof typeof PATH, string, string][] = [
  ["hoodie", C.black, "rotateY(0deg)"],
  ["tee", C.red, "rotateY(90deg)"],
  ["jacket", C.white, "rotateY(180deg)"],
  ["pants", C.carbon, "rotateY(270deg)"],
  ["shorts", C.red, "rotateX(90deg)"],
  ["tee", C.black, "rotateX(-90deg)"],
];

const COLLECTIONS_PANELS = [
  [
    "Court & Track",
    "Light, fast, breathable gear engineered for high-output sessions.",
    "shorts",
    C.red,
    "linear-gradient(155deg, #ffffff 0%, #edf0f7 100%)",
    C.black,
  ],
  [
    "After Hours",
    "Heavyweight brushed fleece built for recovery and street presence.",
    "hoodie",
    C.red,
    "linear-gradient(155deg, #ffffff 0%, #edf0f7 100%)",
    C.black,
  ],
  [
    "Weather Layer",
    "Technical zip-ups that cut through wind and rain without bulk.",
    "jacket",
    C.red,
    "linear-gradient(155deg, #ffffff 0%, #edf0f7 100%)",
    C.black,
  ],
  [
    "Daily Basics",
    "Precision-cut tees you reach for every single day.",
    "tee",
    C.black,
    "linear-gradient(155deg, #ffffff 0%, #edf0f7 100%)",
    C.black,
  ],
];

const VIEWS = ["scale(1)", "scale(1.55) translateY(8%)", "scale(.85) rotate(-12deg)"];

export default function HomePage() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [rackProducts, setRackProducts] = useState<ProductItem[]>([]);
  const [shopProducts, setShopProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeViewIdx, setActiveViewIdx] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  // Scroll references
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);
  const heroEndRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chapRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRackProducts() {
      const [result, categoryResult] = await Promise.all([fetchProducts(), fetchCategories()]);
      setCategories(categoryResult.data);
      const featured = result.data.filter((product) => Boolean(product.is_featured));
      if (!cancelled && featured.length > 0) {
        setRackProducts(featured.slice(0, 8).map(toProductItem));
      } else if (!cancelled) {
        setRackProducts([]);
      }
      if (!cancelled) {
        setShopProducts(result.data.map(toProductItem));
      }
    }

    loadRackProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2400);
  };

  // Math interpolations
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lin = (p: number, xs: number[], ys: number[]) => {
    if (p <= xs[0]) return ys[0];
    for (let i = 1; i < xs.length; i++) {
      if (p <= xs[i]) {
        const t = (p - xs[i - 1]) / (xs[i] - xs[i - 1]);
        return ys[i - 1] + (ys[i] - ys[i - 1]) * t;
      }
    }
    return ys[ys.length - 1];
  };

  const getProg = (el: HTMLElement | null) => {
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const h = r.height - window.innerHeight;
    if (h <= 0) return 0;
    return clamp(-r.top / h);
  };

  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.substring(i, i + 2), 16));
  const mix = (xs: number[], cols: string[], p: number) => {
    const c = cols.map(rgb);
    return `rgb(${[0, 1, 2]
      .map((i) => Math.round(lin(p, xs, c.map((a) => a[i]))))
      .join(",")})`;
  };

  useEffect(() => {
    let animId: number;
    let smH = 0;
    let smS = 0;
    let smC = 0;

    const tick = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const bodyP = scrollY / docHeight;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${bodyP})`;
      }

      // Hero scroll calculations
      if (heroRef.current) {
        const heroP = getProg(heroRef.current);
        smH += (heroP - smH) * 0.055;
        const h = smH;

        if (ringRef.current) {
          const rotX = lin(h, [0, 0.5, 1], [-8, 12, -8]);
          const rotY = h * 240;
          const scale = lin(h, [0, 0.45, 1], [1, 0.8, 1.2]);
          ringRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
        }

        if (megaRef.current) {
          const megaScale = lin(h, [0, 0.6], [1, 2.2]);
          const megaOp = lin(h, [0, 0.55], [1, 0]);
          megaRef.current.style.transform = `scale(${megaScale})`;
          megaRef.current.style.opacity = `${megaOp}`;
        }

        if (heroSubRef.current) {
          heroSubRef.current.style.opacity = `${lin(h, [0, 0.15], [1, 0])}`;
        }

        if (heroEndRef.current) {
          const endOp = lin(h, [0.62, 0.85], [0, 1]);
          const endY = lin(h, [0.62, 0.85], [70, 0]);
          heroEndRef.current.style.opacity = `${endOp}`;
          heroEndRef.current.style.transform = `translateY(${endY}px)`;
        }
      }

      // Story scroll calculations (Smooth Dark -> Light showroom transition)
      if (storyRef.current) {
        const storyP = getProg(storyRef.current);
        smS += (storyP - smS) * 0.08;
        const s = smS;
        const n = CHAPTERS.length;

        storyRef.current.style.background = mix(
          [0, 0.35, 0.7, 1],
          ["#08080a", "#1b080d", "#dce0e8", "#eaebf2"],
          s
        );

        if (cubeRef.current) {
          const cX = lin(s, [0, 1], [-20, 30]);
          const cY = s * 300;
          cubeRef.current.style.transform = `rotateX(${cX}deg) rotateY(${cY}deg)`;
        }

        if (railRef.current) {
          railRef.current.style.height = `${s * 100}%`;
        }

        chapRefs.current.forEach((el, i) => {
          if (!el) return;
          const a = i / n;
          const b = (i + 1) / n;
          const xs = [a - 0.08, a, b - 0.08, b];
          const first = i === 0;
          const last = i === n - 1;

          const op = lin(s, xs, first ? [1, 1, 1, 0] : last ? [0, 1, 1, 1] : [0, 1, 1, 0]);
          const ty = lin(
            s,
            xs,
            first ? [0, 0, 0, -70] : last ? [70, 0, 0, 0] : [70, 0, 0, -70]
          );

          el.style.opacity = `${op}`;
          el.style.transform = `translateY(${ty}px)`;

          // Smoothly adapt text color from dark phase (white) to light phase (graphite)
          const h2 = el.querySelector("h2");
          const p = el.querySelector("p");
          if (h2) (h2 as HTMLElement).style.color = s < 0.45 ? "#ffffff" : "#08080a";
          if (p) (p as HTMLElement).style.color = s < 0.45 ? "rgba(255, 255, 255, 0.8)" : "rgba(15, 23, 42, 0.8)";
        });
      }

      // Collections horizontal track calculations
      if (colsRef.current && trackRef.current) {
        const colP = getProg(colsRef.current);
        smC += (colP - smC) * 0.06;
        const c = smC;
        trackRef.current.style.transform = `translateX(${-66 * c}%)`;

        const pgs = document.querySelectorAll<HTMLElement>(".pg-par");
        pgs.forEach((el) => {
          el.style.transform = `translateX(${-240 * c}px)`;
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const filteredProducts = (shopProducts.length > 0 ? shopProducts : []).filter((p) => {
    const matchCat = activeCategory === "All" || p.cat === activeCategory;
    const matchQuery =
      searchQuery.trim().length === 0 ||
      p.n.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 20}deg) rotateY(${x * 24}deg)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "";
  };

  const openProductModal = (p: ProductItem) => {
    setActiveProduct(p);
    setSelectedColorIdx(0);
    setSelectedSize("M");
    setActiveViewIdx(0);
    document.body.style.overflow = "hidden";
  };

  const closeProductModal = () => {
    setActiveProduct(null);
    document.body.style.overflow = "";
  };

  const handleAddBag = () => {
    if (!activeProduct) return;
    addToCart(
      {
        id: activeProduct.id,
        title: activeProduct.n,
        description: `Premium ${activeProduct.cat} apparel engineered in Sialkot.`,
        price: activeProduct.price,
        moq: activeProduct.moq || "MOQ: 20 Pcs",
        category_id: 1,
        image_url: activeProduct.image_url || "",
        stock: 50,
        created_at: new Date().toISOString(),
      },
      1,
      selectedSize,
      activeProduct.cl[selectedColorIdx][0]
    );

    showToast(`${activeProduct.n} added to bag!`);
    closeProductModal();
  };

  return (
    <>
      <Navbar />

      {/* ─── 1. HERO SECTION (STICKY 320vh WITH 3D CYLINDRICAL RACK) ─── */}
      <section className="hero-wrap" id="top" ref={heroRef}>
        <div className="sticky-stage flex flex-col items-center justify-center">
          <h1 className="mega-title" ref={megaRef}>
            DAN<i>FIT</i>
          </h1>

          <div className="stage-3d">
            <div className="ring-3d" ref={ringRef}>
              {rackProducts.map((p, i, rack) => (
                <div
                  key={p.id}
                  className="rc-card cursor-pointer"
                  style={{
                    transform: `rotateY(${i * (360 / rack.length)}deg) translateZ(var(--R))`,
                  }}
                  onClick={() => openProductModal(p)}
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.n}
                      className="w-[76%] h-[210px] object-contain rounded-xl"
                      loading="eager"
                    />
                  ) : (
                    <GarmentSVG k={p.k} col={p.cl[0][1]} />
                  )}
                  <span className="text-white font-bold">{p.n}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="absolute bottom-[6vh] left-0 right-0 text-center z-10 text-base text-slate-300 px-6 font-mono font-medium" ref={heroSubRef}>
            Performance clothing and sportswear, engineered in Sialkot. Scroll to rotate the rack.
          </p>

          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-7 text-center bg-[radial-gradient(circle,rgba(8,8,10,0.92)_0%,transparent_75%)] pointer-events-none opacity-0"
            ref={heroEndRef}
          >
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase text-white tracking-tight">
              Built to move,
              <br />
              <span className="text-red-600">made to dominate.</span>
            </h2>
            <a href="#shop" className="btn-red pointer-events-auto">
              Shop the drop
            </a>
          </div>
        </div>
      </section>

      {/* ─── 2. RED MARQUEE ─── */}
      <div className="mq">
        <div>
          {"Tees · Hoodies · Track Pants · Jackets · Shorts · Engineered in Sialkot · ".repeat(6)}
        </div>
      </div>

      {/* ─── 3. STORY SECTION (STICKY 520vh WITH 3D INTERACTIVE CUBE) ─── */}
      <section className="story-wrap" id="story" ref={storyRef}>
        <div className="sticky-stage story-grid">
          <div className="chap-wrap">
            {CHAPTERS.map((c, i) => (
              <div
                key={i}
                className="chap-item"
                ref={(el) => {
                  chapRefs.current[i] = el;
                }}
              >
                <span className="step">{c[0]}</span>
                <h2 className="text-white font-black">{c[1]}</h2>
                <p>{c[2]}</p>
              </div>
            ))}
          </div>

          <div className="cube-stage">
            <div className="cube-3d" ref={cubeRef}>
              {rackProducts.slice(0, 6).map((product, idx) => ({
                transform: CUBE_FACES[idx]?.[2] || CUBE_FACES[0][2],
                product,
              })).map((item) =>
                (
                  <div
                    key={item.product.id}
                    className="cube-face cursor-pointer"
                    style={{ transform: `${item.transform} translateZ(var(--H))` }}
                    onClick={() => openProductModal(item.product as ProductItem)}
                  >
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.n}
                        className="w-[72%] h-[72%] object-contain"
                      />
                    ) : (
                      <GarmentSVG k={item.product.k} col={item.product.cl[0][1]} />
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rail-track">
            <i ref={railRef} />
          </div>
        </div>
      </section>

      {/* ─── 3.5 SHOWROOM & B2B MANUFACTURING CAPABILITIES ─── */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-14 bg-[#dfe2ea] text-slate-900 border-y border-slate-300/80 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-600 text-xs font-mono font-bold tracking-widest uppercase mb-4">
                ★ Sialkot OEM / ODM Facilities
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-slate-950 leading-none">
                Your Custom <span className="text-red-600">Sportswear</span>
                <br />
                Manufacturer &amp; Exporter
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-slate-600 text-base font-normal leading-relaxed mb-4">
                From concept to global markets. We engineer high-performance athletic apparel for global brands, gyms, and sports clubs with zero compromise on quality.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider text-red-600">
                <span>Manufacturer</span>
                <span className="text-slate-400">•</span>
                <span>Exporter</span>
                <span className="text-slate-400">•</span>
                <span>B2B Solutions</span>
              </div>
            </div>
          </div>

          {/* 5 Core Pillars from Official Showroom Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 sm:mb-16">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                ),
                title: "Custom Design",
                desc: "Tech-packs, 3D CAD mockups, custom labels & tags tailored to your exact brand aesthetics.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                ),
                title: "Premium Materials",
                desc: "180-420 GSM combed cotton, 4-way stretch DryFit, heavyweight French terry and technical fleeces.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                  </svg>
                ),
                title: "Sample Development",
                desc: "Rapid prototype sampling in 5-7 business days so you test fabric, fit, and finish before bulk.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                ),
                title: "OEM / ODM Production",
                desc: "High-capacity automated cutting, Japanese multi-head embroidery, and flatlock stitch assembly lines.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
                title: "Worldwide Shipping",
                desc: "Doorstep delivery across USA, UK, Europe, Middle East & Pakistan via DHL Express & Air Cargo.",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gradient-to-br from-white to-[#f4f5fa] border border-slate-300/90 hover:border-red-600/60 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 text-red-600 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-black uppercase text-slate-950 mb-2 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Showroom Stage Banner with Holographic Brand Overlays */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-300/80 bg-black shadow-xl">
            <img
              src="/images/hero-showroom.jpg"
              alt="DanFit Industry Showroom & Production Facilities"
              className="block w-full max-w-full h-auto min-h-[220px] sm:min-h-0 object-cover max-h-[360px] sm:max-h-[640px] opacity-95 transition-transform duration-700 hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-500/30">
                    Wear Your Vision Worldwide
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black uppercase text-white mt-3">
                    Quality Builds <span className="text-red-600">Brands</span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${WA}?text=Hi%20DanFit%20Industry,%20I%20want%20to%20inquire%20about%20Custom%20Sportswear%20Manufacturing%20for%20my%20brand.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-red text-xs sm:text-sm px-6 py-3"
                  >
                    Start Custom Order on WhatsApp
                  </a>
                  <Link
                    href="/custom-manufacturing"
                    className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-black transition duration-300 flex items-center"
                  >
                    Explore OEM Specs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. SHOP DROP SECTION (3D TILT CARDS & FILTERS) ─── */}
      <section className="shop-section" id="shop">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-5 mb-10">
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase text-slate-950">
              The current <span className="text-red-600">drop</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 justify-between items-center mb-10">
            <div className="flex gap-2.5 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
              {["All", ...categories.map((category) => category.name)].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`border-2 rounded-full px-5 py-2.5 font-bold text-xs uppercase tracking-wider transition ${
                    activeCategory === c
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/30"
                      : "border-slate-300 bg-white/70 text-slate-800 hover:border-red-600 hover:text-red-600 hover:bg-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search tees, hoodies, jackets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 border-slate-300 bg-white/90 text-slate-900 rounded-full px-6 py-3 font-medium text-sm min-w-[min(100%,320px)] focus:outline-none focus:border-red-600 shadow-sm"
              aria-label="Search products"
            />
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-12 text-center text-lg text-slate-500 font-mono">
              Nothing matches that search. Try another keyword or select All.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
              {filteredProducts.map((p) => (
                <div key={p.id} className="transition-all duration-500">
                  <button
                    className="product-tilt-card"
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    onClick={() => openProductModal(p)}
                    aria-label={`Open ${p.n}`}
                  >
                    <div
                      className="aspect-[4/5] rounded-[18px] grid place-items-center relative overflow-hidden group"
                      style={{
                        background: `radial-gradient(circle at 50% 35%, #2b0000, ${C.black} 85%)`,
                      }}
                    >
                      <div className="w-[72%] transition-transform duration-500 group-hover:scale-105">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.n}
                            className="w-full h-[270px] object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <GarmentSVG k={p.k} col={p.cl[0][1]} />
                        )}
                      </div>
                      {p.tag && (
                        <span className="absolute top-3.5 left-3.5 bg-red-600 text-white font-bold text-[11px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                          {p.tag}
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg border border-white/20">
                        {p.moq || "MOQ: 20 Pcs"}
                      </span>
                    </div>

                    <div className="p-4 pt-3">
                      <h3 className="text-lg font-bold mb-2 text-slate-900">{p.n}</h3>
                      <div className="flex justify-end items-center font-bold text-slate-800 text-sm font-mono">
                        <div className="flex">
                          {p.cl.map((c, idx) => (
                            <i
                              key={idx}
                              style={{ background: c[1] }}
                              className="w-4 h-4 rounded-full border-2 border-white -ml-1.5 outline outline-1 outline-black/20"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. COLLECTIONS SECTION (STICKY 380vh HORIZONTAL SLIDE TRACK) ─── */}
      <section className="cols-track-wrap" id="collections" ref={colsRef}>
        <div className="sticky-stage cols-sticky">
          <div className="horizontal-track" ref={trackRef}>
            <div className="w-[44vw] text-slate-950">
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight">
                Four ways to wear <span className="text-red-600">DanFit</span>
              </h2>
            </div>

            {COLLECTIONS_PANELS.map((c, idx) => (
              <div
                key={idx}
                className="col-panel"
                style={{ background: c[4], color: c[5] }}
              >
                <div className="pg-par absolute right-[5%] top-[8%] w-[52%] transition-transform duration-300">
                  <GarmentSVG k={c[2] as keyof typeof PATH} col={c[3]} />
                </div>
                <h3 className="font-black text-slate-950">{c[0]}</h3>
                <p className="font-medium text-slate-600">{c[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. CONTACT & FOOTER ─── */}
      <footer className="bg-[#08080a] text-white pt-12 pb-5 px-4 sm:px-6 lg:px-14 border-t-2 border-red-600 overflow-hidden" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
            <div>
              <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-3">
                DanFit Industry
              </h4>
              <p className="text-base text-slate-300 leading-relaxed">
                Sialkot, Punjab, Pakistan
                <br />
                The Global Capital of Sports Apparel
              </p>
            </div>

            <div>
              <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-3">
                Phone / WhatsApp
              </h4>
              <p className="text-base text-slate-300">
                <a
                  href={`https://wa.me/${WA}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-red-500 border-b border-white/30 pb-0.5 transition"
                >
                  +92 328 5850057
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-3">
                Email
              </h4>
              <p className="text-base text-slate-300">
                <a
                  href="mailto:info@danfitindustry.com"
                  className="hover:text-red-500 border-b border-white/30 pb-0.5 transition"
                >
                  info@danfitindustry.com
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-xs text-red-600 uppercase tracking-widest font-mono font-bold mb-3">
                Socials
              </h4>
              <p className="text-base text-slate-300 space-y-1">
                <a
                  href="https://facebook.com/danfitindustry"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-red-500 block border-b border-white/20 pb-0.5 transition"
                >
                  Facebook: DanFit Industry
                </a>
                <a
                  href="https://instagram.com/danfit_industry"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-red-500 block border-b border-white/20 pb-0.5 transition"
                >
                  Instagram: @danfit_industry
                </a>
              </p>
            </div>
          </div>

          {/* Giant Outline Text */}
          <div className="giant-outline">DANFIT</div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-slate-400 font-mono">
            <p>© {new Date().getFullYear()} DanFit Industry · danfitindustry.com</p>
            <div className="flex gap-4">
              <Link href="/custom-manufacturing" className="hover:text-white transition">
                OEM Manufacturing
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── 7. QUICK VIEW / PRODUCT MODAL (3D VIEW SWITCHER + COLOR CHANGER) ─── */}
      <div
        className={`modal-overlay ${activeProduct ? "show open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeProductModal();
        }}
        role="dialog"
        aria-modal="true"
      >
        {activeProduct && (
          <div className="modal-dialog">
            <div>
              <div
                className="aspect-square rounded-[20px] grid place-items-center overflow-hidden"
                style={{
                  background: `radial-gradient(circle at 50% 40%, #330000, ${C.black} 88%)`,
                }}
              >
                <div
                  className="w-[min(62vw,340px)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                  style={{ transform: VIEWS[activeViewIdx] }}
                >
                  {activeProduct.image_url ? (
                    <img
                      src={activeProduct.image_url}
                      alt={activeProduct.n}
                      className="w-full max-h-[340px] object-contain"
                    />
                  ) : (
                    <GarmentSVG
                      k={activeProduct.k}
                      col={activeProduct.cl[selectedColorIdx][1]}
                    />
                  )}
                </div>
              </div>

              {/* Angle / Zoom Thumbs */}
              <div className="flex gap-2.5 mt-3">
                {VIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveViewIdx(i)}
                    className={`w-[76px] h-[76px] rounded-[14px] border-2 bg-black overflow-hidden grid place-items-center transition ${
                      activeViewIdx === i ? "border-red-600 scale-105" : "border-transparent opacity-70"
                    }`}
                    aria-label={`View ${i + 1}`}
                  >
                    <div style={{ transform: `scale(${[1, 1.5, 0.85][i]})` }}>
                      <GarmentSVG
                        k={activeProduct.k}
                        col={activeProduct.cl[selectedColorIdx][1]}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative p-2 flex flex-col justify-between">
              <button
                onClick={closeProductModal}
                className="absolute right-0 top-0 border border-black/20 rounded-full px-3.5 py-1 text-xs font-bold text-black hover:bg-red-600 hover:border-red-600 hover:text-white transition"
              >
                Close
              </button>

              <div className="space-y-3">
                <p className="text-red-600 font-bold uppercase text-xs tracking-wider">
                  {activeProduct.cat} • {activeProduct.moq || "MOQ: 20 Pcs"}
                </p>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase">
                  {activeProduct.n}
                </h3>
                {/* Colorway Swatches */}
                <div>
                  <p className="font-bold text-xs uppercase text-slate-700 mb-2">
                    Colour: <strong className="text-black">{activeProduct.cl[selectedColorIdx][0]}</strong>
                  </p>
                  <div className="flex gap-2.5">
                    {activeProduct.cl.map((x, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColorIdx(i)}
                        style={{ background: x[1] }}
                        className={`w-9 h-9 rounded-full border-2 border-white transition shadow-sm ${
                          selectedColorIdx === i ? "outline outline-2 outline-red-600 scale-110" : "outline outline-1 outline-black/20"
                        }`}
                        aria-label={x[0]}
                        title={x[0]}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div>
                  <p className="font-bold text-xs uppercase text-slate-700 mb-2">
                    Size: <strong className="text-black">{selectedSize}</strong>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[48px] py-2 px-3 rounded-xl border-2 font-bold text-xs font-mono transition ${
                          selectedSize === sz
                            ? "bg-red-600 border-red-600 text-white"
                            : "border-black bg-transparent text-black hover:border-red-600 hover:text-red-600"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-6">
                <button
                  onClick={handleAddBag}
                  className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition"
                >
                  Add to bag
                </button>

                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(
                    `Hi DanFit Industry! I'd like to order ${activeProduct.n} (${activeProduct.cl[selectedColorIdx][0]}, size ${selectedSize}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-full border-2 border-black text-black hover:bg-black hover:text-white font-black text-xs uppercase tracking-wider block text-center transition"
                >
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Spec Drawer */}
      <CartDrawer />

      {/* Floating Toast Notification */}
      <div className={`toast-pill ${toastMessage ? "show" : ""}`}>
        {toastMessage}
      </div>
    </>
  );
}
