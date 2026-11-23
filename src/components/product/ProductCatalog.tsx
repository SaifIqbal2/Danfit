"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Layers, Factory, PhoneCall, ShoppingBag, Eye, Star } from "lucide-react";
import { Category, Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/context/CartContext";

const WA = "923285850057";

interface ProductCatalogProps {
  initialProducts: Product[];
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  title?: string;
  subtitle?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialProducts,
  categories,
  selectedCategoryId,
  onSelectCategory,
  title = "High-Performance Sportswear & MOQs",
  subtitle = "DanFit Industry Engineering Catalog • Factory Direct Production Tiers",
}) => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "newest">("featured");
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [modalSize, setModalSize] = useState("M");
  const [modalQuantity, setModalQuantity] = useState(20);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        if (selectedCategoryId !== null && p.category_id !== selectedCategoryId) {
          return false;
        }
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSku = p.sku ? p.sku.toLowerCase().includes(q) : false;
          const matchMoq = p.moq ? p.moq.toLowerCase().includes(q) : false;
          const matchCat = p.category_name ? p.category_name.toLowerCase().includes(q) : false;
          return matchTitle || matchDesc || matchSku || matchMoq || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id - a.id;
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [initialProducts, selectedCategoryId, searchQuery, sortBy]);

  const handleOpenModal = (prod: Product) => {
    setActiveModalProduct(prod);
    setModalSize(prod.sizes?.[0] || "M");
    setModalQuantity(20);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setActiveModalProduct(null);
    document.body.style.overflow = "";
  };

  const handleModalAddBag = () => {
    if (!activeModalProduct) return;
    addToCart(activeModalProduct, modalQuantity, modalSize, activeModalProduct.colors?.[0]?.name || "Standard");
    handleCloseModal();
  };

  return (
    <section id="products" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-['DM_Sans',sans-serif]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold block mb-1">
            {subtitle}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 uppercase tracking-tight font-['Bricolage_Grotesque',sans-serif]">
            {title}
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search garments, MOQ, SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-red-600 transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar & Category Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition font-bold ${
              selectedCategoryId === null
                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                : "bg-white text-slate-800 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Lines ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition font-bold ${
                selectedCategoryId === cat.id
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-white text-slate-800 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
          <span className="text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "newest")}
            className="bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-600 cursor-pointer font-bold shadow-sm"
          >
            <option value="featured">Featured Production</option>
            <option value="newest">Latest Sialkot Drops</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950 font-['Bricolage_Grotesque',sans-serif]">
              No styles matched your criteria
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, or clear the category filters to browse our full factory catalog.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              onSelectCategory(null);
            }}
            className="px-5 py-2.5 rounded-full bg-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md shadow-red-600/30"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleOpenModal}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-red-600 hover:text-white text-slate-900 border border-slate-200 transition shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Image Showcase */}
            <div className="relative aspect-square md:aspect-auto bg-slate-100 p-6 flex items-center justify-center">
              {activeModalProduct.image_url ? (
                <Image
                  src={activeModalProduct.image_url}
                  alt={activeModalProduct.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              ) : (
                <div className="text-xl font-black font-['Bricolage_Grotesque',sans-serif] text-red-600">
                  DANFIT
                </div>
              )}
              <span className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-xs font-mono text-slate-900 border border-slate-200 shadow-sm font-bold">
                {activeModalProduct.moq || "MOQ: 20 Pcs"}
              </span>
            </div>

            {/* Right Spec & Action Sheet */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono text-red-600 font-bold uppercase tracking-widest block mb-1">
                  Sialkot Factory Spec
                </span>
                <h3 className="text-2xl font-black text-slate-950 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
                  {activeModalProduct.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeModalProduct.description}
                </p>

                {/* Available Sizes */}
                {activeModalProduct.sizes && activeModalProduct.sizes.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-mono text-slate-700 block mb-2 font-bold uppercase">
                      Select Size:
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {activeModalProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setModalSize(s)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                            modalSize === s
                              ? "bg-red-600 text-white"
                              : "bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-4">
                  <span className="text-xs font-mono text-slate-700 block mb-2 font-bold uppercase">
                    Inquiry Units:
                  </span>
                  <div className="flex items-center gap-3">
                    {[20, 50, 100, 250].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setModalQuantity(qty)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                          modalQuantity === qty
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {qty} pcs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={handleModalAddBag}
                  className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {modalQuantity} Units to Spec Sheet</span>
                </button>

                <a
                  href={`https://wa.me/${WA}?text=Hi%20DanFit%20Industry,%20I%20am%20inquiring%20about%20${encodeURIComponent(activeModalProduct.title)}%20(Qty:%20${modalQuantity},%20Size:%20${modalSize})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                  <span>Direct Quote on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
