"use client";

import React, { useEffect, useState } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Product, Category, Size, Variant } from "@/types/types";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Select from "../components/atoms/Select";
import ProductTable from "../components/organisms/ProductTable";
import ProductForm from "../components/molecules/ProductForm";
import api from "@/lib/axios";
import axios from "axios";
import { optimizeAndUploadImageWebP } from "@/lib/firebase";

const InventoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[] | []>([]);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [sizes, setSizes] = useState<Size[] | []>([]);

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

  // 🔹 Función para subir una imagen base64 a Firebase vía API

  const handleFormSave = async (product: Product) => {
    if (product.id) {
      const updatedProduct = { ...product };

      // Imagen principal
      if (product.mainImage.startsWith("data:image")) {
        updatedProduct.mainImage = await optimizeAndUploadImageWebP(
          product.mainImage,
          `${product.name}-main-${Date.now()}.jpg`
        );
      }

      // Variantes
      if (product.Variants?.length) {
        updatedProduct.Variants = await Promise.all(
          product.Variants.map(async (variant) => {
            const updatedVariant = { ...variant };
            if (variant.mainImage.startsWith("data:image")) {
              updatedVariant.mainImage = await optimizeAndUploadImageWebP(
                variant.mainImage,
                `${product.name}-${variant.name}-${Date.now()}.jpg`
              );
            }
            return updatedVariant;
          })
        );
      }

      const { data } = await api.put("admin-edit-product", updatedProduct);

      console.log("resultado", data);
    } else {
      const updatedProduct = { ...product };

      // Imagen principal
      if (product.mainImage.startsWith("data:image")) {
        updatedProduct.mainImage = await optimizeAndUploadImageWebP(
          product.mainImage,
          `${product.name}-main-${Date.now()}.jpg`
        );
      }

      // Variantes
      if (product.Variants?.length) {
        updatedProduct.Variants = await Promise.all(
          product.Variants.map(async (variant) => {
            const updatedVariant = { ...variant };
            if (variant.mainImage.startsWith("data:image")) {
              updatedVariant.mainImage = await optimizeAndUploadImageWebP(
                variant.mainImage,
                `${product.name}-${variant.name}-${Date.now()}.jpg`
              );
            }
            return updatedVariant;
          })
        );
      }

      // return updatedProduct;

      const { data } = await api.post("admin-product", updatedProduct);

      console.log("resultado", data);
    }
  };

  // Frontend anterior

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    statusProduct: "",
    stock: "",
    nameProduct: "",
    price: "",
  });

  const [dataSearchProducts, setDataSearchProduct] = useState("");

  async function getProducts(e?: React.FormEvent<HTMLFormElement> | null) {
    if (e) e.preventDefault();
    const { data } = await api.get(`new/products-admin/${page}`, {
      params: {
        filters,
        dataSearchProducts,
      },
    });

    console.log(data, "productos traidos");

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

  async function addCategory(name: string) {
    const { data } = await api.post(`/category`, { name });

    if (data.success) {
      setCategories(data.categories);
    }

    return data.categories;
  }

  async function addSize(name: string) {
    const { data } = await api.post(`/size`, { name });

    if (data.success) {
      setSizes(data.size);
    }

    return data.size;
  }

  useEffect(() => {
    getProducts();
    getCategories();
    getSizes();
  }, [page, filters]);

  console.log({ sizes, categories, products });

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
        products={products}
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
