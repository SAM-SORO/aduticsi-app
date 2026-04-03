"use client";

import { type User as AuthUser } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, LogOut, Settings, LayoutDashboard, Menu, X } from "lucide-react";


import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/auth/actions";
import { getProfile } from "@/app/profile/actions";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/activities", label: "Activités" },
  { href: "/members", label: "Membres" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [member, setMember] = useState<{name: string | null; role: string; function: string; photo_url: string | null; email: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hide-on-scroll state
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      if (authUser) {
        try {
          const profile = await getProfile();
          setMember(profile);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Failed to fetch profile in navbar", e);
        }
      }
      setLoading(false);
    };

    fetchUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const profile = await getProfile();
          setMember(profile);
        } catch(_e) { /* ignore */ }
      } else {
        setMember(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Hide menu on route change
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    // Safety cleanup when component unmounts (important for pages that hide the navbar like /profile)
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Hide-on-scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only trigger hide/show if we've scrolled past the top abstract area
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY && !isOpen) {
          // Scrolling down & menu closed -> hide navbar
          setIsVisible(false);
        } else {
          // Scrolling up or menu open -> show navbar
          setIsVisible(true);
        }
      } else {
        // Always show at the very top
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  const renderAuthButton = (className?: string) => {
    if (loading) return null;

    if (user && member) {
      // Determine dashboard link
      let dashboardLink = null;
      if (member.role === "SUPER_ADMIN") dashboardLink = "/dashboard/super-admin";
      else if (member.role === "ADMIN") dashboardLink = "/dashboard/admin";
      else if (member.function && member.function !== "NONE") dashboardLink = "/dashboard/bureau";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn("flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200", className)}>
              <div className="size-9 rounded-full bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)] flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 group-hover:bg-[var(--aduti-primary)] group-hover:text-white transition-colors">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt="Profil" width={36} height={36} className="object-cover w-full h-full" />
                ) : (
                  member.name?.slice(0, 1).toUpperCase() || "A"
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none mb-0.5 max-w-[120px] truncate">
                  {member.name || "Utilisateur"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none uppercase tracking-wider">
                  {member.role === "SUPER_ADMIN" ? "Administrateur" : member.role === "ADMIN" ? "Admin" : member.function !== "NONE" ? "Bureau" : "Membre"}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-[100]">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{member.email || user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {dashboardLink && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={dashboardLink} className="cursor-pointer w-full flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer w-full flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer w-full flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onSelect={async () => {
                await logout();
                window.location.href = '/';
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else if (user && !member) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn("flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200", className)}>
              <div className="size-9 rounded-full bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)] flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 group-hover:bg-[var(--aduti-primary)] group-hover:text-white transition-colors">
                <User className="h-4 w-4" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-[100]">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Utilisateur</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onSelect={async () => {
                await logout();
                window.location.href = '/';
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button
        asChild
        className={cn(
          "inline-flex items-center justify-center rounded-lg h-10 px-6 bg-[var(--aduti-primary)] hover:bg-blue-600 transition-colors text-white text-sm font-semibold tracking-wide shadow-sm",
          className
        )}
      >
        <Link href="/auth/login">Se connecter</Link>
      </Button>
    );
  };

  return (
    <>
      <header 
        className={cn(
          "sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="px-4 py-4 layout-container flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link
            href="/"
            className="flex items-center gap-2 select-none no-underline"
          >
            <div className="relative h-14 w-auto aspect-[3/1]">
              <Image
                src="/logo_association.jpeg"
                alt="Logo ADUTI"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-[var(--aduti-primary)] font-semibold"
                      : "text-slate-600 hover:text-[var(--aduti-primary)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center pl-4 border-l border-slate-200">
              {renderAuthButton()}
            </div>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            {user && renderAuthButton()}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-800 p-2 hover:bg-slate-100/50 rounded-full transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay pour fermer le menu au clic à côté */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 w-full h-[100vh] bg-slate-900/10 backdrop-blur-[2px] md:hidden"
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden bg-white/95"
              >
              <div className="border-t border-slate-100">
                <nav className="flex flex-col px-4 py-6 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block text-lg font-semibold transition-all py-3 px-4 w-full rounded-2xl active:scale-95",
                        pathname === link.href
                          ? "text-[var(--aduti-primary)] bg-[var(--aduti-primary)]/10"
                          : "text-slate-600 hover:text-[var(--aduti-primary)] hover:bg-slate-50/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!user && (
                    <div className="w-full pt-4 mt-2 border-t border-slate-100">
                      {renderAuthButton("w-full h-14 rounded-2xl text-lg font-bold outline-none")}
                    </div>
                  )}
                </nav>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
