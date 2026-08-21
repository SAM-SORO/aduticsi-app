// components/ui/nav-dropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getActivityCategories } from "@/app/dashboard/super-admin/activities/actions";
import { getPostes } from "@/app/dashboard/postes/actions";

type Category = { id: string; name: string };

interface NavDropdownProps {
  label: string;
  baseHref: string; // ex: "/activities"
  isActive: boolean;
  cible : string;  // l'onglet de départ
}

export function NavDropdown({ label, baseHref, isActive, cible }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Charge les catégories une seule fois, au premier survol
  const loadCategories = async () => {
    if (loaded) return;
    const data = cible === "activities" 
        ? await getActivityCategories()
        : await getPostes()
    
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
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
        />
        
      </Link>

      {open && (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
          <div className="w-max min-w-[268px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-[0_18px_45px_rgba(15,39,73,0.14)]">
            <div className="flex flex-col gap-1">
              {loaded && categories.map((category) => (
                <Link
                  key={category.id}
                  href={ cible ==="activities" ?`/activities?search=&promo=&category=${category.id}` : `/members?promo=&status=&role=${category.id}&gender=&search=`}
                  title={category.name}
                  className="flex min-h-10 items-center whitespace-nowrap rounded-xl px-3.5 py-2 text-[15px] font-semibold leading-5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-[var(--aduti-primary)] focus-visible:bg-slate-50 focus-visible:text-[var(--aduti-primary)] focus-visible:outline-none"
                >
                  <span className="truncate">{category.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-2 border-t border-slate-100 pt-2">
              <Link
                href={baseHref}
                className="flex min-h-10 items-center whitespace-nowrap rounded-xl bg-slate-50 px-3.5 py-2 text-[13px] font-bold leading-5 text-[var(--aduti-primary)] transition-colors hover:bg-rose-50 focus-visible:bg-rose-50 focus-visible:outline-none"
              >
                {cible === "activities" ? "Voir toutes les activités" : "Annuaire des membres"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
