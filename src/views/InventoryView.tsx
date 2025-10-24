"use client";

import React, { useState, useMemo } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Product, Category } from "@/types/types";
import { useInventory } from "../hooks/useInventory";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Select from "../components/atoms/Select";
import ProductTable from "../components/organisms/ProductTable";
import ProductForm from "../components/molecules/ProductForm";

const InventoryView: React.FC = () => {
  const {
    products,
    categories,
    sizes,
    addProduct,
    updateProduct,
    addCategory,
    addSize,
  } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct({ ...product, id: `prod-${Date.now()}` });
    }
    handleFormClose();
  };

  return (
    <div className="space-y-6">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Inventario de Productos
        </h2>

        <div className="w-max flex-grow flex items-center justify-end space-x-4">
          <div className="relative w-full max-w-[300px]">
            <Input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <IconSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </div>

          <div className="max-w-[200px]">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <Button onClick={handleAddProduct} icon={<IconPlus size={16} />}>
            Crear Producto
          </Button>
        </div>
      </div>

      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        categories={categories}
        sizes={sizes}
      />

      {isFormOpen && (
        <ProductForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSave={handleFormSave}
          product={editingProduct}
          categories={categories}
          sizes={sizes}
          onAddCategory={addCategory}
          onAddSize={addSize}
        />
      )}
    </div>
  );
};

export default InventoryView;
