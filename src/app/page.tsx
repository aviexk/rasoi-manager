import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />

      {/* Integrations badge section */}
      <section id="integrations" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Built on battle-tested integrations
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-6 py-4 rounded-2xl">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">PP</div>
              <div className="text-left">
                <p className="font-bold text-slate-900">PetPooja POS</p>
                <p className="text-xs text-slate-500">Consumption & inventory sync</p>
              </div>
            </div>
            <div className="text-slate-300 text-2xl font-light">+</div>
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 px-6 py-4 rounded-2xl">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.85.504 3.582 1.379 5.069L2 22l5.051-1.363A9.963 9.963 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">WhatsApp Business</p>
                <p className="text-xs text-slate-500">Meta Cloud API · Supplier orders</p>
              </div>
            </div>
            <div className="text-slate-300 text-2xl font-light">=</div>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-orange-400 font-bold text-sm">RM</div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Rasoi Manager</p>
                <p className="text-xs text-slate-500">Zero manual work</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Stop losing money to poor stock management
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Join 2,000+ Indian restaurants already using Rasoi Manager to cut waste, order smarter, and grow faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-lg"
            >
              Start your free trial
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-orange-400/30 text-white border border-orange-300 font-semibold rounded-xl hover:bg-orange-400/50 transition-colors"
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
