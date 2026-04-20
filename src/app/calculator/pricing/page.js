"use client";
import Link from "next/link";
import { useDeal } from "../../context/DealContext";

const INCOTERMS_CONFIG = {
  EXW: { label: "EXW", fullName: "Ex Works", description: "Самовывоз с пилорамы",
    includes: ["raw"], icon: "🏭" },
  FCA: { label: "FCA", fullName: "Free Carrier", description: "+ доставка до порта РФ",
    includes: ["raw", "logisticsRU"], icon: "🚚" },
  FOB: { label: "FOB", fullName: "Free On Board", description: "+ погрузка на судно",
    includes: ["raw", "logisticsRU", "fob"], icon: "⚓" },
  CIF: { label: "CIF", fullName: "Cost, Insurance, Freight", description: "+ фрахт + страховка",
    includes: ["raw", "logisticsRU", "fob", "cif"], icon: "🚢" },
};

const CFT_PER_M3 = 35.3147;

export default function PricingPage() {
  const { deal, updateField, resetDeal, clearMemory, hasMemory } = useDeal();

  const {
    costRawMaterial_per_m3,
    costLogisticsRU_per_container,
    costFOB_per_container,
    costCIF_per_container,
    incoterms,
    marginPercent,
    usdRub,
    computedVolume_m3,
  } = deal;

  // Объём из калькулятора объёма (Step 3.8)
  // Если пользователь ещё не заходил туда — 0, покажем предупреждение
  const volumeM3 = Number(computedVolume_m3) || 0;
  const hasVolume = volumeM3 > 0;

  const selectedIncoterms = INCOTERMS_CONFIG[incoterms];
  const includes = selectedIncoterms.includes;
  const isItemIncluded = (key) => includes.includes(key);

  // === РАСЧЁТЫ (правка Gemini: правильная логика per-container → per-m³) ===

  // Raw material: уже в $/м³
  const rawPerM3 = isItemIncluded("raw") ? (Number(costRawMaterial_per_m3) || 0) : 0;

  // Логистика: $/контейнер → делим на объём → получаем $/м³
  const logRUPerContainer = Number(costLogisticsRU_per_container) || 0;
  const fobPerContainer = Number(costFOB_per_container) || 0;
  const cifPerContainer = Number(costCIF_per_container) || 0;

  const logRUPerM3 = volumeM3 > 0 && isItemIncluded("logisticsRU")
    ? logRUPerContainer / volumeM3 : 0;
  const fobPerM3 = volumeM3 > 0 && isItemIncluded("fob")
    ? fobPerContainer / volumeM3 : 0;
  const cifPerM3 = volumeM3 > 0 && isItemIncluded("cif")
    ? cifPerContainer / volumeM3 : 0;

  const costPerM3_USD = rawPerM3 + logRUPerM3 + fobPerM3 + cifPerM3;

  // Маржа
  const marginMultiplier = 1 + (Number(marginPercent) || 0) / 100;
  const pricePerM3_USD = costPerM3_USD * marginMultiplier;
  const profitPerM3_USD = pricePerM3_USD - costPerM3_USD;
  const pricePerCFT_USD = pricePerM3_USD / CFT_PER_M3;

  // Итого по контейнеру
  const totalCost_USD = costPerM3_USD * volumeM3;
  const totalPrice_USD = pricePerM3_USD * volumeM3;
  const totalProfit_USD = profitPerM3_USD * volumeM3;

  // В рублях
  const rate = Number(usdRub) || 0;
  const totalPrice_RUB = totalPrice_USD * rate;
  const totalProfit_RUB = totalProfit_USD * rate;

  const totalVolume_CFT = volumeM3 * CFT_PER_M3;

  const handleNumberInput = (key) => (e) => {
    const val = e.target.value;
    if (val === "") {
      updateField(key, "");
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        updateField(key, num);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <div className="flex gap-3 text-sm flex-wrap">
            <Link href="/calculator" className="text-slate-300 hover:text-orange-500">📦 Volume</Link>
            <Link href="/calculator/container" className="text-slate-300 hover:text-orange-500">🚢 3D</Link>
            <Link href="/" className="text-slate-300 hover:text-orange-500">← Home</Link>
          </div>
        </div>
      </nav>

      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-3">
            STEP 3.10 · PRICING
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Pricing <span className="text-orange-500">Calculator</span>
          </h1>
          <p className="text-slate-300 text-sm">
            🔗 Connected to Volume Calculator · per-container costs → per-m³ pricing
          </p>
          {hasMemory && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full text-xs">
              ✅ Deal restored from memory
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* VOLUME SNAPSHOT from Step 3.8 */}
        <section className={`rounded-lg p-5 shadow-sm border-2 ${
          hasVolume ? "bg-emerald-50 border-emerald-300" : "bg-amber-50 border-amber-400"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span>{hasVolume ? "🔗" : "⚠️"}</span>
                Volume from Step 3.8
              </h2>
              {hasVolume ? (
                <>
                  <div className="text-3xl font-black font-mono text-orange-500">
                    {volumeM3.toFixed(2)} m³
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    = {totalVolume_CFT.toFixed(0)} CFT · auto-synced from Volume Calculator
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-700">
                  No volume calculated yet. Set dimensions in Volume Calculator first.
                </div>
              )}
            </div>
            <Link href="/calculator"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded transition-all active:scale-95 whitespace-nowrap">
              📦 Edit Volume →
            </Link>
          </div>
        </section>

        {/* INCOTERMS SELECTOR */}
        <section className="bg-white rounded-lg p-5 shadow-sm border-2 border-orange-200">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">🚢</span> Incoterms (Delivery Basis)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Cumulative: each adds previous costs. Dim items below = excluded.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(INCOTERMS_CONFIG).map((ic) => {
              const isActive = incoterms === ic.label;
              return (
                <button key={ic.label} onClick={() => updateField("incoterms", ic.label)}
                  className={`text-left p-3 rounded-lg border-2 transition-all active:scale-95 ${
                    isActive ? "border-orange-500 bg-orange-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
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
        </section>

        {/* COSTS — РЕАЛИСТИЧНЫЕ ЕДИНИЦЫ */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">💵</span> Cost Breakdown
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Raw material — per m³. Logistics — per container (auto-converted to m³).
          </p>

          <div className="space-y-3">
            {/* Raw material — $/m³ */}
            <div className={`p-4 rounded-lg border-2 transition ${
              isItemIncluded("raw") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  🌲 Raw material (mill price)
                </label>
                <span className="text-xs font-bold">
                  {isItemIncluded("raw") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-slate-400 text-lg">$</span>
                <input type="number" value={costRawMaterial_per_m3}
                  onChange={handleNumberInput("costRawMaterial_per_m3")}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
                <span className="text-slate-500 text-sm font-bold">/ m³</span>
              </div>
              <p className="text-xs text-slate-500">Mill price per cubic meter</p>
            </div>

            {/* Logistics RU — $/container */}
            <div className={`p-4 rounded-lg border-2 transition ${
              isItemIncluded("logisticsRU") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  🚚 RU logistics (mill → port)
                </label>
                <span className="text-xs font-bold">
                  {isItemIncluded("logisticsRU") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400 text-lg">$</span>
                <input type="number" value={costLogisticsRU_per_container}
                  onChange={handleNumberInput("costLogisticsRU_per_container")}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
                <span className="text-slate-500 text-sm font-bold">/ 40HC</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Truck/rail to port</span>
                <span className="font-mono font-bold text-slate-700">
                  = ${logRUPerM3.toFixed(2)} / m³
                </span>
              </div>
            </div>

            {/* FOB — $/container */}
            <div className={`p-4 rounded-lg border-2 transition ${
              isItemIncluded("fob") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  ⚓ Port & loading (FOB fees)
                </label>
                <span className="text-xs font-bold">
                  {isItemIncluded("fob") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400 text-lg">$</span>
                <input type="number" value={costFOB_per_container}
                  onChange={handleNumberInput("costFOB_per_container")}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
                <span className="text-slate-500 text-sm font-bold">/ 40HC</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">THC + B/L + doc fees</span>
                <span className="font-mono font-bold text-slate-700">
                  = ${fobPerM3.toFixed(2)} / m³
                </span>
              </div>
            </div>

            {/* CIF — $/container */}
            <div className={`p-4 rounded-lg border-2 transition ${
              isItemIncluded("cif") ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 opacity-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  🚢 Freight + Insurance (ocean)
                </label>
                <span className="text-xs font-bold">
                  {isItemIncluded("cif") ? "✅ included" : "⊘ excluded"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400 text-lg">$</span>
                <input type="number" value={costCIF_per_container}
                  onChange={handleNumberInput("costCIF_per_container")}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
                <span className="text-slate-500 text-sm font-bold">/ 40HC</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Ocean freight + cargo insurance</span>
                <span className="font-mono font-bold text-slate-700">
                  = ${cifPerM3.toFixed(2)} / m³
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-slate-900 text-white rounded-lg p-3 flex justify-between items-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Total Cost ({incoterms})</div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-orange-500">
                ${costPerM3_USD.toFixed(2)}<span className="text-xs text-slate-400"> / m³</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                = ${totalCost_USD.toLocaleString("en-US", { maximumFractionDigits: 0 })} / container
              </div>
            </div>
          </div>
        </section>

        {/* MARGIN + RATE */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-orange-500">📊</span> Margin & Exchange Rate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Margin (%)</label>
              <input type="number" value={marginPercent} step="1"
                onChange={handleNumberInput("marginPercent")}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
              <p className="text-xs text-slate-500 mt-1">
                Profit: ${profitPerM3_USD.toFixed(2)} / m³
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">USD / RUB rate</label>
              <input type="number" value={usdRub} step="0.5"
                onChange={handleNumberInput("usdRub")}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
              <p className="text-xs text-slate-500 mt-1">₽ per $1</p>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-xs text-slate-700">
            💡 <strong>Tip:</strong> Typical export margin 15-30%. First deals: try 18-22%.
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <button onClick={resetDeal} className="text-sm text-slate-500 hover:text-orange-500 underline">
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
            {selectedIncoterms.icon} {selectedIncoterms.label} · Margin {marginPercent}% · {volumeM3.toFixed(2)} m³ ({totalVolume_CFT.toFixed(0)} CFT) · ₽{rate}/$
          </div>

          {!hasVolume && (
            <div className="bg-amber-500/20 border border-amber-500/50 text-amber-200 p-3 rounded mb-4 text-sm">
              ⚠️ Volume is 0. Go to <Link href="/calculator" className="underline font-bold">Volume Calculator</Link> and set dimensions first.
            </div>
          )}

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
                <div className="flex justify-between">
                  <span className="text-slate-400">🌲 Raw material</span>
                  <span>${rawPerM3.toFixed(2)}</span>
                </div>
              )}
              {isItemIncluded("logisticsRU") && (
                <div className="flex justify-between">
                  <span className="text-slate-400">🚚 RU logistics <span className="text-xs">(${logRUPerContainer}/cnt ÷ {volumeM3.toFixed(1)}m³)</span></span>
                  <span>${logRUPerM3.toFixed(2)}</span>
                </div>
              )}
              {isItemIncluded("fob") && (
                <div className="flex justify-between">
                  <span className="text-slate-400">⚓ Port & loading <span className="text-xs">(${fobPerContainer}/cnt)</span></span>
                  <span>${fobPerM3.toFixed(2)}</span>
                </div>
              )}
              {isItemIncluded("cif") && (
                <div className="flex justify-between">
                  <span className="text-slate-400">🚢 Freight + Ins. <span className="text-xs">(${cifPerContainer}/cnt)</span></span>
                  <span>${cifPerM3.toFixed(2)}</span>
                </div>
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
          ℹ️ <strong>Next (Step 4):</strong> 3D Container visualizer + PDF quotation export
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}