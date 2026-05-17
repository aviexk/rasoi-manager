"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  RefreshCw,
  Utensils,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/suppliers", label: "Suppliers", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-slate-900 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Rasoi Manager</div>
            <div className="text-slate-500 text-xs">Restaurant Ops</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-widest">Operations</p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${pathname === href || pathname.startsWith(href + "/") ? "active" : ""}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}

        <div className="pt-4">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-widest">Integrations</p>
          <Link
            href="/settings"
            className={`sidebar-link ${pathname === "/settings" ? "active" : ""}`}
          >
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            PetPooja Sync
          </Link>
          <Link
            href="/settings"
            className={`sidebar-link ${pathname === "/settings/whatsapp" ? "active" : ""}`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            WhatsApp Setup
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            RM
          </div>
          <div>
            <div className="text-white text-xs font-medium">Restaurant Manager</div>
            <div className="text-slate-500 text-xs">Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
