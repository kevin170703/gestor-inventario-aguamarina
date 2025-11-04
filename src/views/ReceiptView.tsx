"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/atoms/Button";
import { IconPrinter, IconArrowLeft } from "@tabler/icons-react";
import { Sale } from "@/types/types";
import Link from "next/link";

const ReceiptView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saleData = sessionStorage.getItem("currentSale"); // ejemplo: /recibo?saleId=123

  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (!saleData) {
      router.replace("/punto-de-venta");
      return;
    }

    setSale(JSON.parse(saleData));

    // 🔹 Cargar los datos de la venta (puede venir del backend o de un estado global)
    // const fetchSale = async () => {
    //   const res = await fetch(`/api/sales/${saleId}`);
    //   if (res.ok) {
    //     const data = await res.json();
    //     setSale(data);
    //   } else {
    //     router.replace("/punto-de-venta");
    //   }
    // };

    // fetchSale();
  }, [saleData, router]);

  if (!sale) return null;

  const subtotal = sale.items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const totalDiscount = sale.items.reduce(
    (acc, item) => acc * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto bg-white p-6 shadow-lg printable-area">
        <h1 className="text-center text-2xl font-bold mb-2">Recibo de Venta</h1>
        <p className="text-center text-sm text-gray-500">POS Pro</p>
        <div className="my-4 border-t border-dashed"></div>
        <p className="text-sm">
          <strong>ID Venta:</strong> {sale.id}
        </p>
        <p className="text-sm">
          <strong>Fecha:</strong> {new Date(sale.date).toLocaleString()}
        </p>
        <div className="my-4 border-t border-dashed"></div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dashed">
              <th className="text-left py-2">Producto</th>
              <th className="text-center">Cant.</th>
              <th className="text-right">Precio</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">
                  {item.name}
                  <div className="text-xs text-gray-500">{item.size}</div>
                </td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="text-right">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="my-4 border-t border-dashed"></div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between">
              <span>Descuentos:</span>
              <span className="text-red-500">-${totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>Total:</span>
            <span>${sale.total.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          ¡Gracias por su compra!
        </p>
      </div>

      <div className="mt-6 w-full max-w-md no-print flex justify-between items-center">
        <Link href={"/punto-de-venta"}>Volver al POS</Link>
        {/* <Button variant="secondary" hre icon={<IconArrowLeft size={16}/>}>
            </Button> */}
        <Button onClick={() => window.print()} icon={<IconPrinter size={16} />}>
          Imprimir
        </Button>
      </div>

      <style jsx global>{`
        /* Centrado en vista normal */
        .printable-area {
          margin-left: auto;
          margin-right: auto;
        }

        @media print {
          @page {
            size: auto;
            margin: 0;
          }

          /* Oculta todo lo demás */
          body * {
            visibility: hidden !important;
          }

          /* Muestra solo el recibo */
          .printable-area,
          .printable-area * {
            visibility: visible !important;
          }

          /* Centrado vertical y horizontal */
          .printable-area {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;

            width: auto !important;
            max-width: 320px !important; /* Ajustá según el ancho deseado */
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0.6cm !important;
          }

          /* Oculta los botones y elementos de control */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptView;
