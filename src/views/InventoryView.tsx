"use client";

import React, { useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Product, Category, Size, Totals } from "@/types/types";
import Select from "../components/atoms/Select";
import ProductTable from "../components/organisms/ProductTable";
import ProductForm from "../components/molecules/ProductForm";
import api from "@/lib/axios";
import { optimizeAndUploadImageWebP } from "@/lib/firebase";

import {
  BasketShopping3OutlinedRounded,
  User4OutlinedRounded,
} from "@lineiconshq/react-lineicons";
import { AnimatePresence } from "framer-motion";
import { showToast } from "nextjs-toast-notify";

const InventoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [totals, setTotals] = useState<Totals>({
    remainingPages: 0,
    totalCombined: 0,
    totalPages: 0,
    totalProducts: 0,
    totalVariants: 0,
  });

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

      showToast.success(data.msg, {
        duration: 4000,
        progress: false,
        position: "top-right",
        transition: "slideInUp",
        icon: "",
        sound: false,
      });

      reloadData();
    } else {
      const updatedProduct = { ...product };

      if (product.mainImage.startsWith("data:image")) {
        updatedProduct.mainImage = await optimizeAndUploadImageWebP(
          product.mainImage,
          `${product.name}-main-${Date.now()}.jpg`
        );
      }

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

      const { data } = await api.post("admin-product", updatedProduct);

      showToast.success(data.msg, {
        duration: 4000,
        progress: false,
        position: "top-right",
        transition: "slideInUp",
        icon: "",
        sound: false,
      });

      reloadData();
    }
  };

  // Frontend anterior

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    statusProduct: "",
    stock: "",
    nameProduct: "",
    price: "",
    category: "all",
  });

  const [dataSearchProducts, setDataSearchProduct] = useState("");

  const hadelchangecategory = (value: string) => {
    setFilters({ ...filters, category: value });
  };

  async function getProducts(e?: React.FormEvent<HTMLFormElement> | null) {
    if (e) e.preventDefault();
    const { data } = await api.get(`new/products-admin/${page}`, {
      params: {
        filters,
        dataSearchProducts,
      },
    });

    console.log(data, "productos traidos");

    if (data.success) {
      setProducts(data.products);
      setTotals(data.totals);
    }
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
      // setSizes(data.size);
    }

    return data.size;
  }

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totals.totalPages) setPage(page + 1);
  };

  function reloadData() {
    getProducts();
    getCategories();
    getSizes();
  }

  useEffect(() => {
    reloadData();
  }, [page, filters]);

  return (
    <div className="space-y-6 overflow-hidden p-6 max-md:px-4 max-md:pt-16">
      <div className="w-full flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold text-black/80">Inventario</h2>

        <div className="flex justify-center items-center gap-3 border-l border-gray-200 pl-4 max-md:hidden">
          <div className="bg-primary rounded-full p-1.5">
            <User4OutlinedRounded className="text-white" />
          </div>

          <div>
            <p className="font-medium">Agumarina</p>

            <p className="text-[10px] text-black/70">
              aguamarinatienda@gmail.com
            </p>
          </div>

          {/* <IconChevronDown className="text-black/50 size-6" /> */}
        </div>
      </div>

      <div className="flex  justify-between items-center gap-x-2 gap-y-6 mb-12 max-md:flex-col max-md:items-start">
        <div className="flex justify-start items-center gap-2">
          <div className="bg-gray-200 w-max p-1.5 rounded-xl">
            <BasketShopping3OutlinedRounded className="text-gray-600" />
          </div>
          <p className="font-semibold text-2xl">{totals.totalCombined}</p>
          <p className="text-xs text-black/50 font-medium">Productos</p>
        </div>

        <div className="w-max flex-grow flex items-center justify-end space-x-2">
          {/* <div className="relative w-full max-w-[300px]">
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
          </div> */}

          <div className="max-w-[200px]">
            <Select
              value={filters.category}
              onChange={(e) => hadelchangecategory(e.target.value)}
            >
              <option value="all">Todos</option>

              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          {/* <button className="flex justify-center items-center gap-2 text-sm border border-black/20 rounded-2xl h-11 px-3 ">
            <IconFilter2 className="size-6 text-black/70" />
            Filtros
          </button> */}

          <button
            className="bg-primary h-11 px-3 flex justify-center items-center gap-2 text-white rounded-2xl text-sm cursor-pointer hover:bg-primary/90"
            onClick={handleAddProduct}
          >
            {/* <IconPlus size={16} /> */}
            Crear Producto
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        categories={categories}
        sizes={sizes}
      />

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="p-1 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
        >
          <IconChevronLeft />
        </button>

        <p className="text-sm font-medium text-black/50">
          <span className="text-xl text-black">{page} </span>
          de {totals.totalPages}
        </p>

        <button
          onClick={handleNext}
          disabled={page === totals.totalPages}
          className="p-1 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
        >
          <IconChevronRight />
        </button>
      </div>

      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </div>
  );
};

export default InventoryView;
