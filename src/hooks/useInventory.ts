"use client";

import { useState, useCallback } from "react";
import { Product, Category, Size } from "@/types/types";
import { mockProducts } from "../data/products";
import { mockCategories } from "../data/categories";
import { mockSizes } from "../data/sizes";

// In a real app, this would be a global state (Context, Redux, etc.)
// For this example, we use a custom hook to simulate a persistent store.
let productsDB = [...mockProducts];
let categoriesDB = [...mockCategories];
let sizesDB = [...mockSizes];

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>(productsDB);
  const [categories, setCategories] = useState<Category[]>(categoriesDB);
  const [sizes, setSizes] = useState<Size[]>(sizesDB);

  const findProduct = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  const findCategory = useCallback(
    (id: string) => {
      return categories.find((c) => c.id === id);
    },
    [categories]
  );

  const findSize = useCallback(
    (id: string) => {
      return sizes.find((s) => s.id === id);
    },
    [sizes]
  );

  const addProduct = useCallback((product: Product) => {
    productsDB = [...productsDB, product];
    setProducts(productsDB);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    productsDB = productsDB.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(productsDB);
  }, []);

  const addCategory = useCallback((name: string) => {
    const newCategory: Category = { id: `cat-${Date.now()}`, name };
    categoriesDB = [...categoriesDB, newCategory];
    setCategories(categoriesDB);
    return newCategory;
  }, []);

  const addSize = useCallback((name: string) => {
    const newSize: Size = { id: `size-${Date.now()}`, name };
    sizesDB = [...sizesDB, newSize];
    setSizes(sizesDB);
    return newSize;
  }, []);

  return {
    products,
    categories,
    sizes,
    findProduct,
    findCategory,
    findSize,
    addProduct,
    updateProduct,
    addCategory,
    addSize,
  };
};
