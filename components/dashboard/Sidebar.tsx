import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Handshake, 
  Link2, 
  History, 
  Settings, 
  LogOut, 
  School,
  Home,
  GraduationCap,
  Briefcase
} from "lucide-react";

import { logout } from "@/app/auth/actions";

interface SidebarProps {
  member: {
    name: string | null;
    email: string;
    role: string;
  };
  activePath: string;
  onCloseMobile?: () => void;
}

export function Sidebar({ member, activePath, onCloseMobile }: SidebarProps) {
  const menuItems = [
    { name: "Retour à l'accueil", href: "/", icon: <Home className="w-5 h-5" />, path: "/" },
    { name: "Tableau de Bord", href: "/dashboard/super-admin", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard/super-admin" },
    { name: "Membres", href: "/dashboard/super-admin/members", icon: <Users className="w-5 h-5" />, path: "/dashboard/super-admin/members" },
    { name: "Postes", href: "/dashboard/super-admin/postes", icon: <Briefcase className="w-5 h-5" />, path: "/dashboard/super-admin/postes" },
    { name: "Gestion des Admins", href: "#", icon: <ShieldCheck className="w-5 h-5" />, path: "/admins" },
    { name: "Promotions", href: "/dashboard/super-admin/promotions", icon: <GraduationCap className="w-5 h-5" />, path: "/dashboard/super-admin/promotions" },
    { name: "Partenaires", href: "/dashboard/super-admin/partners", icon: <Handshake className="w-5 h-5" />, path: "/dashboard/super-admin/partners" },
    { name: "Liens d'invitation", href: "/dashboard/super-admin/invitations", icon: <Link2 className="w-5 h-5" />, path: "/dashboard/super-admin/invitations" },
    { name: "Activités & Publications", href: "/dashboard/super-admin/activities", icon: <History className="w-5 h-5" />, path: "/dashboard/super-admin/activities" },
    { name: "Paramètres Globaux", href: "#", icon: <Settings className="w-5 h-5" />, path: "/settings" },
  ];

  return (
    <aside className="w-full h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Logo — fixed */}
      <div className="p-6 pb-0 shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 bg-[var(--aduti-primary)]/10 rounded-lg flex items-center justify-center text-[var(--aduti-primary)]">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">ADUTI</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Nav — scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item, index) => {
            const isActive = activePath === item.path;
            return (
              <div key={item.name}>
                {index === 1 && <div className="my-2 border-t border-slate-100" />}
                <a
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.name}</span>
                </a>
              </div>
            );
          })}
        </nav>
      </div>

    {/* Footer — fixed */}
    <div className="p-4 border-t border-slate-100 shrink-0">
      <form action={logout}>
        <button
          type="submit"
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group text-left"
        >
          <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 overflow-hidden shrink-0 group-hover:bg-slate-300 transition-colors">
            {member.name?.slice(0, 1).toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {member.name || "Super Admin"}
            </p>
            <p className="text-xs text-slate-500 truncate">{member.email}</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-400 ml-auto group-hover:text-red-500 transition-colors shrink-0" />
        </button>
      </form>
    </div>
  </aside>
);
}
