import Link from "next/link";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  confirmed: "bg-blue-100 text-blue-700",
  sent: "bg-yellow-100 text-yellow-700",
  draft: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-100 text-red-700",
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-slate-900">Recent Orders</h3>
        </div>
        <Link href="/orders" className="text-xs text-orange-600 font-medium hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{order.supplierName}</p>
                <p className="text-xs text-slate-400">
                  {order.items.length} items · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{formatINR(order.totalAmount)}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
