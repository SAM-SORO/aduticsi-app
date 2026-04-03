"use client";

import React, { useState } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/auth/actions";

import { DashboardSidebar } from "./Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  member: {
    name: string | null;
    email: string;
    role: string;
  };
  activePath: string;
  title: string;
}

export function DashboardShell({
  children,
  member,
  activePath,
  title,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Empêcher le défilement du corps quand le menu mobile est ouvert
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="bg-[#f6f7f8] font-sans text-slate-900 h-screen sm:h-[100dvh] flex overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop and Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar
          member={member}
          activePath={activePath}
          onCloseMobile={closeMobileMenu}
        />
        {/* Mobile Close Button */}
        <button
          onClick={closeMobileMenu}
          className="absolute top-4 right-4 p-2 text-slate-500 lg:hidden hover:bg-slate-100 rounded-full transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#f6f7f8]">
        {/* Fixed Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
              type="button"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200">
                  <div className="size-9 rounded-full bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)] flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 group-hover:bg-[var(--aduti-primary)] group-hover:text-white transition-colors">
                    {member.name?.slice(0, 1).toUpperCase() || "A"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">
                      {member.name || "Super Admin"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-none uppercase tracking-wider">
                      {member.role === "SUPER_ADMIN" ? "Administrateur" : member.role}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{member.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{member.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile" className="cursor-pointer w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon Profil</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#" className="cursor-pointer w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onSelect={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Alias plus explicite pour éviter la confusion avec la barre latérale.
export { DashboardShell as DashboardLayout };
