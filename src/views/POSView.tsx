"use client";

import React, { useEffect, useState } from "react";
import { Category, Product, ProductPOS, Size, CartItem } from "@/types/types";
import POSGrid from "../components/organisms/POSGrid";
import ShoppingCart from "../components/organisms/ShoppingCart";
import api from "@/lib/axios";
import ProductSelectionModal from "../components/molecules/VariantSelectionModal";

const POSView: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductPOS | null>(
    null
  );

  // const filteredProducts =
  //   activeCategoryId === "all"
  //     ? products
  //     : products.filter((p) => p.categoryId === activeCategoryId);

  const handleProductClick = (product: ProductPOS) => {
    // If product has no variants and only one size, add directly to cart? (Future optimization)
    // For now, always open modal to select size.
    setSelectedProduct(product);
    setIsVariantModalOpen(true);
  };

  const handleAddToCart = (products: CartItem[]) => {
    setCart([...cart, ...products]);
  };

  // Produccion

  const [products, setProducts] = useState<ProductPOS[] | []>([]);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [sizes, setSizes] = useState<Size[] | []>([]);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    statusProduct: "",
    stock: "",
    nameProduct: "",
    price: "",
    category: "all",
  });

  const [dataSearchProducts, setDataSearchProduct] = useState("");

  async function getProducts(e?: React.FormEvent<HTMLFormElement> | null) {
    if (e) e.preventDefault();
    const { data } = await api.get(`/pos-products/${page}`, {
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

  console.log(cart, "carriitoo");

  return (
    <div className="flex gap-6 w-full h-max">
      <div className="flex flex-col h-full w-[70%] p-6">
        <div className="flex justify-start items-center gap-2 flex-wrap mb-6">
          <button
            onClick={() => setFilters({ ...filters, category: "all" })}
            className={`px-10 py-6 text-sm font-semibold rounded-2xl transition-colors cursor-pointer ${
              filters.category === "all"
                ? "bg-primary text-white"
                : "bg-black/10 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {categories.map((cat: Category) => (
            <button
              key={cat.name}
              onClick={() => setFilters({ ...filters, category: cat.name })}
              className={`px-10 py-6  text-sm font-semibold rounded-2xl whitespace-nowrap transition-colors cursor-pointer ${
                filters.category === cat.name
                  ? "bg-primary text-white"
                  : "bg-black/10 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex-grow overflow-y-auto">
          <POSGrid products={products} onProductClick={handleProductClick} />
        </div>
      </div>

      <div className="h-full fixed right-5 w-[25%]">
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
