import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Category, Product, StoreMetrics, Inquiry } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean =>
  supabaseUrl.startsWith("http") &&
  supabaseAnonKey.trim().length > 0 &&
  !supabaseUrl.includes("your-project-id");

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

let categoryCache: { data: Category[]; expiresAt: number } | null = null;
let productCache: { data: Product[]; expiresAt: number } | null = null;
const DATA_CACHE_MS = 30_000;

export async function signInAdmin(email: string, password: string): Promise<{ success: boolean; error: string | null }> {
  if (!supabase) return { success: false, error: "Database connection is not configured" };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

export async function signOutAdmin(): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

export async function getAdminSession(): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

export async function fetchCategories(): Promise<{ data: Category[]; error: string | null; isLive: boolean }> {
  if (!supabase) return { data: [], error: "Supabase is not configured", isLive: false };
  if (categoryCache && categoryCache.expiresAt > Date.now()) {
    return { data: categoryCache.data, error: null, isLive: true };
  }
  const { data, error } = await supabase.from("categories").select("*").order("id");
  if (error) return { data: [], error: error.message, isLive: false };
  const categories = (data || []) as Category[];
  categoryCache = { data: categories, expiresAt: Date.now() + DATA_CACHE_MS };
  return { data: categories, error: null, isLive: true };
}

export async function createCategory(category: { name: string; slug: string; description?: string; image_url?: string }) {
  if (!supabase) return { data: null, error: "Supabase is not configured" };
  const { data, error } = await supabase
    .from("categories")
    .insert([{ ...category, created_at: new Date().toISOString() }])
    .select()
    .single();
  if (!error) categoryCache = null;
  return { data: data as Category | null, error: error?.message || null };
}

export async function updateCategory(id: number, category: Partial<Category>) {
  if (!supabase) return { data: null, error: "Supabase is not configured" };
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();
  if (!error) categoryCache = null;
  return { data: data as Category | null, error: error?.message || null };
}

export async function deleteCategory(id: number) {
  if (!supabase) return { success: false, error: "Supabase is not configured" };
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (!error) categoryCache = null;
  return { success: !error, error: error?.message || null };
}

export async function fetchProducts(categoryId?: number): Promise<{ data: Product[]; error: string | null; isLive: boolean }> {
  if (!supabase) return { data: [], error: "Supabase is not configured", isLive: false };
  if (!categoryId && productCache && productCache.expiresAt > Date.now()) {
    return { data: productCache.data, error: null, isLive: true };
  }
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false });
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) return { data: [], error: error.message, isLive: false };
  const formatted = (data || []).map((item: any) => ({
    ...item,
    category_name: item.categories?.name,
    sizes: item.sizes?.length ? item.sizes : ["S", "M", "L", "XL"],
    colors: item.colors?.length ? item.colors : [{ name: "Standard", hex: "#111116" }],
  })) as Product[];
  if (!categoryId) {
    productCache = { data: formatted, expiresAt: Date.now() + DATA_CACHE_MS };
  }
  return { data: formatted, error: null, isLive: true };
}

export async function fetchProductById(id: number): Promise<{ data: Product | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase is not configured" };
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single();
  if (error) return { data: null, error: error.message };
  return {
    data: {
      ...data,
      category_name: data.categories?.name,
      sizes: data.sizes?.length ? data.sizes : ["S", "M", "L", "XL"],
      colors: data.colors?.length ? data.colors : [{ name: "Standard", hex: "#111116" }],
    } as Product,
    error: null,
  };
}

export async function createProduct(prod: {
  title: string;
  description: string;
  price: number;
  category_id: number | null;
  image_url: string;
  stock: number;
  moq?: string;
  lead_time?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  is_featured?: boolean;
}) {
  if (!supabase) return { data: null, error: "Supabase is not configured" };
  const payload = {
    ...prod,
    slug: prod.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    moq: prod.moq || "MOQ: 20 Pcs",
    lead_time: prod.lead_time || "7-12 Days",
    sizes: prod.sizes || ["S", "M", "L", "XL"],
    colors: prod.colors || [{ name: "Standard", hex: "#111116" }],
    is_featured: prod.is_featured ?? false,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("products").insert([payload]).select().single();
  if (!error) productCache = null;
  return { data: data as Product | null, error: error?.message || null };
}

export async function updateProduct(id: number, prod: Partial<Product>) {
  if (!supabase) return { data: null, error: "Supabase is not configured" };
  const { data, error } = await supabase
    .from("products")
    .update(prod)
    .eq("id", id)
    .select()
    .single();
  if (!error) productCache = null;
  return { data: data as Product | null, error: error?.message || null };
}

export async function deleteProduct(id: number) {
  if (!supabase) return { success: false, error: "Supabase is not configured" };
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) {
    return { success: false, error: "Product was not found or could not be deleted" };
  }
  productCache = null;
  return { success: true, error: null };
}

export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) return { url: null, error: "Database is not configured" };
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `products/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    if (error.message.toLowerCase().includes("bucket") || error.message.toLowerCase().includes("not found")) {
      return { url: null, error: "Image storage is not setup yet. Run the database setup SQL once." };
    }
    return { url: null, error: error.message };
  }
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function createInquiry(inquiry: Omit<Inquiry, "id" | "status" | "created_at">) {
  if (!supabase) return { data: null, error: "Supabase is not configured" };
  const { data, error } = await supabase
    .from("inquiries")
    .insert([{ ...inquiry, phone: inquiry.phone || null, status: "new" }])
    .select()
    .single();
  return { data: data as Inquiry | null, error: error?.message || null };
}

export async function fetchInquiries(): Promise<{ data: Inquiry[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase is not configured" };
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: (data || []) as Inquiry[], error: error?.message || null };
}

export async function updateInquiryStatus(id: number, status: Inquiry["status"]) {
  if (!supabase) return { error: "Supabase is not configured" };
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  return { error: error?.message || null };
}

export async function getStoreMetrics(): Promise<StoreMetrics> {
  const [productResult, categoryResult] = await Promise.all([fetchProducts(), fetchCategories()]);
  const products = productResult.data;
  const categories = categoryResult.data;
  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalInventoryUnits: products.reduce((sum, product) => sum + (product.stock || 0), 0),
    totalInventoryValue: products.reduce((sum, product) => sum + (product.price || 0) * (product.stock || 0), 0),
  };
}
