import React from "react";
import { IconPencil } from "@tabler/icons-react";
import { Product, Category, Size } from "@/types/types";
import Button from "../atoms/Button";
import Image from "next/image";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  sizes: Size[];
  onEdit: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  sizes,
  onEdit,
}) => {
  const getTotalStock = (product: Product) => {
    const mainStock = product.ProductSizes.reduce(
      (sum, size) => sum + size.quantity,
      0
    );

    const variantsStock = (product.Variants || []).reduce((sum, variant) => {
      return (
        sum +
        variant.ProductSizes.reduce(
          (variantSum, size) => variantSum + size.quantity,
          0
        )
      );
    }, 0);
    return mainStock + variantsStock;
  };

  return (
    <div className="bg-white overflow-x-auto">
      <div className="w-full min-w-[800px] ">
        <div className="flex justify-between items-center gap-2 text-xs text-gray-500 uppercase bg-black/6 rounded-xl px-4 ">
          <div className="w-[25%] clear-start font-medium py-4">Producto</div>
          <div className="w-[15%] clear-start font-medium py-4">Categoría</div>
          <div className="w-[15%] clear-start font-medium py-4">Variantes</div>
          <div className="w-[15%] clear-start font-medium py-4">
            Stock Total
          </div>
          <div className="w-[15%] clear-start font-medium py-4">
            Precio Venta
          </div>
          <div className="w-[15%] clear-start font-medium py-4">Acciones</div>
        </div>

        <div className="w-full">
          {products.map((product) => (
            <div className="bg-white text-black/60 hover:bg-primary/10 flex justify-between items-center py-3 gap-2  border-b border-b-gray-200 text-start text-sm px-4 ">
              <div className="flex justify-start items-center w-[25%]">
                <div className="size-14 rounded-full p-1 border border-gray-200 mr-3 ">
                  <Image
                    width={250}
                    height={250}
                    src={product.mainImage}
                    alt={product.name}
                    className="size-full rounded-full object-contain "
                  />
                </div>
                <p className="text-black font-medium">{product.name}</p>
              </div>

              <div className="w-[15%]">{product.category}</div>

              <div className="w-[15%]">{product.Variants?.length || 0}</div>

              <div className={`w-[15%]  `}>
                <p
                  className={`w-max rounded-full py-1 px-2  text-white ${
                    getTotalStock(product) <= 3
                      ? "bg-red-400"
                      : getTotalStock(product) <= 6
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  } `}
                >
                  {getTotalStock(product)}
                </p>
              </div>

              <div className="w-[15%] ">
                ${product.salePrice.toLocaleString("es-AR")}
              </div>

              <div className="w-[15%]">
                <button
                  onClick={() => onEdit(product)}
                  className="size-6 cursor-pointer"
                >
                  <IconPencil className="size-full" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="w-full text-center py-6 text-xl">
              <p>No se encontraron productos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
