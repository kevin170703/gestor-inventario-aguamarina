"use client";

import React, { useEffect, useState } from "react";
import { CartItem } from "@/types/types";
import {
  IconLoader2,
  IconMinus,
  IconPlus,
  IconShoppingCart,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Image from "next/image";

interface ShoppingCartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, setCart }) => {
  const router = useRouter();

  const [createOrder, setCreateOrder] = useState(false);

  const updateItem = (id: string, size: string, updates: Partial<CartItem>) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.size === size ? { ...item, ...updates } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAddition, setTotalAddition] = useState(0);
  // const [subtotal, setSubtotal] = useState(0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const total = subtotal + totalAddition - totalDiscount;

  const handleProcessSale = async () => {
    setCreateOrder(true);
    if (cart.length === 0) return;

    const sale = {
      id: `sale-${Date.now()}`,
      items: cart,
      total,
      date: new Date(),
    };

    const formatIdsProducts = cart.map((product) => ({
      ...product,
      id: product.id.split(".")[0],
    }));

    const { data } = await api.post("/pos/order", {
      total,
      items: formatIdsProducts,
      discount: totalDiscount,
    });

    if (data.success) {
      setCart([]);

      sessionStorage.setItem("currentSale", JSON.stringify(sale));

      setTimeout(() => {
        setCreateOrder(false);

        router.push("/recibo");
      }, 100);

      // navigate("/recibo", { state: { sale } });
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col h-full">
      <h3 className="text-xl font-semibold flex items-center p-4 border-b border-gray-200">
        Carrito de Compras
      </h3>

      <div className="flex-grow overflow-y-auto p-4 space-y-3 px-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">
            El carrito está vacío.
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-center space-x-3 p-2  border-b border-gray-200 relative"
            >
              <div className="size-14 rounded-full p-1 border border-gray-200 mr-3 ">
                <Image
                  width={250}
                  height={250}
                  src={item.mainImage}
                  alt={item.name}
                  className="size-full rounded-full object-contain "
                />
              </div>

              <div className="flex-grow">
                <p className="font-medium text-sm">
                  {item.name} ({item.size})
                </p>

                <p className="text-sm font-medium text-primary">
                  ${item.unitPrice.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="flex justify-end items-center gap-3">
                <div className="flex items-center">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateItem(item.id, item.size, {
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    className="p-1 bg-primary text-white rounded-full disabled:opacity-50"
                  >
                    <IconMinus className="size-4" />
                  </button>

                  <input
                    type="text"
                    disabled
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, item.size, {
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-10 text-center"
                  />

                  <button
                    disabled={item.quantity >= 10}
                    onClick={() =>
                      updateItem(item.id, item.size, {
                        quantity: item.quantity + 1,
                      })
                    }
                    className="p-1 bg-primary text-white rounded-full disabled:opacity-50"
                  >
                    <IconPlus className="size-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 rounded-full text-white p-1  hover:bg-red-700 absolute top-1 left-1"
                >
                  <IconX className="size-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 mt-auto border-t border-gray-200">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between pr-1 text-base font-medium">
            <span className=" text-black/60">Subtotal:</span>{" "}
            <span className="">{subtotal.toLocaleString("es-AR")}</span>
          </div>

          <div className="w-full flex justify-between items-center gap-2 text-base font-medium">
            <span className="flex-1 text-black/60">Descuentos:</span>{" "}
            <div className="flex justify-end items-center gap-0">
              {/* <p>$</p> */}
              <input
                type="text"
                value={
                  totalDiscount === 0
                    ? "0"
                    : totalDiscount.toLocaleString("es-AR")
                }
                onChange={(e) => {
                  const numericValue = Number(
                    e.target.value.replace(/\./g, "").replace(",", ".")
                  );
                  setTotalDiscount(isNaN(numericValue) ? 0 : numericValue);
                }}
                onFocus={(e) => e.target.select()}
                size={String(totalDiscount.toLocaleString("es-AR")).length || 1}
                className="border-none outline-none pr-1 text-red-500  text-right"
              />
            </div>
          </div>

          <div className="w-full flex justify-between items-center gap-2 text-base font-medium">
            <span className="flex-1 text-black/60">Adicional:</span>{" "}
            <div className="flex justify-end items-center gap-0">
              {/* <p>$</p> */}
              <input
                type="text"
                value={
                  totalAddition === 0
                    ? "0"
                    : totalAddition.toLocaleString("es-AR")
                }
                onChange={(e) => {
                  const numericValue = Number(
                    e.target.value.replace(/\./g, "").replace(",", ".")
                  );
                  setTotalAddition(isNaN(numericValue) ? 0 : numericValue);
                }}
                onFocus={(e) => e.target.select()}
                size={String(totalAddition.toLocaleString("es-AR")).length || 1}
                className="border-none outline-none pr-1 text-red-500  text-right"
              />
            </div>
          </div>

          <div className="flex justify-between font-medium text-base">
            <span>Total:</span> <span>{total.toLocaleString("es-AR")}</span>
          </div>
        </div>

        <Button
          onClick={handleProcessSale}
          disabled={cart.length === 0}
          className="w-full mt-4"
        >
          {createOrder ? (
            <IconLoader2 className="animate-spin" />
          ) : (
            "Realizar Venta"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCart;
