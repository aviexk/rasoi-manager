"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { mockSuppliers } from "@/lib/mock-data";
import { MessageCircle, Phone, MapPin, Tag, Plus } from "lucide-react";
import Link from "next/link";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppShell title="Suppliers" subtitle="Manage your supplier network · Orders sent via WhatsApp">
      <div className="max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search suppliers by name, city, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          />
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{supplier.contactPerson}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${supplier.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {supplier.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  +{supplier.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {supplier.address}, {supplier.city}
                </div>
                {supplier.gstNumber && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                    GST: {supplier.gstNumber}
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {supplier.categories.map((cat) => (
                  <span key={cat} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    {cat}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 pt-4 border-t border-slate-50">
                <Link
                  href={`/orders?prefill=${supplier.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Order via WhatsApp
                </Link>
                <a
                  href={`https://wa.me/${supplier.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Chat
                </a>
              </div>

              <p className="text-xs text-slate-400 mt-2 text-center">
                Lead time: {supplier.leadTimeDays} day{supplier.leadTimeDays > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
