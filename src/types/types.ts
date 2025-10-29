export interface Size {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductSize {
  quantity: number;
  name: string;
}

// A variant only contains properties that differ from the main product
export interface Variant {
  id: string;
  name: string; // e.g., "Red", "Blue"
  mainImage: string;
  ProductSizes: ProductSize[];
  isActive: boolean;
}

// The main product has all the core details
export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  costPrice: number;
  salePrice: number;
  mainImage: string;
  ProductSizes: ProductSize[]; // Sizes for the main product
  Variants?: Variant[]; // Optional, simplified variants
  isActive: boolean;
  description: string;
}

export interface CartItem {
  id: string; // Unique ID for the cart item instance
  productId: string;
  variantId: string | null; // null if it's the main product
  sizeId: string;
  quantity: number;
  unitPrice: number;
  discount: number; // Fixed amount
  productName: string;
  variantName: string; // "Red T-shirt" or "Base T-shirt"
  sizeName: string;
  imageUrl: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
}
