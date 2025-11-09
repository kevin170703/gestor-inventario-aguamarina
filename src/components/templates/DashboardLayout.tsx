"use client";

import React, { useState, ReactNode, useEffect } from "react";
import {
  IconLayoutDashboard,
  IconBuildingStore,
  IconBox,
  IconMenu2,
  IconShoppingBag,
  IconShoppingCart,
  IconBasket,
  IconBasketFilled,
  IconShoppingCartFilled,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

import {
  BasketShopping3BulkRounded,
  LabelDollar2BulkRounded,
  User4BulkRounded,
  ExitOutlinedRounded,
  BarChart4BulkRounded,
} from "@lineiconshq/react-lineicons";

import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Sidebar con callback para cerrar en móvil
interface SidebarProps {
  onNavLinkClick: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ onNavLinkClick }) => {
  const pathname = usePathname();

  const [selectLink, setSelectLink] = useState("");

  useEffect(() => {
    if (pathname) {
      const divideUrl = pathname.split("/");
      setSelectLink(divideUrl[divideUrl.length - 1] || "/");
    }
  }, [pathname]);

  return (
    <aside className="min-w-max w-64 text-black flex flex-col justify-between items-start py-6 h-full border-r border-gray-200 bg-gray-100 px-4">
      <div className="flex items-start justify-center gap-3 pl-4 mb-10 flex-col">
        {/* <IconBuildingStore size={32} className="text-teal-400" /> */}
        <h1 className="text-2xl font-bold ml-2 text-[#10acb9]">Aguamarina</h1>

        {/* <div className="border border-gray-300 rounded-xl flex justify-center items-center gap-3 py-3 px-3 mx-2">
          <User4BulkRounded />
          <div>
            <p className="font-medium text-black/80">Agumarina</p>

            <p className="text-xs text-black/70">agumarinatienda@gmail.com</p>
          </div>
        </div> */}
      </div>

      <nav className="flex-1 flex flex-col justify-start items-start w-full">
        <nav className="flex flex-col space-y-3 pt-6 w-full pr-3">
          <h2 className="text-black/40 font-medium pl-2 text-sm">GENERAL</h2>
          <Link
            href="/inventario"
            onClick={onNavLinkClick}
            className={`${
              selectLink === "inventario"
                ? "text-primary bg-primary/12"
                : "text-black"
            } w-full flex justify-start font-medium items-center gap-3 text-sm py-2 rounded-xl pl-4`}
          >
            {selectLink === "inventario" ? (
              <BasketShopping3BulkRounded className="size-6  text-primary" />
            ) : (
              <BasketShopping3BulkRounded className="size-6" />
            )}
            Inventario
          </Link>

          <Link
            href="/punto-de-venta"
            onClick={onNavLinkClick}
            className={`${
              selectLink === "punto-de-venta"
                ? "text-primary bg-primary/12"
                : "text-black"
            } w-full flex justify-start font-medium items-center gap-3 text-sm py-2 rounded-xl pl-4`}
          >
            {selectLink === "punto-de-venta" ? (
              <LabelDollar2BulkRounded className="size-6  text-primary" />
            ) : (
              <LabelDollar2BulkRounded className="size-6" />
            )}
            Punto de Venta
          </Link>
        </nav>

        {/* <nav className="flex flex-col space-y-3 pt-6 w-full pr-3">
          <h2 className="text-black/40 font-medium pl-2 text-sm">METRICAS</h2>
          <Link
            href="/inventario"
            onClick={onNavLinkClick}
            className={`${
              selectLink === "statistics"
                ? "text-primary bg-primary/12"
                : "text-black"
            } w-full flex justify-start font-medium items-center gap-3 text-sm py-2 rounded-xl pl-4`}
          >
            {selectLink === "statistics" ? (
              <BarChart4BulkRounded className="size-6  text-primary" />
            ) : (
              <BarChart4BulkRounded className="size-6" />
            )}
            Estadisticas
          </Link>
        </nav> */}
      </nav>

      <div className="w-full border-t pt-4 border-gray-300">
        <button
          onClick={onNavLinkClick}
          className={`text-black flex justify-start font-medium items-center gap-3 text-sm rounded-xl pl-2 cursor-pointer transition-colors hover:text-red-800`}
        >
          <ExitOutlinedRounded className="size-6" />
          Salir
        </button>
      </div>
    </aside>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-whitee">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform 
          lg:relative lg:translate-x-0 lg:flex-shrink-0
          transition-transform duration-300 ease-in-out max-md:w-full
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onNavLinkClick={closeSidebar} />
      </div>

      {/* Backdrop overlay móvil */}
      <div
        className={`fixed ${
          isSidebarOpen ? "top-4 right-4" : "inset-4"
        }  size-10 p-2 shadow bg-white rounded-full bg-opacity-50 z-99 lg:hidden`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-hidden="true"
      >
        {isSidebarOpen ? (
          <IconX className="size-full" />
        ) : (
          <IconMenu2 className="size-full" />
        )}
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hiddenn">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
