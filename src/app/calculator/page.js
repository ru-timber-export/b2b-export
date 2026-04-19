"use client";
import { useState } from "react";
import Link from "next/link";

// Популярные экспортные пресеты
const PRESETS = [
  { label: "44 × 150 × 5980", t: 44, w: 150, l: 5980 },
  { label: "50 × 150 × 5980", t: 50, w: 150, l: 5980 },
  { label: "25 × 100 × 5980", t: 25, w: 100, l: 5980 },
  { label: "32 × 100 × 5980", t: 32, w: 100, l: 5980 },
  { label: "50 × 200 × 5980", t: 50, w: 200, l: 5980 },
];

export default function CalculatorPage() {
  // Размеры доски в мм
  const [thickness, setThickness] = useState(44);
  const [width, setWidth] = useState(150);
  const [length, setLength] = useState(5980);
  const [quantity, setQuantity] = useState(100);

  // Расчёты
  const volumePerBoard_m3 = (thickness * width * length) / 1_000_000_000; // мм³ → м³
  const totalVolume_m3 = volumePerBoard_m3 * quantity;
  const totalVolume_cft = totalVolume_m3 * 35.3147;

  // Применить пресет
  const applyPreset = (preset) => {
    setThickness(preset.t);
    setWidth(preset.w);
    setLength(preset.l);
  };

  // Сброс
  const reset = () => {
    setThickness(44);
    setWidth(150);
    setLength(5980);
    setQuantity(100);
  };

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
      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-3">
            FREE TOOL
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Container Loading <span className="text-orange-500">Calculator</span>
          </h1>
          <p className="text-slate-300 text-sm">
            Step 2 of build: volume calculation ✅
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* ПРЕСЕТЫ */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-orange-500">⚡</span> Quick Presets
          </h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-3 py-2 text-sm bg-slate-100 hover:bg-orange-500 hover:text-white rounded font-mono transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ℹ️ Standard export sizes for 40ft HC container (length 5980mm optimal)
          </p>
        </section>

        {/* ВВОД РАЗМЕРОВ */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-orange-500">📐</span> Board Dimensions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Толщина */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Thickness (mm)
              </label>
              <input
                type="number"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value) || 0)}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">{(thickness / 25.4).toFixed(2)}"</p>
            </div>

            {/* Ширина */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Width (mm)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">{(width / 25.4).toFixed(2)}"</p>
            </div>

            {/* Длина */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Length (mm)
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value) || 0)}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">{(length / 304.8).toFixed(2)} ft</p>
            </div>
          </div>

          {/* Количество */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Quantity (number of boards)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 0)}
              className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
              min="0"
            />
          </div>

          <button
            onClick={reset}
            className="mt-4 text-sm text-slate-500 hover:text-orange-500 underline"
          >
            ↻ Reset to defaults
          </button>
        </section>

        {/* РЕЗУЛЬТАТ */}
        <section className="bg-slate-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-500">📊</span> Volume Calculation
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Per Board</div>
              <div className="text-2xl font-black font-mono text-orange-500">
                {volumePerBoard_m3.toFixed(4)}
              </div>
              <div className="text-xs text-slate-400">m³</div>
            </div>
            <div className="bg-slate-800 rounded p-3">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Quantity</div>
              <div className="text-2xl font-black font-mono">
                {quantity.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">pcs</div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Total Volume</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-4xl font-black font-mono text-orange-500">
                  {totalVolume_m3.toFixed(2)}
                </div>
                <div className="text-sm text-slate-400">m³ (CBM)</div>
              </div>
              <div>
                <div className="text-4xl font-black font-mono">
                  {totalVolume_cft.toFixed(0)}
                </div>
                <div className="text-sm text-slate-400">CFT</div>
              </div>
            </div>
          </div>
        </section>

        {/* Инфо */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-slate-700">
          ℹ️ <strong>Next step:</strong> moisture selector (KD / AD / Fresh) + weight calculation
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}