import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    desc: "For single-outlet restaurants and cloud kitchens",
    features: [
      "Up to 100 inventory items",
      "1 PetPooja outlet sync",
      "WhatsApp orders to 5 suppliers",
      "7-day consumption reports",
      "Email support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: "₹2,499",
    period: "/month",
    desc: "For growing restaurants with multiple suppliers",
    features: [
      "Unlimited inventory items",
      "3 PetPooja outlet syncs",
      "Unlimited WhatsApp orders",
      "30-day reports & analytics",
      "Auto low-stock reordering",
      "GST-ready purchase orders",
      "Priority WhatsApp support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Chain",
    price: "₹7,999",
    period: "/month",
    desc: "For QSR chains and multi-outlet groups",
    features: [
      "Everything in Growth",
      "Unlimited outlet syncs",
      "Central kitchen management",
      "Custom reports & exports",
      "Dedicated account manager",
      "API access",
      "SLA-backed support",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-sm font-semibold rounded-full mb-3">Pricing</span>
          <h2 className="text-4xl font-extrabold text-slate-900">Simple, transparent pricing</h2>
          <p className="mt-3 text-lg text-slate-500">All plans include a 14-day free trial. No credit card required.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col ${
                plan.highlight
                  ? "border-orange-500 shadow-xl shadow-orange-100 relative"
                  : "border-slate-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{plan.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`mt-8 w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
