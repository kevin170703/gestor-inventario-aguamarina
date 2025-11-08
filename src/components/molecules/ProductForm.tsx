"use client";

import React, { useState, useEffect } from "react";
import { Product, Category, Size, Variant, ProductSize } from "@/types/types";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import UploadImage from "../atoms/UploadImage";
import TextArea from "../atoms/TextArea";

import { AnimatePresence, motion } from "framer-motion";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
  categories: Category[];
  sizes: Size[];
  onAddCategory: (name: string) => Promise<Category>;
  onAddSize: (name: string) => Promise<Size>;
}

const emptyVariant: Omit<Variant, "id"> = {
  name: "",
  mainImage: "",
  ProductSizes: [],
  isActive: true,
  barcode: "",
};
const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "",
  barcode: "",
  costPrice: 0,
  salePrice: 0,
  mainImage: "",
  ProductSizes: [],
  Variants: [],
  description: "",
  isActive: true,
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
  const [newSizeName, setNewSizeName] = useState("");
  const [isAddingSize, setIsAddingSize] = useState(false);

  useEffect(() => {
    setFormData(product ? JSON.parse(JSON.stringify(product)) : emptyProduct);
  }, [product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (
    file: File | null,
    variantIndex: number | null = null
  ) => {
    console.log(variantIndex, "index variante");
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const mainImage = reader.result as string;
        if (variantIndex !== null) {
          console.log("entro aca por imagen variante");
          const newVariants = [...(formData.Variants || [])];
          newVariants[variantIndex].mainImage = mainImage;
          setFormData((prev) => ({ ...prev, Variants: newVariants }));
        } else {
          setFormData((prev) => ({ ...prev, mainImage }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Size Management ---
  const handleChangeSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    const size = sizes.find((s) => s.name === value);
    if (!size) return;

    console.log("pase primero");

    const existSizeProduct = formData.ProductSizes.find(
      (s) => s.name === value
    );
    if (existSizeProduct) return;
    console.log("pase segundo");

    setFormData((prev) => ({
      ...formData,
      ProductSizes: [...prev.ProductSizes, { name: size.name, quantity: 1 }],
    }));
  };

  const handleChangeSizeQuantity = (name: string, quantity: string) => {
    const size = formData.ProductSizes.find((s) => s.name === name);
    if (!size) return;

    setFormData((prev) => ({
      ...prev,
      ProductSizes: prev.ProductSizes.map((s) =>
        s.name === name ? { ...s, quantity: parseInt(quantity) } : s
      ),
    }));
  };

  const handleSizeDelete = (name: string) => {
    const size = formData.ProductSizes.find((s) => s.name === name);
    if (!size) return;

    setFormData((prev) => ({
      ...prev,
      ProductSizes: prev.ProductSizes.filter((s) => s.name !== name),
    }));
  };

  // --- Variant Management ---
  const handleVariantChange = (
    variantIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newVariants = [...(formData.Variants || [])];
    const key = name as keyof Variant;
    (newVariants[variantIndex] as any)[key] = value;
    setFormData((prev) => ({ ...prev, Variants: newVariants }));
  };

  const handleChangeSizeVariant = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    const { value } = e.target;

    const size = sizes.find((s) => s.name === value);
    if (!size) return;

    const variant = formData.Variants?.find((s) => s.id === id);
    if (!variant) return;

    const existSizeProduct = variant.ProductSizes.find((s) => s.name === value);
    if (existSizeProduct) return;

    setFormData((prev) => ({
      ...prev,
      Variants: prev.Variants?.map((v) =>
        v.id === id
          ? {
              ...v,
              ProductSizes: [
                ...v.ProductSizes,
                { name: size.name, quantity: 1 },
              ],
            }
          : v
      ),
    }));
  };

  const handleChangeSizeQuantityVariant = (
    name: string,
    quantity: string,
    id: string
  ) => {
    const variant = formData.Variants?.find((s) => s.id === id);
    if (!variant) return;

    const size = variant.ProductSizes.find((s) => s.name === name);
    if (!size) return;

    setFormData((prev) => ({
      ...prev,
      Variants: prev.Variants?.map((v) =>
        v.id === id
          ? {
              ...v,
              ProductSizes: v.ProductSizes.map((s) =>
                s.name === name ? { ...s, quantity: parseInt(quantity) } : s
              ),
            }
          : v
      ),
    }));
  };

  const handleSizeDeleteVariant = (name: string, id: string) => {
    const variant = formData.Variants?.find((s) => s.id === id);
    if (!variant) return;

    const size = variant.ProductSizes.find((s) => s.name === name);
    if (!size) return;

    setFormData((prev) => ({
      ...prev,
      ProductSizes: prev.ProductSizes.filter((s) => s.name !== name),
    }));

    setFormData((prev) => ({
      ...prev,
      Variants: prev.Variants?.map((v) =>
        v.id === id
          ? {
              ...v,
              ProductSizes: v.ProductSizes.filter((s) => s.name !== name),
            }
          : v
      ),
    }));
  };

  const handleAddVariant = () => {
    const newVariant = { ...emptyVariant, id: `var-${Date.now()}` };
    setFormData((prev) => ({
      ...prev,
      Variants: [...(prev.Variants || []), newVariant],
    }));
  };

  const handleRemoveVariant = (variantIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: (prev.Variants || []).filter((_, i) => i !== variantIndex),
    }));
  };

  const handleAddNewCategory = async () => {
    if (newCategoryName.trim()) {
      const newCat = await onAddCategory(newCategoryName.trim());
      if (newCat) {
        setFormData((prev) => ({ ...prev, category: newCategoryName.trim() }));
        setNewCategoryName("");
        setIsAddingCategory(false);
      }
    }
  };

  const handleAddNewSize = async () => {
    if (newSizeName.trim()) {
      const newSize = await onAddSize(newSizeName);
      console.log(newSize, "nuevo talle");
      if (newSize) {
        setFormData((prev) => ({
          ...prev,
          sizes: [
            ...prev.ProductSizes,
            { name: newSize.name, id: newSize.id, quantity: 0 },
          ],
        }));
        setNewSizeName("");
        setIsAddingCategory(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      key="product-form"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
      onClick={onClose}
    >
      <div
        className="fixed top-0 right-0 h-full w-full max-w-2xl overflow-hidden bg-white rounded-l-2xl  flex flex-col border-l border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 mx-4">
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
          className="flex-1 overflow-y-auto pt-6 space-y-6 px-4 "
        >
          {/* Main Product Info */}
          <div className="space-y-6 border-b border-gray-200 py-4 ">
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen Principal
                </label>

                <div className="size-52">
                  <UploadImage
                    id="mainImage"
                    value={
                      formData.mainImage === ""
                        ? null // 👈 si es File, no hay string todavía
                        : formData.mainImage || null // 👈 si es string, lo pasamos
                    }
                    onChange={(image) => {
                      // handleChange("coverImage", image?.preview ?? null);
                      handleImageChange(image?.file ?? null); // opcional: guardar el file real
                    }}
                  />
                </div>
              </div>
            </div>

            <Input
              label="Nombre del Producto"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <TextArea
              label="Descripción"
              name="description"
              value={formData.description}
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
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Seleccionar categoría
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              <Input
                label="Código de Barras"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
              />
              <Input
                label="Precio Costo"
                name="costPrice"
                type="text"
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

            {isAddingSize ? (
              <div className="flex items-end space-x-2">
                <Input
                  label="Nuevo talle"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                />
                <Button type="button" onClick={handleAddNewSize}>
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddingSize(false)}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <Select
                      label="Talles"
                      name="sizes"
                      // value={formData}
                      onChange={handleChangeSize}
                    >
                      <option value="">Seleccionar talle</option>
                      {sizes.map((size) => (
                        <option key={size.id} value={size.name}>
                          {size.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsAddingSize(true)}
                    icon={<IconPlus size={16} />}
                  >
                    Nuevo
                  </Button>
                </div>

                <div className="flex flex-wrap justify-start items-center gap-4">
                  {formData.ProductSizes.map((size) => (
                    <div
                      key={size.name}
                      className="flex justify-start items-center gap-2 relative"
                    >
                      <button
                        className="rounded-full size-4 p-0.5 bg-red-400 text-white cursor-pointer absolute top-0 right-0"
                        onClick={() => handleSizeDelete(size.name)}
                      >
                        <IconX className="size-full" />
                      </button>

                      <p className="font-medium">{size.name}:</p>
                      <input
                        value={size.quantity}
                        onChange={(e) =>
                          handleChangeSizeQuantity(size.name, e.target.value)
                        }
                        min={0}
                        type="number"
                        className="px-3 h-12 w-16 border bg-white border-gray-200 rounded-xl focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
              // <Button
              //   type="button"
              //   variant="secondary"
              //   // onClick={() => setIsAddingCategory(true)}
              //   icon={<IconPlus size={16} />}
              // >
              //   Nueva
              // </Button>
            )}
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium ">Variantes (Opcional)</h3>
            {(formData.Variants || []).map((variant, vIndex) => (
              <div
                key={variant.id}
                className="p-6 border border-gray-200 rounded-3xl bg-white space-y-4 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(vIndex)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <IconTrash size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <Input
                    label="Nombre Variante (ej. Color)"
                    name="name"
                    type="text"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(vIndex, e)}
                  />

                  <Input
                    type="text"
                    label="Código de Barras"
                    name="barcode"
                    value={variant.barcode}
                    onChange={(e) => handleVariantChange(vIndex, e)}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagen Variante
                    </label>
                    <div className="size-52">
                      <UploadImage
                        id={variant.id.toString()}
                        value={
                          variant.mainImage === ""
                            ? null // 👈 si es File, no hay string todavía
                            : variant.mainImage || null // 👈 si es string, lo pasamos
                        }
                        onChange={(image) => {
                          // handleChange("coverImage", image?.preview ?? null);
                          handleImageChange(image?.file ?? null, vIndex); // opcional: guardar el file real
                        }}
                      />
                    </div>
                  </div>
                </div>

                {isAddingSize ? (
                  <div className="flex items-end space-x-2">
                    <Input
                      label="Nuevo talle"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddNewSize}>
                      Guardar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsAddingSize(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-end space-x-2">
                      <div className="flex-grow">
                        <Select
                          label="Talles"
                          name="sizes"
                          // value={}
                          onChange={(e) =>
                            handleChangeSizeVariant(e, variant.id)
                          }
                        >
                          <option value="">Seleccionar talle</option>
                          {sizes.map((size) => (
                            <option key={size.id} value={size.name}>
                              {size.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsAddingSize(true)}
                        icon={<IconPlus size={16} />}
                      >
                        Nuevo
                      </Button>
                    </div>

                    <div className="flex flex-wrap justify-start items-center gap-4">
                      {variant.ProductSizes.map((size) => (
                        <div
                          key={size.name}
                          className="flex justify-start items-center gap-2 relative"
                        >
                          <button
                            className="rounded-full size-4 p-0.5 bg-red-400 text-white cursor-pointer absolute top-0 right-0"
                            onClick={() =>
                              handleSizeDeleteVariant(size.name, variant.id)
                            }
                          >
                            <IconX className="size-full" />
                          </button>

                          <p className="font-medium">{size.name}:</p>
                          <input
                            value={size.quantity}
                            onChange={(e) =>
                              handleChangeSizeQuantityVariant(
                                size.name,
                                e.target.value,
                                variant.id
                              )
                            }
                            min={0}
                            type="number"
                            className="px-3 h-12 w-16 border bg-white border-gray-200 rounded-xl focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  // <Button
                  //   type="button"
                  //   variant="secondary"
                  //   // onClick={() => setIsAddingCategory(true)}
                  //   icon={<IconPlus size={16} />}
                  // >
                  //   Nueva
                  // </Button>
                )}

                {/* <SizeStockManager
                  title="Tallas y Stock (Variante)"
                  availableSizes={sizes}
                  selectedSizes={variant.sizes}
                  onToggleSize={(sizeId) => handleToggleSize(sizeId, vIndex)}
                  onSizeChange={(sIndex, e) =>
                    handleSizeChange(sIndex, e, vIndex)
                  }
                /> */}
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

          <div className="flex justify-end p-4  mt-6 border-t border-gray-200 bg-red-400 sticky bottom-0">
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
    </motion.div>
  );
};

export default ProductForm;
