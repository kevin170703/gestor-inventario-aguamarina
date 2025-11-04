"use client";

import React, { useEffect, useState } from "react";
import { CartItem } from "@/types/types";
import { IconShoppingCart, IconTrash, IconX } from "@tabler/icons-react";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";

interface ShoppingCartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, setCart }) => {
  const router = useRouter();

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
  // const [subtotal, setSubtotal] = useState(0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const total = subtotal - totalDiscount;

  const handleProcessSale = () => {
    if (cart.length === 0) return;

    const sale = {
      id: `sale-${Date.now()}`,
      items: cart,
      total,
      date: new Date(),
    };

    sessionStorage.setItem("currentSale", JSON.stringify(sale));

    setTimeout(() => {
      router.push("/recibo");
    }, 100);

    // navigate("/recibo", { state: { sale } });

    setCart([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-full p-4">
      <div className="p-4 bg-black/6 rounded-xl ">
        <h3 className="text-lg font-semibold flex items-center">
          Carrito de Compras
        </h3>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">
            El carrito está vacío.
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-2  border-b border-gray-200"
            >
              <img
                src={item.mainImage}
                alt={item.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-grow">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.size}</p>
                <p className="text-sm font-medium text-teal-600">
                  ${item.unitPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-end items-center gap-3">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateItem(item.id, item.size, {
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    className="px-2 border rounded-full"
                  >
                    -
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
                    onClick={() =>
                      updateItem(item.id, item.size, {
                        quantity: item.quantity + 1,
                      })
                    }
                    className="px-2 border rounded-full"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 rounded-full text-white p-1  hover:bg-red-700"
                >
                  <IconX className="size-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4  rounded-xl mt-auto bg-black/6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between pr-1">
            <span>Subtotal:</span>{" "}
            <span className="text-xl">{subtotal.toLocaleString("es-AR")}</span>
          </div>

          <div className="w-full flex justify-between items-center gap-2">
            <span className="flex-1">Descuentos:</span>{" "}
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
                className="border-none outline-none rounded-xl pr-1 text-red-500  text-right text-xl"
              />
            </div>
          </div>

          <div className="flex justify-between font-bold text-xl pr-1 border-t border-gray-300 pt-3">
            <span>Total:</span> <span>{total.toLocaleString("es-AR")}</span>
          </div>
        </div>
        <Button
          onClick={handleProcessSale}
          disabled={cart.length === 0}
          className="w-full mt-4"
        >
          Realizar Venta
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCart;
