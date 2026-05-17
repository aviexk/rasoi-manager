"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { mockInventory, mockSuppliers, mockOrders } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import {
  MessageCircle,
  Trash2,
  ShoppingCart,
  ChevronDown,
  CheckCircle,
  X,
  Package,
} from "lucide-react";
import type { OrderItem, Supplier, Order } from "@/lib/types";

const statusStyle: Record<string, { pill: string; label: string }> = {
  delivered: { pill: "bg-green-100 text-green-700", label: "Delivered" },
  confirmed: { pill: "bg-blue-100 text-blue-700", label: "Confirmed" },
  sent:      { pill: "bg-yellow-100 text-yellow-700", label: "Sent" },
  draft:     { pill: "bg-slate-100 text-slate-600", label: "Draft" },
  cancelled: { pill: "bg-red-100 text-red-700", label: "Cancelled" },
};

export default function OrdersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [orderItems, setOrderItems]             = useState<OrderItem[]>([]);
  const [notes, setNotes]                       = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [sending, setSending]                   = useState(false);
  const [sent, setSent]                         = useState<{ waLink: string } | null>(null);
  const [error, setError]                       = useState<string | null>(null);
  const [detailOrder, setDetailOrder]           = useState<Order | null>(null);

  // Prefill from inventory "quick order" links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("prefill");
    const iid = params.get("item");
    if (sid) {
      const s = mockSuppliers.find((s) => s.id === sid);
      if (s) setSelectedSupplier(s);
    }
    if (sid && iid) {
      const inv = mockInventory.find((i) => i.id === iid);
      if (inv) {
        const qty = Math.max(inv.minStock * 2 - inv.currentStock, inv.minStock, 1);
        setOrderItems([{ inventoryItemId: inv.id, itemName: inv.name, quantity: qty, unit: inv.unit, unitCost: inv.unitCost, totalCost: qty * inv.unitCost }]);
      }
    }
  }, []);

  const supplierItems = selectedSupplier
    ? mockInventory.filter((i) => i.supplierId === selectedSupplier.id)
    : [];

  function pickSupplier(id: string) {
    setSelectedSupplier(mockSuppliers.find((s) => s.id === id) ?? null);
    setOrderItems([]);
  }

  function toggleItem(itemId: string) {
    if (orderItems.find((oi) => oi.inventoryItemId === itemId)) {
      setOrderItems((prev) => prev.filter((oi) => oi.inventoryItemId !== itemId));
    } else {
      const inv = mockInventory.find((i) => i.id === itemId);
      if (!inv) return;
      const qty = Math.max(inv.minStock, 1);
      setOrderItems((prev) => [...prev, { inventoryItemId: inv.id, itemName: inv.name, quantity: qty, unit: inv.unit, unitCost: inv.unitCost, totalCost: qty * inv.unitCost }]);
    }
  }

  function updateQty(itemId: string, qty: number) {
    if (qty < 1) return;
    setOrderItems((prev) => prev.map((oi) => oi.inventoryItemId === itemId ? { ...oi, quantity: qty, totalCost: qty * oi.unitCost } : oi));
  }

  const total = orderItems.reduce((s, i) => s + i.totalCost, 0);

  async function sendOrder() {
    if (!selectedSupplier || !orderItems.length) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/whatsapp/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierPhone: selectedSupplier.phone,
          supplierName: selectedSupplier.name,
          restaurantName: "My Restaurant",
          orderId: "ORD-" + Date.now().toString(36).toUpperCase(),
          items: orderItems,
          totalAmount: total,
          expectedDelivery: expectedDelivery || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json() as { success: boolean; waLink?: string; error?: string };
      if (data.success && data.waLink) setSent({ waLink: data.waLink });
      else setError(data.error ?? "Failed to prepare order");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setSent(null); setOrderItems([]); setSelectedSupplier(null);
    setNotes(""); setExpectedDelivery(""); setError(null);
  }

  return (
    <AppShell title="Orders" subtitle="Place purchase orders to suppliers via WhatsApp">
      <div className="max-w-6xl space-y-8">

        {/* ── Order detail modal ── */}
        {detailOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900">{detailOrder.supplierName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(detailOrder.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                    {" · "}Order #{detailOrder.id.replace("ord_", "")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[detailOrder.status].pill}`}>
                    {statusStyle[detailOrder.status].label}
                  </span>
                  <button onClick={() => setDetailOrder(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-4 max-h-72 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Items Ordered</p>
                <div className="space-y-3">
                  {detailOrder.items.map((item) => (
                    <div key={item.inventoryItemId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.itemName}</p>
                          <p className="text-xs text-slate-400">{item.quantity} {item.unit} × {formatINR(item.unitCost)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{formatINR(item.totalCost)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-xl font-extrabold text-slate-900">{formatINR(detailOrder.totalAmount)}</p>
                  {detailOrder.expectedDelivery && (
                    <p className="text-xs text-slate-400 mt-0.5">Delivery: {detailOrder.expectedDelivery}</p>
                  )}
                </div>
                {detailOrder.status === "sent" || detailOrder.status === "confirmed" ? (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Sent via WhatsApp
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* ── Status chips ── */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
            <MessageCircle className="w-4 h-4" /> WhatsApp enabled
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 font-medium">
            <ShoppingCart className="w-4 h-4" /> {mockOrders.length} orders this month
          </div>
        </div>

        {/* ── Success screen ── */}
        {sent ? (
          <div className="bg-white rounded-2xl border border-green-200 p-12 text-center shadow-sm">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Ready to Send!</h3>
            <p className="text-slate-500 mb-8">
              Opens WhatsApp with the full purchase order pre-filled for{" "}
              <strong>{selectedSupplier?.name}</strong>.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a href={sent.waLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-md shadow-green-100">
                <MessageCircle className="w-5 h-5" /> Open WhatsApp to Send
              </a>
              <button onClick={reset}
                className="px-7 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                New Order
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Builder ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Step 1 */}
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
                  Step 1 — Select Supplier
                </p>
                <div className="relative">
                  <select
                    value={selectedSupplier?.id ?? ""}
                    onChange={(e) => pickSupplier(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-lg px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="">— Choose a supplier —</option>
                    {mockSuppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {selectedSupplier && (
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 pt-3 border-t border-slate-50">
                    <span>📞 +{selectedSupplier.phone}</span>
                    <span>📍 {selectedSupplier.city}</span>
                    <span>⏱ {selectedSupplier.leadTimeDays}-day lead time</span>
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> WhatsApp ready
                    </span>
                  </div>
                )}
              </div>

              {/* Step 2 — only rendered when supplier chosen */}
              {selectedSupplier && (
                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
                    Step 2 — Add Items ({supplierItems.length} available from {selectedSupplier.name.split(" ")[0]})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {supplierItems.map((item) => {
                      const inCart = orderItems.some((oi) => oi.inventoryItemId === item.id);
                      const isLow  = item.currentStock <= item.minStock;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={[
                            "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                            inCart
                              ? "bg-green-500 text-white border-green-500"
                              : isLow
                              ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700",
                          ].join(" ")}
                        >
                          {inCart ? "✓ " : "+ "}
                          {item.name}
                          <span className="ml-1.5 opacity-60 text-xs">
                            ({item.currentStock} {item.unit})
                          </span>
                          {isLow && !inCart && (
                            <span className="ml-1.5 text-xs bg-red-200 text-red-700 px-1.5 py-0.5 rounded-full">low</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 — only rendered when items in cart */}
              {orderItems.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">
                    Step 3 — Review Quantities ({orderItems.length} item{orderItems.length > 1 ? "s" : ""})
                  </p>
                  <div className="space-y-3">
                    {orderItems.map((oi) => (
                      <div key={oi.inventoryItemId} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{oi.itemName}</p>
                          <p className="text-xs text-slate-400">{formatINR(oi.unitCost)} / {oi.unit}</p>
                        </div>
                        <input
                          type="number"
                          min={1}
                          value={oi.quantity}
                          onChange={(e) => updateQty(oi.inventoryItemId, Number(e.target.value))}
                          className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                        <span className="text-xs text-slate-400 w-5">{oi.unit}</span>
                        <span className="text-sm font-semibold text-slate-800 w-20 text-right">{formatINR(oi.totalCost)}</span>
                        <button
                          type="button"
                          onClick={() => toggleItem(oi.inventoryItemId)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Expected Delivery</label>
                      <input type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Notes (optional)</label>
                      <input type="text" placeholder="e.g. Deliver before 9am" value={notes} onChange={(e) => setNotes(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Summary ── */}
            <div>
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm sticky top-6">
                <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>
                {orderItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingCart className="w-9 h-9 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">
                      {!selectedSupplier ? "Pick a supplier to start." : "Click items in Step 2 to add them."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {orderItems.map((oi) => (
                        <div key={oi.inventoryItemId} className="flex justify-between gap-2 text-sm">
                          <span className="text-slate-600 truncate">{oi.itemName} ×{oi.quantity}{oi.unit}</span>
                          <span className="font-medium text-slate-900 flex-shrink-0">{formatINR(oi.totalCost)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
                      <span>Total</span>
                      <span>{formatINR(total)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 mb-5">+ GST as applicable</p>
                    {error && (
                      <p className="mb-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                    )}
                    <button
                      type="button"
                      onClick={sendOrder}
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {sending ? "Preparing…" : <><MessageCircle className="w-4 h-4" /> Send via WhatsApp</>}
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-2">Opens WhatsApp with order pre-filled</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Order history ── */}
        <div>
          <h2 className="font-semibold text-slate-900 mb-3">Order History</h2>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {mockOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setDetailOrder(order)}
                className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
                    {order.supplierName}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[order.status].pill}`}>
                    {statusStyle[order.status].label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>
                    {order.items.length} items ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <span className="font-semibold text-slate-700">{formatINR(order.totalAmount)}</span>
                </div>
                {order.status === "sent" && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                    <MessageCircle className="w-3 h-3" /> Sent via WhatsApp · Awaiting confirmation
                  </p>
                )}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400 text-center">Click any order to view details</p>
        </div>

      </div>
    </AppShell>
  );
}
