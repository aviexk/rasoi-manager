import { Utensils } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">Rasoi Manager</span>
            </div>
            <p className="text-sm leading-relaxed">
              Built for Indian restaurants. Powered by PetPooja & WhatsApp Business API.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              All systems operational
            </div>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Product</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Integrations</p>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-orange-400">PetPooja POS</span></li>
              <li><span className="text-green-400">WhatsApp Business</span></li>
              <li>Zoho Books <span className="text-xs text-slate-600">(soon)</span></li>
              <li>Tally <span className="text-xs text-slate-600">(soon)</span></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Support</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 Rasoi Manager. Made with ❤️ in India.</p>
          <p>GST: 07AAAAA0000A1Z5</p>
        </div>
      </div>
    </footer>
  );
}
