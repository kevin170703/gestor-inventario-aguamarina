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

export type ProductPOS = {
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
};

export interface CartItem {
  id: string;
  size: string;
  quantity: number;
  name: string;
  mainImage: string;
  unitPrice: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
}
