"use client";

import React from "react";
import { CartItem } from "@/types/types";
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";

interface ShoppingCartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, setCart }) => {
  const router = useRouter();

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const totalDiscount = cart.reduce(
    (acc, item) => acc + item.discount * item.quantity,
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

    router.push("/recibo");

    // navigate("/recibo", { state: { sale } });

    setCart([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold flex items-center">
          <IconShoppingCart size={20} className="mr-2" /> Carrito de Compras
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
              className="flex items-start space-x-3 p-2 bg-gray-50 rounded-md"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-grow">
                <p className="font-semibold text-sm">{item.productName}</p>
                <p className="text-xs text-gray-500">
                  {item.variantName} / {item.sizeName}
                </p>
                <p className="text-sm font-medium text-teal-600">
                  ${item.unitPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateItem(item.id, {
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    className="px-2 py-0.5 border rounded-l-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, {
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-10 text-center border-t border-b"
                  />
                  <button
                    onClick={() =>
                      updateItem(item.id, { quantity: item.quantity + 1 })
                    }
                    className="px-2 py-0.5 border rounded-r-md"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center text-xs">
                  <span className="mr-1">Desc: $</span>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      updateItem(item.id, {
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-12 text-center border rounded-md"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IconTrash size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t mt-auto bg-gray-50">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Descuentos:</span>{" "}
            <span className="text-red-500">-${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span> <span>${total.toFixed(2)}</span>
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
