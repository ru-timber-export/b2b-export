"use client";

import { useState, useEffect } from "react";
import { useDeal, FREIGHT_PRESETS } from "../../context/DealContext";
import { useBusinessSettings } from "../../hooks/useBusinessSettings";
import { useCustomers } from "../../hooks/useCustomers";
import { useQuotationCounter } from "../../hooks/useQuotationCounter";
import Link from "next/link";
import Reminder from "../../components/Reminder";

// 🏷 Маппинг для отображения
const SPECIES_NAMES = {
  pine: "Pine (Pinus sylvestris)",
  spruce: "Spruce (Picea abies)",
  larch: "Larch (Larix sibirica)",
  cedar: "Cedar (Pinus sibirica)",
  birch: "Birch (Betula)",
  oak: "Oak (Quercus)",
  aspen: "Aspen (Populus tremula)",
  "pine-spruce-50-50": "Pine + Spruce 50/50",
  "pine-spruce-70-30": "Pine + Spruce 70/30",
  spf: "SPF (Spruce/Pine/Fir)",
};

const MOISTURE_LABELS = {
  kd: "KD 10-12% (Kiln Dried)",
  ad: "AD 18-22% (Air Dried)",
  fresh: "Fresh 22-30%",
};

const PACKAGING_LABELS = {
  none: "Bulk (no packaging)",
  crate: "Strapped bundles + crate",
  shrink: "Shrink-wrap + crate (premium)",
  strapped: "Strapped bundles",
  premium: "Premium packaging",
};

// 🆕 ОПРЕДЕЛЕНИЕ ПОРТА ОТПРАВЛЕНИЯ ПО ID МАРШРУТА
const LOADING_PORT_MAP = {
  nvr: "Novorossiysk, Russia",
  spb: "Saint Petersburg, Russia",
  vlv: "Vladivostok, Russia",
  kgd: "Kaliningrad, Russia",
};

function getLoadingPort(routeKey) {
  if (!routeKey) return "Novorossiysk, Russia";
  const prefix = routeKey.split("-")[0];
  return LOADING_PORT_MAP[prefix] || "Novorossiysk, Russia";
}

export default function QuotationPage() {
  const { deal, isLoaded: dealLoaded, clearPositions } = useDeal();
  const { settings, isLoaded: settingsLoaded } = useBusinessSettings();
  const { customers, isLoaded: customersLoaded } = useCustomers();
  const { nextNumber, commitNumber, isLoaded: counterLoaded } = useQuotationCounter();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [quotationNumber, setQuotationNumber] = useState("");
  const [numberCommitted, setNumberCommitted] = useState(false);

  useEffect(() => {
    if (counterLoaded && !quotationNumber) {
      setQuotationNumber(nextNumber);
    }
  }, [counterLoaded, nextNumber, quotationNumber]);

  if (!dealLoaded || !settingsLoaded || !customersLoaded || !counterLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handlePrint = () => {
    if (!numberCommitted) {
      const committed = commitNumber();
      setQuotationNumber(committed);
      setNumberCommitted(true);
    }
    setTimeout(() => window.print(), 100);
  };

  // 🆕 МУЛЬТИ-ПОЗИЦИИ ИЗ КОРЗИНЫ
  const basketPositions = deal.positions || [];
  const hasBasket = basketPositions.length > 0;

  // 🆕 Fallback позиция из текущего калькулятора
  const fallbackPosition = {
    id: "fallback",
    species: deal.species || "pine",
    speciesLabel: SPECIES_NAMES[deal.species] || "Pine (Pinus sylvestris)",
    thickness: parseFloat(deal.thickness) || 50,
    width: parseFloat(deal.width) || 150,
    length: parseFloat(deal.length) || 6000,
    moisture: deal.moisture || "kd",
    moistureLabel: MOISTURE_LABELS[deal.moisture] || "KD 10-12%",
    packaging: deal.packaging || "crate",
    packagingLabel: PACKAGING_LABELS[deal.packaging] || "Strapped bundles + crate",
    totalVolume: parseFloat(deal.totalVolume) || 0,
    containers: parseInt(deal.finalContainers) || 1,
    volumePerContainer: 0,
    pricePerM3: parseFloat(deal.finalPricePerM3) || 0,
    totalAmount: parseFloat(deal.finalTotalAmount) || 0,
  };
  fallbackPosition.volumePerContainer = 
    fallbackPosition.containers > 0 ? fallbackPosition.totalVolume / fallbackPosition.containers : 0;
  if (!fallbackPosition.totalAmount) {
    fallbackPosition.totalAmount = fallbackPosition.totalVolume * fallbackPosition.pricePerM3;
  }

  const positions = hasBasket ? basketPositions : [fallbackPosition];

  const totalVolume = positions.reduce((sum, p) => sum + (p.totalVolume || 0), 0);
  const totalContainers = positions.reduce((sum, p) => sum + (p.containers || 0), 0);
  const grandTotal = positions.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  // 🆕 ✅ ПРАВИЛЬНО БЕРЁМ ПОРТЫ ИЗ FREIGHT_PRESETS
  let destinationPort = "Jebel Ali, UAE";
  let loadingPort = "Novorossiysk, Russia";
  
  // Если есть customRoute — приоритет ему
  if (deal.customRoute && deal.customRoute.destinationPort) {
    destinationPort = `${deal.customRoute.destinationPort}${deal.customRoute.country ? `, ${deal.customRoute.country}` : ""}`;
    loadingPort = deal.customRoute.loadingPort || "Novorossiysk, Russia";
  } 
  // Иначе берём из FREIGHT_PRESETS по ID
  else if (deal.freightRoute && FREIGHT_PRESETS[deal.freightRoute]) {
    const preset = FREIGHT_PRESETS[deal.freightRoute];
    destinationPort = `${preset.port}${preset.country ? `, ${preset.country}` : ""}`;
    loadingPort = getLoadingPort(deal.freightRoute);
  }

  const incotermLabel = (deal.incoterm || "CIF").toUpperCase();

  const speciesListInSubject = [...new Set(positions.map(p => 
    (p.speciesLabel || SPECIES_NAMES[p.species] || "Pine").split(" (")[0]
  ))].join(" + ");

  const today = new Date().toLocaleDateString("en-GB");
  const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB");

  const settingsIncomplete = !settings.inn || !settings.bankAccountUSD || !settings.companyNameEn;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .quotation-page { box-shadow: none !important; }
        }
      `}</style>

      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg print:hidden">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <div className="flex gap-3 text-xs sm:text-sm">
            <Link href="/calculator" className="text-slate-300 hover:text-orange-500">← Calculator</Link>
            <Link href="/captain" className="text-orange-400 hover:text-orange-500">⚓ Captain</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 print:hidden">
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                📄 Quotation
                {hasBasket && (
                  <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-bold">
                    🛒 {positions.length} positions
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500">
                Number: <span className="font-mono font-bold text-orange-500">{quotationNumber}</span>
                {!numberCommitted && <span className="ml-2 text-slate-400">(preview)</span>}
                {numberCommitted && <span className="ml-2 text-emerald-500">✓ committed</span>}
              </p>
              {/* 🆕 Показываем маршрут в header */}
              <p className="text-xs text-slate-600 mt-1">
                🚢 <strong>{loadingPort}</strong> → <strong>{destinationPort}</strong>
              </p>
            </div>
            <div className="flex gap-2">
              {hasBasket && (
                <button
                  onClick={() => {
                    if (confirm("Очистить корзину после печати?")) {
                      clearPositions();
                    }
                  }}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-2 rounded-lg font-bold text-xs active:scale-95"
                  title="Clear basket"
                >
                  🗑 Clear basket
                </button>
              )}
              <button
                onClick={handlePrint}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95"
              >
                🖨 Print / PDF
              </button>
            </div>
          </div>

          <div className="border-t pt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600">👥 Buyer:</span>
            {selectedCustomer ? (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg px-3 py-1.5 text-xs">
                  <span className="font-bold text-purple-900">{selectedCustomer.companyName}</span>
                  {selectedCustomer.contactPerson && (
                    <span className="text-purple-600"> · {selectedCustomer.contactPerson}</span>
                  )}
                  {selectedCustomer.country && (
                    <span className="text-purple-500"> · {selectedCustomer.country}</span>
                  )}
                </div>
                <button
                  onClick={() => setShowCustomerPicker(true)}
                  className="text-xs text-purple-600 hover:text-purple-800 underline"
                >
                  Change
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-rose-500 hover:text-rose-700 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowCustomerPicker(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95"
                >
                  👥 Select Customer from CRM
                </button>
                <span className="text-xs text-slate-400">or leave as placeholder</span>
              </>
            )}
          </div>
        </div>
      </div>

      {showCustomerPicker && (
        <CustomerPickerModal
          customers={customers}
          onSelect={(c) => { setSelectedCustomer(c); setShowCustomerPicker(false); }}
          onClose={() => setShowCustomerPicker(false)}
        />
      )}

      {!hasBasket && totalVolume > 0 && (
        <div className="max-w-5xl mx-auto p-4 print:hidden">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <div className="font-bold text-blue-900">Quotation на 1 позицию</div>
              <div className="text-xs text-blue-800 mt-1">
                Если хочешь добавить ещё позиции — иди в Pricing и нажми "Add to Quotation Basket".
              </div>
              <Link href="/calculator/pricing" className="inline-block mt-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-blue-700 active:scale-95">
                💰 Add more positions →
              </Link>
            </div>
          </div>
        </div>
      )}

      {settingsIncomplete && (
        <div className="max-w-5xl mx-auto p-4 print:hidden">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <div className="font-bold text-amber-900">Заполни Business Settings</div>
              <div className="text-xs text-amber-800 mt-1">
                Нужны: ИНН, USD-счёт, название EN.
              </div>
              <Link href="/captain/settings" className="inline-block mt-2 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-amber-700 active:scale-95">
                ⚙ Открыть Settings →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-4 print:hidden space-y-2">
        <Reminder title="KYC проверка покупателя" tone="warning" icon="🔍">
          Перед отправкой Quotation убедись что проверил покупателя: реальный сайт, юридический адрес, отзывы, торговая лицензия.
        </Reminder>
        <Reminder title="NDA опционально" tone="info" icon="🤐">
          Если переговоры конфиденциальные — пришли покупателю NDA перед детальной квотацией.
        </Reminder>
        <Reminder title="Юрист перед подписанием" tone="critical" icon="⚖️">
          <strong>Перед подписанием контракта</strong> — обязательно юрист (5-10 тыс₽).
        </Reminder>
      </div>

      <div className="max-w-5xl mx-auto p-4 pb-12">
        <div className="quotation-page bg-white shadow-2xl rounded-xl p-6 sm:p-10">

          <header className="border-b-4 border-orange-500 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center font-black text-2xl text-white">R</div>
                  <div>
                    <div className="font-black text-2xl text-slate-900 tracking-widest">RU-TIMBER</div>
                    <div className="text-xs text-slate-500 tracking-wider">EXPORT TRADING</div>
                  </div>
                </div>
                <div className="text-xs text-slate-600">
                  {settings.companyNameEn || settings.companyName || "Individual Entrepreneur"}<br/>
                  {settings.warehouseAddressEn || settings.warehouseAddress || "Russian Federation"}<br/>
                  📞 {settings.phone} · 📧 {settings.email}
                </div>
              </div>
              <div className="text-right">
                <div className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-block mb-2">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Quotation №</div>
                  <div className="font-black text-lg">{quotationNumber}</div>
                </div>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div><strong>Date:</strong> {today}</div>
                  <div><strong>Valid until:</strong> {validUntil}</div>
                </div>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">FROM (Seller)</div>
              <div className="font-bold text-sm">{settings.companyNameEn || settings.companyName || "RU-TIMBER EXPORT"}</div>
              <div className="text-xs text-slate-600 mt-1">
                {settings.warehouseAddressEn || settings.warehouseAddress || "Russian Federation"}<br/>
                TIN: {settings.inn || "—"}<br/>
                {settings.ogrnip && <>OGRNIP: {settings.ogrnip}<br/></>}
                {settings.website && <>Web: {settings.website}</>}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-[10px] uppercase tracking-wider text-orange-700 font-bold mb-1">TO (Buyer)</div>
              {selectedCustomer ? (
                <>
                  <div className="font-bold text-sm">{selectedCustomer.companyName}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selectedCustomer.country && <>{selectedCustomer.country}{selectedCustomer.city && `, ${selectedCustomer.city}`}<br/></>}
                    {selectedCustomer.contactPerson && (
                      <>Attn: {selectedCustomer.contactPerson}
                        {selectedCustomer.position && ` (${selectedCustomer.position})`}<br/></>
                    )}
                    {selectedCustomer.email && <>📧 {selectedCustomer.email}<br/></>}
                    {selectedCustomer.phone && <>📞 {selectedCustomer.phone}</>}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold text-sm">[BUYER COMPANY NAME]</div>
                  <div className="text-xs text-slate-600 mt-1">
                    [Country / Address]<br/>
                    Attn: [Buyer Representative]
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="bg-slate-900 text-white rounded-lg p-4 mb-6">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Subject</div>
            <div className="font-bold text-base sm:text-lg">
              Sawn Timber Export — {speciesListInSubject} — {totalContainers} × 40HC Container{totalContainers > 1 ? "s" : ""}
              {hasBasket && positions.length > 1 && (
                <span className="text-sm font-normal opacity-80"> ({positions.length} positions)</span>
              )}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {loadingPort} → {destinationPort} · {incotermLabel} Incoterms 2020
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-xs sm:text-sm font-black text-orange-500 mb-3 tracking-wider">
              📋 PRODUCT SPECIFICATION
              {hasBasket && (
                <span className="ml-2 text-purple-600">({positions.length} positions)</span>
              )}
            </h3>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-3 font-bold w-12">#</th>
                    <th className="text-left p-3 font-bold">Product</th>
                    <th className="text-left p-3 font-bold">Specification</th>
                    <th className="text-right p-3 font-bold">Vol (m³)</th>
                    <th className="text-right p-3 font-bold">Qty (cont)</th>
                    <th className="text-right p-3 font-bold">Price (USD/m³)</th>
                    <th className="text-right p-3 font-bold">Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p, idx) => {
                    const speciesLabel = p.speciesLabel || SPECIES_NAMES[p.species] || "Pine (Pinus sylvestris)";
                    const moistureLabel = p.moistureLabel || MOISTURE_LABELS[p.moisture] || "KD 10-12%";
                    const packagingLabel = p.packagingLabel || PACKAGING_LABELS[p.packaging] || "Strapped bundles";
                    const dimensions = `${p.thickness}×${p.width}×${p.length}`;
                    
                    return (
                      <tr key={p.id} className="border-b border-slate-100">
                        <td className="p-3 font-bold text-orange-500">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold">{speciesLabel}</div>
                          <div className="text-xs text-slate-500">GOST 8486-86, Grade 1-3</div>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-xs">{dimensions} mm</div>
                          <div className="text-xs text-slate-500">{moistureLabel}</div>
                          <div className="text-xs text-slate-500">{packagingLabel}</div>
                        </td>
                        <td className="p-3 text-right font-mono">{(p.totalVolume || 0).toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-bold">{p.containers || 1}</td>
                        <td className="p-3 text-right font-mono">${(p.pricePerM3 || 0).toFixed(0)}</td>
                        <td className="p-3 text-right font-mono font-bold">${(p.totalAmount || 0).toFixed(0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 font-bold">
                  <tr>
                    <td colSpan="6" className="p-3 text-right">
                      TOTAL ({totalContainers} × 40HC, {totalVolume.toFixed(1)} m³):
                    </td>
                    <td className="p-3 text-right font-mono text-orange-500 text-base">
                      ${grandTotal.toFixed(0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="sm:hidden space-y-3">
              {positions.map((p, idx) => {
                const speciesLabel = p.speciesLabel || SPECIES_NAMES[p.species] || "Pine (Pinus sylvestris)";
                const moistureLabel = p.moistureLabel || MOISTURE_LABELS[p.moisture] || "KD 10-12%";
                const packagingLabel = p.packagingLabel || PACKAGING_LABELS[p.packaging] || "Strapped bundles";
                const dimensions = `${p.thickness}×${p.width}×${p.length}`;
                
                return (
                  <div key={p.id} className="bg-slate-50 rounded-lg p-3 border-l-4 border-orange-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-black text-slate-900 text-sm">{speciesLabel}</div>
                        <div className="text-xs text-slate-500">GOST 8486-86, Grade 1-3</div>
                      </div>
                      <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Pos. {idx + 1}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      <div className="bg-white rounded p-2">
                        <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Dimensions</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{dimensions} mm</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Moisture</div>
                        <div className="font-bold text-slate-900 mt-0.5 text-xs">{moistureLabel}</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Volume</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{(p.totalVolume || 0).toFixed(2)} m³</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Containers</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{p.containers || 1} × 40HC</div>
                      </div>
                      <div className="bg-white rounded p-2 col-span-2">
                        <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Packaging</div>
                        <div className="text-xs text-slate-800 mt-0.5">{packagingLabel}</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Price/m³</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">${(p.pricePerM3 || 0).toFixed(0)}</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Line Total</div>
                        <div className="font-mono font-bold text-emerald-600 mt-0.5 text-sm">${(p.totalAmount || 0).toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="bg-slate-900 text-white rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Grand Total</div>
                  <div className="text-xs text-slate-500">
                    {positions.length} position{positions.length > 1 ? "s" : ""} · 
                    {totalContainers} × 40HC · 
                    {totalVolume.toFixed(1)} m³
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-2xl text-orange-400">${grandTotal.toFixed(0)}</div>
                  <div className="text-xs text-slate-400">USD</div>
                </div>
              </div>
            </div>
          </section>

          {/* 🆕 ОБНОВЛЁННЫЙ TermBlock с правильными портами */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <TermBlock label="Incoterms" value={`${incotermLabel} ${destinationPort}`} />
            <TermBlock label="Lead Time" value={`${settings.defaultTransitDays || 45} days from advance`} />
            <TermBlock label="Payment" value={settings.paymentTerms || "30% advance + 70% vs B/L copy"} />
            <TermBlock label="Document Release" value="⚡ Telex Release (no DHL)" />
            <TermBlock label="Loading Port" value={loadingPort} />
            <TermBlock label="Destination" value={destinationPort} />
            <TermBlock label="Container Type" value={`${totalContainers} × 40HC`} />
            <TermBlock label="Schedule" value="Single shipment" />
          </section>

          {(settings.bankNameEn || settings.bankAccountUSD) && (
            <section className="bg-emerald-50 border-l-4 border-emerald-500 rounded p-4 mb-6">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-2">🏦 Banking Details (for advance payment)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                {settings.bankNameEn && <div><span className="opacity-70">Bank:</span> <strong>{settings.bankNameEn}</strong></div>}
                {settings.bankSWIFT && <div><span className="opacity-70">SWIFT:</span> <strong className="font-mono">{settings.bankSWIFT}</strong></div>}
                {settings.bankAccountUSD && <div className="sm:col-span-2"><span className="opacity-70">Account USD:</span> <strong className="font-mono">{settings.bankAccountUSD}</strong></div>}
                {settings.bankCorrespondentUSD && <div className="sm:col-span-2"><span className="opacity-70">Correspondent Bank:</span> <strong>{settings.bankCorrespondentUSD}</strong></div>}
                <div className="sm:col-span-2 mt-1"><span className="opacity-70">Beneficiary:</span> <strong>{settings.companyNameEn}</strong></div>
              </div>
            </section>
          )}

          <section className="bg-blue-50 border-l-4 border-blue-500 rounded p-4 mb-6">
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">📑 Documents provided</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs text-blue-800">
              <div>✅ Commercial Invoice</div>
              <div>✅ Packing List</div>
              <div>✅ Bill of Lading (Telex)</div>
              <div>✅ Certificate of Origin</div>
              <div>✅ Phytosanitary Cert.</div>
              <div>✅ ISPM-15 Fumigation</div>
              <div>✅ Pre-shipment Photos</div>
              <div>✅ Container Survey</div>
              <div>✅ Marine Insurance</div>
            </div>
          </section>

          <section className="text-xs text-slate-600 space-y-2 mb-6 border-t pt-4">
            <div><strong>Validity:</strong> This Quotation is valid until {validUntil}.</div>
            <div><strong>Quality:</strong> All goods shall meet GOST 8486-86 standard.</div>
            <div><strong>Inspection:</strong> Pre-shipment inspection by SGS / Bureau Veritas available at Buyer's expense.</div>
            <div><strong>Force Majeure:</strong> Including sanctions, banking restrictions, port closures. Full terms in Contract.</div>
            <div><strong>Arbitration:</strong> ICAC at the Chamber of Commerce and Industry of the Russian Federation, Moscow.</div>
          </section>

          <footer className="border-t-2 border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <div className="text-xs text-slate-500 mb-1">Issued by:</div>
              <div className="font-bold">{settings.signatureName || settings.fullName || "Director Name"}</div>
              <div className="text-xs text-slate-600">{settings.position}</div>
              <div className="text-xs text-slate-600">{settings.companyNameEn || settings.companyName || "RU-TIMBER EXPORT"}</div>
              <div className="text-xs text-slate-500 mt-2 italic">
                This Quotation is an offer subject to final Contract signing.
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              Powered by RU-TIMBER<br/>
              Generated: {today}
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}

function TermBlock({ label, value }) {
  return (
    <div className="bg-slate-50 rounded p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className="text-sm font-bold text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

function CustomerPickerModal({ customers, onSelect, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${c.companyName} ${c.contactPerson} ${c.country} ${c.email}`.toLowerCase().includes(q);
  });

  const tempOrder = { hot: 0, warm: 1, cold: 2 };
  const sorted = [...filtered].sort((a, b) => {
    return (tempOrder[a.temperature] ?? 3) - (tempOrder[b.temperature] ?? 3);
  });

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 print:hidden">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col rounded-t-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-black text-lg">👥 Select Buyer from CRM</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl">✕</button>
        </div>

        <div className="p-3 border-b">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search company, name, country..."
            autoFocus
            className="w-full p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none"
          />
          <div className="text-xs text-slate-500 mt-1">
            {sorted.length} of {customers.length} customers
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-2">👥</div>
              <div className="font-bold text-slate-700">Нет клиентов в CRM</div>
              <div className="text-xs text-slate-500 mt-1">Сначала добавь клиентов</div>
              <Link
                href="/captain/customers"
                className="inline-block mt-3 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-purple-700"
              >
                ⚓ Open CRM →
              </Link>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Никого не найдено
            </div>
          ) : (
            sorted.map(c => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className="w-full text-left bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border-2 border-transparent rounded-lg p-3 transition-colors active:scale-[0.98]"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{c.companyName || "Без названия"}</div>
                    {c.contactPerson && (
                      <div className="text-xs text-slate-600 truncate">
                        {c.contactPerson}
                        {c.position && <span className="text-slate-400"> · {c.position}</span>}
                      </div>
                    )}
                    {c.country && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {c.country} {c.city && `· ${c.city}`}
                      </div>
                    )}
                    {c.interest && (
                      <div className="text-xs text-purple-600 mt-1 italic truncate">
                        💼 {c.interest}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {c.temperature === "hot" && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">🔥 Hot</span>}
                    {c.temperature === "warm" && <span className="text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold">🟡 Warm</span>}
                    {c.temperature === "cold" && <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">🧊 Cold</span>}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t flex gap-2">
          <Link
            href="/captain/customers"
            className="text-xs text-purple-600 hover:text-purple-800 underline"
          >
            + Add new customer in CRM
          </Link>
          <button
            onClick={onClose}
            className="ml-auto text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}