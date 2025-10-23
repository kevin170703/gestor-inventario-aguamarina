"use client";

import React, { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { Category, Product, Variant, Size, CartItem } from "@/types/types";
import POSGrid from "../components/organisms/POSGrid";
import ShoppingCart from "../components/organisms/ShoppingCart";
import VariantSelectionModal from "../components/molecules/VariantSelectionModal";

const POSView: React.FC = () => {
  const { products, categories, sizes, findProduct, findSize } = useInventory();
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    activeCategoryId === "all"
      ? products
      : products.filter((p) => p.categoryId === activeCategoryId);

  const handleProductClick = (product: Product) => {
    // If product has no variants and only one size, add directly to cart? (Future optimization)
    // For now, always open modal to select size.
    setSelectedProduct(product);
    setIsVariantModalOpen(true);
  };

  const handleAddToCart = (
    productId: string,
    variantId: string | null,
    sizeId: string
  ) => {
    const product = findProduct(productId);
    if (!product) return;

    const size = findSize(sizeId);
    if (!size) return;

    let itemToAdd: {
      variantId: string | null;
      name: string;
      imageUrl: string;
    };

    if (variantId) {
      const variant = product.variants?.find((v) => v.id === variantId);
      if (!variant) return;
      itemToAdd = {
        variantId: variant.id,
        name: variant.name,
        imageUrl: variant.imageUrl,
      };
    } else {
      // It's the main product
      itemToAdd = {
        variantId: null,
        name: "Estándar",
        imageUrl: product.imageUrl,
      };
    }

    const existingCartItemIndex = cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.variantId === itemToAdd.variantId &&
        item.sizeId === sizeId
    );

    if (existingCartItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingCartItemIndex].quantity++;
      setCart(newCart);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        productId,
        variantId: itemToAdd.variantId,
        sizeId,
        quantity: 1,
        unitPrice: product.salePrice, // Price is always from the main product
        discount: 0,
        productName: product.name,
        variantName: itemToAdd.name,
        sizeName: size.name,
        imageUrl: itemToAdd.imageUrl,
      };
      setCart((prev) => [...prev, newItem]);
    }

    setIsVariantModalOpen(false);
    setSelectedProduct(null);
  };

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
          <POSGrid
            products={filteredProducts}
            onProductClick={handleProductClick}
          />
        </div>
      </div>

      <div className="lg:col-span-1 h-full">
        <ShoppingCart cart={cart} setCart={setCart} />
      </div>

      {selectedProduct && (
        <VariantSelectionModal
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
