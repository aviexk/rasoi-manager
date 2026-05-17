"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { mockInventory, mockSuppliers, mockOrders } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import {
  MessageCircle,
  Plus,
  Trash2,
  Send,
  ShoppingCart,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import type { OrderItem, Supplier } from "@/lib/types";

const statusStyle: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  sent: "bg-yellow-100 text-yellow-700",
  draft: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-100 text-red-700",
};

function OrderBuilder() {
  const searchParams = useSearchParams();
  const prefillSupplier = searchParams.get("prefill");
  const prefillItem = searchParams.get("item");

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    prefillSupplier ? (mockSuppliers.find((s) => s.id === prefillSupplier) ?? null) : null
  );
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ waLink: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prefillItem && prefillSupplier) {
      const item = mockInventory.find((i) => i.id === prefillItem);
      if (item) {
        const needed = item.minStock * 2 - item.currentStock;
        setOrderItems([
          {
            inventoryItemId: item.id,
            itemName: item.name,
            quantity: Math.max(needed, item.minStock),
            unit: item.unit,
            unitCost: item.unitCost,
            totalCost: Math.max(needed, item.minStock) * item.unitCost,
          },
        ]);
      }
    }
  }, [prefillItem, prefillSupplier]);

  const supplierItems = selectedSupplier
    ? mockInventory.filter((i) => i.supplierId === selectedSupplier.id)
    : [];

  function addItem(inventoryItemId: string) {
    const inv = mockInventory.find((i) => i.id === inventoryItemId);
    if (!inv || orderItems.find((oi) => oi.inventoryItemId === inventoryItemId)) return;
    const qty = inv.minStock;
    setOrderItems((prev) => [
      ...prev,
      {
        inventoryItemId: inv.id,
        itemName: inv.name,
        quantity: qty,
        unit: inv.unit,
        unitCost: inv.unitCost,
        totalCost: qty * inv.unitCost,
      },
    ]);
  }

  function updateQty(inventoryItemId: string, qty: number) {
    setOrderItems((prev) =>
      prev.map((oi) =>
        oi.inventoryItemId === inventoryItemId
          ? { ...oi, quantity: qty, totalCost: qty * oi.unitCost }
          : oi
      )
    );
  }

  function removeItem(inventoryItemId: string) {
    setOrderItems((prev) => prev.filter((oi) => oi.inventoryItemId !== inventoryItemId));
  }

  const total = orderItems.reduce((s, i) => s + i.totalCost, 0);

  async function handleSendWhatsApp() {
    if (!selectedSupplier || orderItems.length === 0) return;
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
      if (data.success && data.waLink) {
        setSent({ waLink: data.waLink });
      } else {
        setError(data.error ?? "Failed to send order");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-xl border border-green-200 p-8 text-center shadow-sm">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Order Ready to Send!</h3>
        <p className="text-slate-500 mb-6 text-sm">
          Click below to open WhatsApp and send the formatted purchase order to{" "}
          <strong>{selectedSupplier?.name}</strong>.
        </p>
        <a
          href={sent.waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Open WhatsApp to Send
        </a>
        <button
          onClick={() => { setSent(null); setOrderItems([]); setSelectedSupplier(null); }}
          className="ml-4 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
        >
          New Order
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Builder */}
      <div className="lg:col-span-2 space-y-4">
        {/* Supplier select */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">1. Select Supplier</h3>
          <div className="relative">
            <select
              value={selectedSupplier?.id ?? ""}
              onChange={(e) => {
                const sup = mockSuppliers.find((s) => s.id === e.target.value) ?? null;
                setSelectedSupplier(sup);
                setOrderItems([]);
              }}
              className="w-full appearance-none border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              <option value="">Choose a supplier…</option>
              {mockSuppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.city}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {selectedSupplier && (
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <span>📞 +{selectedSupplier.phone}</span>
              <span>📍 {selectedSupplier.city}</span>
              <span>🕐 {selectedSupplier.leadTimeDays}d lead time</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <MessageCircle className="w-3 h-3" /> WhatsApp enabled
              </span>
            </div>
          )}
        </div>

        {/* Add items */}
        {selectedSupplier && (
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3">2. Add Items</h3>
            <div className="flex flex-wrap gap-2">
              {supplierItems.map((item) => {
                const alreadyAdded = orderItems.some((oi) => oi.inventoryItemId === item.id);
                const isLow = item.currentStock <= item.minStock;
                return (
                  <button
                    key={item.id}
                    onClick={() => addItem(item.id)}
                    disabled={alreadyAdded}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      alreadyAdded
                        ? "bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed"
                        : isLow
                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {isLow && !alreadyAdded && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    {alreadyAdded && <Plus className="w-3 h-3" />}
                    {item.name} ({item.currentStock} {item.unit})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Order items */}
        {orderItems.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3">3. Review & Quantities</h3>
            <div className="space-y-3">
              {orderItems.map((oi) => (
                <div key={oi.inventoryItemId} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{oi.itemName}</p>
                    <p className="text-xs text-slate-400">{formatINR(oi.unitCost)} per {oi.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={oi.quantity}
                      onChange={(e) => updateQty(oi.inventoryItemId, Number(e.target.value))}
                      className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    <span className="text-xs text-slate-400 w-8">{oi.unit}</span>
                    <span className="text-sm font-semibold text-slate-700 w-20 text-right">
                      {formatINR(oi.totalCost)}
                    </span>
                    <button
                      onClick={() => removeItem(oi.inventoryItemId)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Expected Delivery</label>
                <input
                  type="date"
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Notes (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Deliver before 9am"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm sticky top-6">
          <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>

          {orderItems.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              Select a supplier and add items to build your order.
            </p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {orderItems.map((oi) => (
                  <div key={oi.inventoryItemId} className="flex justify-between text-sm">
                    <span className="text-slate-600 truncate mr-2">{oi.itemName} ×{oi.quantity}{oi.unit}</span>
                    <span className="font-medium text-slate-900 flex-shrink-0">{formatINR(oi.totalCost)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">+ GST as applicable</div>

              {error && (
                <p className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
              )}

              <button
                onClick={handleSendWhatsApp}
                disabled={sending || !selectedSupplier}
                className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  "Preparing…"
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Send via WhatsApp
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 text-center mt-2">
                Opens WhatsApp with pre-filled order message
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AppShell title="Orders" subtitle="Place purchase orders to suppliers via WhatsApp">
      <div className="max-w-7xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
            <MessageCircle className="w-4 h-4" />
            WhatsApp Business API connected
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 font-medium">
            <ShoppingCart className="w-4 h-4" />
            {mockOrders.length} orders this month
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold text-slate-900 mb-3">New Order</h2>
            <Suspense fallback={<div className="text-sm text-slate-400">Loading…</div>}>
              <OrderBuilder />
            </Suspense>
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 mb-3">Order History</h2>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {mockOrders.map((order) => (
                <div key={order.id} className="px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-slate-900 text-sm">{order.supplierName}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{order.items.length} items · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    <span className="font-semibold text-slate-700">{formatINR(order.totalAmount)}</span>
                  </div>
                  {order.status === "sent" && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <MessageCircle className="w-3 h-3" />
                      Sent via WhatsApp · Awaiting confirmation
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
