"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

  // 💱 Автозагрузка курса ЦБ РФ
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

  // Пресет фрахта
  const freightPreset = FREIGHT_PRESETS[deal.freightRoute] || FREIGHT_PRESETS["vlv-chennai"];

  // 💰 Расчёт mill price (EXW по-честному)
  const speciesBase = SPECIES_BASE_PRICES[species] || 160;
  const dryingAdd = DRYING_SURCHARGE[moisture] || 0;
  const packAdd = PACKAGING_SURCHARGE[packaging] || 0;
  const millPrice = speciesBase + dryingAdd + packAdd;

  // Честный расчёт по шагам Incoterms
  const loadFactory = 6; // FCA завод: +$6/m³ (погрузка на пилораме)
  const landTransport = totalVol > 0 ? 1500 / totalVol : 0; // FCA порт: фура/жд до порта
  const portFees = totalVol > 0 ? 400 / totalVol : 0; // FOB: THC + B/L
  const ocean = totalVol > 0 ? freightPreset.rate / totalVol : 0; // CIF: фрахт
  const insurance = 0.011 * (millPrice + loadFactory + landTransport + portFees + ocean); // страховка 1.1%

  // Сумма по выбранному Incoterm
  let totalCost = millPrice;
  if (incoterm === "fca-factory") totalCost = millPrice + loadFactory;
  if (incoterm === "fca-port") totalCost = millPrice + loadFactory + landTransport;
  if (incoterm === "fob") totalCost = millPrice + loadFactory + landTransport + portFees;
  if (incoterm === "cif") totalCost = millPrice + loadFactory + landTransport + portFees + ocean + insurance;

  // 0% пошлины при камерной сушке или обработке 4409
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
          <div className="text-xs font-mono">STEP 3.11 · PRICING</div>
          <div className="flex gap-2 text-xs">
            <Link href="/calculator" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📐 Volume</Link>
            <Link href="/calculator/container" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📦 3D</Link>
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
            <Tooltip text="Выберите направление отгрузки. Ставки фрахта ALL-IN (все сборы включены), апрель 2026. Приоритет: Владивосток → Ченнай (Индия)." />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {Object.entries(FREIGHT_PRESETS).map(([key, val]) => {
              const active = deal.freightRoute === key;
              return (
                <button
                  key={key}
                  onClick={() => updateDeal({ freightRoute: key })}
                  className={`p-3 rounded-lg text-left text-xs transition-all active:scale-95 ${
                    active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="font-bold">{val.label}</div>
                  <div className="opacity-75 mt-1">${val.rate}/40HC</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Incoterms */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📜 Incoterms (Delivery Basis)
            <Tooltip text="Международные условия поставки. EXW = товар на складе. FCA завод = +погрузка в фуру. FCA порт = +доставка. FOB = +погрузка на судно. CIF = +фрахт и страховка до порта клиента. Каждый шаг добавляет стоимость." />
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
            {[
              { id: "exw", label: "EXW", ru: "Самовывоз", include: [] },
              { id: "fca-factory", label: "FCA завод", ru: "+погрузка", include: ["load"] },
              { id: "fca-port", label: "FCA порт", ru: "+фура", include: ["load", "land"] },
              { id: "fob", label: "FOB", ru: "+судно", include: ["load", "land", "port"] },
              { id: "cif", label: "CIF ⭐", ru: "+фрахт+страх.", include: ["load", "land", "port", "ocean"] },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => updateDeal({ incoterm: t.id })}
                className={`p-2 rounded-lg text-xs transition-all active:scale-95 ${
                  deal.incoterm === t.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
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
            💵 Cost Breakdown
            <Tooltip text="Честная себестоимость по компонентам. Меняется при смене Incoterms." />
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="flex items-center">
                🌲 Mill price ({species} {moisture} {packaging})
                <Tooltip text={`Заводская цена = База породы ($${speciesBase}) + Сушка ($${dryingAdd}) + Упаковка ($${packAdd})`} />
              </span>
              <span className="font-mono font-bold">${millPrice.toFixed(2)}/m³</span>
            </div>

            {["fca-factory", "fca-port", "fob", "cif"].includes(incoterm) && (
              <div className="flex justify-between py-2 border-b text-slate-600">
                <span>🏭 Factory loading (погрузка в фуру)</span>
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
                  <span>🌊 Ocean freight ({freightPreset.label.split("→")[1]?.trim()})</span>
                  <span className="font-mono">+${ocean.toFixed(2)}/m³</span>
                </div>
                <div className="flex justify-between py-2 border-b text-slate-600">
                  <span>🛡 Insurance (1.1%)</span>
                  <span className="font-mono">+${insurance.toFixed(2)}/m³</span>
                </div>
              </>
            )}

            {/* Пошлина */}
            <div className={`flex justify-between py-2 border-b ${dutyFree ? "text-emerald-600" : "text-rose-600"}`}>
              <span className="flex items-center">
                🛃 Export duty {dutyFree ? "(0% — KD/4409)" : "(6.5% — AD raw)"}
                <Tooltip text="Экспортная пошлина РФ. 0% если: камерная сушка (KD) ИЛИ обработка по коду 4409 (фаска/паз)." />
              </span>
              <span className="font-mono">+${duty.toFixed(2)}/m³</span>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-slate-900">
              <span className="font-bold">TOTAL COST ({incoterm.toUpperCase()})</span>
              <span className="font-mono font-black text-slate-900">${totalCostWithDuty.toFixed(2)}/m³</span>
            </div>
          </div>

          {/* Profile processing checkbox */}
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
                  ⚙ Profile processing (HS 4409 — fаска/паз)
                  <Tooltip text="Лёгкая фаска 2×2мм переводит товар в код ТН ВЭД 4409 → 0% экспортной пошлины. Особенно выгодно для AD доски. Стоимость обработки ~$4/m³, экономия пошлины ~$12/m³." />
                </div>
                <div className="opacity-75 mt-1">
                  Для AD-доски: фаска 2×2мм → 0% пошлины РФ. Экономия ~$7/m³ чистыми.
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Margin + Rate */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            💼 Margin & Exchange Rate
            <Tooltip text="Ваша наценка к себестоимости. Меняется по рынку." />
          </h2>

          {/* Country margin presets */}
          <div className="mt-3">
            <div className="text-xs text-slate-500 mb-2">Quick margin by country:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COUNTRY_MARGINS).map(([country, m]) => (
                <button
                  key={country}
                  onClick={() => updateDeal({ margin: m })}
                  className={`px-3 py-2 rounded-lg text-xs transition-all active:scale-95 ${
                    deal.margin === m ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"
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
                <Tooltip text="Типично 15-30%. Индия/Китай: 15-18% (чувствительны к цене). ОАЭ/Саудовская Аравия: 25-30% (премиум)." />
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
                <Tooltip text="Курс ЦБ РФ автоматически. Кнопка 🔄 обновит курс." />
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
          <h2 className="font-bold">💎 Final Pricing</h2>
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
        </section>

        <div className="text-center text-xs text-slate-400">
          Powered by RU-TIMBER Export · +7 915 349 00 07
        </div>
      </div>
    </main>
  );
}