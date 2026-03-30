"use client";

import { Home, LayoutGrid, Map as MapIcon, Heart, Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutGrid, href: "/" },
    { icon: MapIcon, href: "/map" },
    { icon: Heart, href: "/saved" },
    { icon: Bell, href: "/alerts" },
  ];

  return (
    <nav className="w-full md:w-16 min-w-[64px] border-t md:border-t-0 md:border-r border-[#1f1f1f] bg-[#0c0c0c] flex flex-row md:flex-col items-center py-2 px-6 md:px-0 md:py-5 justify-between h-[64px] md:h-full z-[100] shrink-0 safe-bottom">
      <div className="flex flex-row md:flex-col gap-2 md:gap-8 w-full md:w-auto items-center justify-between md:justify-center flex-1 md:flex-none">
        {/* Logo element: hidden on mobile */}
        <Link href="/" className="hidden md:flex w-9 h-9 bg-[#C1F32A] rounded-xl items-center justify-center text-black shadow-lg hover:bg-white transition-colors">
          <Home className="w-5 h-5 fill-black stroke-[1.5]" />
        </Link>

        {/* Home text placeholder for mobile */}
        <Link href="/" className="md:hidden flex flex-col items-center justify-center w-10 h-10">
           <Home className="w-5 h-5 text-[#C1F32A]" />
        </Link>

        <div className="flex flex-row md:flex-col gap-6 md:gap-4 mt-0 md:mt-2 w-full md:w-auto items-center justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className="relative group">
                <button 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive 
                      ? "md:border md:border-white/5 md:bg-[#1a1a1a] text-[#C1F32A] md:shadow-inner" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-[-10px] md:top-1/2 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 w-4 md:w-1 h-1 md:h-4 bg-[#C1F32A] rounded-b-md md:rounded-b-none md:rounded-r-md"></div>
                  )}
                  <Icon className="w-[22px] h-[22px] md:w-5 md:h-5" />
                </button>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* User avatar bottom */}
      <div className="w-8 h-8 rounded-full bg-[#1f1f1f] text-white font-bold flex items-center justify-center text-[10px] uppercase shadow-md cursor-pointer hover:bg-white hover:text-black transition-colors md:mt-auto hidden md:flex">
        JD
      </div>

      <button className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-400">
        <Menu className="w-6 h-6" />
      </button>
    </nav>
  );
}
