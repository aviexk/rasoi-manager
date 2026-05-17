"use client";

import { useState } from "react";
import { RefreshCw, Bell, ChevronDown, MessageCircle } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/petpooja/sync", { method: "POST" });
      const data = await res.json() as { success: boolean; message?: string; itemCount?: number };
      if (data.success) {
        setSyncMsg(`Synced ${data.itemCount ?? 0} items from PetPooja`);
      } else {
        setSyncMsg(data.message ?? "Sync failed");
      }
    } catch {
      setSyncMsg("Sync error — check console");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 4000);
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        {syncMsg && (
          <p className="text-xs text-orange-600 mt-1 font-medium">{syncMsg}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* PetPooja sync */}
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing…" : "PetPooja Sync"}
        </button>

        {/* WhatsApp indicator */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
          <MessageCircle className="w-4 h-4" />
          WhatsApp Active
        </div>

        {/* Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
          <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
