"use client";

import { Home, LayoutGrid, Map as MapIcon, Heart, Bell, Menu, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';


export default function SidebarNav() {
  const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setUser(session?.user ?? null);
  //   });

  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  const navItems = [
    { icon: LayoutGrid, href: "/" },
    { icon: MapIcon, href: "/map" },
    { icon: Heart, href: "/saved" },
    { icon: Bell, href: "/alerts" },
  ];

  return (
    <nav className="w-full md:w-16 min-w-[64px] border-t md:border-t-0 md:border-r border-zinc-200 bg-white flex flex-row md:flex-col items-center py-2 px-6 md:px-0 md:py-5 justify-between h-[64px] md:h-full z-[100] shrink-0 safe-bottom">
      <div className="flex flex-row md:flex-col gap-2 md:gap-8 w-full md:w-auto items-center justify-between md:justify-center flex-1 md:flex-none">
        {/* Logo element: hidden on mobile */}
        <Link href="/" className="hidden md:flex w-9 h-9 bg-black rounded-xl items-center justify-center text-white shadow-lg hover:bg-zinc-800 transition-colors">
          <Home className="w-5 h-5 fill-white stroke-[1.5]" />
        </Link>

        {/* Home text placeholder for mobile */}
        <Link href="/" className="md:hidden flex flex-col items-center justify-center w-10 h-10">
           <Home className="w-5 h-5 text-black" />
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
                      ? "md:border md:border-zinc-200 md:bg-zinc-50 text-black md:shadow-sm" 
                      : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-[-10px] md:top-1/2 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 w-4 md:w-1 h-1 md:h-4 bg-black rounded-b-md md:rounded-b-none md:rounded-r-md"></div>
                  )}
                  <Icon className="w-[22px] h-[22px] md:w-5 md:h-5" />
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      
      
      {/* User avatar bottom */}
      <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold flex items-center justify-center text-[10px] uppercase shadow-sm cursor-pointer hover:bg-zinc-200 transition-colors md:mt-auto hidden md:flex">
        JD
      </div>

      <button className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-400">
        <Menu className="w-6 h-6" />
      </button>
    </nav>
  );
}
