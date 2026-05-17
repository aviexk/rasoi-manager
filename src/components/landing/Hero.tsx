import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-orange-100 px-4 py-1.5 rounded-full text-sm text-orange-700 font-medium mb-8 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
          Trusted by 2,000+ restaurants across India
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight max-w-4xl mx-auto">
          Run your restaurant kitchen
          <span className="text-orange-500"> smarter</span>, not harder
        </h1>

        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Rasoi Manager connects with your PetPooja POS to track consumption in real-time
          and places purchase orders to suppliers via WhatsApp — automatically.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-lg shadow-orange-200"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            See how it works
          </a>
        </div>

        <p className="mt-4 text-sm text-slate-400">No credit card required · Free 14-day trial · Setup in 10 minutes</p>

        {/* Dashboard preview */}
        <div className="mt-16 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200 max-w-5xl mx-auto">
          <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-4 text-slate-400 text-xs">app.rasoimanager.in/dashboard</span>
          </div>
          <div className="bg-slate-50 p-6 grid grid-cols-4 gap-4">
            {[
              { label: "Inventory Value", value: "₹2,84,500", delta: "+4.2%", color: "orange" },
              { label: "Low Stock Alerts", value: "8 items", delta: "Action needed", color: "red" },
              { label: "Orders this Month", value: "34", delta: "+12 vs last month", color: "blue" },
              { label: "Monthly Savings", value: "₹32,400", delta: "vs manual ordering", color: "green" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.color === "red" ? "text-red-500" : stat.color === "green" ? "text-green-600" : "text-orange-500"}`}>
                  {stat.delta}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-slate-800 text-sm">Weekly Consumption vs Orders (₹)</p>
              <span className="text-xs text-slate-400">Live from PetPooja</span>
            </div>
            <div className="flex items-end gap-3 h-24">
              {[42, 38, 51, 47, 63, 78, 71].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-orange-400 rounded-t-sm"
                    style={{ height: `${(h / 78) * 80}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                <div key={d} className="flex-1 text-center text-xs text-slate-400">{d}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
