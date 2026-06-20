// components/ui/nav-dropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getActivityCategories } from "@/app/dashboard/super-admin/activities/actions.ts";

type Category = { id: string; name: string };

interface NavDropdownProps {
  label: string;
  baseHref: string; // ex: "/activities"
  isActive: boolean;
}

export function NavDropdown({ label, baseHref, isActive }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Charge les catégories une seule fois, au premier survol
  const loadCategories = async () => {
    if (loaded) return;
    const data = await getActivityCategories();
    setCategories(data);
    setLoaded(true);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    loadCategories();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    // Petit délai pour éviter la fermeture si la souris passe rapidement vers le dropdown
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={baseHref}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          isActive
            ? "text-[var(--aduti-primary)] font-semibold"
            : "text-slate-600 hover:text-[var(--aduti-primary)]"
        )}
      >
        {label}
        
      </Link>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
          <div className="bg-white rounded-md border border-slate-200/60 shadow-sm min-w-[180px]">
            <Link
              href={baseHref}
              className="block px-2 py-0.7 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[var(--aduti-primary)] transition-colors"
            >
              Toutes les activités
            </Link>

            <div className="h-px bg-slate-100 my-1.5 mx-2" />

            {loaded && (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/activities?search=&promo=&category=${category.id}`}
                  className="block px-2 py-0.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[var(--aduti-primary)] transition-colors"
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}