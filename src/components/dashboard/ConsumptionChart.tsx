"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { weeklyChartData } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export default function ConsumptionChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900">Weekly Consumption vs Orders</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pulled from PetPooja · Last 7 days</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Live sync
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyChartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
            formatter={(value, name) => [
              formatINR(Number(value ?? 0)),
              name === "consumption" ? "Consumption" : "Orders",
            ]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => value === "consumption" ? "Consumption" : "Orders placed"}
          />
          <Bar dataKey="consumption" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="orders" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
