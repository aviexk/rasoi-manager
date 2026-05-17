import { Package, AlertTriangle, ShoppingCart, TrendingUp, Users, Flame } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";

interface Props {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    {
      label: "Inventory Value",
      value: formatINR(stats.totalInventoryValue),
      sub: "Current stock value",
      icon: Package,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "Low Stock Alerts",
      value: `${stats.lowStockCount} items`,
      sub: "Need reordering",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrdersCount.toString(),
      sub: "Awaiting delivery",
      icon: ShoppingCart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Monthly Savings",
      value: formatINR(stats.monthlySavings),
      sub: "vs. manual ordering",
      icon: TrendingUp,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Active Suppliers",
      value: stats.activeSuppliers.toString(),
      sub: "On WhatsApp",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Today's Consumption",
      value: formatINR(stats.todayConsumptionValue),
      sub: "From PetPooja (live)",
      icon: Flame,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{c.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{c.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
            </div>
            <div className={`${c.iconBg} p-2.5 rounded-lg`}>
              <c.icon className={`w-5 h-5 ${c.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
