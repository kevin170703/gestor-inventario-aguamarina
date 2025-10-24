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
} from "@tabler/icons-react";
import Link from "next/link";

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
    <aside className="min-w-max w-64 bg-white text-black flex flex-col pb-6 h-full border-r border-gray-200">
      <div className="flex items-center  pl-4 h-18">
        {/* <IconBuildingStore size={32} className="text-teal-400" /> */}
        <h1 className="text-2xl font-bold ml-2 text-teal-400">Aguamarina</h1>
      </div>

      <nav className="flex flex-col space-y-3 border-y border-gray-200 py-6 px-4">
        <h2 className="text-black/40 font-medium pl-2 text-sm">GENERAL</h2>
        <Link
          href="/inventario"
          onClick={onNavLinkClick}
          className={`${
            selectLink === "inventario" ? "font-semibold bg-black/6" : ""
          } flex justify-start text-black/90 items-center gap-3 font-medium text-sm py-2 rounded-xl pl-2`}
        >
          {selectLink === "inventario" ? (
            <IconBasketFilled className="size-6" />
          ) : (
            <IconBasket className="size-6" />
          )}
          Inventario
        </Link>

        <Link
          href="/punto-de-venta"
          onClick={onNavLinkClick}
          className={`${
            selectLink === "punto-de-venta" ? "font-semibold bg-black/6" : ""
          } flex justify-start text-black/90 items-center gap-3 font-medium text-sm py-2 rounded-xl pl-2`}
        >
          {selectLink === "punto-de-venta" ? (
            <IconShoppingCartFilled className="size-6" />
          ) : (
            <IconShoppingCart className="size-6" />
          )}
          Punto de Venta
        </Link>
      </nav>
    </aside>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform 
          lg:relative lg:translate-x-0 lg:flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onNavLinkClick={closeSidebar} />
      </div>

      {/* Backdrop overlay móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white px-6 h-18 border-b border-gray-200 flex items-center space-x-4">
          <button
            aria-label="Open sidebar"
            className="lg:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setIsSidebarOpen(true)}
          >
            <IconMenu2 size={24} />
          </button>
        </header>

        {/* Aquí va el contenido de las páginas hijas */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
