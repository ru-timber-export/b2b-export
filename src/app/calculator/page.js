"use client";
import { useState } from "react";
import Link from "next/link";

const PRESETS = [
  { label: "44 × 150 × 5980", t: 44, w: 150, l: 5980 },
  { label: "50 × 150 × 5980", t: 50, w: 150, l: 5980 },
  { label: "25 × 100 × 5980", t: 25, w: 100, l: 5980 },
  { label: "32 × 100 × 5980", t: 32, w: 100, l: 5980 },
  { label: "50 × 200 × 5980", t: 50, w: 200, l: 5980 },
];

// Чистые породы (GOST 8486)
const SPECIES = [
  {
    id: "PINE",
    label: "Pine",
    ru: "Сосна",
    icon: "🌲",
    isMix: false,
    densities: { KD: 500, AD: 600, FRESH: 750 },
    desc: "Most popular export. Redwood grade.",
  },
  {
    id: "SPRUCE",
    label: "Spruce",
    ru: "Ель",
    icon: "🌲",
    isMix: false,
    densities: { KD: 450, AD: 550, FRESH: 700 },
    desc: "Lightest softwood. Whitewood.",
  },
  {
    id: "PINE_SPRUCE_50",
    label: "Pine+Spruce 50/50",
    ru: "Сосна+Ель 50/50",
    icon: "🌲🌲",
    isMix: true,
    densities: { KD: 475, AD: 575, FRESH: 725 },
    desc: "GOST 8486 mixed softwood. Market standard.",
  },
  {
    id: "PINE_SPRUCE_70",
    label: "Pine+Spruce 70/30",
    ru: "Сосна+Ель 70/30",
    icon: "🌲🌲",
    isMix: true,
    densities: { KD: 485, AD: 585, FRESH: 735 },
    desc: "Pine-dominant mix. Slightly premium.",
  },
  {
    id: "SPF",
    label: "SPF / Whitewood",
    ru: "Ель+Пихта",
    icon: "🌲🌲",
    isMix: true,
    densities: { KD: 440, AD: 540, FRESH: 690 },
    desc: "Spruce+Fir. Light, white, export staple.",
  },
  {
    id: "LARCH",
    label: "Larch",
    ru: "Лиственница",
    icon: "🌳",
    isMix: false,
    densities: { KD: 650, AD: 750, FRESH: 900 },
    desc: "Heavy & strong! GOST: do NOT mix with pine.",
  },
  {
    id: "CEDAR",
    label: "Cedar",
    ru: "Кедр",
    icon: "🌲",
    isMix: false,
    densities: { KD: 435, AD: 520, FRESH: 670 },
    desc: "Aromatic, decorative. Premium.",
  },
  {
    id: "BIRCH",
    label: "Birch",
    ru: "Берёза",
    icon: "🌿",
    isMix: false,
    densities: { KD: 640, AD: 720, FRESH: 880 },
    desc: "Hardwood. Heavy, strong.",
  },
  {
    id: "OAK",
    label: "Oak",
    ru: "Дуб",
    icon: "🌳",
    isMix: false,
    densities: { KD: 700, AD: 790, FRESH: 950 },
    desc: "Heaviest! Premium hardwood.",
  },
  {
    id: "ASPEN",
    label: "Aspen",
    ru: "Осина",
    icon: "🌿",
    isMix: false,
    densities: { KD: 450, AD: 530, FRESH: 680 },
    desc: "Light, sauna lining.",
  },
  {
    id: "CUSTOM",
    label: "Custom Mix",
    ru: "Свой микс",
    icon: "🎛️",
    isMix: true,
    isCustom: true,
    desc: "Set your own Pine/Spruce ratio.",
  },
];

const MOISTURE_OPTIONS = [
  { id: "KD", label: "KD", fullName: "Kiln Dried", range: "10-12%", desc: "Chamber-dried. Premium." },
  { id: "AD", label: "AD", fullName: "Air Dried", range: "18-22%", desc: "Standard for shipping." },
  { id: "FRESH", label: "Fresh", fullName: "Fresh Sawn", range: "22-30%", desc: "Heaviest — watch overweight!" },
];

const PINE_DENSITIES = { KD: 500, AD: 600, FRESH: 750 };
const SPRUCE_DENSITIES = { KD: 450, AD: 550, FRESH: 700 };

export default function CalculatorPage() {
  const [thickness, setThickness] = useState(44);
  const [width, setWidth] = useState(150);
  const [length, setLength] = useState(5980);
  const [quantity, setQuantity] = useState(100);
  const [species, setSpecies] = useState("PINE");
  const [moisture, setMoisture] = useState("KD");
  const [pinePercent, setPinePercent] = useState(50); // для Custom Mix

  const volumePerBoard_m3 = (thickness * width * length) / 1_000_000_000;
  const totalVolume_m3 = volumePerBoard_m3 * quantity;
  const totalVolume_cft = totalVolume_m3 * 35.3147;

  const selectedSpecies = SPECIES.find((s) => s.id === species);
  const selectedMoisture = MOISTURE_OPTIONS.find((m) => m.id === moisture);

  // Расчёт плотности
  let density;
  if (selectedSpecies.isCustom) {
    const pineD = PINE_DENSITIES[moisture];
    const spruceD = SPRUCE_DENSITIES[moisture];
    density = Math.round((pineD * pinePercent + spruceD * (100 - pinePercent)) / 100);
  } else {
    density = selectedSpecies.densities[moisture];
  }

  const totalWeight_kg = totalVolume_m3 * density;
  const totalWeight_t = totalWeight_kg / 1000;

  const safeLoad_m3 = 26580 / density;

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
    setSpecies("PINE");
    setMoisture("KD");
    setPinePercent(50);
  };

  const densityLabel = selectedSpecies.isCustom
    ? `Pine ${pinePercent}% + Spruce ${100 - pinePercent}%`
    : selectedSpecies.label;

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
            Step 3.6: GOST mixed softwood bundles 🌲🌲
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

        {/* ПОРОДА */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">🌲</span> Wood Species
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            GOST 8486: softwoods (Pine+Spruce) can be mixed. Larch/Cedar — separate bundles.
          </p>
          
          {/* Разделитель: Pure species */}
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pure species / Чистые
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {SPECIES.filter(s => !s.isMix).map((s) => {
              const isActive = species === s.id;
              const d = s.densities[moisture];
              return (
                <button
                  key={s.id}
                  onClick={() => setSpecies(s.id)}
                  className={`text-left p-3 rounded-lg border-2 transition ${
                    isActive
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm">{s.icon} {s.label}</div>
                    {isActive && <span className="text-orange-500">✓</span>}
                  </div>
                  <div className="text-xs text-slate-500">{s.ru}</div>
                  <div className="text-xs font-mono mt-1 text-slate-700">{d} kg/m³</div>
                </button>
              );
            })}
          </div>

          {/* Разделитель: Mixed */}
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            🌲🌲 Mixed bundles (GOST allowed) / Миксы
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SPECIES.filter(s => s.isMix).map((s) => {
              const isActive = species === s.id;
              const d = s.isCustom
                ? Math.round((PINE_DENSITIES[moisture] * pinePercent + SPRUCE_DENSITIES[moisture] * (100 - pinePercent)) / 100)
                : s.densities[moisture];
              return (
                <button
                  key={s.id}
                  onClick={() => setSpecies(s.id)}
                  className={`text-left p-3 rounded-lg border-2 transition ${
                    isActive
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm">{s.icon} {s.label}</div>
                    {isActive && <span className="text-orange-500">✓</span>}
                  </div>
                  <div className="text-xs text-slate-500">{s.ru}</div>
                  <div className="text-xs font-mono mt-1 text-slate-700">{d} kg/m³</div>
                  <div className="text-xs text-slate-600 mt-1 italic">{s.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Ползунок Custom Mix */}
          {selectedSpecies.isCustom && (
            <div className="mt-4 bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Pine / Spruce ratio
              </label>
              <div className="flex items-center gap-4 mb-2">
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-500">{pinePercent}%</div>
                  <div className="text-xs text-slate-500">Pine</div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={pinePercent}
                  onChange={(e) => setPinePercent(Number(e.target.value))}
                  className="flex-1 accent-orange-500"
                />
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-500">{100 - pinePercent}%</div>
                  <div className="text-xs text-slate-500">Spruce</div>
                </div>
              </div>
              <div className="text-xs text-slate-600 text-center">
                Weighted density: <strong>{density} kg/m³</strong>
              </div>
            </div>
          )}

          {/* Предупреждение для Larch */}
          {species === "LARCH" && (
            <div className="mt-4 bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-slate-700">
              ⚠️ <strong>GOST 8486:</strong> Larch must NOT be mixed with Pine/Spruce in one bundle. Package separately!
            </div>
          )}
        </section>

        {/* ВЛАЖНОСТЬ */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">💧</span> Moisture Content
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Wood moisture affects density (and weight!).
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOISTURE_OPTIONS.map((m) => {
              const isActive = moisture === m.id;
              let mDensity;
              if (selectedSpecies.isCustom) {
                mDensity = Math.round((PINE_DENSITIES[m.id] * pinePercent + SPRUCE_DENSITIES[m.id] * (100 - pinePercent)) / 100);
              } else {
                mDensity = selectedSpecies.densities[m.id];
              }
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
                    {mDensity} kg/m³
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{m.desc}</p>
                </button>
              );
            })}
          </div>

          <div className={`mt-4 border-l-4 p-3 rounded text-xs text-slate-700 ${
            safeLoad_m3 >= 45 ? "bg-emerald-50 border-emerald-500" :
            safeLoad_m3 >= 38 ? "bg-amber-50 border-amber-500" :
            "bg-rose-50 border-rose-500"
          }`}>
            {safeLoad_m3 >= 45 ? "✅" : safeLoad_m3 >= 38 ? "ℹ️" : "⚠️"}
            {" "}
            <strong>40ft HC safe load for {densityLabel} {selectedMoisture.label}:</strong>
            {" "}~{safeLoad_m3.toFixed(1)} m³
            {safeLoad_m3 < 38 && " — heavy material, watch overweight!"}
          </div>
        </section>

        {/* РЕЗУЛЬТАТ */}
        <section className="bg-slate-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-500">📊</span> Calculation Result
          </h2>

          <div className="mb-3 text-xs text-slate-400">
            {selectedSpecies.icon} {densityLabel} · {selectedMoisture.label} · {density} kg/m³
          </div>

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

          <div className="border-t border-slate-700 pt-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Total Weight</div>
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
          ℹ️ <strong>Next step:</strong> 40ft HC container visual — bars with safety zones
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}