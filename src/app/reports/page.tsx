"use client";

import AppShell from "@/components/layout/AppShell";
import { mockInventory, mockOrders, weeklyChartData } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const categoryData = (() => {
  const totals: Record<string, number> = {};
  mockInventory.forEach((item) => {
    totals[item.category] = (totals[item.category] ?? 0) + item.currentStock * item.unitCost;
  });
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
})();

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

const monthlyOrders = [
  { month: "Dec", amount: 78000 },
  { month: "Jan", amount: 92000 },
  { month: "Feb", amount: 84000 },
  { month: "Mar", amount: 1.1e5 },
  { month: "Apr", amount: 98000 },
  { month: "May", amount: 62000 },
];

export default function ReportsPage() {
  const totalOrderValue = mockOrders.reduce((s, o) => s + o.totalAmount, 0);
  const deliveredOrders = mockOrders.filter((o) => o.status === "delivered").length;
  const avgOrderValue = totalOrderValue / (mockOrders.length || 1);

  return (
    <AppShell title="Reports & Analytics" subtitle="Consumption data from PetPooja · Order analytics">
      <div className="max-w-7xl space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Order Value (MTD)", value: formatINR(totalOrderValue) },
            { label: "Orders Delivered", value: `${deliveredOrders} / ${mockOrders.length}` },
            { label: "Avg Order Value", value: formatINR(avgOrderValue) },
            { label: "Inventory Turnover", value: "4.2x / month" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{kpi.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly consumption */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-1">Weekly Consumption (₹)</h3>
            <p className="text-xs text-slate-400 mb-5">Sourced from PetPooja · Last 7 days</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                  formatter={(v) => [formatINR(Number(v ?? 0)), "Consumption"]}
                />
                <Bar dataKey="consumption" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory by category */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-1">Inventory Value by Category</h3>
            <p className="text-xs text-slate-400 mb-5">Current stock value breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [formatINR(Number(v ?? 0)), "Value"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                <Legend iconType="circle" iconSize={8} formatter={(v: string) => v} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly order trend */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-1">Monthly Procurement Spend (₹)</h3>
          <p className="text-xs text-slate-400 mb-5">Total purchase orders sent via WhatsApp</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatINR(Number(v ?? 0)), "Spend"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top consumed items */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Top Consumed Items (Last 7 days · PetPooja)</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Item</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Consumed</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock Value Used</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockInventory.slice(0, 8).map((item) => {
                const consumed = Math.round(item.maxStock * 0.3 + Math.random() * 10);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3.5 text-slate-500">{item.category}</td>
                    <td className="px-4 py-3.5 text-right text-slate-700">{consumed} {item.unit}</td>
                    <td className="px-4 py-3.5 text-right text-slate-700">{formatINR(consumed * item.unitCost)}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`font-semibold ${item.currentStock <= item.minStock ? "text-red-600" : "text-green-600"}`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
