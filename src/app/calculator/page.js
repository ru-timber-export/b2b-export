"use client";
import Link from "next/link";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Навигация */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <Link href="/" className="text-sm text-slate-300 hover:text-orange-500">← Back</Link>
        </div>
      </nav>

      {/* Заголовок */}
      <header className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-4">
            FREE TOOL
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Container Loading<br/>
            <span className="text-orange-500">Calculator</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Calculate volume, weight, and container capacity for timber shipping.
            Works offline. Metric and Imperial units.
          </p>
        </div>
      </header>

      {/* Заглушка */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🪵</div>
          <h2 className="text-2xl font-bold mb-2">Calculator coming here</h2>
          <p className="text-slate-600">
            Step 1 of build: empty page created. ✅<br/>
            Next step: input fields + volume calculation.
          </p>
        </div>

        {/* Инфо-блок */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-slate-700">
            ℹ️ <strong>What this tool will do:</strong><br/>
            • Calculate timber volume (m³ / CFT)<br/>
            • Estimate weight by moisture (KD / AD / Fresh)<br/>
            • Check 40ft HC container capacity (weight + volume)<br/>
            • Visual container loading scheme<br/>
            • Works on slow internet and offline
          </p>
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}