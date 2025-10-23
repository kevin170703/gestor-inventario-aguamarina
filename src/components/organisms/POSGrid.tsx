import React from "react";
import { Product } from "@/types/types";
import ProductCard from "../molecules/ProductCard";

interface POSGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const POSGrid: React.FC<POSGridProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
};

export default POSGrid;
