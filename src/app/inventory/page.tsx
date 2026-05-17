"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { mockInventory, mockSuppliers } from "@/lib/mock-data";
import { formatINR, getStockUrgency } from "@/lib/utils";
import { Search, Filter, Package, AlertTriangle } from "lucide-react";
import Link from "next/link";

const categories = ["All", "Grains", "Pulses", "Dairy", "Vegetables", "Poultry", "Spices"];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = mockInventory.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || item.category === category;
    return matchSearch && matchCat;
  });

  const urgencyLabel = { critical: "Critical", low: "Low", warning: "Warning" } as const;
  const urgencyStyle = {
    critical: "bg-red-100 text-red-700",
    low: "bg-amber-100 text-amber-700",
    warning: "bg-yellow-50 text-yellow-700",
  };

  return (
    <AppShell title="Inventory" subtitle="Stock levels synced from PetPooja">
      <div className="max-w-7xl space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-orange-500 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800">{filtered.length} items</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {filtered.filter((i) => i.currentStock <= i.minStock).length} need restocking
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Stock</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Min Stock</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Unit Cost</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  const urgency = isLow ? getStockUrgency(item.currentStock, item.minStock) : null;
                  const supplier = mockSuppliers.find((s) => s.id === item.supplierId);

                  return (
                    <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${isLow ? "bg-red-50/30" : ""}`}>
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400">PetPooja ID: {item.petpoojaItemId ?? "—"}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{item.category}</td>
                      <td className={`px-4 py-3.5 text-right font-semibold ${isLow ? "text-red-600" : "text-slate-900"}`}>
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-500">{item.minStock} {item.unit}</td>
                      <td className="px-4 py-3.5 text-right text-slate-700">{formatINR(item.unitCost)}/{item.unit}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{supplier?.name ?? "—"}</td>
                      <td className="px-4 py-3.5">
                        {urgency ? (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgencyStyle[urgency]}`}>
                            {urgencyLabel[urgency]}
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">OK</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {isLow && (
                          <Link
                            href={`/orders?prefill=${item.supplierId}&item=${item.id}`}
                            className="text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Order via WhatsApp
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
