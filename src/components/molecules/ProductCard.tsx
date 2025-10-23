import React from "react";
import { Product } from "@/types/types";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform transform hover:scale-105 group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        {(product.variants?.length || 0) > 0 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {product.variants?.length} Variantes
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-teal-600">
          {product.name}
        </h4>
        <p className="text-lg font-bold text-teal-600 mt-1">
          ${product.salePrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
