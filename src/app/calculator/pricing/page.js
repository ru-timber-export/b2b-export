"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Reminder from "../../components/Reminder";
import {
  useDeal,
  SPECIES_BASE_PRICES,
  DRYING_SURCHARGE,
  PACKAGING_SURCHARGE,
  FREIGHT_PRESETS,
  COUNTRY_MARGINS,
} from "../../context/DealContext";

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

export default function PricingPage() {
  const { deal, updateDeal, isLoaded } = useDeal();
  const [cbrLoading, setCbrLoading] = useState(false);
  const [cbrDate, setCbrDate] = useState(null);
  const [cbrError, setCbrError] = useState(false);

  // 🆕 Custom freight rate
  const [useCustomFreight, setUseCustomFreight] = useState(false);
  const [customFreightRate, setCustomFreightRate] = useState(2400);
  const [customFreightDate, setCustomFreightDate] = useState("");

  // 🆕 Загружаем custom freight из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ru-timber-custom-freight");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUseCustomFreight(parsed.enabled || false);
        setCustomFreightRate(parsed.rate || 2400);
        setCustomFreightDate(parsed.date || "");
      }
    } catch (e) {
      console.error("Failed to load custom freight:", e);
    }
  }, []);

  // 🆕 Сохраняем custom freight
  const saveCustomFreight = (enabled, rate) => {
    const today = new Date().toLocaleDateString("ru-RU");
    const data = { enabled, rate, date: today };
    localStorage.setItem("ru-timber-custom-freight", JSON.stringify(data));
    setCustomFreightDate(today);
  };

  // Автозагрузка курса ЦБ РФ
  const fetchCBR = async () => {
    setCbrLoading(true);
    setCbrError(false);
    try {
      const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
      const data = await res.json();
      const usd = data.Valute?.USD?.Value;
      const date = data.Date;
      if (usd) {
        updateDeal({ usdRubRate: parseFloat(usd.toFixed(2)) });
        setCbrDate(new Date(date).toLocaleDateString("ru-RU"));
      }
    } catch (e) {
      console.error("CBR API error:", e);
      setCbrError(true);
    } finally {
      setCbrLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) fetchCBR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

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
  const packaging = deal.packaging || "crate";
  const incoterm = deal.incoterm || "cif";
  const totalVol = deal.totalVolume === "" ? 0 : parseFloat(deal.totalVolume) || 50;
  const margin = deal.margin === "" ? 0 : parseFloat(deal.margin) || 18;
  const rate = deal.usdRubRate === "" ? 76.25 : parseFloat(deal.usdRubRate) || 76.25;

  const freightPreset = FREIGHT_PRESETS[deal.freightRoute] || FREIGHT_PRESETS["vlv-chennai"];
  
  // 🆕 Используем custom freight если включено
  const effectiveFreightRate = useCustomFreight ? customFreightRate : freightPreset.rate;
  const effectiveFreightLabel = useCustomFreight 
    ? `Custom Rate (manual)` 
    : freightPreset.label;

  const speciesBase = SPECIES_BASE_PRICES[species] || 160;
  const dryingAdd = DRYING_SURCHARGE[moisture] || 0;
  const packAdd = PACKAGING_SURCHARGE[packaging] || 0;
  const millPrice = speciesBase + dryingAdd + packAdd;

  const loadFactory = 6;
  const landTransport = totalVol > 0 ? 1500 / totalVol : 0;
  const portFees = totalVol > 0 ? 400 / totalVol : 0;
  const ocean = totalVol > 0 ? effectiveFreightRate / totalVol : 0;
  const insurance = 0.011 * (millPrice + loadFactory + landTransport + portFees + ocean);

  let totalCost = millPrice;
  if (incoterm === "fca-factory") totalCost = millPrice + loadFactory;
  if (incoterm === "fca-port") totalCost = millPrice + loadFactory + landTransport;
  if (incoterm === "fob") totalCost = millPrice + loadFactory + landTransport + portFees;
  if (incoterm === "cif") totalCost = millPrice + loadFactory + landTransport + portFees + ocean + insurance;

  const dutyFree = moisture === "kd" || deal.profileProcessing;
  const duty = dutyFree ? 0 : totalCost * 0.065;
  const totalCostWithDuty = totalCost + duty;
  const sellPricePerM3 = totalCostWithDuty * (1 + margin / 100);
  const profitPerM3 = sellPricePerM3 - totalCostWithDuty;
  const totalAmount = sellPricePerM3 * totalVol;
  const totalProfit = profitPerM3 * totalVol;

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm">← Home</Link>
          <div className="text-xs font-mono hidden sm:block">STEP 3.11 · PRICING</div>
          <div className="flex gap-1 text-xs">
            <Link href="/calculator" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📐 Volume</Link>
            <Link href="/calculator/container" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📦 3D</Link>
            <Link href="/calculator/quotation" className="bg-emerald-600 px-2 py-1 rounded active:scale-95">📄 Quote</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Title */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Pricing Calculator</h1>
          <p className="text-sm text-slate-500 mt-1">
            💰 Honest cost breakdown · EXW → FCA → FOB → CIF
          </p>
        </div>

        {/* Reminders */}
        <Reminder
          priority="high"
          icon="💱"
          title="Проверь курс USD/RUB перед отправкой Quotation"
          description="Курс ЦБ РФ обновляется в 13:00 МСК ежедневно. Если квотация валидна 7 дней — закладывай запас 2-3% на колебание рубля."
          dismissKey="usd-rate-tip-2026"
        />

        <Reminder
          priority="medium"
          icon="🏦"
          title="Валютный контроль (после регистрации ИП)"
          description="Контракты на сумму >$50,000 обязательно ставятся на учёт в банке. За нарушение — штраф до 100% суммы сделки!"
          dismissKey="vc-warning-2026"
        />

        {/* Volume info */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500">Volume from Step 3.10 (auto-synced)</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{totalVol.toFixed(2)} m³</div>
          <Link href="/calculator" className="text-xs text-orange-500 mt-1 inline-block active:scale-95">
            ✏ Edit Volume →
          </Link>
        </section>

        {/* Freight Route */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            🚢 Freight Route
            <Tooltip text="Выберите готовый маршрут ИЛИ задайте свою ставку вручную ниже." />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {Object.entries(FREIGHT_PRESETS).map(([key, val]) => {
              const active = deal.freightRoute === key && !useCustomFreight;
              return (
                <button
                  key={key}
                  onClick={() => {
                    updateDeal({ freightRoute: key });
                    setUseCustomFreight(false);
                    saveCustomFreight(false, customFreightRate);
                  }}
                  className={`p-3 rounded-lg text-left text-xs transition-all active:scale-95 border-2 ${
                    active
                      ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                      : "bg-slate-100 text-slate-700 border-transparent hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold">{val.label}</div>
                  <div className="opacity-75 mt-1">${val.rate}/40HC</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 🆕 CUSTOM FREIGHT RATE */}
        <section className={`rounded-xl p-5 shadow-sm border-2 transition-all ${
          useCustomFreight 
            ? "bg-emerald-50 border-emerald-400" 
            : "bg-white border-slate-200"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 flex items-center">
              ✏️ Custom Freight Rate
              <Tooltip text="Введи свою ставку фрахта вручную (например, полученную от форвардера или с Freightos). Сохраняется в браузере." />
            </h2>
            {useCustomFreight && (
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                ACTIVE
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 flex items-center">
                Ставка фрахта (USD за 40HC контейнер)
                <Tooltip text="Сумма ALL-IN: океанский фрахт + BAF + THC + B/L. Не включает таможню и доставку до порта." />
              </label>
              <input
                type="number"
                value={customFreightRate}
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  setCustomFreightRate(v);
                  if (useCustomFreight) saveCustomFreight(true, v);
                }}
                onFocus={(e) => e.target.select()}
                placeholder="2400"
                className="w-full mt-1 p-3 border-2 border-slate-300 rounded-lg text-xl font-bold focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  const newState = !useCustomFreight;
                  setUseCustomFreight(newState);
                  saveCustomFreight(newState, customFreightRate);
                }}
                className={`w-full p-3 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                  useCustomFreight
                    ? "bg-slate-500 text-white hover:bg-slate-600"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {useCustomFreight ? "⬅ Use Preset" : "✓ Use Custom →"}
              </button>
            </div>
          </div>

          {/* 🆕 Шильдик источника */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-500">Источник данных:</span>
            <a
              href="https://app.terminal.freightos.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold hover:bg-blue-200 transition-colors"
            >
              📊 Freightos Baltic Index (FBX)
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
            <a
              href="https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold hover:bg-purple-200 transition-colors"
            >
              📈 Drewry WCI
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
            {customFreightDate && (
              <span className="text-slate-400 ml-auto">
                Обновлено: {customFreightDate}
              </span>
            )}
          </div>

          {useCustomFreight && (
            <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-800">
              ✓ Используется твоя ставка: <span className="font-mono font-bold">${customFreightRate}/40HC</span>
              <br/>
              <span className="opacity-75">Per m³ (на {totalVol.toFixed(0)} m³): ${(customFreightRate / totalVol).toFixed(2)}/m³</span>
            </div>
          )}
        </section>

        {/* Incoterms */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📋 Incoterms (Delivery Basis)
            <Tooltip text="Международные условия поставки. EXW = товар на складе. FCA = +погрузка. FOB = +судно. CIF = +фрахт+страховка." />
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
            {[
              { id: "exw", label: "EXW", ru: "Самовывоз" },
              { id: "fca-factory", label: "FCA завод", ru: "+погрузка" },
              { id: "fca-port", label: "FCA порт", ru: "+фура" },
              { id: "fob", label: "FOB", ru: "+судно" },
              { id: "cif", label: "CIF ⭐", ru: "+фрахт+страх." },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => updateDeal({ incoterm: t.id })}
                className={`p-2 rounded-lg text-xs transition-all active:scale-95 border-2 ${
                  deal.incoterm === t.id
                    ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                    : "bg-slate-100 text-slate-700 border-transparent hover:border-slate-300"
                }`}
              >
                <div className="font-bold">{t.label}</div>
                <div className="opacity-75 text-[10px] mt-1">{t.ru}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            💰 Cost Breakdown
            <Tooltip text="Честная себестоимость по компонентам. Меняется при смене Incoterms." />
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="flex items-center">
                🪵 Mill price ({species} {moisture} {packaging})
                <Tooltip text={`Заводская цена = База породы (${speciesBase}) + Сушка (${dryingAdd}) + Упаковка (${packAdd})`} />
              </span>
              <span className="font-mono font-bold">${millPrice.toFixed(2)}/m³</span>
            </div>

            {["fca-factory", "fca-port", "fob", "cif"].includes(incoterm) && (
              <div className="flex justify-between py-2 border-b text-slate-600">
                <span>🚚 Factory loading (погрузка в фуру)</span>
                <span className="font-mono">+${loadFactory.toFixed(2)}/m³</span>
              </div>
            )}

            {["fca-port", "fob", "cif"].includes(incoterm) && (
              <div className="flex justify-between py-2 border-b text-slate-600">
                <span>🚛 Land transport (до порта РФ)</span>
                <span className="font-mono">+${landTransport.toFixed(2)}/m³</span>
              </div>
            )}

            {["fob", "cif"].includes(incoterm) && (
              <div className="flex justify-between py-2 border-b text-slate-600">
                <span>⚓ Port & THC + B/L</span>
                <span className="font-mono">+${portFees.toFixed(2)}/m³</span>
              </div>
            )}

            {incoterm === "cif" && (
              <>
                <div className="flex justify-between py-2 border-b text-slate-600">
                  <span>
                    🚢 Ocean freight ({effectiveFreightLabel})
                    {useCustomFreight && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">CUSTOM</span>}
                  </span>
                  <span className="font-mono">+${ocean.toFixed(2)}/m³</span>
                </div>
                <div className="flex justify-between py-2 border-b text-slate-600">
                  <span>🛡 Insurance (1.1%)</span>
                  <span className="font-mono">+${insurance.toFixed(2)}/m³</span>
                </div>
              </>
            )}

            <div className={`flex justify-between py-2 border-b ${dutyFree ? "text-emerald-600" : "text-rose-600"}`}>
              <span className="flex items-center">
                🏛 Export duty {dutyFree ? "(0% — KD/4409)" : "(6.5% — AD raw)"}
                <Tooltip text="Экспортная пошлина РФ. 0% если: камерная сушка (KD) ИЛИ обработка по коду 4409 (фаска/паз)." />
              </span>
              <span className="font-mono">+${duty.toFixed(2)}/m³</span>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-slate-900">
              <span className="font-bold">TOTAL COST ({incoterm.toUpperCase()})</span>
              <span className="font-mono font-black text-slate-900">${totalCostWithDuty.toFixed(2)}/m³</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deal.profileProcessing}
                onChange={(e) => updateDeal({ profileProcessing: e.target.checked })}
                className="mt-1"
              />
              <div className="text-xs text-slate-700">
                <div className="font-bold flex items-center">
                  ⚙ Profile processing (HS 4409 — фаска/паз)
                  <Tooltip text="Лёгкая фаска 2×2мм переводит товар в код 4409 → 0% пошлины. Особенно выгодно для AD." />
                </div>
                <div className="opacity-75 mt-1">
                  Для AD-доски: фаска 2×2мм → 0% пошлины РФ. Экономия ~$7/m³.
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Margin + Rate */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📊 Margin & Exchange Rate
            <Tooltip text="Ваша наценка к себестоимости." />
          </h2>

          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-2">Quick margin by country:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COUNTRY_MARGINS).map(([country, m]) => (
                <button
                  key={country}
                  onClick={() => updateDeal({ margin: m })}
                  className={`px-3 py-2 rounded-lg text-xs transition-all active:scale-95 border-2 ${
                    deal.margin === m
                      ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                      : "bg-slate-100 text-slate-700 border-transparent hover:border-slate-300"
                  }`}
                >
                  {country === "india" && "🇮🇳 India"}
                  {country === "china" && "🇨🇳 China"}
                  {country === "uae" && "🇦🇪 UAE"}
                  {country === "egypt" && "🇪🇬 Egypt"}
                  {country === "turkey" && "🇹🇷 Turkey"}
                  {" "}{m}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="text-xs text-slate-500 flex items-center">
                Margin (%)
                <Tooltip text="Типично 15-30%. Индия/Китай: 15-18%. ОАЭ/Саудовская: 25-30%." />
              </label>
              <input
                type="number"
                value={deal.margin}
                onChange={handleNum("margin")}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg font-bold"
              />
              <div className="text-xs text-emerald-600 mt-1">Profit: ${profitPerM3.toFixed(2)}/m³</div>
            </div>
            <div>
              <label className="text-xs text-slate-500 flex items-center">
                USD / RUB
                <Tooltip text="Курс ЦБ РФ автоматически." />
              </label>
              <input
                type="number"
                value={deal.usdRubRate}
                onChange={handleNum("usdRubRate")}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg font-bold"
              />
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={fetchCBR}
                  disabled={cbrLoading}
                  className="text-xs text-orange-500 active:scale-95"
                >
                  {cbrLoading ? "⏳ Загрузка..." : "🔄 Обновить ЦБ"}
                </button>
                {cbrDate && !cbrError && (
                  <span className="text-[10px] text-slate-400">ЦБ РФ: {cbrDate}</span>
                )}
                {cbrError && (
                  <span className="text-[10px] text-rose-500">⚠ Ошибка загрузки</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Final pricing */}
        <section className="bg-slate-900 text-white rounded-xl p-5 shadow-lg">
          <h2 className="font-bold">🎯 Final Pricing</h2>
          <div className="text-xs opacity-60 mt-1">
            {incoterm.toUpperCase()} · Margin {margin}% · {totalVol.toFixed(2)} m³ · ₽{rate}/$
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs opacity-60">SELLING PRICE PER m³</div>
              <div className="text-3xl font-black">${sellPricePerM3.toFixed(2)}</div>
              <div className="text-xs opacity-60">≈ ₽{(sellPricePerM3 * rate).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-xs opacity-60">TOTAL DEAL ({incoterm.toUpperCase()})</div>
              <div className="text-3xl font-black">${totalAmount.toFixed(0)}</div>
              <div className="text-xs opacity-60">≈ ₽{(totalAmount * rate).toFixed(0)}</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-900/50 rounded-lg">
            <div className="text-xs opacity-75">YOUR PROFIT</div>
            <div className="text-2xl font-black text-emerald-400">
              +${totalProfit.toFixed(0)} <span className="text-sm opacity-75">(+₽{(totalProfit * rate).toFixed(0)})</span>
            </div>
          </div>

          <Link
            href="/calculator/container"
            className="block w-full mt-5 bg-orange-500 text-white text-center py-3 rounded-lg font-bold active:scale-95"
          >
            📦 Continue to 3D View →
          </Link>
          <Link
            href="/calculator/quotation"
            className="block w-full mt-2 bg-emerald-600 text-white text-center py-3 rounded-lg font-bold active:scale-95"
          >
            📄 Generate Commercial Quotation →
          </Link>
        </section>

        <div className="text-center text-xs text-slate-400">
          Powered by RU-TIMBER Export · +7 915 349 00 07
        </div>
      </div>
    </main>
  );
}