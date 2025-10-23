import React from "react";
import { IconPencil } from "@tabler/icons-react";
import { Product, Category, Size } from "@/types/types";
import Button from "../atoms/Button";

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
  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "N/A";

  const getTotalStock = (product: Product) => {
    const mainStock = product.sizes.reduce(
      (sum, size) => sum + size.quantity,
      0
    );
    const variantsStock = (product.variants || []).reduce((sum, variant) => {
      return (
        sum +
        variant.sizes.reduce(
          (variantSum, size) => variantSum + size.quantity,
          0
        )
      );
    }, 0);
    return mainStock + variantsStock;
  };

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto p-4">
        <div className="flex justify-between items-center gap-2  text-xs text-gray-500 uppercase bg-black/6 rounded-xl px-4 ">
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

        <div className=" w-full">
          {products.map((product) => (
            <div className="bg-white text-black/60 hover:bg-gray-50 flex justify-between items-center py-4 gap-2  border-b border-b-gray-200 text-start text-sm px-4">
              <div className="flex justify-start items-center w-[25%]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 rounded-md object-cover mr-3 border border-gray-200"
                />
                <p className="text-black">{product.name}</p>
              </div>

              <div className="w-[15%]">
                {getCategoryName(product.categoryId)}
              </div>

              <div className="w-[15%]">{product.variants?.length || 0}</div>

              <div className="w-[15%] ">{getTotalStock(product)}</div>

              <div className="w-[15%] ">${product.salePrice.toFixed(2)}</div>

              <div className="w-[15%]">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(product)}
                  className="px-2 py-1"
                >
                  <IconPencil size={16} />
                </Button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-500">
                No se encontraron productos.
              </td>
            </tr>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
