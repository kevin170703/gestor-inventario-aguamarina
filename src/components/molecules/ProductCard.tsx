import React from "react";
import { Product } from "@/types/types";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border-6 border-primary/5 overflow-hidden cursor-pointer transition-transform transform hover:scale-95 group"
      onClick={onClick}
    >
      <div className="relative">
        <Image
          width={700}
          height={700}
          src={product.mainImage}
          alt={product.name}
          className="w-full h-40 object-cover bg-primary"
        />
      </div>
      <div className="p-2">
        <h4 className="text-sm font-medium truncate">{product.name}</h4>
        <p className="text-lg font-bold text-primary mt-1">
          ${product.salePrice.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
