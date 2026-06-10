"use client";

import { useState, useEffect } from "react";
import { useDeal, FREIGHT_PRESETS, calcLeadTime, calcAutoDiscount, getPaymentSchema } from "../../context/DealContext";
import { useBusinessSettings } from "../../hooks/useBusinessSettings";
import { useCustomers } from "../../hooks/useCustomers";
import { useQuotationCounter } from "../../hooks/useQuotationCounter";
import Link from "next/link";
import Reminder from "../../components/Reminder";

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

  const basketPositions = deal.positions || [];
  const hasBasket = basketPositions.length > 0;

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
  const subtotal = positions.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  let destinationPort = "Jebel Ali, UAE";
  let loadingPort = "Novorossiysk, Russia";
  let routeTransit = 21;
  
  if (deal.customRoute && deal.customRoute.destinationPort) {
    destinationPort = `${deal.customRoute.destinationPort}${deal.customRoute.country ? `, ${deal.customRoute.country}` : ""}`;
    loadingPort = deal.customRoute.loadingPort || "Novorossiysk, Russia";
    routeTransit = 21;
  } 
  else if (deal.freightRoute && FREIGHT_PRESETS[deal.freightRoute]) {
    const preset = FREIGHT_PRESETS[deal.freightRoute];
    destinationPort = `${preset.port}${preset.country ? `, ${preset.country}` : ""}`;
    loadingPort = getLoadingPort(deal.freightRoute);
    routeTransit = preset.transit || 21;
  }

  const incotermLabel = (deal.incoterm || "CIF").toUpperCase();

  const leadTimeAuto = calcLeadTime(deal.freightRoute, routeTransit);
  const leadTimeTotal = deal.leadTimeOverride !== null && deal.leadTimeOverride !== undefined
    ? parseInt(deal.leadTimeOverride) : leadTimeAuto.total;

  const autoDiscountPercent = calcAutoDiscount(totalContainers);
  let appliedDiscountPercent = 0;
  if (deal.discountMode === "auto" || !deal.discountMode) appliedDiscountPercent = autoDiscountPercent;
  else if (deal.discountMode === "custom") appliedDiscountPercent = parseFloat(deal.customDiscountPercent) || 0;
  
  const discountAmount = (subtotal * appliedDiscountPercent) / 100;
  const grandTotal = subtotal - discountAmount;

  // 🆕 PAYMENT SCHEMA
  const paymentSchema = getPaymentSchema(deal.paymentSchema || "prepay100");
  const buyerAdvance = (grandTotal * paymentSchema.advancePercent) / 100;
  const buyerBalance = grandTotal - buyerAdvance;

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
                {appliedDiscountPercent > 0 && (
                  <span className="ml-2 text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-bold">
                    💸 -{appliedDiscountPercent}%
                  </span>
                )}
                <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-bold">
                  {paymentSchema.icon} {paymentSchema.name}
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                №: <span className="font-mono font-bold text-orange-500">{quotationNumber}</span>
                {!numberCommitted && <span className="ml-2 text-slate-400">(preview)</span>}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                🚢 <strong>{loadingPort}</strong> → <strong>{destinationPort}</strong> · ⏱ {leadTimeTotal}d
              </p>
            </div>
            <div className="flex gap-2">
              {hasBasket && (
                <button onClick={() => { if (confirm("Очистить?")) clearPositions(); }}
                  className="bg-rose-100 text-rose-700 px-3 py-2 rounded-lg font-bold text-xs active:scale-95">
                  🗑 Clear
                </button>
              )}
              <button onClick={handlePrint}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm active:scale-95">
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
                  {selectedCustomer.country && <span className="text-purple-500"> · {selectedCustomer.country}</span>}
                </div>
                <button onClick={() => setShowCustomerPicker(true)} className="text-xs text-purple-600 underline">Change</button>
                <button onClick={() => setSelectedCustomer(null)} className="text-xs text-rose-500 underline">Remove</button>
              </div>
            ) : (
              <>
                <button onClick={() => setShowCustomerPicker(true)}
                  className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95">
                  👥 Select Customer
                </button>
                <span className="text-xs text-slate-400">or placeholder</span>
              </>
            )}
          </div>
        </div>
      </div>

      {showCustomerPicker && (
        <CustomerPickerModal customers={customers} 
          onSelect={(c) => { setSelectedCustomer(c); setShowCustomerPicker(false); }}
          onClose={() => setShowCustomerPicker(false)} />
      )}

      <div className="max-w-5xl mx-auto p-4 print:hidden space-y-2">
        <Reminder title="KYC проверка" tone="warning" icon="🔍">
          Перед отправкой убедись что проверил покупателя.
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
                  <div className="text-[10px] uppercase text-slate-400">Quotation №</div>
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
              <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">FROM (Seller)</div>
              <div className="font-bold text-sm">{settings.companyNameEn || "RU-TIMBER EXPORT"}</div>
              <div className="text-xs text-slate-600 mt-1">
                {settings.warehouseAddressEn || "Russian Federation"}<br/>
                TIN: {settings.inn || "—"}<br/>
                {settings.website && <>Web: {settings.website}</>}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-[10px] uppercase text-orange-700 font-bold mb-1">TO (Buyer)</div>
              {selectedCustomer ? (
                <>
                  <div className="font-bold text-sm">{selectedCustomer.companyName}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selectedCustomer.country && <>{selectedCustomer.country}{selectedCustomer.city && `, ${selectedCustomer.city}`}<br/></>}
                    {selectedCustomer.contactPerson && <>Attn: {selectedCustomer.contactPerson}<br/></>}
                    {selectedCustomer.email && <>📧 {selectedCustomer.email}</>}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold text-sm">[BUYER COMPANY NAME]</div>
                  <div className="text-xs text-slate-600 mt-1">[Country / Address]<br/>Attn: [Buyer Representative]</div>
                </>
              )}
            </div>
          </section>

          <section className="bg-slate-900 text-white rounded-lg p-4 mb-6">
            <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Subject</div>
            <div className="font-bold text-base sm:text-lg">
              Sawn Timber Export — {speciesListInSubject} — {totalContainers} × 40HC
              {hasBasket && positions.length > 1 && <span className="text-sm font-normal opacity-80"> ({positions.length} positions)</span>}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {loadingPort} → {destinationPort} · {incotermLabel} Incoterms 2020 · {leadTimeTotal} days
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-xs sm:text-sm font-black text-orange-500 mb-3 tracking-wider">
              📋 PRODUCT SPECIFICATION
              {hasBasket && <span className="ml-2 text-purple-600">({positions.length})</span>}
            </h3>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs uppercase">
                  <tr>
                    <th className="text-left p-3 font-bold w-12">#</th>
                    <th className="text-left p-3 font-bold">Product</th>
                    <th className="text-left p-3 font-bold">Specification</th>
                    <th className="text-right p-3 font-bold">Vol (m³)</th>
                    <th className="text-right p-3 font-bold">Qty</th>
                    <th className="text-right p-3 font-bold">Price/m³</th>
                    <th className="text-right p-3 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p, idx) => {
                    const speciesLabel = p.speciesLabel || SPECIES_NAMES[p.species] || "Pine";
                    const moistureLabel = p.moistureLabel || MOISTURE_LABELS[p.moisture] || "KD 10-12%";
                    const packagingLabel = p.packagingLabel || PACKAGING_LABELS[p.packaging] || "Strapped";
                    const dimensions = `${p.thickness}×${p.width}×${p.length}`;
                    return (
                      <tr key={p.id} className="border-b border-slate-100">
                        <td className="p-3 font-bold text-orange-500">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold">{speciesLabel}</div>
                          <div className="text-xs text-slate-500">GOST 8486-86</div>
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
                <tfoot>
                  <tr className="bg-slate-50">
                    <td colSpan="6" className="p-3 text-right font-semibold text-slate-700">
                      Subtotal ({totalContainers} × 40HC, {totalVolume.toFixed(1)} m³):
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">${subtotal.toFixed(0)}</td>
                  </tr>
                  {appliedDiscountPercent > 0 && (
                    <tr className="bg-emerald-50">
                      <td colSpan="6" className="p-3 text-right font-semibold text-emerald-700">
                        🎁 Volume Discount ({appliedDiscountPercent}%):
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">-${discountAmount.toFixed(0)}</td>
                    </tr>
                  )}
                  <tr className="bg-slate-900 text-white">
                    <td colSpan="6" className="p-3 text-right font-black text-base">GRAND TOTAL:</td>
                    <td className="p-3 text-right font-mono text-orange-400 text-lg font-black">${grandTotal.toFixed(0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* MOBILE */}
            <div className="sm:hidden space-y-3">
              {positions.map((p, idx) => {
                const speciesLabel = p.speciesLabel || SPECIES_NAMES[p.species] || "Pine";
                const dimensions = `${p.thickness}×${p.width}×${p.length}`;
                return (
                  <div key={p.id} className="bg-slate-50 rounded-lg p-3 border-l-4 border-orange-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-black text-sm">{speciesLabel}</div>
                        <div className="text-xs text-slate-500">GOST 8486-86</div>
                      </div>
                      <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">Pos. {idx + 1}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      <div className="bg-white rounded p-2">
                        <div className="text-[9px] font-bold">Dimensions</div>
                        <div className="font-mono font-bold text-xs">{dimensions}mm</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-[9px] font-bold">Volume</div>
                        <div className="font-mono font-bold text-xs">{(p.totalVolume || 0).toFixed(2)} m³</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-[9px] font-bold">Cont</div>
                        <div className="font-mono font-bold text-xs">{p.containers || 1}×40HC</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="text-[9px] font-bold">Total</div>
                        <div className="font-mono font-bold text-emerald-600 text-sm">${(p.totalAmount || 0).toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="space-y-2">
                <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold">Subtotal</div>
                    <div className="text-[10px] text-slate-500">{totalContainers}×40HC · {totalVolume.toFixed(1)}m³</div>
                  </div>
                  <div className="font-mono font-bold">${subtotal.toFixed(0)}</div>
                </div>
                {appliedDiscountPercent > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex justify-between items-center">
                    <div className="text-xs text-emerald-700 font-bold">🎁 Discount ({appliedDiscountPercent}%)</div>
                    <div className="font-mono font-bold text-emerald-600">-${discountAmount.toFixed(0)}</div>
                  </div>
                )}
                <div className="bg-slate-900 text-white rounded-lg p-4 flex justify-between items-center">
                  <div className="text-[10px] uppercase text-slate-400">Grand Total</div>
                  <div className="font-mono font-black text-2xl text-orange-400">${grandTotal.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </section>

          {/* 🆕 PAYMENT TERMS — большая красивая секция */}
          <section className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{paymentSchema.icon}</span>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-purple-700">Payment Terms</div>
                <div className="text-xl font-black text-slate-900">{paymentSchema.name}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {paymentSchema.advancePercent > 0 && (
                <div className="bg-white rounded-lg p-4 border-2 border-emerald-300">
                  <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">
                    💰 Advance Payment
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    ${buyerAdvance.toFixed(0)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {paymentSchema.advancePercent}% of Grand Total
                  </div>
                  <div className="text-xs text-slate-500 mt-2 italic">
                    Within 5 banking days of Contract signing
                  </div>
                </div>
              )}
              
              {paymentSchema.balancePercent > 0 && (
                <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                  <div className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
                    📦 Balance Payment
                  </div>
                  <div className="text-2xl font-black text-amber-700">
                    ${buyerBalance.toFixed(0)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {paymentSchema.balancePercent}% of Grand Total
                  </div>
                  <div className="text-xs text-slate-500 mt-2 italic">
                    Against scan copy of Bill of Lading (B/L)
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-3 text-xs text-slate-700">
              <div className="font-bold mb-1">📄 Contract clause 6.2:</div>
              <div className="italic opacity-80">{paymentSchema.contractText}</div>
            </div>
          </section>

          {/* TERMS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <TermBlock label="Incoterms" value={`${incotermLabel} ${destinationPort}`} />
            <TermBlock label="Lead Time" value={`${leadTimeTotal} days from advance payment`} />
            <TermBlock label="Payment Schema" value={`${paymentSchema.icon} ${paymentSchema.name}`} />
            <TermBlock label="Document Release" value="⚡ Telex Release (no DHL)" />
            <TermBlock label="Loading Port" value={loadingPort} />
            <TermBlock label="Destination" value={destinationPort} />
            <TermBlock label="Container Type" value={`${totalContainers} × 40HC`} />
            <TermBlock label="Schedule" value="Single shipment" />
          </section>

          {(settings.bankNameEn || settings.bankAccountUSD) && (
            <section className="bg-emerald-50 border-l-4 border-emerald-500 rounded p-4 mb-6">
              <h4 className="text-xs font-black text-emerald-900 uppercase mb-2">🏦 Banking Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                {settings.bankNameEn && <div><span className="opacity-70">Bank:</span> <strong>{settings.bankNameEn}</strong></div>}
                {settings.bankSWIFT && <div><span className="opacity-70">SWIFT:</span> <strong className="font-mono">{settings.bankSWIFT}</strong></div>}
                {settings.bankAccountUSD && <div className="sm:col-span-2"><span className="opacity-70">Account USD:</span> <strong className="font-mono">{settings.bankAccountUSD}</strong></div>}
                <div className="sm:col-span-2 mt-1"><span className="opacity-70">Beneficiary:</span> <strong>{settings.companyNameEn}</strong></div>
              </div>
            </section>
          )}

          <section className="bg-blue-50 border-l-4 border-blue-500 rounded p-4 mb-6">
            <h4 className="text-xs font-black text-blue-900 uppercase mb-2">📑 Documents provided</h4>
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
            <div><strong>Validity:</strong> Valid until {validUntil}.</div>
            <div><strong>Quality:</strong> GOST 8486-86.</div>
            <div><strong>Payment Terms:</strong> {paymentSchema.name} — {paymentSchema.description}</div>
            {appliedDiscountPercent > 0 && (
              <div><strong>Discount:</strong> Volume discount {appliedDiscountPercent}% applied for {totalContainers} × 40HC.</div>
            )}
            <div><strong>Inspection:</strong> SGS/Bureau Veritas at Buyer's expense.</div>
            <div><strong>Arbitration:</strong> ICAC, Moscow.</div>
          </section>

          <footer className="border-t-2 border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <div className="text-xs text-slate-500 mb-1">Issued by:</div>
              <div className="font-bold">{settings.signatureName || settings.fullName || "Director Name"}</div>
              <div className="text-xs text-slate-600">{settings.position}</div>
              <div className="text-xs text-slate-600">{settings.companyNameEn || "RU-TIMBER EXPORT"}</div>
            </div>
            <div className="text-right text-xs text-slate-500">
              Powered by RU-TIMBER<br/>{today}
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
      <div className="text-[10px] uppercase text-slate-500 font-bold">{label}</div>
      <div className="text-sm font-bold text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

function CustomerPickerModal({ customers, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${c.companyName} ${c.contactPerson} ${c.country}`.toLowerCase().includes(q);
  });
  const tempOrder = { hot: 0, warm: 1, cold: 2 };
  const sorted = [...filtered].sort((a, b) => (tempOrder[a.temperature] ?? 3) - (tempOrder[b.temperature] ?? 3));

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col rounded-t-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-black text-lg">👥 Select Buyer</h3>
          <button onClick={onClose} className="text-slate-400 text-2xl">✕</button>
        </div>
        <div className="p-3 border-b">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search..." autoFocus
            className="w-full p-2 border-2 border-slate-300 rounded-lg text-sm outline-none" />
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-2">👥</div>
              <div className="font-bold">Нет клиентов</div>
              <Link href="/captain/customers" className="inline-block mt-3 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded">
                ⚓ CRM →
              </Link>
            </div>
          ) : (
            sorted.map(c => (
              <button key={c.id} onClick={() => onSelect(c)}
                className="w-full text-left bg-slate-50 hover:bg-purple-50 border-2 border-transparent rounded-lg p-3 active:scale-[0.98]">
                <div className="font-bold">{c.companyName || "Без названия"}</div>
                {c.contactPerson && <div className="text-xs text-slate-600">{c.contactPerson}</div>}
                {c.country && <div className="text-xs text-slate-500">{c.country}</div>}
              </button>
            ))
          )}
        </div>
        <div className="p-3 border-t">
          <button onClick={onClose} className="ml-auto text-xs px-3 py-1.5 bg-slate-100 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
}