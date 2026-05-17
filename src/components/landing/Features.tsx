import { RefreshCw, MessageCircle, Package, BarChart3, Bell, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    color: "bg-orange-100 text-orange-600",
    title: "PetPooja POS Integration",
    desc: "Automatically pulls item consumption, sales, and stock data from your PetPooja account every hour. No manual entry, ever.",
  },
  {
    icon: MessageCircle,
    color: "bg-green-100 text-green-600",
    title: "WhatsApp to Suppliers",
    desc: "Send formatted purchase orders to suppliers on WhatsApp in one click. Suppliers get a clear, structured message with items, quantities, and expected delivery.",
  },
  {
    icon: Package,
    color: "bg-blue-100 text-blue-600",
    title: "Smart Inventory Management",
    desc: "Track every ingredient — atta, dal, paneer, vegetables — with minimum stock alerts. Know what to order before you run out.",
  },
  {
    icon: Bell,
    color: "bg-red-100 text-red-600",
    title: "Low Stock Alerts",
    desc: "Get notified the moment an item drops below your set minimum. Colour-coded urgency levels — critical, low, and warning.",
  },
  {
    icon: BarChart3,
    color: "bg-purple-100 text-purple-600",
    title: "Consumption Reports",
    desc: "See exactly how much of each item you consume daily, weekly, and monthly. Identify waste, optimise portions, and reduce costs.",
  },
  {
    icon: ShieldCheck,
    color: "bg-teal-100 text-teal-600",
    title: "GST-Ready Invoicing",
    desc: "Supplier orders include GST numbers and GSTIN-compliant fields. All amounts in INR with proper formatting for Indian books of accounts.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-sm font-semibold rounded-full mb-3">Features</span>
          <h2 className="text-4xl font-extrabold text-slate-900">Everything your kitchen team needs</h2>
          <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
            Built specifically for Indian restaurants, QSRs, dhabas, and cloud kitchens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-shadow group"
            >
              <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
