"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { BackToTop } from "@/components/back-to-top";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/auth");
  const isProfile = pathname.startsWith("/profile");

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      {!isDashboard && !isAuth && !isProfile && <SiteNavbar />}
      <main className="flex-1">{children}</main>
      {!isDashboard && !isAuth && !isProfile && (
        <>
          <SiteFooter />
          <BackToTop />
        </>
      )}
    </div>
  );
}

