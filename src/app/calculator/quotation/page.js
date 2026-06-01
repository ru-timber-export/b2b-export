"use client";

import { useDeal } from "../../context/DealContext";
import { useBusinessSettings } from "../../hooks/useBusinessSettings";
import Link from "next/link";
import Reminder from "../../components/Reminder";

export default function QuotationPage() {
  const { deal, isLoaded: dealLoaded } = useDeal();
  const { settings, isLoaded: settingsLoaded } = useBusinessSettings();

  if (!dealLoaded || !settingsLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handlePrint = () => window.print();

  // Расчёты
  const volumePerContainer = deal.volumeTotal || 0;
  const pricePerM3 = deal.pricingPerM3 || 0;
  const containerCount = deal.containerCount || 1;
  const totalPerContainer = volumePerContainer * pricePerM3;
  const grandTotal = totalPerContainer * containerCount;
  const totalVolume = volumePerContainer * containerCount;

  const today = new Date().toLocaleDateString("en-GB");
  const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB");
  const quotationNumber = `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

  // 🆕 Проверка заполненности настроек
  const settingsIncomplete = !settings.inn || !settings.bankAccountUSD || !settings.companyNameEn;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .quotation-page { box-shadow: none !important; }
        }
      `}</style>

      {/* NAV */}
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

      {/* Controls */}
      <div className="max-w-5xl mx-auto p-4 print:hidden">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">📄 Quotation</h1>
            <p className="text-xs text-slate-500">Commercial offer for international buyer</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95"
          >
            🖨 Print / PDF
          </button>
        </div>
      </div>

      {/* 🆕 Предупреждение если Settings не заполнены */}
      {settingsIncomplete && (
        <div className="max-w-5xl mx-auto p-4 print:hidden">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <div className="font-bold text-amber-900">Заполни Business Settings</div>
              <div className="text-xs text-amber-800 mt-1">
                В Quotation нужны: ИНН, банковский USD-счёт, название компании на английском.
                Без них документ выглядит непрофессионально.
              </div>
              <Link
                href="/captain/settings"
                className="inline-block mt-2 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-amber-700 active:scale-95"
              >
                ⚙ Открыть Settings →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reminders */}
      <div className="max-w-5xl mx-auto p-4 print:hidden space-y-2">
        <Reminder
          title="KYC проверка покупателя"
          tone="warning"
          icon="🔍"
        >
          Перед отправкой Quotation убедись что проверил покупателя: реальный сайт, юридический адрес, отзывы, торговая лицензия (Trade License в ОАЭ).
        </Reminder>
        <Reminder
          title="NDA опционально"
          tone="info"
          icon="🤐"
        >
          Если переговоры конфиденциальные — пришли покупателю NDA перед детальной квотацией. Защитит твои цены от утечки конкурентам.
        </Reminder>
        <Reminder
          title="Юрист перед подписанием"
          tone="critical"
          icon="⚖️"
        >
          Quotation — это ещё не контракт, но если покупатель примет — на её основе составится контракт. <strong>Перед подписанием контракта</strong> — обязательно юрист (5-10 тыс₽).
        </Reminder>
      </div>

      {/* QUOTATION DOCUMENT */}
      <div className="max-w-5xl mx-auto p-4 pb-12">
        <div className="quotation-page bg-white shadow-2xl rounded-xl p-6 sm:p-10">

          {/* HEADER */}
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

          {/* TO / FROM */}
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
              <div className="font-bold text-sm">[BUYER COMPANY NAME]</div>
              <div className="text-xs text-slate-600 mt-1">
                [Country / Address]<br/>
                Attn: [Buyer Representative]
              </div>
            </div>
          </section>

          {/* SUBJECT */}
          <section className="bg-slate-900 text-white rounded-lg p-4 mb-6">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Subject</div>
            <div className="font-bold text-base sm:text-lg">
              Sawn Timber Export — {deal.species || "Pine"} — {containerCount} × {deal.containerType || "40HC"} Container{containerCount > 1 ? "s" : ""}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {deal.loadingPort || settings.defaultPort || "Novorossiysk"} → {deal.destinationPort || "Jebel Ali, UAE"} · {settings.defaultIncoterm || "CIF"} Incoterms 2020
            </div>
          </section>

          {/* PRODUCT SPECIFICATION */}
          <section className="mb-6">
            <h3 className="text-xs sm:text-sm font-black text-orange-500 mb-3 tracking-wider">
              📋 PRODUCT SPECIFICATION
            </h3>

            {/* DESKTOP — таблица */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-3 font-bold">Product</th>
                    <th className="text-left p-3 font-bold">Specification</th>
                    <th className="text-right p-3 font-bold">Vol/Cont (m³)</th>
                    <th className="text-right p-3 font-bold">Qty (cont)</th>
                    <th className="text-right p-3 font-bold">Price (USD/m³)</th>
                    <th className="text-right p-3 font-bold">Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3">
                      <div className="font-bold">{deal.species || "Pine"} (Pinus sylvestris)</div>
                      <div className="text-xs text-slate-500">GOST 8486-86, Grade 1-3</div>
                      <div className="text-xs text-orange-600 font-semibold">🟠 REDWOOD</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-xs">{deal.dimensions || "50x150x6000"} mm</div>
                      <div className="text-xs text-slate-500">{deal.drying || "KD 10-12%"}</div>
                      <div className="text-xs text-slate-500">{deal.packaging || "Strapped bundles, AST"}</div>
                    </td>
                    <td className="p-3 text-right font-mono">{volumePerContainer.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold">{containerCount}</td>
                    <td className="p-3 text-right font-mono">${pricePerM3.toFixed(0)}</td>
                    <td className="p-3 text-right font-mono font-bold">${grandTotal.toFixed(0)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold">
                  <tr>
                    <td colSpan="5" className="p-3 text-right">
                      TOTAL ({containerCount} × {deal.containerType || "40HC"}, {totalVolume.toFixed(1)} m³):
                    </td>
                    <td className="p-3 text-right font-mono text-orange-500 text-base">
                      ${grandTotal.toFixed(0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* MOBILE — карточки */}
            <div className="sm:hidden space-y-3">
              <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-black text-slate-900 text-sm">{deal.species || "Pine"} (Pinus sylvestris)</div>
                    <div className="text-xs text-slate-500">GOST 8486-86, Grade 1-3</div>
                    <div className="text-xs text-orange-600 font-bold mt-0.5">🟠 REDWOOD</div>
                  </div>
                  <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Pos. 1
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                  <div className="bg-white rounded p-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Dimensions</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{deal.dimensions || "50x150x6000"} mm</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Moisture</div>
                    <div className="font-bold text-slate-900 mt-0.5 text-xs">{deal.drying || "KD 10-12%"}</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Vol/Cont</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{volumePerContainer.toFixed(2)} m³</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Containers</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{containerCount} × {deal.containerType || "40HC"}</div>
                  </div>
                  <div className="bg-white rounded p-2 col-span-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Packaging</div>
                    <div className="text-xs text-slate-800 mt-0.5">{deal.packaging || "Strapped bundles, AST treated"}</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Price/m³</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">${pricePerM3.toFixed(0)}</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Total Volume</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5 text-xs">{totalVolume.toFixed(1)} m³</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t-2 border-orange-200 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Line Total:</span>
                  <span className="font-mono font-black text-base text-orange-500">${grandTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* TOTAL card */}
              <div className="bg-slate-900 text-white rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Grand Total</div>
                  <div className="text-xs text-slate-500">{containerCount} × {deal.containerType || "40HC"}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-2xl text-orange-400">${grandTotal.toFixed(0)}</div>
                  <div className="text-xs text-slate-400">USD</div>
                </div>
              </div>
            </div>
          </section>

          {/* TERMS GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <TermBlock label="Incoterms" value={`${deal.incoterm || settings.defaultIncoterm || "CIF"} ${deal.destinationPort || "Jebel Ali"}`} />
            <TermBlock label="Lead Time" value={`${deal.leadTime || settings.defaultTransitDays || 45} days from advance`} />
            <TermBlock label="Payment" value={settings.paymentTerms || "30% advance + 70% vs B/L copy"} />
            <TermBlock label="Document Release" value="⚡ Telex Release (no DHL)" />
            <TermBlock label="Loading Port" value={deal.loadingPort || settings.defaultPort || "Novorossiysk, RU"} />
            <TermBlock label="Destination" value={deal.destinationPort || "Jebel Ali, UAE"} />
            <TermBlock label="Container Type" value={`${containerCount} × ${deal.containerType || "40HC"}`} />
            <TermBlock label="Schedule" value={deal.shipmentSchedule === "single" ? "Single shipment" : `${deal.shipmentSchedule || "single"}`} />
          </section>

          {/* 🆕 BANK DETAILS — новая секция (только если заполнены) */}
          {(settings.bankNameEn || settings.bankAccountUSD) && (
            <section className="bg-emerald-50 border-l-4 border-emerald-500 rounded p-4 mb-6">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-2">🏦 Banking Details (for advance payment)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                {settings.bankNameEn && (
                  <div>
                    <span className="opacity-70">Bank:</span> <strong>{settings.bankNameEn}</strong>
                  </div>
                )}
                {settings.bankSWIFT && (
                  <div>
                    <span className="opacity-70">SWIFT:</span> <strong className="font-mono">{settings.bankSWIFT}</strong>
                  </div>
                )}
                {settings.bankAccountUSD && (
                  <div className="sm:col-span-2">
                    <span className="opacity-70">Account USD:</span> <strong className="font-mono">{settings.bankAccountUSD}</strong>
                  </div>
                )}
                {settings.bankCorrespondentUSD && (
                  <div className="sm:col-span-2">
                    <span className="opacity-70">Correspondent Bank:</span> <strong>{settings.bankCorrespondentUSD}</strong>
                  </div>
                )}
                <div className="sm:col-span-2 mt-1">
                  <span className="opacity-70">Beneficiary:</span> <strong>{settings.companyNameEn}</strong>
                </div>
              </div>
            </section>
          )}

          {/* DOCUMENTS */}
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

          {/* TERMS & CONDITIONS */}
          <section className="text-xs text-slate-600 space-y-2 mb-6 border-t pt-4">
            <div><strong>Validity:</strong> This Quotation is valid until {validUntil}. After this date prices may be subject to revision.</div>
            <div><strong>Quality:</strong> All goods shall meet GOST 8486-86 standard. 100% Pine (Pinus sylvestris), no admixture of Spruce.</div>
            <div><strong>Inspection:</strong> Pre-shipment inspection by SGS / Bureau Veritas available at Buyer's expense.</div>
            <div><strong>Force Majeure:</strong> Including sanctions, banking restrictions, port closures. Full terms in Contract.</div>
            <div><strong>Arbitration:</strong> ICAC at the Chamber of Commerce and Industry of the Russian Federation, Moscow.</div>
          </section>

          {/* FOOTER / SIGNATURE */}
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

// ============ COMPONENTS ============

function TermBlock({ label, value }) {
  return (
    <div className="bg-slate-50 rounded p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className="text-sm font-bold text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

// END OF FILE