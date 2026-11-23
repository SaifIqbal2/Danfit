"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  generateWhatsAppOrderUrl: (customer: { name: string; address: string; phone?: string; notes?: string }) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "danfit_shopping_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to storage:", e);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedSize: string = product.sizes?.[0] || "M",
    selectedColor: string = product.colors?.[0]?.name || "Standard"
  ) => {
    const compositeId = `${product.id}-${selectedSize}-${selectedColor}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === compositeId);
      if (existing) {
        return prev.map((item) =>
          item.id === compositeId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: compositeId,
          product,
          quantity,
          selectedSize,
          selectedColor,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const generateWhatsAppOrderUrl = (customer: {
    name: string;
    address: string;
    phone?: string;
    notes?: string;
  }) => {
    const phone = "923285850057"; // DanFit Industry WhatsApp Number
    let message = `*NEW ORDER INQUIRY - DANFIT INDUSTRY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Customer:* ${customer.name}\n`;
    message += `*Delivery Address:* ${customer.address}\n`;
    if (customer.phone) message += `*Contact:* ${customer.phone}\n`;
    if (customer.notes) message += `*Instructions:* ${customer.notes}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*ORDER ITEMS:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.title}*\n`;
      message += `   Size: ${item.selectedSize} | Color: ${item.selectedColor}\n`;
      message += `   Qty: ${item.quantity}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Origin:* danfitindustry.com Storefront\n`;
    message += `Please confirm availability and dispatch timeframe.`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
