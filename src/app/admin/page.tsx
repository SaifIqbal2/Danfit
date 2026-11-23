"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FolderTree,
  Boxes,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fetchCategories, fetchProducts, getStoreMetrics } from "@/lib/supabase";
import { Category, Product, StoreMetrics } from "@/types";

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<StoreMetrics>({
    totalProducts: 0,
    totalCategories: 0,
    totalInventoryUnits: 0,
    totalInventoryValue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadData() {
      const m = await getStoreMetrics();
      setMetrics(m);

      const { data: prods } = await fetchProducts();
      setRecentProducts(prods.slice(0, 5));

      const { data: cats } = await fetchCategories();
      setCategories(cats);
    }
    loadData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl font-['DM_Sans',sans-serif]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight font-['Bricolage_Grotesque',sans-serif]">
              Store Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              DanFit Industry • E-Commerce Administration
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/categories"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-xs font-mono text-slate-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <FolderTree className="w-3.5 h-3.5 text-red-600" />
              <span>Manage Categories</span>
            </Link>

            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-mono uppercase tracking-wider">Active Products</span>
              <Package className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-3xl font-black font-mono text-slate-950">{metrics.totalProducts}</p>
            <p className="text-[11px] text-slate-400 font-mono">Live in catalog</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-mono uppercase tracking-wider">Categories</span>
              <FolderTree className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-3xl font-black font-mono text-slate-950">{metrics.totalCategories}</p>
            <p className="text-[11px] text-slate-400 font-mono">Sportswear divisions</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-mono uppercase tracking-wider">Inventory Stock</span>
              <Boxes className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-3xl font-black font-mono text-slate-950">{metrics.totalInventoryUnits}</p>
            <p className="text-[11px] text-slate-400 font-mono">Total physical units</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-mono uppercase tracking-wider">Low MOQ Ready</span>
              <Boxes className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black font-mono text-red-600">{metrics.totalProducts}</p>
            <p className="text-[11px] text-slate-400 font-mono">Inquiry-ready styles</p>
          </div>
        </div>

        {/* Recent Products Snapshot */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider font-['Bricolage_Grotesque',sans-serif]">
                Catalog Inventory
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Recent products managed in database
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-mono text-red-600 hover:text-red-700 flex items-center gap-1 font-bold"
            >
              <span>View &amp; Edit All ({metrics.totalProducts})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.title} fill sizes="36px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">DF</div>
                        )}
                      </div>
                      <span className="font-sans font-medium text-slate-900 truncate max-w-xs">
                        {p.title}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {p.category_name || `Division #${p.category_id}`}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          p.stock > 10
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/products?edit=${p.id}`}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition font-bold"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
