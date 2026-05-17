"use client";

import Link from "next/link";
import { Utensils } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg">Rasoi Manager</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#integrations" className="hover:text-slate-900 transition-colors">Integrations</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            Sign in
          </Link>
          <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
            Start free trial
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700" />
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-4 border-t border-slate-100 bg-white space-y-3">
          <a href="#features" className="block text-sm font-medium text-slate-600">Features</a>
          <a href="#how-it-works" className="block text-sm font-medium text-slate-600">How it works</a>
          <a href="#pricing" className="block text-sm font-medium text-slate-600">Pricing</a>
          <Link href="/dashboard" className="block text-sm font-medium text-orange-600">Go to app →</Link>
        </div>
      )}
    </nav>
  );
}
