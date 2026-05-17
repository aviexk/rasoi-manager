import { RefreshCw, AlertTriangle, MessageCircle, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: RefreshCw,
    color: "bg-orange-500",
    step: "01",
    title: "Connect your PetPooja account",
    desc: "Enter your PetPooja API credentials once. Rasoi Manager starts syncing your menu, inventory, and consumption data automatically.",
  },
  {
    icon: AlertTriangle,
    color: "bg-amber-500",
    step: "02",
    title: "Get smart low-stock alerts",
    desc: "When an item falls below your minimum quantity, you get an instant alert with the exact shortfall — sorted by urgency.",
  },
  {
    icon: MessageCircle,
    color: "bg-green-500",
    step: "03",
    title: "Order via WhatsApp in one click",
    desc: "Select items to restock, choose your supplier, and hit 'Send on WhatsApp'. A formatted purchase order is sent directly to the supplier's phone.",
  },
  {
    icon: CheckCircle,
    color: "bg-blue-500",
    step: "04",
    title: "Track delivery & update stock",
    desc: "When the delivery arrives, mark it received. Stock levels update automatically and the cycle repeats — zero manual work.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-sm font-semibold rounded-full mb-3">How it works</span>
          <h2 className="text-4xl font-extrabold text-slate-900">From PetPooja data to WhatsApp order in minutes</h2>
          <p className="mt-3 text-lg text-slate-500">No more Excel sheets. No more missed orders. No more phone calls.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-slate-200 -translate-x-6 z-0" />
              )}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 relative z-10">
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1">Step {s.step}</div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
