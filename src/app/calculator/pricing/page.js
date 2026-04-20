"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "ru-timber-pricing-v1";

const DEFAULTS = {
  // Costs (в USD, для простоты)
  costRawMaterial: 180,      // $ за 1 м³ (сырьё от пилорамы)
  costLogisticsRU: 15,       // $ за 1 м³ (логистика по РФ до порта)
  costFOB: 25,               // $ за 1 м³ (портовые сборы, погрузка)
  costCIF: 40,               // $ за 1 м³ (фрахт + страховка до порта назначения)
  // Deal parameters
  incoterms: "CIF",
  volumeM3: 40,
  marginPercent: 25,
  usdRub: 95,
};

const INCOTERMS_CONFIG = {
  EXW: {
    label: "EXW",
    fullName: "Ex Works",
    description: "Самовывоз с пилорамы",
    includes: ["raw"],
    icon: "🏭",
  },
  FCA: {
    label: "FCA",
    fullName: "Free Carrier",
    description: "+ доставка до порта РФ",
    includes: ["raw", "logisticsRU"],
    icon: "🚚",
  },
  FOB: {
    label: "FOB",
    fullName: "Free On Board",
    description: "+ погрузка на судно",
    includes: ["raw", "logisticsRU", "fob"],
    icon: "⚓",
  },
  CIF: {
    label: "CIF",
    fullName: "Cost, Insurance, Freight",
    description: "+ фрахт + страховка (Full)",
    includes: ["raw", "logisticsRU", "fob", "cif"],
    icon: "🚢",
  },
};

export default function PricingPage() {
  const [costRawMaterial, setCostRawMaterial] = useState(DEFAULTS.costRawMaterial);
  const [costLogisticsRU, setCostLogisticsRU] = useState(DEFAULTS.costLogisticsRU);
  const [costFOB, setCostFOB] = useState(DEFAULTS.costFOB);
  const [costCIF, setCostCIF] = useState(DEFAULTS.costCIF);
  const [incoterms, setIncoterms] = useState(DEFAULTS.incoterms);
  const [volumeM3, setVolumeM3] = useState(DEFAULTS.volumeM3);
  const [marginPercent, setMarginPercent] = useState(DEFAULTS.marginPercent);
  const [usdRub, setUsdRub] = useState(DEFAULTS.usdRub);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);

  // LOAD
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const d = JSON.parse(saved);
          if (d.costRawMaterial !== undefined) setCostRawMaterial(d.costRawMaterial);
          if (d.costLogisticsRU !== undefined) setCostLogisticsRU(d.costLogisticsRU);
          if (d.costFOB !== undefined) setCostFOB(d.costFOB);
          if (d.costCIF !== undefined) setCostCIF(d.costCIF);
          if (d.incoterms !== undefined) setIncoterms(d.incoterms);
          if (d.volumeM3 !== undefined) setVolumeM3(d.volumeM3);
          if (d.marginPercent !== undefined) setMarginPercent(d.marginPercent);
          if (d.usdRub !== undefined) setUsdRub(d.usdRub);
          setHasMemory(true);
        }
      }
    } catch (e) {
      console.warn("Failed to load pricing state:", e);
    }
    setIsLoaded(true);
  }, []);

  // SAVE
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (typeof window !== "undefined") {
        const data = {
          costRawMaterial, costLogisticsRU, costFOB, costCIF,
          incoterms, volumeM3, marginPercent, usdRub,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.warn("Failed to save pricing state:", e);
    }
  }, [costRawMaterial, costLogisticsRU, costFOB, costCIF,
      incoterms, volumeM3, marginPercent, usdRub, isLoaded]);

  // === РАСЧЁТЫ ===

  const selectedIncoterms = INCOTERMS_CONFIG[incoterms];
  const includes = selectedIncoterms.includes;

  // Стоимость по статьям (только то, что включено в выбранные Incoterms)
  const includedRaw = includes.includes("raw") ? Number(costRawMaterial) || 0 : 0;
  const includedLogRU = includes.includes("logisticsRU") ? Number(costLogisticsRU) || 0 : 0;
  const includedFOB = includes.includes("fob") ? Number(costFOB) || 0 : 0;
  const includedCIF = includes.includes("cif") ? Number(costCIF) || 0 : 0;

  // Себестоимость за 1 м³
  const costPerM3_USD = includedRaw + includedLogRU + includedFOB + includedCIF;

  // Маржа
  const marginMultiplier = 1 + (Number(marginPercent) || 0) / 100;
  const pricePerM3_USD = costPerM3_USD * marginMultiplier;
  const profitPerM3_USD = pricePerM3_USD - costPerM3_USD;

  // Итого по объёму
  const volume = Number(volumeM3) || 0;
  const totalCost_USD = costPerM3_USD * volume;
  const totalPrice_USD = pricePerM3_USD * volume;
  const totalProfit_USD = profitPerM3_USD * volume;

  // В рублях
  const rate = Number(usdRub) || 0;
  const totalPrice_RUB = totalPrice_USD * rate;
  const totalProfit_RUB = totalProfit_USD * rate;

  // CFT эквивалент (индусский стандарт)
  const CFT_PER_M3 = 35.3147;
  const pricePerCFT_USD = pricePerM3_USD / CFT_PER_M3;
  const totalVolume_CFT = volume * CFT_PER_M3;

  const reset = () => {
    setCostRawMaterial(DEFAULTS.costRawMaterial);
    setCostLogisticsRU(DEFAULTS.costLogisticsRU);
    setCostFOB(DEFAULTS.costFOB);
    setCostCIF(DEFAULTS.costCIF);
    setIncoterms(DEFAULTS.incoterms);
    setVolumeM3(DEFAULTS.volumeM3);
    setMarginPercent(DEFAULTS.marginPercent);
    setUsdRub(DEFAULTS.usdRub);
    setHasMemory(false);
  };

  const clearMemory = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      reset();
      if (typeof window !== "undefined") {
        alert("Memory cleared!");
      }
    } catch (e) {
      console.warn("Failed to clear:", e);
    }
  };

  const handleNumberInput = (setter) => (e) => {
    const val = e.target.value;
    if (val === "") {
      setter(0);
    } else {
      setter(Number(val));
    }
  };

  const isItemIncluded = (key) => includes.includes(key);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/calculator" className="text-slate-300 hover:text-orange-500">📦 Volume</Link>
            <Link href="/" className="text-slate-300 hover:text-orange-500">← Back</Link>
          </div>
        </div>
      </nav>

      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-3">
            STEP 3.9 · PRICING
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Pricing <span className="text-orange-500">Calculator</span>
          </h1>
          <p className="text-slate-300 text-sm">
            Cost breakdown + Incoterms + margin → CBM & CFT pricing
          </p>
          {hasMemory && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full text-xs">
              ✅ Previous pricing restored from memory
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* INCOTERMS SELECTOR */}
        <section className="bg-white rounded-lg p-5 shadow-sm border-2 border-orange-200">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">🚢</span> Incoterms (Delivery Basis)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Select delivery basis. Cumulative: each adds the previous costs.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(INCOTERMS_CONFIG).map((ic) => {
              const isActive = incoterms === ic.label;
              return (
                <button
                  key={ic.label}
                  onClick={() => setIncoterms(ic.label)}
                  className={`text-left p-3 rounded-lg border-2 transition-all active:scale-95 ${
                    isActive
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-black text-sm">{ic.icon} {ic.label}</div>
                    {isActive && <span className="text-orange-500">✓</span>}
                  </div>
                  <div className="text-xs font-semibold text-slate-700">{ic.fullName}</div>
                  <div className="text-xs text-slate-500 mt-1">{ic.description}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-xs text-slate-700">
            ℹ️ <strong>Selected: {selectedIncoterms.label} ({selectedIncoterms.fullName})</strong><br/>
            Price includes: {includes.map(k => {
              const map = { raw: "Raw material", logisticsRU: "RU logistics", fob: "Port/Loading", cif: "Freight+Insurance" };
              return map[k];
            }).join(" + ")}
          </div>
        </section>

        {/* COSTS INPUT */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">💵</span> Cost Breakdown (per 1 m³ in USD)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Dim items = excluded from current Incoterms ({incoterms}).
          </p>

          <div className="space-y-3">
            {/* Raw material */}
            <div className={`p-3 rounded-lg border-2 transition ${
              isItemIncluded("raw") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-slate-700">
                  🌲 Raw material (mill price)
                </label>
                <span className="text-xs">
                  {isItemIncluded("raw") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-lg">$</span>
                <input
                  type="number"
                  value={costRawMaterial}
                  onChange={handleNumberInput(setCostRawMaterial)}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="text-slate-500 text-sm">/ m³</span>
              </div>
            </div>

            {/* Logistics RU */}
            <div className={`p-3 rounded-lg border-2 transition ${
              isItemIncluded("logisticsRU") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-slate-700">
                  🚚 RU logistics (mill → port)
                </label>
                <span className="text-xs">
                  {isItemIncluded("logisticsRU") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-lg">$</span>
                <input
                  type="number"
                  value={costLogisticsRU}
                  onChange={handleNumberInput(setCostLogisticsRU)}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="text-slate-500 text-sm">/ m³</span>
              </div>
            </div>

            {/* FOB */}
            <div className={`p-3 rounded-lg border-2 transition ${
              isItemIncluded("fob") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-slate-700">
                  ⚓ Port & loading (FOB fees)
                </label>
                <span className="text-xs">
                  {isItemIncluded("fob") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-lg">$</span>
                <input
                  type="number"
                  value={costFOB}
                  onChange={handleNumberInput(setCostFOB)}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="text-slate-500 text-sm">/ m³</span>
              </div>
            </div>

            {/* CIF */}
            <div className={`p-3 rounded-lg border-2 transition ${
              isItemIncluded("cif") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-slate-700">
                  🚢 Freight + Insurance (CIF)
                </label>
                <span className="text-xs">
                  {isItemIncluded("cif") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-lg">$</span>
                <input
                  type="number"
                  value={costCIF}
                  onChange={handleNumberInput(setCostCIF)}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
                />
                <span className="text-slate-500 text-sm">/ m³</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-slate-900 text-white rounded-lg p-3 flex justify-between items-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Total Cost ({incoterms})</div>
            <div className="text-2xl font-black font-mono text-orange-500">
              ${costPerM3_USD.toFixed(2)} <span className="text-xs text-slate-400">/ m³</span>
            </div>
          </div>
        </section>

        {/* DEAL PARAMS */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-orange-500">📊</span> Deal Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Volume (m³)</label>
              <input
                type="number"
                value={volumeM3}
                step="0.1"
                onChange={handleNumberInput(setVolumeM3)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                = {totalVolume_CFT.toFixed(0)} CFT
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Margin (%)</label>
              <input
                type="number"
                value={marginPercent}
                step="1"
                onChange={handleNumberInput(setMarginPercent)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Profit: ${profitPerM3_USD.toFixed(2)} / m³
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">USD / RUB rate</label>
              <input
                type="number"
                value={usdRub}
                step="0.5"
                onChange={handleNumberInput(setUsdRub)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                ₽ per $1
              </p>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-xs text-slate-700">
            💡 <strong>Tip:</strong> Typical export margin in timber — 15-30%. For first deals with new clients try 18-22% (competitive).
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <button onClick={reset} className="text-sm text-slate-500 hover:text-orange-500 underline">
              ↻ Reset all
            </button>
            <button onClick={clearMemory} className="text-sm text-rose-500 hover:text-rose-700 underline">
              🗑️ Clear saved memory
            </button>
          </div>
        </section>

        {/* RESULT */}
        <section className="bg-slate-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-500">💰</span> Final Pricing
          </h2>
          <div className="mb-4 text-xs text-slate-400">
            {selectedIncoterms.icon} {selectedIncoterms.label} · Margin {marginPercent}% · {volume} m³ ({totalVolume_CFT.toFixed(0)} CFT) · Rate ₽{rate}/$
          </div>

          {/* Price per unit */}
          <div className="mb-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Selling Price per unit</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono text-orange-500">
                  ${pricePerM3_USD.toFixed(2)}
                </div>
                <div className="text-sm text-slate-400">/ m³ (CBM)</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono">
                  ${pricePerCFT_USD.toFixed(2)}
                </div>
                <div className="text-sm text-slate-400">/ CFT 🇮🇳</div>
              </div>
            </div>
          </div>

          {/* Total deal */}
          <div className="border-t border-slate-700 pt-5 mb-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Total Deal Amount ({incoterms})</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono text-orange-500">
                  ${totalPrice_USD.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400">USD</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono">
                  ₽{totalPrice_RUB.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400">RUB</div>
              </div>
            </div>
          </div>

          {/* Profit */}
          <div className="border-t border-slate-700 pt-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Your Profit</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl md:text-3xl font-black font-mono text-emerald-400">
                  +${totalProfit_USD.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400">USD</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black font-mono text-emerald-400">
                  +₽{totalProfit_RUB.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400">RUB</div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="mt-5 pt-5 border-t border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Breakdown (per m³)</div>
            <div className="space-y-1 text-sm font-mono">
              {isItemIncluded("raw") && (
                <div className="flex justify-between"><span className="text-slate-400">🌲 Raw material</span><span>${Number(costRawMaterial).toFixed(2)}</span></div>
              )}
              {isItemIncluded("logisticsRU") && (
                <div className="flex justify-between"><span className="text-slate-400">🚚 RU logistics</span><span>${Number(costLogisticsRU).toFixed(2)}</span></div>
              )}
              {isItemIncluded("fob") && (
                <div className="flex justify-between"><span className="text-slate-400">⚓ Port & loading</span><span>${Number(costFOB).toFixed(2)}</span></div>
              )}
              {isItemIncluded("cif") && (
                <div className="flex justify-between"><span className="text-slate-400">🚢 Freight + Ins.</span><span>${Number(costCIF).toFixed(2)}</span></div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-400">Total cost</span>
                <span>${costPerM3_USD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>+ Margin {marginPercent}%</span>
                <span>+${profitPerM3_USD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-orange-500 pt-2 border-t border-slate-700">
                <span>= SELLING PRICE</span>
                <span>${pricePerM3_USD.toFixed(2)} / m³</span>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-slate-700">
          ℹ️ <strong>Next:</strong> State management architecture discussion (see chat)
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}