"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  AlignHorizontalDistributeEndIcon,
  HandHeart,
  Home,
  LayoutDashboard,
  ListTree,
  Menu,
  PackagePlus,
  PlusCircle,
  Receipt,
  ShoppingBasket,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { checkAndAddAssociation } from "../actions";
import Stock from "./Stock";

export default function NavBar() {
  const pathName = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user } = useUser();

  const navLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "New Product", href: "/new-product", icon: PlusCircle },
    { name: "Products", href: "/products", icon: ShoppingBasket },
    { name: "Categories", href: "/category", icon: ListTree },
    { name: "Give", href: "/give", icon: HandHeart },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    // { name: "About", href: "/about", icon: AlignHorizontalDistributeEndIcon },
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddAssociation(user?.primaryEmailAddress?.emailAddress, user.fullName)
    }
  }, [user])

  const renderLinks = (baseClass: string) => (
    <>
      {navLinks.map(({ name, href, icon: Icon }) => {
        const isActive = pathName === href;
        const activeClass = isActive ? "btn-primary text-white" : "btn-ghost";
        return (
          <Link
            href={href}
            key={name}
            onClick={() => setMenuOpen(false)} // fermer le menu après clic
            className={`${baseClass} flex gap-2 items-center ${activeClass}`}
          >
            <Icon className="w-4 h-4" />
            {name}
          </Link>
        );
      })}
      <button
        className="btn btn-sm "
        onClick={() => (document.getElementById('my_modal_stock') as HTMLDialogElement).showModal()}
      >
        <Warehouse />
        to replenish the stock
      </button>

    </>
  );

  return (
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4 relative bg-base-100">
      <div className="flex justify-between items-center">
        {/* Logo + Nom */}
        <div className="flex items-center gap-2">
          <PackagePlus className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">OptiStock</span>
        </div>

        {/* Menu Desktop */}
        <div className="hidden sm:flex items-center space-x-2">
          {renderLinks("btn")}
          <UserButton />
        </div>

        {/* Bouton Menu Mobile */}
        <button
          className="btn btn-sm w-fit sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu Mobile Fullscreen */}
      <div
        className={`absolute top-0 left-0 w-full bg-base-100 h-screen flex flex-col gap-4 p-6 transition-all duration-300 sm:hidden z-50 ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header du menu mobile */}
        <div className="flex justify-between items-center mb-4">
          <UserButton />
          <div className="flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">OptiStock</span>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => setMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Liens du menu mobile */}
        {renderLinks("btn")}

      </div>
      <Stock />
    </div>
  );
}
