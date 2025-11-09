"use client";

import React, { useState, useEffect } from "react";
import { CartItem, Product, ProductPOS, Size } from "@/types/types";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import Image from "next/image";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductPOS;
  sizes: Size[];
  onAddToCart: (items: CartItem[]) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  product,
  sizes,
  onAddToCart,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<
    { name: string; quantity: number; maxQuantity: number }[]
  >([]);

  useEffect(() => {
    if (isOpen) setSelectedSizes([]);
  }, [isOpen, product]);

  const toggleSizeSelection = (size: string) => {
    const productSize = product.ProductSizes.find((ps) => ps.name === size);
    const maxQuantity = productSize ? productSize.quantity : 1;

    setSelectedSizes((prev) => {
      const exists = prev.find((s) => s.name === size);
      if (exists) {
        // Si ya está seleccionado, quitarlo
        return prev.filter((s) => s.name !== size);
      }
      // Si no está, agregarlo con cantidad 1
      return [...prev, { name: size, quantity: 1, maxQuantity }];
    });
  };

  const handleQuantityChange = (size: string, newQuantity: number) => {
    setSelectedSizes((prev) =>
      prev.map((s) =>
        s.name === size
          ? {
              ...s,
              quantity: Math.min(
                Math.max(1, newQuantity),
                s.maxQuantity // no supera el stock disponible
              ),
            }
          : s
      )
    );
  };

  const handleAddToCartClick = () => {
    const cartItems: CartItem[] = selectedSizes.map((s) => ({
      id: product.id + "." + Math.random(),
      size: s.name,
      quantity: s.quantity,
      name: product.name,
      mainImage: product.mainImage,
      unitPrice: product.salePrice,
      isVariant: product.isVariant,
    }));

    onAddToCart(cartItems);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-4 flex flex-col justify-center items-center">
        {/* Imagen del producto */}
        {/* <div className="flex justify-center mb-4">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-md border"
          />
        </div> */}

        <div className="size-32 rounded-full p-1 border border-gray-200 flex ">
          <Image
            width={250}
            height={250}
            src={product.mainImage}
            alt={product.name}
            className="size-full rounded-full object-contain "
          />
        </div>

        {/* Talles */}
        <label className="w-full block text-sm font-medium text-gray-700 mb-2">
          Talles disponibles
        </label>
        <div className="w-full flex flex-wrap gap-2">
          {product.ProductSizes.map((productSize) => {
            const size = sizes.find((s) => s.name === productSize.name);
            if (!size) return null;
            const isDisabled = productSize.quantity <= 0;
            const isSelected = selectedSizes.some((s) => s.name === size.name);

            return (
              <button
                key={size.id}
                onClick={() => toggleSizeSelection(size.name)}
                disabled={isDisabled}
                className={`px-3 py-1.5 rounded-xl text-sm border border-gray-200 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white border-transparent"
                    : "bg-white hover:bg-gray-100"
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {size.name}
              </button>
            );
          })}
        </div>

        {/* Lista de talles seleccionados */}
        {selectedSizes.length > 0 && (
          <div className="w-full mt-6 border-t border-gray-200 pt-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Talles seleccionados
            </h4>
            {selectedSizes.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between border border-gray-200 p-2 rounded-2xl"
              >
                <span>{s.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={s.quantity}
                    min={1}
                    max={s.maxQuantity}
                    onChange={(e) =>
                      handleQuantityChange(s.name, Number(e.target.value))
                    }
                    className="w-6 border-none outline-none rounded-md text-center"
                  />
                  <span className="text-xs text-gray-500">
                    / {s.maxQuantity} disp.
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón de agregar */}
      <div className="pt-4 flex justify-end">
        <button
          className="bg-primary h-11 px-3 min-w-[150px] flex justify-center items-center gap-2 text-white rounded-2xl text-sm cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-50"
          onClick={handleAddToCartClick}
          disabled={selectedSizes.length === 0}
        >
          Añadir al Carrito
        </button>
      </div>
    </Modal>
  );
};

export default ProductSelectionModal;
