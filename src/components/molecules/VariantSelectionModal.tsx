"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, Size, Variant, ProductSize } from "@/types/types";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";

interface VariantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  sizes: Size[];
  onAddToCart: (
    productId: string,
    variantId: string | null,
    sizeId: string
  ) => void;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({
  isOpen,
  onClose,
  product,
  sizes,
  onAddToCart,
}) => {
  // `null` represents the main product
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>("");

  const selectableOptions = useMemo(() => {
    const mainProductOption = {
      id: null,
      name: "Estándar",
      imageUrl: product.imageUrl,
      sizes: product.sizes,
    };
    const variantOptions = (product.variants || []).map((v) => ({
      id: v.id,
      name: v.name,
      imageUrl: v.imageUrl,
      sizes: v.sizes,
    }));
    return [mainProductOption, ...variantOptions];
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      setSelectedVariantId(null); // Default to main product
      setSelectedSizeId("");
    }
  }, [isOpen, product]);

  const selectedOption = selectableOptions.find(
    (opt) => opt.id === selectedVariantId
  );

  const handleAddToCartClick = () => {
    if (selectedSizeId) {
      onAddToCart(product.id, selectedVariantId, selectedSizeId);
    }
  };

  const handleVariantChange = (variantId: string | null) => {
    setSelectedVariantId(variantId);
    setSelectedSizeId(""); // Reset size selection when variant changes
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-4">
        {selectedOption && (
          <div className="flex justify-center mb-4">
            <img
              src={selectedOption.imageUrl}
              alt={selectedOption.name}
              className="w-32 h-32 object-cover rounded-md border"
            />
          </div>
        )}

        {selectableOptions.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variante
            </label>
            <div className="flex flex-wrap gap-2">
              {selectableOptions.map((option) => (
                <button
                  key={option.id || "main"}
                  onClick={() => handleVariantChange(option.id)}
                  className={`px-3 py-1.5 rounded-md text-sm border ${
                    selectedVariantId === option.id
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedOption && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Talla
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedOption.sizes.map((productSize) => {
                const size = sizes.find((s) => s.id === productSize.sizeId);
                if (!size) return null;
                const isDisabled = productSize.quantity <= 0;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSizeId(size.id)}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 rounded-md text-sm border ${
                      selectedSizeId === size.id
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white hover:bg-gray-100"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {size.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button onClick={handleAddToCartClick} disabled={!selectedSizeId}>
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VariantSelectionModal;
