"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, FileText, PhoneCall, CheckCircle, Sparkles, Factory, Layers } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "@/context/CartContext";
import { createInquiry } from "@/lib/supabase";

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "whatsapp_form" | "confirmed">("cart");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    company: "",
    address: "",
    phone: "",
    email: "",
    notes: "",
  });

  if (!isCartOpen) return null;

  const handleLaunchWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.address) {
      alert("Please provide your name/company and target delivery destination.");
      return;
    }

    const phone = "923285850057"; // DanFit Industry WhatsApp
    let message = `*DANFIT INDUSTRY - B2B INQUIRY & SPEC SHEET*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Client / Brand:* ${customerInfo.name} ${customerInfo.company ? `(${customerInfo.company})` : ""}\n`;
    message += `*Email:* ${customerInfo.email}\n`;
    message += `*Destination / Country:* ${customerInfo.address}\n`;
    if (customerInfo.phone) message += `*Phone:* ${customerInfo.phone}\n`;
    if (customerInfo.notes) message += `*Custom Branding / Notes:* ${customerInfo.notes}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*REQUESTED APPAREL ITEMS:*\n\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.title}*\n`;
      message += `   SKU: ${item.product.sku || `DF-${item.product.id}`}\n`;
      message += `   Requested Qty: ${item.quantity} units\n`;
      message += `   MOQ Baseline: ${item.product.moq || "20 Pcs"}\n`;
      message += `   Size: ${item.selectedSize} | Color: ${item.selectedColor}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `Please confirm unit quotation, sample timeline, and DHL Express shipping rates from Sialkot factory.`;

    await createInquiry({
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      subject: "B2B Spec Sheet Inquiry",
      product_name: cartItems.map((item) => item.product.title).join(", "),
      message: `${customerInfo.company ? `Company: ${customerInfo.company}\n` : ""}Destination: ${customerInfo.address}\n${customerInfo.notes ? `Notes: ${customerInfo.notes}\n` : ""}${cartItems.map((item) => `${item.product.title} — Size: ${item.selectedSize}, Color: ${item.selectedColor}, Qty: ${item.quantity}`).join("\n")}`,
      source: "cart",
    });

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank");

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#b80000", "#ffffff"],
    });

    setCheckoutStep("confirmed");
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      if (checkoutStep === "confirmed") {
        clearCart();
        setCheckoutStep("cart");
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e12] border-l border-white/10 text-white flex flex-col shadow-2xl relative">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#141418]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-tight text-white font-['Bricolage_Grotesque',sans-serif]">
                  Inquiry Spec Sheet ({cartCount})
                </h2>
                <span className="text-[11px] font-mono text-white/50 block">
                  B2B Wholesale &amp; Custom Manufacturing
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sialkot OEM Advisory Notice */}
          <div className="px-6 py-2.5 bg-red-950/40 border-b border-red-900/40 flex items-center justify-between text-xs font-mono text-red-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Factory className="w-3.5 h-3.5 text-red-500" />
              <span>Factory Direct Quotations • Low MOQs</span>
            </span>
            <span className="text-white/60 font-semibold">Sialkot, PK</span>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutStep === "cart" && (
              <>
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                      <Layers className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white font-['Bricolage_Grotesque',sans-serif]">
                        Spec sheet is currently empty
                      </p>
                      <p className="text-xs text-white/50 mt-1 max-w-xs leading-relaxed font-sans">
                        Browse our sportswear collections, select styles, sizes and quantities to receive factory-direct wholesale pricing.
                      </p>
                    </div>
                    <Link
                      href="/products"
                      onClick={handleClose}
                      className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-red-600/30 inline-block font-mono"
                    >
                      Browse Products &amp; MOQs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-2xl bg-[#141418] border border-white/10 items-center hover:border-red-600/40 transition"
                      >
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.title}
                              fill
                              sizes="64px"
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-white/40">
                              DF
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate font-['Bricolage_Grotesque',sans-serif]">
                            {item.product.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-white/60 mt-1">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {item.selectedSize}
                            </span>
                            <span className="text-white/30">•</span>
                            <span className="truncate">{item.selectedColor}</span>
                          </div>
                          <span className="text-[10px] text-red-400 font-mono block mt-1">
                            {item.product.moq || "MOQ: 20 Pcs"}
                          </span>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 5))}
                                className="p-1 hover:text-red-500 text-white/60"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono font-bold px-2 text-white">
                                {item.quantity} pcs
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 5)}
                                className="p-1 hover:text-red-500 text-white/60"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/40 hover:text-red-500 transition p-1.5"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {checkoutStep === "whatsapp_form" && (
              <form onSubmit={handleLaunchWhatsAppOrder} className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-1">
                  <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block">
                    Export Dispatch Details
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Provide destination and company details so our Sialkot export desk generates your official proforma quotation with DHL/FedEx freight.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/80 uppercase mb-1.5">
                    Your Name / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/80 uppercase mb-1.5">
                    Brand / Gym / Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Combat Athletics"
                    value={customerInfo.company}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/80 uppercase mb-1.5">
                    Delivery City &amp; Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Houston TX, USA / London, UK"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/80 uppercase mb-1.5">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555 234 5678"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/80 uppercase mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-white/80 uppercase mb-1.5">
                    Custom Branding Specs / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need 3D silicone logo on chest, custom woven tags, custom packaging."
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="w-1/3 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Send to WhatsApp</span>
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === "confirmed" && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black uppercase text-white font-['Bricolage_Grotesque',sans-serif]">
                  Inquiry Dispatched!
                </h3>
                <p className="text-xs text-white/60 max-w-xs leading-relaxed font-sans">
                  Your spec sheet has been formatted and opened on WhatsApp. Our Sialkot export representative will reply shortly with unit quotes and lead times.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  Close Spec Sheet
                </button>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          {checkoutStep === "cart" && cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#141418] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/60">Total Line Items:</span>
                <span className="font-bold text-white">{cartCount} spec items</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/60">Quotation Model:</span>
                <span className="font-bold text-red-500">Factory Wholesale (Low MOQ)</span>
              </div>
              <button
                onClick={() => setCheckoutStep("whatsapp_form")}
                className="w-full py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <span>Proceed to WhatsApp Quotation</span>
                <PhoneCall className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
