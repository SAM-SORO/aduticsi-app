"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users2, Link2, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  type PromoCombo, 
  type BinomePair, 
  getBinomesForCombo 
} from "@/app/dashboard/binomage/actions";

export function BinomagesClient({ combos }: { combos: PromoCombo[] }) {
  const [selectedCombo, setSelectedCombo] = useState<string>(
    combos.length > 0 ? combos[0].label : ""
  );
  const [binomes, setBinomes] = useState<BinomePair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    if (!selectedCombo) return;

    let isMounted = true;
    setTimeout(() => {
      if (isMounted) setIsLoading(true);
    }, 0);

    getBinomesForCombo(selectedCombo).then((data) => {
      if (isMounted) {
        setBinomes(data);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCombo]);

  const filteredBinomes = binomes.filter((b) => {
    const search = searchQuery.toLowerCase();
    return (
      b.parrain.first_name.toLowerCase().includes(search) ||
      b.parrain.last_name.toLowerCase().includes(search) ||
      b.filleul.first_name.toLowerCase().includes(search) ||
      b.filleul.last_name.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredBinomes.length / ITEMS_PER_PAGE);
  const currentBinomes = filteredBinomes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-2 animate-fade-in">
      {/* Header */}
      {/* <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Famille <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--aduti-primary)] to-blue-600">ADUTI</span>
        </h1>

      </div> */}

      {combos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm mt-8">
          <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Aucun groupe de promotion trouvé.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-full md:w-64">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block px-1">
                Génération
              </label>
              <select
                value={selectedCombo}
                onChange={(e) => {
                  setSelectedCombo(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border-none outline-none ring-0 text-slate-900 font-semibold px-4 py-3 rounded-xl focus:ring-2 focus:ring-[var(--aduti-primary)]/20 transition-all cursor-pointer"
              >
                {combos.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.parrain_promo_name} ↔ {c.filleul_promo_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="hidden md:block w-[1px] h-12 bg-slate-100 shrink-0 mx-2" />

            <div className="w-full flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block px-1">
                Rechercher un membre
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nom du parrain ou du filleul..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border-none outline-none ring-0 text-slate-900 px-4 py-3 pl-12 rounded-xl focus:ring-2 focus:ring-[var(--aduti-primary)]/20 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-[var(--aduti-primary)] animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">Chargement des liens...</p>
            </div>
          ) : filteredBinomes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Aucun binôme trouvé pour cette sélection.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBinomes.map((binome) => (
                  <div 
                    key={binome.id} 
                    className="group relative bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--aduti-primary)]/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6 relative">
                         {/* Parrain */}
                         <Link 
                           href={`/members/${binome.parrain.slug ?? binome.parrain.id}?from=binomage`}
                           className="flex flex-col items-center text-center w-[45%] group/avatar hover:scale-105 transition-all cursor-pointer"
                         >
                            <div className="size-20 md:size-24 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-slate-100 flex-shrink-0 z-10 mb-3 relative group-hover/avatar:ring-4 ring-[var(--aduti-primary)]/20 transition-all">
                              {binome.parrain.photo_url ? (
                                  <Image src={binome.parrain.photo_url} alt={`${binome.parrain.last_name.toUpperCase()} ${binome.parrain.first_name}`} fill className="object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold text-2xl">
                                    {binome.parrain.first_name.charAt(0).toUpperCase()}
                                  </div>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Parrain</span>
                            <h3 className="font-bold text-slate-900 leading-tight text-sm md:text-base line-clamp-2 group-hover/avatar:text-[var(--aduti-primary)] transition-colors">{binome.parrain.last_name.toUpperCase()} {binome.parrain.first_name}</h3>
                         </Link>
  
                         {/* Lien */}
                         <div className="absolute top-10 md:top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 size-8 md:size-10 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100 text-[var(--aduti-primary)]">
                            <Link2 className="w-4 h-4 md:w-5 md:h-5" />
                         </div>
  
                         {/* Filleul */}
                         <Link 
                           href={`/members/${binome.filleul.slug ?? binome.filleul.id}?from=binomage`}
                           className="flex flex-col items-center text-center w-[45%] group/avatar hover:scale-105 transition-all cursor-pointer"
                         >
                            <div className="size-20 md:size-24 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-slate-100 flex-shrink-0 z-10 mb-3 relative group-hover/avatar:ring-4 ring-[var(--aduti-primary)]/20 transition-all">
                              {binome.filleul.photo_url ? (
                                  <Image src={binome.filleul.photo_url} alt={`${binome.filleul.last_name.toUpperCase()} ${binome.filleul.first_name}`} fill className="object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-500 font-bold text-2xl">
                                    {binome.filleul.first_name.charAt(0).toUpperCase()}
                                  </div>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filleul</span>
                            <h3 className="font-bold text-slate-900 leading-tight text-sm md:text-base line-clamp-2 group-hover/avatar:text-[var(--aduti-primary)] transition-colors">{binome.filleul.last_name.toUpperCase()} {binome.filleul.first_name}</h3>
                         </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-slate-600 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
