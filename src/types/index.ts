export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  description?: string;
  image_url?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number; // kept for internal database reference
  category_id: number | null;
  image_url: string;
  stock: number;
  created_at: string;
  // B2B & MOQ Attributes
  moq?: string; // Minimum Order Quantity (e.g. "20 Pcs (Low MOQ)")
  lead_time?: string; // Production lead time
  sample_available?: boolean;
  // Extended UI attributes
  category_name?: string;
  slug?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  is_featured?: boolean;
  rating?: number;
  reviews_count?: number;
  sku?: string;
  features?: string[];
}

export interface CartItem {
  id: string; // unique item composite key: `${product.id}-${selectedSize}-${selectedColor}`
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  customLogoNote?: string;
}

export interface StoreMetrics {
  totalProducts: number;
  totalCategories: number;
  totalInventoryUnits: number;
  totalInventoryValue: number;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  product_name?: string;
  message: string;
  status: "new" | "read" | "resolved";
  source: "contact" | "custom_manufacturing" | "cart";
  created_at: string;
}

