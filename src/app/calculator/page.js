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

// Плотность сосны по влажности
const MOISTURE_OPTIONS = [
  {
    id: "KD",
    label: "KD",
    fullName: "Kiln Dried",
    range: "10-12%",
    density: 550,
    desc: "Chamber-dried. Premium export grade.",
    color: "emerald",
  },
  {
    id: "AD",
    label: "AD",
    fullName: "Air Dried",
    range: "18-22%",
    density: 650,
    desc: "Transport moisture. Standard for shipping.",
    color: "amber",
  },
  {
    id: "FRESH",
    label: "Fresh",
    fullName: "Fresh Sawn",
    range: "22-30%",
    density: 750,
    desc: "Freshly cut. Heaviest — watch overweight!",
    color: "rose",
  },
];

export default function CalculatorPage() {
  const [thickness, setThickness] = useState(44);
  const [width, setWidth] = useState(150);
  const [length, setLength] = useState(5980);
  const [quantity, setQuantity] = useState(100);
  const [moisture, setMoisture] = useState("KD");

  const volumePerBoard_m3 = (thickness * width * length) / 1_000_000_000;
  const totalVolume_m3 = volumePerBoard_m3 * quantity;
  const totalVolume_cft = totalVolume_m3 * 35.3147;

  const selectedMoisture = MOISTURE_OPTIONS.find((m) => m.id === moisture);
  const density = selectedMoisture.density;
  const totalWeight_kg = totalVolume_m3 * density;
  const totalWeight_t = totalWeight_kg / 1000;

  const applyPreset = (preset) => {
    setThickness(preset.t);
    setWidth(preset.w);
    setLength(preset.l);
  };

  const reset = () => {
    setThickness(44);
    setWidth(150);
    setLength(5980);
    setQuantity(100);
    setMoisture("KD");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <Link href="/" className="text-sm text-slate-300 hover:text-orange-500">← Back</Link>
        </div>
      </nav>

      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-3">
            FREE TOOL
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Container Loading <span className="text-orange-500">Calculator</span>
          </h1>
          <p className="text-slate-300 text-sm">
            Step 3 of build: moisture + weight ✅
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

        {/* РАЗМЕРЫ */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-orange-500">📐</span> Board Dimensions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Thickness (mm)</label>
              <input
                type="number"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value) || 0)}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">{(thickness / 25.4).toFixed(2)}"</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Width (mm)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 0)}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">{(width / 25.4).toFixed(2)}"</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Length (mm)</label>
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity (number of boards)</label>
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

        {/* ВЛАЖНОСТЬ */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">💧</span> Moisture Content
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Select the wood moisture — density (and weight!) depends on it.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOISTURE_OPTIONS.map((m) => {
              const isActive = moisture === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMoisture(m.id)}
                  className={`text-left p-4 rounded-lg border-2 transition ${
                    isActive
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-black text-lg">{m.label}</div>
                    {isActive && <span className="text-orange-500 text-xl">✓</span>}
                  </div>
                  <div className="text-sm font-semibold text-slate-700">{m.fullName}</div>
                  <div className="text-xs text-slate-500 mb-2">Moisture: {m.range}</div>
                  <div className="text-xs font-mono bg-slate-100 inline-block px-2 py-1 rounded">
                    {m.density} kg/m³
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{m.desc}</p>
                </button>
              );
            })}
          </div>

          {moisture === "FRESH" && (
            <div className="mt-4 bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-slate-700">
              ⚠️ <strong>Fresh wood is heavy!</strong> Max safe load for 40ft HC drops to ~35 m³ (weight limit).
            </div>
          )}
          {moisture === "AD" && (
            <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-xs text-slate-700">
              ℹ️ Standard transport moisture. Max safe load for 40ft HC ≈ 40 m³.
            </div>
          )}
          {moisture === "KD" && (
            <div className="mt-4 bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-xs text-slate-700">
              ✅ Premium dried wood. Max safe load for 40ft HC ≈ 48 m³.
            </div>
          )}
        </section>

        {/* РЕЗУЛЬТАТ */}
        <section className="bg-slate-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-500">📊</span> Calculation Result
          </h2>

          {/* Объём */}
          <div className="mb-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Total Volume</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono text-orange-500">
                  {totalVolume_m3.toFixed(2)}
                </div>
                <div className="text-sm text-slate-400">m³ (CBM)</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono">
                  {totalVolume_cft.toFixed(0)}
                </div>
                <div className="text-sm text-slate-400">CFT</div>
              </div>
            </div>
          </div>

          {/* Вес */}
          <div className="border-t border-slate-700 pt-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
              Total Weight ({selectedMoisture.label} · {density} kg/m³)
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono text-orange-500">
                  {totalWeight_kg.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400">kg</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono">
                  {totalWeight_t.toFixed(2)}
                </div>
                <div className="text-sm text-slate-400">tonnes</div>
              </div>
            </div>
          </div>

          {/* Детали */}
          <div className="mt-5 pt-5 border-t border-slate-700 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-400 uppercase">Per board vol.</div>
              <div className="font-mono">{volumePerBoard_m3.toFixed(4)} m³</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase">Per board weight</div>
              <div className="font-mono">{(volumePerBoard_m3 * density).toFixed(2)} kg</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase">Quantity</div>
              <div className="font-mono">{quantity.toLocaleString()} pcs</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase">Density</div>
              <div className="font-mono">{density} kg/m³</div>
            </div>
          </div>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-slate-700">
          ℹ️ <strong>Next step:</strong> 40ft HC container capacity check — weight & volume bars with safety zones
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}