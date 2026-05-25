"use client";

import Link from "next/link";
import { useDeal } from "../../context/DealContext";
import Reminder from "../../components/Reminder";

export default function ContainerPage() {
  const { deal, updateDeal, isLoaded } = useDeal();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // 📊 Расчёты
  const volumePerContainer = deal.volumeTotal || 0;
  const pricePerM3 = deal.pricingPerM3 || 0;
  const containerCount = deal.containerCount || 1;
  const totalPerContainer = volumePerContainer * pricePerM3;
  const grandTotal = totalPerContainer * containerCount;
  const totalVolume = volumePerContainer * containerCount;

  // Расчёт оценочной длительности отгрузки
  const estimatedDays =
    deal.shipmentSchedule === "weekly"
      ? containerCount * 7
      : deal.shipmentSchedule === "biweekly"
      ? containerCount * 14
      : deal.shipmentSchedule === "monthly"
      ? containerCount * 30
      : 0;

  // Описание типа контейнера
  const containerInfo = {
    "20DV": { name: "20' Dry Van", capacity: "~28 m³", payload: "21,750 kg" },
    "40DV": { name: "40' Dry Van", capacity: "~58 m³", payload: "26,500 kg" },
    "40HC": { name: "40' High Cube", capacity: "~68 m³", payload: "26,500 kg" },
    "45HC": { name: "45' High Cube", capacity: "~76 m³", payload: "27,500 kg" },
  };
  const currentContainer = containerInfo[deal.containerType] || containerInfo["40HC"];

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* NAV */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <div className="flex gap-3 text-xs sm:text-sm">
            <Link href="/calculator/pricing" className="text-slate-300 hover:text-orange-500">← Pricing</Link>
            <Link href="/calculator/quotation" className="bg-orange-500 text-white px-3 py-1 rounded font-bold">Quotation →</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 space-y-4">
        {/* HEADER */}
        <header className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-4xl">📦</div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Container Planning</h1>
              <p className="text-sm text-slate-600">Шаг 3 из 4 · Тип контейнера, количество, график отгрузки</p>
            </div>
          </div>
        </header>

        {/* СЧЁТЧИК КОНТЕЙНЕРОВ */}
        <section className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-4 tracking-wider">
            📦 ПЛАНИРОВАНИЕ ОТГРУЗКИ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Тип контейнера */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Container Type
              </label>
              <select
                value={deal.containerType || "40HC"}
                onChange={(e) => updateDeal({ containerType: e.target.value })}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg font-bold focus:border-orange-500 focus:outline-none text-sm"
              >
                <option value="20DV">20' Dry Van (~28 m³)</option>
                <option value="40DV">40' Dry Van (~58 m³)</option>
                <option value="40HC">40' High Cube (~68 m³) ⭐</option>
                <option value="45HC">45' High Cube (~76 m³)</option>
              </select>
              <div className="text-[10px] text-slate-500 mt-1">
                Payload: {currentContainer.payload}
              </div>
            </div>

            {/* Количество */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateDeal({ containerCount: Math.max(1, (deal.containerCount || 1) - 1) })}
                  className="bg-slate-200 hover:bg-slate-300 w-10 h-10 rounded-lg font-black text-lg active:scale-90"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={deal.containerCount || 1}
                  onChange={(e) => updateDeal({ containerCount: parseInt(e.target.value) || 1 })}
                  className="w-full text-center px-2 py-2 border-2 border-slate-300 rounded-lg font-black text-lg focus:border-orange-500 focus:outline-none"
                />
                <button
                  onClick={() => updateDeal({ containerCount: Math.min(100, (deal.containerCount || 1) + 1) })}
                  className="bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-lg font-black text-lg active:scale-90"
                >
                  +
                </button>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Units (контейнеров)
              </div>
            </div>

            {/* График */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Schedule
              </label>
              <select
                value={deal.shipmentSchedule || "single"}
                onChange={(e) => updateDeal({ shipmentSchedule: e.target.value })}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg font-bold focus:border-orange-500 focus:outline-none text-sm"
              >
                <option value="single">Single shipment</option>
                <option value="weekly">Weekly (раз в неделю)</option>
                <option value="biweekly">Bi-weekly (раз в 2 недели)</option>
                <option value="monthly">Monthly (раз в месяц)</option>
                <option value="custom">Custom</option>
              </select>
              <div className="text-[10px] text-slate-500 mt-1">
                График поставок
              </div>
            </div>
          </div>

          {/* Подсказка для multi-container */}
          {containerCount > 1 && (
            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded text-xs text-amber-800">
              <strong>💡 Multi-container shipment:</strong> для отгрузки {containerCount} контейнеров рекомендуем подписать <strong>Frame Contract</strong> (рамочный договор) + отдельные <strong>Specifications</strong> на каждую партию. Это упростит документооборот и таможню.
            </div>
          )}
        </section>

        {/* СВОДКА */}
        <section className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-4 tracking-wider">
            📊 СВОДКА ОТГРУЗКИ
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <SummaryCard
              label="Containers"
              value={`${containerCount}`}
              sub={`× ${deal.containerType || "40HC"}`}
              color="slate"
            />
            <SummaryCard
              label="Total Volume"
              value={`${totalVolume.toFixed(1)}`}
              sub="m³"
              color="orange"
            />
            <SummaryCard
              label="Per Container"
              value={`$${totalPerContainer.toFixed(0)}`}
              sub={`${volumePerContainer.toFixed(1)} m³ × $${pricePerM3}`}
              color="cyan"
            />
            <SummaryCard
              label="GRAND TOTAL"
              value={`$${grandTotal.toFixed(0)}`}
              sub="USD"
              color="emerald"
              big
            />
          </div>

          {estimatedDays > 0 && (
            <div className="mt-3 p-3 bg-cyan-50 border-l-4 border-cyan-500 rounded text-xs text-cyan-800">
              <strong>📅 Estimated shipment duration:</strong> {estimatedDays} days from first container to last ({deal.shipmentSchedule}).
            </div>
          )}
        </section>

        {/* CONTAINER SPECS */}
        <section className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-4 tracking-wider">
            📐 {currentContainer.name.toUpperCase()} — SPECIFICATIONS
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <SpecBlock label="Capacity" value={currentContainer.capacity} />
            <SpecBlock label="Max Payload" value={currentContainer.payload} />
            <SpecBlock label="Doors" value="Standard rear" />
            <SpecBlock label="Floor" value="Plywood, marine-grade" />
          </div>
        </section>

        {/* REMINDERS */}
        <Reminder
          title="📸 Сфотографируй контейнер ДО загрузки"
          tone="critical"
          icon="📸"
        >
          Обязательно сделай 10-15 фото внутренностей контейнера до загрузки: стены, пол, потолок, дверные уплотнители. Это твоё доказательство, что контейнер был сухим и чистым. Если в порту назначения товар придёт мокрым — без этих фото покупатель скажет «ты грузил в плохой контейнер».
        </Reminder>

        <Reminder
          title="🌳 ISPM-15 для упаковки"
          tone="warning"
          icon="🌳"
        >
          Все деревянные элементы упаковки (поддоны, крепёжный брус, опоры) должны иметь клеймо IPPC по стандарту ISPM-15. Без этого груз развернут в порту Индии/ЕС/Австралии/ОАЭ. Стоимость фумигации: ~$50-100 на контейнер.
        </Reminder>

        <Reminder
          title="🔬 Сюрвейер (опционально, но рекомендую для первой сделки)"
          tone="info"
          icon="🔬"
        >
          Сюрвейерский отчёт (SGS, Bureau Veritas, Cotecna) — $200-500 за контейнер. Это независимое подтверждение качества и количества загруженного товара. Защитит тебя от ложных претензий покупателя.
        </Reminder>

        <Reminder
          title="⚡ Telex Release вместо DHL"
          tone="info"
          icon="⚡"
        >
          При бронировании фрахта обязательно укажи: <strong>"Telex Release at destination"</strong>. Это электронный выпуск груза в порту назначения. Экономия: ~$100-150 и 3-7 дней vs DHL с бумажными оригиналами.
        </Reminder>

        {/* NAVIGATION */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/calculator/pricing"
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-3 rounded-lg font-bold text-center transition-all"
          >
            ← Back to Pricing
          </Link>
          <Link
            href="/calculator/quotation"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-bold text-center transition-all shadow-lg"
          >
            Generate Quotation →
          </Link>
        </div>
      </main>
    </div>
  );
}

// ============ COMPONENTS ============

function SummaryCard({ label, value, sub, color, big }) {
  const colors = {
    slate: "bg-slate-100 text-slate-900",
    orange: "bg-orange-50 text-orange-700 border border-orange-200",
    cyan: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    emerald: "bg-emerald-500 text-white",
  };
  return (
    <div className={`rounded-lg p-3 ${colors[color] || colors.slate}`}>
      <div className={`text-[10px] uppercase tracking-wider font-bold ${big ? "text-emerald-100" : "opacity-70"}`}>
        {label}
      </div>
      <div className={`font-black mt-1 ${big ? "text-2xl" : "text-xl"}`}>{value}</div>
      <div className={`text-[10px] mt-0.5 ${big ? "text-emerald-100" : "opacity-60"}`}>{sub}</div>
    </div>
  );
}

function SpecBlock({ label, value }) {
  return (
    <div className="bg-slate-50 rounded p-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className="text-sm font-bold text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

// END OF FILE