"use client";

import Link from "next/link";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { mockInventory, mockSuppliers } from "@/lib/mock-data";
import { getStockUrgency } from "@/lib/utils";
import type { StockAlert } from "@/lib/types";

function buildAlerts(): StockAlert[] {
  return mockInventory
    .filter((item) => item.currentStock <= item.minStock)
    .map((item) => {
      const supplier = mockSuppliers.find((s) => s.id === item.supplierId);
      return {
        itemId: item.id,
        itemName: item.name,
        currentStock: item.currentStock,
        minStock: item.minStock,
        unit: item.unit,
        supplierId: item.supplierId,
        supplierName: supplier?.name ?? "Unknown",
        urgency: getStockUrgency(item.currentStock, item.minStock),
      };
    })
    .sort((a, b) => {
      const order = { critical: 0, low: 1, warning: 2 };
      return order[a.urgency] - order[b.urgency];
    });
}

export default function LowStockAlerts() {
  const alerts = buildAlerts();

  const urgencyStyle = {
    critical: { dot: "bg-red-500", badge: "bg-red-100 text-red-700", label: "Critical" },
    low: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", label: "Low" },
    warning: { dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-700", label: "Warning" },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-slate-900">Low Stock Alerts</h3>
          <span className="ml-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {alerts.length}
          </span>
        </div>
        <Link href="/inventory" className="text-xs text-orange-600 font-medium hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 6).map((alert) => {
          const s = urgencyStyle[alert.urgency];
          return (
            <div key={alert.itemId} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                <div>
                  <p className="text-sm font-medium text-slate-800">{alert.itemName}</p>
                  <p className="text-xs text-slate-400">
                    {alert.currentStock} {alert.unit} remaining · Min: {alert.minStock} {alert.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
                  {s.label}
                </span>
                <Link
                  href={`/orders?prefill=${alert.supplierId}&item=${alert.itemId}`}
                  className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                  title="Order via WhatsApp"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length > 6 && (
        <Link
          href="/inventory"
          className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-700 font-medium"
        >
          + {alerts.length - 6} more items need restocking
        </Link>
      )}
    </div>
  );
}
