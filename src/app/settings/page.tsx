"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { RefreshCw, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [ppKey, setPpKey] = useState("");
  const [ppSecret, setPpSecret] = useState("");
  const [ppToken, setPpToken] = useState("");
  const [ppRestaurantId, setPpRestaurantId] = useState("");
  const [waPhoneId, setWaPhoneId] = useState("");
  const [waToken, setWaToken] = useState("");
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [syncMsg, setSyncMsg] = useState("");

  async function handleSync() {
    setSyncStatus("loading");
    try {
      const res = await fetch("/api/petpooja/sync", { method: "POST" });
      const data = await res.json() as { success: boolean; message?: string; itemCount?: number };
      if (data.success) {
        setSyncStatus("success");
        setSyncMsg(`Synced ${data.itemCount ?? 0} items from PetPooja`);
      } else {
        setSyncStatus("error");
        setSyncMsg(data.message ?? "Sync failed");
      }
    } catch {
      setSyncStatus("error");
      setSyncMsg("Network error");
    }
  }

  return (
    <AppShell title="Settings" subtitle="Configure PetPooja and WhatsApp integrations">
      <div className="max-w-2xl space-y-6">
        {/* PetPooja */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">PetPooja POS Integration</h3>
              <p className="text-xs text-slate-400">Get your credentials from the PetPooja Partner Portal</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "App Key", value: ppKey, set: setPpKey, placeholder: "PETPOOJA_APP_KEY", envKey: "PETPOOJA_APP_KEY" },
              { label: "App Secret", value: ppSecret, set: setPpSecret, placeholder: "PETPOOJA_APP_SECRET", envKey: "PETPOOJA_APP_SECRET" },
              { label: "Access Token", value: ppToken, set: setPpToken, placeholder: "PETPOOJA_ACCESS_TOKEN", envKey: "PETPOOJA_ACCESS_TOKEN" },
              { label: "Restaurant ID", value: ppRestaurantId, set: setPpRestaurantId, placeholder: "Your PetPooja restaurant ID", envKey: "PETPOOJA_RESTAURANT_ID" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs font-medium text-slate-600 block mb-1">{field.label}</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Set as <code className="bg-slate-100 px-1 rounded">{field.envKey}</code> in <code className="bg-slate-100 px-1 rounded">.env.local</code></p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncStatus === "loading"}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus === "loading" ? "animate-spin" : ""}`} />
              {syncStatus === "loading" ? "Syncing…" : "Test & Sync"}
            </button>
            {syncStatus === "success" && (
              <div className="flex items-center gap-1.5 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" /> {syncMsg}
              </div>
            )}
            {syncStatus === "error" && (
              <div className="flex items-center gap-1.5 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" /> {syncMsg}
              </div>
            )}
          </div>

          <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg p-4 text-xs text-orange-700">
            <strong>How to get credentials:</strong> Log in to{" "}
            <span className="font-mono">partner.petpooja.com</span> → API Settings → Generate API Keys.
            Add them to your <code className="bg-orange-100 px-1 rounded">.env.local</code> file for production use.
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">WhatsApp Business API</h3>
              <p className="text-xs text-slate-400">Meta Cloud API · Used to send purchase orders to suppliers</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Phone Number ID", value: waPhoneId, set: setWaPhoneId, placeholder: "WhatsApp Business phone number ID", envKey: "WHATSAPP_PHONE_NUMBER_ID" },
              { label: "Access Token", value: waToken, set: setWaToken, placeholder: "System user permanent token", envKey: "WHATSAPP_ACCESS_TOKEN" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs font-medium text-slate-600 block mb-1">{field.label}</label>
                <input
                  type="password"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <p className="text-xs text-slate-400 mt-1">Set as <code className="bg-slate-100 px-1 rounded">{field.envKey}</code> in <code className="bg-slate-100 px-1 rounded">.env.local</code></p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4 text-xs text-green-700">
            <strong>Demo mode:</strong> Without credentials, orders open a{" "}
            <code className="bg-green-100 px-1 rounded">wa.me</code> deep-link so you can test immediately.
            Add the Meta credentials to send messages programmatically at scale.
          </div>
        </div>

        {/* .env.local instructions */}
        <div className="bg-slate-900 rounded-xl p-5">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">.env.local</p>
          <pre className="text-green-400 text-xs leading-relaxed overflow-x-auto">{`# PetPooja POS
PETPOOJA_APP_KEY=your_app_key
PETPOOJA_APP_SECRET=your_app_secret
PETPOOJA_ACCESS_TOKEN=your_access_token
PETPOOJA_RESTAURANT_ID=your_restaurant_id

# WhatsApp Business Cloud API (Meta)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_system_token`}</pre>
        </div>
      </div>
    </AppShell>
  );
}
