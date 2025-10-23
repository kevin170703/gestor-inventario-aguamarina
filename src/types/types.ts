export interface Size {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductSize {
  sizeId: string;
  quantity: number;
}

// A variant only contains properties that differ from the main product
export interface Variant {
  id: string;
  name: string; // e.g., "Red", "Blue"
  imageUrl: string;
  sizes: ProductSize[];
}

// The main product has all the core details
export interface Product {
  id: string;
  name: string;
  categoryId: string;
  barcode: string;
  costPrice: number;
  salePrice: number;
  imageUrl: string;
  sizes: ProductSize[]; // Sizes for the main product
  variants?: Variant[]; // Optional, simplified variants
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
