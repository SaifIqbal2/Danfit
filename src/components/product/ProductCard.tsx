"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye, Star, Factory } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [isAdded, setIsAdded] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 14}deg) rotateY(${x * 16}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 20, selectedSize, product.colors?.[0]?.name || "Standard");
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-red-600/70 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-2xl"
    >
      <div>
        {/* Thumbnail & Badges */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-400">
                DF ATHLETICS
              </div>
            )}
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.is_featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider font-mono shadow-sm">
                Featured Spec
              </span>
            )}
            {product.category_name && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-mono font-bold border border-slate-200 shadow-sm">
                {product.category_name}
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <button
            onClick={handleOpenQuickView}
            className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/95 hover:bg-red-600 hover:text-white text-slate-900 backdrop-blur-md border border-slate-200 transition flex items-center gap-1.5 text-xs shadow-md"
            title="Quick Spec View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase font-black pr-0.5">Quick View</span>
          </button>

          {/* MOQ Tag on Bottom of Image */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[11px] font-mono text-slate-900 border border-slate-200 flex items-center gap-1.5 font-bold shadow-md">
              <Factory className="w-3 h-3 text-red-600" />
              <span>{product.moq || "MOQ: 20 Pcs"}</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-2.5">
          {/* Rating & SKU */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 text-red-600">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-mono font-bold text-slate-900">{product.rating || "5.0"}</span>
              <span className="text-slate-400 text-[10px]">({product.reviews_count || 12})</span>
            </div>
            {product.sku && <span className="font-mono text-[10px] text-slate-400 font-medium">{product.sku}</span>}
          </div>

          <Link href={`/product/${product.id}`} className="block group-hover:text-red-600 transition">
            <h3 className="text-base font-bold text-slate-950 line-clamp-1 font-['Bricolage_Grotesque',sans-serif]">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans font-normal">
            {product.description}
          </p>

          {/* Available Sizes Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="pt-2 flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Size:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.sizes.slice(0, 5).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition font-bold ${selectedSize === size
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing / MOQ Action Footer */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-3 pt-3 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          Request a custom quote
        </span>

        <button
          onClick={handleQuickAdd}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition ${isAdded
            ? "bg-red-600 text-white"
            : "bg-slate-900 hover:bg-red-600 text-white shadow-sm"
            }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isAdded ? "Added!" : "Add MOQ"}</span>
        </button>
      </div>
    </div>
  );
};
