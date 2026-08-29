"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";

export interface FilterDefinition {
  name: string;
  /** Libellé affiché quand aucune valeur n'est choisie. */
  placeholder: string;
  searchPlaceholder: string;
  value: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  searchValue: string;
  searchPlaceholder: string;
  filters: FilterDefinition[];
  /** Paramètres à conserver dans l'URL sans être pilotés ici. */
  extraParams?: Record<string, string>;
}

const DEBOUNCE_MS = 350;

/**
 * Met à jour la liste sans rechargement de page : router.replace conserve le
 * scroll et useTransition garde l'ancien contenu affiché pendant le calcul,
 * au lieu de faire clignoter la page à chaque frappe.
 */
export function FilterBar({
  searchValue,
  searchPlaceholder,
  filters,
  extraParams,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchValue);
  const [prevSearchValue, setPrevSearchValue] = useState(searchValue);
  const firstRender = useRef(true);

  // Une navigation externe (retour arrière, lien) doit se refléter dans le champ.
  if (searchValue !== prevSearchValue) {
    setPrevSearchValue(searchValue);
    setSearch(searchValue);
  }

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extraParams ?? {})) {
      if (value) params.set(key, value);
    }
    const nextSearch = overrides.search ?? search;
    if (nextSearch) params.set("search", nextSearch);
    for (const filter of filters) {
      const value = overrides[filter.name] ?? filter.value;
      if (value) params.set(filter.name, value);
    }
    // Tout changement de filtre ramène à la première page.
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function navigate(overrides: Record<string, string>) {
    startTransition(() => {
      router.replace(buildUrl(overrides), { scroll: false });
    });
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (search === searchValue) return;
    const timer = setTimeout(() => navigate({ search }), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // navigate depend de valeurs recalculees a chaque rendu : seule la frappe doit relancer le minuteur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchValue]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 pr-10 text-sm focus-visible:bg-white"
          />
          {isPending && (
            <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-nowrap">
          {filters.map((filter) => (
            <div key={filter.name} className="lg:w-44">
              <Combobox
                options={filter.options}
                value={filter.value}
                onChange={(value) => navigate({ [filter.name]: value })}
                placeholder={filter.placeholder}
                searchPlaceholder={filter.searchPlaceholder}
                emptyMessage="Aucun résultat."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
