"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDeal, SPECIES_BASE_PRICES } from "../context/DealContext";

// 🇷🇺 Подсказки
const Tooltip = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-300 active:scale-95"
      >
        ℹ
      </button>
      {open && (
        <span
          onClick={() => setOpen(false)}
          className="absolute z-50 left-0 top-6 w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl leading-relaxed"
        >
          {text}
        </span>
      )}
    </span>
  );
};

// Плотности
const DENSITIES = {
  pine: { kd: 475, ad: 575, fresh: 725 },
  spruce: { kd: 425, ad: 515, fresh: 650 },
  "pine-spruce-50-50": { kd: 450, ad: 545, fresh: 687 },
  "pine-spruce-70-30": { kd: 460, ad: 557, fresh: 702 },
  spf: { kd: 415, ad: 505, fresh: 635 },
  larch: { kd: 620, ad: 720, fresh: 850 },
  cedar: { kd: 410, ad: 500, fresh: 620 },
  birch: { kd: 610, ad: 710, fresh: 850 },
  oak: { kd: 670, ad: 770, fresh: 900 },
  aspen: { kd: 420, ad: 510, fresh: 640 },
};

const SPECIES_LIST = [
  { id: "pine", label: "Pine", ru: "Сосна", pure: true },
  { id: "spruce", label: "Spruce", ru: "Ель", pure: true },
  { id: "larch", label: "Larch", ru: "Лиственница", pure: true },
  { id: "cedar", label: "Cedar", ru: "Кедр", pure: true },
  { id: "birch", label: "Birch", ru: "Берёза", pure: true },
  { id: "oak", label: "Oak", ru: "Дуб", pure: true },
  { id: "aspen", label: "Aspen", ru: "Осина", pure: true },
  { id: "pine-spruce-50-50", label: "Pine+Spruce 50/50", ru: "Сосна+Ель 50/50", pure: false },
  { id: "pine-spruce-70-30", label: "Pine+Spruce 70/30", ru: "Сосна+Ель 70/30", pure: false },
  { id: "spf", label: "SPF / Whitewood", ru: "Ель+Пихта", pure: false },
];

const LENGTH_PRESETS = [
  { mm: 3000, label: "3000", status: "yellow", note: "Мебель, короткая" },
  { mm: 4000, label: "4000", status: "yellow", note: "Мебель / строительство" },
  { mm: 5100, label: "5100", status: "green", note: "Тяжёлые породы (дуб)" },
  { mm: 5950, label: "5950", status: "green", note: "Запас по весу" },
  { mm: 5980, label: "5980 ⭐", status: "green", note: "Экспорт-стандарт" },
  { mm: 6000, label: "6000", status: "red", note: "НЕ влезает в 40HC!" },
];

const SIZE_PRESETS = [
  { t: 22, w: 100, tag: "Упаковка" },
  { t: 25, w: 100, tag: "Универсал" },
  { t: 32, w: 100, tag: "Опалубка" },
  { t: 44, w: 150, tag: "⭐ Экспорт" },
  { t: 50, w: 150, tag: "Стропила" },
  { t: 50, w: 200, tag: "Балки" },
];

const END_USES = [
  { id: "construction", label: "🏗 Construction", ru: "Строительство", grade: "2-3 grade (structural)" },
  { id: "furniture", label: "🪑 Furniture", ru: "Мебель", grade: "1st (Select)" },
  { id: "packaging", label: "📦 Packaging", ru: "Упаковка", grade: "3-4 grade" },
  { id: "interior", label: "🏠 Interior", ru: "Отделка", grade: "1-2 grade" },
  { id: "sauna", label: "🧖 Sauna", ru: "Баня", grade: "1st (Select)" },
  { id: "decking", label: "🌳 Decking", ru: "Террасы", grade: "Select" },
  { id: "industrial", label: "🏭 Industrial", ru: "Опалубка", grade: "4 grade" },
];

export default function CalculatorPage() {
  const { deal, updateDeal, resetDeal, isLoaded } = useDeal();

  const handleNum = (field) => (e) => {
    const v = e.target.value;
    if (v === "") {
      updateDeal({ [field]: "" });
    } else {
      const num = parseFloat(v);
      if (!isNaN(num) && num >= 0) {
        updateDeal({ [field]: num });
      }
    }
  };

  const species = deal.species || "pine-spruce-50-50";
  const moisture = deal.moisture || "kd";
  const density = DENSITIES[species]?.[moisture] || 475;

  const thickness = parseFloat(deal.thickness) || 0;
  const width = parseFloat(deal.width) || 0;
  const length = parseFloat(deal.length) || 0;
  const boardVol = (thickness * width * length) / 1_000_000_000;
  const boardWeight = boardVol * density;

  const totalVol = deal.totalVolume === "" ? 0 : parseFloat(deal.totalVolume) || 0;
  const pieces = boardVol > 0 ? Math.round(totalVol / boardVol) : 0;
  const totalWeight = totalVol * density;

  const MAX_VOL = 76;
  const MAX_WEIGHT = 26580;
  const volPct = Math.min((totalVol / MAX_VOL) * 100, 999);
  const weightPct = Math.min((totalWeight / MAX_WEIGHT) * 100, 999);
  const overloaded = totalVol > MAX_VOL || totalWeight > MAX_WEIGHT;

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm">← Home</Link>
          <div className="text-xs font-mono hidden sm:block">STEP 3.11 · CALCULATOR</div>
          <div className="flex gap-1 text-xs">
            <Link href="/calculator/pricing" className="bg-orange-500 px-2 py-1 rounded active:scale-95">💰 Pricing</Link>
            <Link href="/calculator/container" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📦 3D</Link>
            <Link href="/calculator/quotation" className="bg-emerald-600 px-2 py-1 rounded active:scale-95">📄 Quote</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Title */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Container Loading Calculator</h1>
          <p className="text-sm text-slate-500 mt-1">🔗 Connected to Pricing · auto-saved</p>
        </div>

        {/* End-Use */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            🎯 End-Use Presets
            <Tooltip text="Выбор назначения автоматически подставит породу, влажность и сорт. Помогает не запутаться с сортами ГОСТ." />
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {END_USES.map((u) => (
              <button
                key={u.id}
                onClick={() => updateDeal({ endUse: u.id })}
                className={`p-3 rounded-lg text-left text-xs transition-all active:scale-95 ${
                  deal.endUse === u.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                <div className="font-bold">{u.label}</div>
                <div className="opacity-75 mt-1">{u.ru}</div>
                <div className="opacity-60 text-[10px] mt-1">{u.grade}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Dimensions */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📐 Board Dimensions
            <Tooltip text="Размеры одной доски в миллиметрах. По ГОСТ 24454-80 стандарт для экспорта — толщина 44мм, ширина 150мм." />
          </h2>

          {/* Size presets */}
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZE_PRESETS.map((p) => {
              const active = deal.thickness === p.t && deal.width === p.w;
              return (
                <button
                  key={`${p.t}-${p.w}`}
                  onClick={() => updateDeal({ thickness: p.t, width: p.w })}
                  className={`px-3 py-2 rounded-lg text-xs font-mono transition-all active:scale-95 ${
                    active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {p.t}×{p.w} <span className="opacity-60">· {p.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <label className="text-xs text-slate-500 flex items-center">
                Thickness (mm)
                <Tooltip text="Толщина доски. Стандарты: 22, 25, 32, 44, 50 мм." />
              </label>
              <input
                type="number"
                value={deal.thickness}
                onChange={handleNum("thickness")}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 flex items-center">
                Width (mm)
                <Tooltip text="Ширина доски. Стандарты: 100, 125, 150, 200, 250 мм." />
              </label>
              <input
                type="number"
                value={deal.width}
                onChange={handleNum("width")}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 flex items-center">
                Length (mm)
                <Tooltip text="Длина доски. Для 40HC оптимум 5980мм (2 пачки подряд). 6000мм НЕ влезает!" />
              </label>
              <input
                type="number"
                value={deal.length}
                onChange={handleNum("length")}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg font-bold"
              />
            </div>
          </div>

          {/* Length presets — светофор */}
          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-2">Length presets (40HC fit check):</div>
            <div className="flex flex-wrap gap-2">
              {LENGTH_PRESETS.map((p) => {
                const active = deal.length === p.mm;
                const colors = {
                  green: active ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-300",
                  yellow: active ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700 border border-amber-300",
                  red: active ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-700 border border-rose-300",
                };
                return (
                  <button
                    key={p.mm}
                    onClick={() => updateDeal({ length: p.mm })}
                    className={`px-3 py-2 rounded-lg text-xs font-mono transition-all active:scale-95 ${colors[p.status]}`}
                    title={p.note}
                  >
                    {p.label}mm
                    <div className="text-[10px] opacity-75">{p.note}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Total Volume / Pieces */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📊 Input Mode
            <Tooltip text="Выберите: считать по объёму (м³) или по количеству досок (штук). Калькулятор автоматически пересчитает." />
          </h2>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => updateDeal({ inputMode: "volume" })}
              className={`flex-1 p-3 rounded-lg text-sm transition-all active:scale-95 ${
                deal.inputMode === "volume" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              📦 Volume (m³)
            </button>
            <button
              onClick={() => updateDeal({ inputMode: "pieces" })}
              className={`flex-1 p-3 rounded-lg text-sm transition-all active:scale-95 ${
                deal.inputMode === "pieces" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              🔢 Pieces
            </button>
          </div>

          <div className="mt-4">
            <label className="text-xs text-slate-500 flex items-center">
              Total Volume (m³)
              <Tooltip text="Общий объём заказа в кубических метрах. Лимит 40HC = 76 m³ и 26580 кг. Обычно грузят 50-56 m³ для KD." />
            </label>
            <input
              type="number"
              value={deal.totalVolume}
              onChange={handleNum("totalVolume")}
              onFocus={(e) => e.target.select()}
              placeholder="Введите объём..."
              className="w-full mt-1 p-3 border border-slate-300 rounded-lg text-2xl font-black text-slate-900"
            />
            <div className="text-xs text-slate-500 mt-1">
              ≈ {pieces.toLocaleString()} pcs · {(totalVol * 35.3147).toFixed(0)} CFT
            </div>
          </div>

          {overloaded && (
            <div className="mt-3 p-3 bg-rose-100 border border-rose-300 rounded-lg text-rose-800 text-sm">
              ⚠ OVERLOAD! {totalVol > MAX_VOL && `Volume ${totalVol.toFixed(1)} > 76 m³. `}
              {totalWeight > MAX_WEIGHT && `Weight ${(totalWeight / 1000).toFixed(1)} > 26.58 t.`}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={resetDeal}
              className="text-xs text-slate-500 hover:text-rose-500 active:scale-95"
            >
              ↻ Reset all
            </button>
          </div>
        </section>

        {/* Species */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            🌲 Wood Species
            <Tooltip text="Чистые породы — одна порода в пачке (дороже). Смеси — разные породы в пачке (дешевле). ГОСТ 8486: Сосна+Ель можно смешивать, Лиственницу и Дуб — только отдельно!" />
          </h2>

          <div className="mt-3 text-xs text-slate-500">PURE SPECIES · чистые</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {SPECIES_LIST.filter((s) => s.pure).map((s) => {
              const active = deal.species === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => updateDeal({ species: s.id })}
                  className={`p-2 rounded-lg text-left text-xs transition-all active:scale-95 ${
                    active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="opacity-75">{s.ru}</div>
                  <div className="opacity-60 text-[10px] mt-1">${SPECIES_BASE_PRICES[s.id]}/m³</div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-slate-500">🌲🌲 MIXED BUNDLES · смеси</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {SPECIES_LIST.filter((s) => !s.pure).map((s) => {
              const active = deal.species === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => updateDeal({ species: s.id })}
                  className={`p-2 rounded-lg text-left text-xs transition-all active:scale-95 ${
                    active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="opacity-75">{s.ru}</div>
                  <div className="opacity-60 text-[10px] mt-1">${SPECIES_BASE_PRICES[s.id]}/m³</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Moisture */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            💧 Moisture Content
            <Tooltip text="KD (Kiln Dried, 10-12%) — камерная сушка, премиум, 0% экспортной пошлины РФ. AD (Air Dried, 18-22%) — атмосферная, стандарт, пошлина 6.5%. Fresh — свежепил, НЕ для экспорта (плесень)!" />
          </h2>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={() => updateDeal({ moisture: "kd" })}
              className={`p-3 rounded-lg text-xs transition-all active:scale-95 ${
                deal.moisture === "kd" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <div className="font-bold">KD ⭐</div>
              <div className="opacity-75 mt-1">10-12%</div>
              <div className="opacity-60 text-[10px] mt-1">Chamber, premium</div>
            </button>
            <button
              onClick={() => updateDeal({ moisture: "ad" })}
              className={`p-3 rounded-lg text-xs transition-all active:scale-95 ${
                deal.moisture === "ad" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <div className="font-bold">AD</div>
              <div className="opacity-75 mt-1">18-22%</div>
              <div className="opacity-60 text-[10px] mt-1">Air dried</div>
            </button>
            <button
              onClick={() => updateDeal({ moisture: "fresh" })}
              className={`p-3 rounded-lg text-xs transition-all active:scale-95 ${
                deal.moisture === "fresh" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <div className="font-bold">Fresh ⚠</div>
              <div className="opacity-75 mt-1">22-30%</div>
              <div className="opacity-60 text-[10px] mt-1">NOT for export!</div>
            </button>
          </div>
        </section>

        {/* Packaging */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📦 Packaging
            <Tooltip text="Упаковка защищает груз в пути. Для Индии/Китая/MENA из-за влажности рекомендуется термопленка + обрешётка." />
          </h2>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={() => updateDeal({ packaging: "none" })}
              className={`p-3 rounded-lg text-xs transition-all active:scale-95 ${
                deal.packaging === "none" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <div className="font-bold">None</div>
              <div className="opacity-75 mt-1">навалом</div>
              <div className="opacity-60 text-[10px] mt-1">+$0/m³</div>
            </button>
            <button
              onClick={() => updateDeal({ packaging: "crate" })}
              className={`p-3 rounded-lg text-xs transition-all active:scale-95 ${
                deal.packaging === "crate" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <div className="font-bold">Crate ⭐</div>
              <div className="opacity-75 mt-1">обрешётка</div>
              <div className="opacity-60 text-[10px] mt-1">+$8/m³</div>
            </button>
            <button
              onClick={() => updateDeal({ packaging: "shrink" })}
              className={`p-3 rounded-lg text-xs transition-all active:scale-95 ${
                deal.packaging === "shrink" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <div className="font-bold">Shrink+Crate</div>
              <div className="opacity-75 mt-1">термоплёнка</div>
              <div className="opacity-60 text-[10px] mt-1">+$18/m³</div>
            </button>
          </div>
        </section>

        {/* Result */}
        <section className="bg-slate-900 text-white rounded-xl p-5 shadow-lg">
          <h2 className="font-bold">📊 Calculation Result</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-xs opacity-60">TOTAL VOLUME</div>
              <div className="text-3xl font-black">{totalVol.toFixed(2)}</div>
              <div className="text-xs opacity-60">m³ (CBM)</div>
              <div className="mt-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${volPct > 100 ? "bg-rose-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(volPct, 100)}%` }}
                />
              </div>
              <div className="text-[10px] opacity-60 mt-1">{volPct.toFixed(0)}% of 76m³</div>
            </div>
            <div>
              <div className="text-xs opacity-60">TOTAL WEIGHT</div>
              <div className="text-3xl font-black">{(totalWeight / 1000).toFixed(2)}</div>
              <div className="text-xs opacity-60">tonnes</div>
              <div className="mt-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${weightPct > 100 ? "bg-rose-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(weightPct, 100)}%` }}
                />
              </div>
              <div className="text-[10px] opacity-60 mt-1">{weightPct.toFixed(0)}% of 26.6t</div>
            </div>
            <div>
              <div className="text-xs opacity-60">QUANTITY</div>
              <div className="text-xl font-bold">{pieces.toLocaleString()} pcs</div>
            </div>
            <div>
              <div className="text-xs opacity-60">DENSITY</div>
              <div className="text-xl font-bold">{density} kg/m³</div>
            </div>
          </div>

          <Link
            href="/calculator/pricing"
            className="block w-full mt-5 bg-orange-500 text-white text-center py-3 rounded-lg font-bold active:scale-95"
          >
            💰 Continue to Pricing →
          </Link>
        </section>

        <div className="text-center text-xs text-slate-400">
          Powered by RU-TIMBER Export · +7 915 349 00 07
        </div>
      </div>
    </main>
  );
}