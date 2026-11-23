"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Plus, Edit, Trash2, Package, AlertCircle, CheckCircle, RefreshCw, X, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Category, Product } from "@/types";
import {
  fetchCategories,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "@/lib/supabase";

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const editParamId = searchParams.get("edit");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "all">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMoq, setFormMoq] = useState("MOQ: 20 Pcs");
  const [formLeadTime, setFormLeadTime] = useState("7-12 Days");
  const [formCategoryId, setFormCategoryId] = useState<number | "">("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formSizes, setFormSizes] = useState("S, M, L, XL, XXL");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data: prods } = await fetchProducts();
    setProducts(prods);
    const { data: cats } = await fetchCategories();
    setCategories(cats);
    setLoading(false);

    if (editParamId) {
      const target = prods.find((p) => p.id === Number(editParamId));
      if (target) {
        openEditModal(target);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [editParamId]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle("");
    setFormDescription("");
    setFormMoq("MOQ: 20 Pcs");
    setFormLeadTime("7-12 Days");
    setFormCategoryId(categories[0]?.id || "");
    setFormImageUrl("https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop");
    setFormStock("100");
    setFormSizes("S, M, L, XL, XXL");
    setFormIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormDescription(p.description || "");
    setFormMoq(p.moq || "MOQ: 20 Pcs");
    setFormLeadTime(p.lead_time || "7-12 Days");
    setFormCategoryId(p.category_id || "");
    setFormImageUrl(p.image_url || "");
    setFormStock(String(p.stock || 50));
    setFormSizes(p.sizes ? p.sizes.join(", ") : "S, M, L, XL, XXL");
    setFormIsFeatured(Boolean(p.is_featured));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sizesArr = formSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle,
      description: formDescription,
      price: 0,
      category_id: formCategoryId === "" ? null : Number(formCategoryId),
      image_url: formImageUrl,
      stock: Number(formStock) || 0,
      moq: formMoq,
      lead_time: formLeadTime,
      sizes: sizesArr,
      is_featured: formIsFeatured,
    };

    if (editingProduct) {
      const { data, error } = await updateProduct(editingProduct.id, payload);
      if (!error) {
        setStatusMessage({ text: "Product specs updated in database.", type: "success" });
        setIsModalOpen(false);
        await loadData();
      } else {
        setStatusMessage({ text: `Update error: ${error}`, type: "error" });
      }
    } else {
      const { data, error } = await createProduct(payload);
      if (!error) {
        setStatusMessage({ text: "New garment style created in database.", type: "success" });
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
    const result = await deleteProduct(id);
    if (result.success) {
      setStatusMessage({ text: "Product style deleted from catalog.", type: "success" });
      setDeleteConfirmationId(null);
      await loadData();
    } else {
      setStatusMessage({ text: `Delete error: ${result.error}`, type: "error" });
    }
    setIsSubmitting(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleHomepageToggle = async (product: Product) => {
    const nextFeatured = !Boolean(product.is_featured);
    const { error } = await updateProduct(product.id, { is_featured: nextFeatured });
    if (!error) {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, is_featured: nextFeatured } : item
        )
      );
      setStatusMessage({
        text: nextFeatured
          ? "Product added to homepage rack and box."
          : "Product removed from homepage rack and box.",
        type: "success",
      });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage({ text: `Homepage update error: ${error}`, type: "error" });
    }
  };

  const displayedProducts = products.filter((p) => {
    if (filterCategory !== "all" && p.category_id !== filterCategory) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl font-['DM_Sans',sans-serif]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight font-['Bricolage_Grotesque',sans-serif]">
                Products Management (CRUD)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Add new garments, update wholesale pricing, stock, and product images.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
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

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-red-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Filter:</span>
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-red-600"
            >
              <option value="all">All Divisions ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
              <span className="text-xs font-mono">Loading products...</span>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs font-mono">
              No products found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase bg-slate-50">
                    <th className="py-3 px-4 font-medium">Product / SKU</th>
                    <th className="py-3 px-4 font-medium">Division</th>
                    <th className="py-3 px-4 font-medium">MOQ Standard</th>
                    <th className="py-3 px-4 font-medium">Stock Units</th>
                    <th className="py-3 px-4 font-medium text-center">Homepage</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedProducts.map((p) => {
                    const cat = categories.find((c) => c.id === p.category_id);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              {p.image_url ? (
                                <Image
                                  src={p.image_url}
                                  alt={p.title}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">DF</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-sans font-bold text-slate-900 text-sm block truncate max-w-sm">
                                {p.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: #{p.id} • SKU: {p.sku || `DF-${p.id}`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {cat?.name || `Division #${p.category_id}`}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-[11px] text-red-600 font-bold">
                            {p.moq || "MOQ: 20 Pcs"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-700">
                          {p.stock} units
                        </td>
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={Boolean(p.is_featured)}
                            onChange={() => handleHomepageToggle(p)}
                            aria-label={`Show ${p.title} on homepage`}
                            title="Show in homepage rack and 3D box"
                            className="h-4 w-4 rounded border-slate-300 accent-red-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition"
                              title="Edit Garment"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {deleteConfirmationId === p.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleDelete(p.id)}
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
                                onClick={() => setDeleteConfirmationId(p.id)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                                title="Delete Garment"
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

        {/* Modal for Add / Edit Product */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-slate-950 uppercase font-['Bricolage_Grotesque',sans-serif]">
                    {editingProduct ? "Edit Product" : "Add New Garment Product"}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Heavyweight Hoodie"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                      Division / Category
                    </label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-red-600"
                    >
                      <option value="">Select Category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Garment technical specs, fabric composition, GSM, flatlock stitching..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-red-600 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                      MOQ Standard
                    </label>
                    <input
                      type="text"
                      placeholder="MOQ: 20 Pcs"
                      value={formMoq}
                      onChange={(e) => setFormMoq(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                      Factory Stock Units
                    </label>
                    <input
                      type="number"
                      placeholder="100"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                      Lead Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7-12 Days"
                      value={formLeadTime}
                      onChange={(e) => setFormLeadTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                      Available Sizes (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="S, M, L, XL, XXL"
                      value={formSizes}
                      onChange={(e) => setFormSizes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={isUploadingImage}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setStatusMessage({ text: "Image must be 5 MB or smaller.", type: "error" });
                        return;
                      }
                      setIsUploadingImage(true);
                      const result = await uploadProductImage(file);
                      setIsUploadingImage(false);
                      if (result.url) {
                        setFormImageUrl(result.url);
                        setStatusMessage({ text: "Product image uploaded successfully.", type: "success" });
                      } else {
                        const uploadError = result.error || "";
                        if (uploadError.toLowerCase().includes("storage") || uploadError.toLowerCase().includes("bucket")) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === "string") {
                              setFormImageUrl(reader.result);
                              setStatusMessage({ text: "Image saved directly with this product.", type: "success" });
                            }
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setStatusMessage({ text: `Upload error: ${result.error}`, type: "error" });
                        }
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs file:mr-3 file:border-0 file:bg-red-600 file:text-white file:rounded-lg file:px-3 file:py-1.5 file:font-bold file:cursor-pointer"
                  />
                  {isUploadingImage && (
                    <p className="text-[11px] text-red-600 font-mono mt-1.5">Uploading image...</p>
                  )}
                  {formImageUrl && (
                    <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <Image src={formImageUrl} alt="Product preview" fill sizes="(max-width: 640px) 100vw, 400px" className="object-contain" />
                    </div>
                  )}
                  <input
                    type="url"
                    placeholder="Or paste image URL..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-red-600"
                  />
                  <span>
                    <span className="block text-xs font-bold text-slate-900 uppercase">
                      Show on Homepage
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      Display this product in the hero rack and 3D product box.
                    </span>
                  </span>
                </label>

                <div className="pt-3 flex gap-3">
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
                    {isSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}
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

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-xs font-mono">Loading Products Workspace...</span>
          </div>
        </AdminLayout>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
