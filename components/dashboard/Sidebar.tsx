import { 
  LayoutDashboard, 
  Users, 
  Handshake, 
  MessageSquare,
  Link2, 
  History, 
  LogOut, 
  ShieldCheck,
  School,
  Home,
  GraduationCap,
  Briefcase,
  User,
  Users2
} from "lucide-react";


import { logout } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

interface SidebarProps {
  member: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string;
  };
  activePath: string;
  onCloseMobile?: () => void;
  collapsed?: boolean;
}

export function Sidebar({ member, activePath, onCloseMobile, collapsed = false }: SidebarProps) {
  const isSuperAdmin = member.role === "SUPER_ADMIN";
  const isAdmin = member.role === "ADMIN";
  const hasActivityFunction = !isSuperAdmin && !isAdmin;

  const rootPath = isSuperAdmin
    ? "/dashboard/super-admin"
    : isAdmin
    ? "/dashboard/admin"
    : "/dashboard/bureau";

  const roleLabel = isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Gestion Activites";

  const menuItems = [
    { name: "Retour a l'accueil", href: "/", icon: <Home className="w-5 h-5" />, path: "/" },
    { name: "Tableau de bord", href: rootPath, icon: <LayoutDashboard className="w-5 h-5" />, path: rootPath },
    ...(isSuperAdmin
      ? [
          { name: "Membres", href: "/dashboard/super-admin/members", icon: <Users className="w-5 h-5" />, path: "/dashboard/super-admin/members" },
          { name: "Liens d'invitation", href: "/dashboard/super-admin/invitations", icon: <Link2 className="w-5 h-5" />, path: "/dashboard/super-admin/invitations" },
          { name: "Demandes d'enregistrement", href: "/dashboard/super-admin/demandes", icon: <ShieldCheck className="w-5 h-5" />, path: "/dashboard/super-admin/demandes" },
        ]
      : []),

    ...(isSuperAdmin || isAdmin
      ? [
          { name: "Postes", href: "/dashboard/postes", icon: <Briefcase className="w-5 h-5" />, path: "/dashboard/postes" },
          { name: "Promotions", href: "/dashboard/promotions", icon: <GraduationCap className="w-5 h-5" />, path: "/dashboard/promotions" },
          { name: "Binomage", href: "/dashboard/binomage", icon: <Users2 className="w-5 h-5" />, path: "/dashboard/binomage" },
        ]
      : []),
    { name: "Activites & Publications", href: "/dashboard/super-admin/activities", icon: <History className="w-5 h-5" />, path: "/dashboard/super-admin/activities" },
    { name: "Partenaires", href: "/dashboard/super-admin/partners", icon: <Handshake className="w-5 h-5" />, path: "/dashboard/super-admin/partners" },
    ...((isSuperAdmin || isAdmin)
      ? [{ name: "Messages publics", href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" />, path: "/dashboard/messages" }]
      : []),
    ...(hasActivityFunction
      ? [{ name: "Mon profil", href: "/dashboard/profile", icon: <User className="w-5 h-5" />, path: "/dashboard/profile" }]
      : []),
  ];

  return (
    <aside className="w-full h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Logo — fixed */}
      <div className={cn("shrink-0 pb-0", collapsed ? "px-3 pt-6" : "p-6 pb-0")}>
        <div className={cn("mb-6 flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)]">
            <School className="size-6" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">ADUTI</h1>
              <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500">{roleLabel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav — scrollable */}
      <div className={cn("flex-1 overflow-y-auto pb-4", collapsed ? "px-3" : "px-6")}>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item, index) => {
            const isActive = activePath === item.path;
            return (
              <div key={item.name}>
                {index === 1 && <div className="my-2 border-t border-slate-100" />}
                <a
                  href={item.href}
                  onClick={onCloseMobile}
                  title={collapsed ? item.name : undefined}
                  aria-label={collapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg py-3 font-medium transition-colors",
                    collapsed ? "justify-center px-0" : "px-4",
                    isActive
                      ? "bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </a>
              </div>
            );
          })}
        </nav>
      </div>

    {/* Footer — fixed */}
    <div className={cn("shrink-0 border-t border-slate-100", collapsed ? "p-3" : "p-4")}>
      <a
        href="/dashboard/profile"
        onClick={onCloseMobile}
        title={collapsed ? "Mon profil" : undefined}
        className={cn(
          "mb-2 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50",
          collapsed && "justify-center"
        )}
      >
        <User className="size-4 shrink-0 text-slate-400" />
        {!collapsed && <span className="text-sm font-medium text-slate-700">Mon profil</span>}
      </a>
      <form action={logout}>
        <button
          type="submit"
          title={collapsed ? "Déconnexion" : undefined}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-slate-50",
            collapsed && "justify-center"
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-bold text-slate-700 transition-colors group-hover:bg-slate-300">
            {member.first_name?.slice(0, 1).toUpperCase() || "A"}
          </div>
          {!collapsed && (
            <>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {member.first_name && member.last_name
                    ? `${member.first_name} ${member.last_name}`
                    : member.first_name || "Super Admin"}
                </p>
                <p className="truncate text-xs text-slate-500">{member.email}</p>
              </div>
              <LogOut className="ml-auto size-4 shrink-0 text-slate-400 transition-colors group-hover:text-red-500" />
            </>
          )}
        </button>
      </form>
    </div>
  </aside>
);
}

// Alias plus explicite pour éviter la confusion avec le layout complet.
export { Sidebar as DashboardSidebar };
