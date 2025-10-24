// import {
//   AlignHorizontalDistributeEndIcon,
//   Home,
//   ListTree,
//   Menu,
//   PackagePlus,
//   X,
// } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// export default function NavBar() {
//   const pathName = usePathname();
//   const [menuOpen, setMenuOpen] = React.useState(false);
//   const navLinks = [
//     { name: "Home", href: "/", icon: Home },
//     { name: "Categories", href: "/category", icon: ListTree },
//     { name: "About", href: "/about", icon: AlignHorizontalDistributeEndIcon },
//   ];
//   const renderLinks = (baseClass: string) => (
//     <>
//       {navLinks.map(({ name, href, icon: Icon }) => {
//         const isActive = pathName === href;
//         const activeClass = isActive ? "btn-primary text-white" : "btn-ghost";
//         return (
//           <Link
//             href={href}
//             key={name}
//             className={`${baseClass} btn-sm flex gap-2 items-center ${activeClass}`}
//           >
//             <Icon className="w-4 h-4" />
//             {name}
//           </Link>
//         );
//       })}
//     </>
//   );

//   return (
//     <div className="border-b border-base-300 px-5 md:px-[10%] py-4 relative">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center">
//           <div className="p-2">
//             <PackagePlus className="w-6 h-6 text-primary" />
//           </div>
//           <span className="font-bold text-xl">OptiStock</span>
//         </div>

//         <button
//           className="btn btn-sm w-fit sm:hidden"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           <Menu className="w-5 h-5" />
//           {menuOpen && (
//             <div className="dropdown-content absolute right-5 top-16 bg-base-100 shadow-md rounded-md flex flex-col gap-2 p-4 z-10">
//               {renderLinks("btn-ghost")}
//             </div>
//           )}
//         </button>

//         <div className="hidden space-x-2 sm:flex items-center">
//           {renderLinks("btn")}
//         </div>
//       </div>

//       <div className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden z-50 ${menuOpen ? "left-0" : "-left-full"}`}>
//         <div className="flex justify-between ">
//           <button
//             className="btn btn-sm w-fit sm:hidden"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             <X className="w-5 h-5" />
//             {menuOpen && (
//               <div className="dropdown-content absolute right-5 top-16 bg-base-100 shadow-md rounded-md flex flex-col gap-2 p-4 z-10">
                
//               </div>
//             )}
//           </button>
//         </div>
//         {renderLinks("btn")}
//       </div>
//     </div>
//   );
// }



"use client";

import {
  AlignHorizontalDistributeEndIcon,
  Home,
  ListTree,
  Menu,
  PackagePlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavBar() {
  const pathName = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/category", icon: ListTree },
    { name: "About", href: "/about", icon: AlignHorizontalDistributeEndIcon },
  ];

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
        className={`absolute top-0 left-0 w-full bg-base-100 h-screen flex flex-col gap-4 p-6 transition-all duration-300 sm:hidden z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header du menu mobile */}
        <div className="flex justify-between items-center mb-4">
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
    </div>
  );
}
