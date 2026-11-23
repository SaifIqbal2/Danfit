"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, FolderTree, AlertCircle, CheckCircle, RefreshCw, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Category, Product } from "@/types";
import {
  fetchCategories,
  fetchProducts,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/supabase";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data: cats } = await fetchCategories();
    setCategories(cats);
    const { data: prods } = await fetchProducts();
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImageUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormImageUrl(cat.image_url || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingCategory) {
      const { data, error } = await updateCategory(editingCategory.id, {
        name: formName,
        slug: formSlug,
        description: formDescription,
        image_url: formImageUrl,
      });

      if (!error) {
        setStatusMessage({ text: "Category updated successfully.", type: "success" });
        setIsModalOpen(false);
        await loadData();
      } else {
        setStatusMessage({ text: `Update error: ${error}`, type: "error" });
      }
    } else {
      const { data, error } = await createCategory({
        name: formName,
        slug: formSlug,
        description: formDescription,
        image_url: formImageUrl,
      });

      if (!error) {
        setStatusMessage({ text: "New category created successfully.", type: "success" });
        setIsModalOpen(false);
        await loadData();
      } else {
        setStatusMessage({ text: `Creation error: ${error}`, type: "error" });
      }
    }

    setIsSubmitting(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    const { error } = await deleteCategory(id);
    if (!error) {
      setStatusMessage({ text: "Category deleted from database.", type: "success" });
      setDeleteConfirmationId(null);
      await loadData();
    } else {
      setStatusMessage({ text: `Delete error: ${error}`, type: "error" });
    }
    setIsSubmitting(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl font-['DM_Sans',sans-serif]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-red-600" />
              <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight font-['Bricolage_Grotesque',sans-serif]">
                Categories Management (CRUD)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Create, modify, and delete website categories.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-mono ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Categories Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
              <span className="text-xs font-mono">Loading categories...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase bg-slate-50">
                    <th className="py-3 px-4 font-medium">ID</th>
                    <th className="py-3 px-4 font-medium">Category Name</th>
                    <th className="py-3 px-4 font-medium">Slug</th>
                    <th className="py-3 px-4 font-medium">Products Count</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category_id === cat.id).length;

                    return (
                      <tr key={cat.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4 text-slate-400">#{cat.id}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {cat.image_url && (
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <Image
                                  src={cat.image_url}
                                  alt={cat.name}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <span className="font-sans font-bold text-slate-900 text-sm block">
                                {cat.name}
                              </span>
                              {cat.description && (
                                <span className="text-[10px] text-slate-400 font-sans line-clamp-1">
                                  {cat.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          <code>{cat.slug}</code>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                            {count} products
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(cat)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition"
                              title="Edit Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {deleteConfirmationId === cat.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleDelete(cat.id)}
                                  disabled={isSubmitting}
                                  className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmationId(null)}
                                  className="px-2 py-1 rounded bg-slate-200 text-slate-800 text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmationId(cat.id)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Add / Edit Category */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-slate-950 uppercase font-['Bricolage_Grotesque',sans-serif]">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Combat &amp; MMA Wear"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingCategory) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Slug (Unique URL identifier)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. combat-mma-wear"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of this apparel division..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-red-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono uppercase font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase font-bold transition shadow-lg shadow-red-600/30"
                  >
                    {isSubmitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
