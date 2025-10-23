"use client";

import React, { useState, useEffect } from "react";
import { Product, Category, Size, Variant, ProductSize } from "@/types/types";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
  categories: Category[];
  sizes: Size[];
  onAddCategory: (name: string) => Category;
  onAddSize: (name: string) => Size;
}

const emptyVariant: Omit<Variant, "id"> = {
  name: "",
  imageUrl: "https://via.placeholder.com/400",
  sizes: [],
};
const emptyProduct: Omit<Product, "id"> = {
  name: "",
  categoryId: "",
  barcode: "",
  costPrice: 0,
  salePrice: 0,
  imageUrl: "https://via.placeholder.com/400",
  sizes: [],
  variants: [],
};

// Reusable component for managing sizes and stock
const SizeStockManager: React.FC<{
  title: string;
  availableSizes: Size[];
  selectedSizes: ProductSize[];
  onToggleSize: (sizeId: string) => void;
  onSizeChange: (
    sizeIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}> = ({ title, availableSizes, selectedSizes, onToggleSize, onSizeChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            type="button"
            key={size.id}
            onClick={() => onToggleSize(size.id)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedSizes.some((s) => s.sizeId === size.id)
                ? "bg-teal-100 border-teal-500 text-teal-800"
                : "bg-white border-gray-300"
            }`}
          >
            {size.name}
          </button>
        ))}
      </div>
      {selectedSizes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
          {selectedSizes.map((ps, sIndex) => {
            const size = availableSizes.find((s) => s.id === ps.sizeId);
            return size ? (
              <div
                key={size.id}
                className="flex items-center space-x-2 p-2 bg-white rounded-md border"
              >
                <span className="font-semibold w-12">{size.name}:</span>
                <Input
                  type="number"
                  name="quantity"
                  value={ps.quantity}
                  onChange={(e) => onSizeChange(sIndex, e)}
                  placeholder="Cant."
                  className="text-center"
                />
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
  sizes,
  onAddCategory,
  onAddSize,
}) => {
  const [formData, setFormData] = useState<Product | Omit<Product, "id">>(
    product || emptyProduct
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    setFormData(product ? JSON.parse(JSON.stringify(product)) : emptyProduct);
  }, [product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    variantIndex: number | null = null
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (variantIndex !== null) {
          const newVariants = [...(formData.variants || [])];
          newVariants[variantIndex].imageUrl = imageUrl;
          setFormData((prev) => ({ ...prev, variants: newVariants }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Size Management ---
  const handleToggleSize = (
    sizeId: string,
    variantIndex: number | null = null
  ) => {
    if (variantIndex !== null) {
      const newVariants = [...(formData.variants || [])];
      const variant = newVariants[variantIndex];
      const sizeExists = variant.sizes.some((s) => s.sizeId === sizeId);
      if (sizeExists) {
        variant.sizes = variant.sizes.filter((s) => s.sizeId !== sizeId);
      } else {
        variant.sizes.push({ sizeId, quantity: 0 });
      }
      setFormData((prev) => ({ ...prev, variants: newVariants }));
    } else {
      const newSizes = [...formData.sizes];
      const sizeExists = newSizes.some((s) => s.sizeId === sizeId);
      if (sizeExists) {
        setFormData((prev) => ({
          ...prev,
          sizes: prev.sizes.filter((s) => s.sizeId !== sizeId),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          sizes: [...prev.sizes, { sizeId, quantity: 0 }],
        }));
      }
    }
  };

  const handleSizeChange = (
    sizeIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
    variantIndex: number | null = null
  ) => {
    const { value } = e.target;
    const quantity = parseInt(value, 10) || 0;
    if (variantIndex !== null) {
      const newVariants = [...(formData.variants || [])];
      newVariants[variantIndex].sizes[sizeIndex].quantity = quantity;
      setFormData((prev) => ({ ...prev, variants: newVariants }));
    } else {
      const newSizes = [...formData.sizes];
      newSizes[sizeIndex].quantity = quantity;
      setFormData((prev) => ({ ...prev, sizes: newSizes }));
    }
  };

  // --- Variant Management ---
  const handleVariantChange = (
    variantIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newVariants = [...(formData.variants || [])];
    const key = name as keyof Variant;
    (newVariants[variantIndex] as any)[key] = value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleAddVariant = () => {
    const newVariant = { ...emptyVariant, id: `var-${Date.now()}` };
    setFormData((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant],
    }));
  };

  const handleRemoveVariant = (variantIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== variantIndex),
    }));
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = onAddCategory(newCategoryName.trim());
      setFormData((prev) => ({ ...prev, categoryId: newCat.id }));
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
    >
      <div
        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">
            {product ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <IconX size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Main Product Info */}
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium border-b pb-2">
              Producto Principal
            </h3>
            <Input
              label="Nombre del Producto"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {isAddingCategory ? (
              <div className="flex items-end space-x-2">
                <Input
                  label="Nueva Categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button type="button" onClick={handleAddNewCategory}>
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-end space-x-2">
                <div className="flex-grow">
                  <Select
                    label="Categoría"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Seleccionar categoría
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddingCategory(true)}
                  icon={<IconPlus size={16} />}
                >
                  Nueva
                </Button>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <img
                src={formData.imageUrl}
                alt="Product preview"
                className="w-20 h-20 rounded-md object-cover bg-gray-100"
              />
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen Principal
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Código de Barras"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
              <Input
                label="Precio Costo"
                name="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={handleChange}
              />
              <Input
                label="Precio Venta"
                name="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={handleChange}
              />
            </div>
            <SizeStockManager
              title="Tallas y Stock (Producto Principal)"
              availableSizes={sizes}
              selectedSizes={formData.sizes}
              onToggleSize={(sizeId) => handleToggleSize(sizeId)}
              onSizeChange={(sIndex, e) => handleSizeChange(sIndex, e)}
            />
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Variantes (Opcional)
            </h3>
            {(formData.variants || []).map((variant, vIndex) => (
              <div
                key={variant.id}
                className="p-4 border rounded-md bg-gray-50 space-y-4 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(vIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <IconTrash size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Variante (ej. Color)"
                    name="name"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(vIndex, e)}
                  />
                  <div className="flex items-center space-x-4">
                    <img
                      src={variant.imageUrl}
                      alt="Variant preview"
                      className="w-16 h-16 rounded-md object-cover bg-gray-100"
                    />
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen Variante
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, vIndex)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                      />
                    </div>
                  </div>
                </div>
                <SizeStockManager
                  title="Tallas y Stock (Variante)"
                  availableSizes={sizes}
                  selectedSizes={variant.sizes}
                  onToggleSize={(sizeId) => handleToggleSize(sizeId, vIndex)}
                  onSizeChange={(sIndex, e) =>
                    handleSizeChange(sIndex, e, vIndex)
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddVariant}
              icon={<IconPlus size={16} />}
            >
              Añadir Variante
            </Button>
          </div>

          <div className="flex justify-end p-4 bg-gray-50 -mx-6 -mb-6 mt-6 border-t sticky bottom-0">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Producto</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
