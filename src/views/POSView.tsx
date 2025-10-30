"use client";

import React, { useEffect, useState } from "react";
import { Category, Product, Variant, Size, CartItem } from "@/types/types";
import POSGrid from "../components/organisms/POSGrid";
import ShoppingCart from "../components/organisms/ShoppingCart";
import api from "@/lib/axios";
import ProductSelectionModal from "../components/molecules/VariantSelectionModal";

const POSView: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // const filteredProducts =
  //   activeCategoryId === "all"
  //     ? products
  //     : products.filter((p) => p.categoryId === activeCategoryId);

  const handleProductClick = (product: Product) => {
    // If product has no variants and only one size, add directly to cart? (Future optimization)
    // For now, always open modal to select size.
    setSelectedProduct(product);
    setIsVariantModalOpen(true);
  };

  const handleAddToCart = (
    products: { productId: string; size: string; quantity: number }[]
  ) => {
    console.log(products, "prodcuts");
  };

  // Produccion

  const [products, setProducts] = useState<Product[] | []>([]);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [sizes, setSizes] = useState<Size[] | []>([]);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    statusProduct: "",
    stock: "",
    nameProduct: "",
    price: "",
  });

  const [dataSearchProducts, setDataSearchProduct] = useState("");

  async function getProducts(e?: React.FormEvent<HTMLFormElement> | null) {
    if (e) e.preventDefault();
    const { data } = await api.get(`new/products-admin/${page}`, {
      params: {
        filters,
        dataSearchProducts,
      },
    });

    if (data.success) setProducts(data.products);
  }

  async function getCategories(e?: React.FormEvent<HTMLFormElement> | null) {
    if (e) e.preventDefault();
    const { data } = await api.get(`/categories`);

    if (data.success) {
      setCategories(data.categories);
    }
  }

  async function getSizes(e?: React.FormEvent<HTMLFormElement> | null) {
    if (e) e.preventDefault();
    const { data } = await api.get(`/sizes`);

    if (data.success) {
      setSizes(data.sizes);
    }
  }

  useEffect(() => {
    getProducts();
    getCategories();
    getSizes();
  }, [page, filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm mb-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategoryId("all")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeCategoryId === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categories.map((cat: Category) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-md whitespace-nowrap transition-colors ${
                  activeCategoryId === cat.id
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          <POSGrid products={products} onProductClick={handleProductClick} />
        </div>
      </div>

      <div className="lg:col-span-1 h-full">
        <ShoppingCart cart={cart} setCart={setCart} />
      </div>

      {selectedProduct && (
        <ProductSelectionModal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          product={selectedProduct}
          sizes={sizes}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default POSView;
