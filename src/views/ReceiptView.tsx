"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { IconPrinter } from "@tabler/icons-react";
import { Sale } from "@/types/types";
import Link from "next/link";

const ReceiptView: React.FC = () => {
  const router = useRouter();
  // const searchParams = useSearchParams();

  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    // ✅ Este código solo se ejecuta en el cliente
    const saleData = window.sessionStorage.getItem("currentSale");

    if (!saleData) {
      router.replace("/punto-de-venta");
      return;
    }

    try {
      setSale(JSON.parse(saleData));
    } catch {
      router.replace("/punto-de-venta");
    }
  }, [router]);

  const subtotal = sale?.items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  if (!sale) return null;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center max-md:pt-18">
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
                <td className="text-right">
                  ${item.unitPrice.toLocaleString("es-AR")}
                </td>
                <td className="text-right">
                  ${(item.unitPrice * item.quantity).toLocaleString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="my-4 border-t border-dashed"></div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="">${subtotal?.toLocaleString("es-AR")}</span>
          </div>

          <div className="flex justify-between">
            <span>Descuentos:</span>
            <span className="">
              ${sale.totalDiscount.toLocaleString("es-AR")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Adición:</span>
            <span className="">
              ${sale.totalAddition.toLocaleString("es-AR")}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>Total:</span>
            <span>${sale.total.toLocaleString("es-AR")}</span>
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
        <button
          className="bg-primary w-max mt-3 h-11 px-3 min-w-[150px] flex justify-center items-center gap-2 text-white rounded-2xl text-sm cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-50"
          onClick={() => window.print()}
        >
          <IconPrinter size={16} />
          Imprimir
        </button>
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
