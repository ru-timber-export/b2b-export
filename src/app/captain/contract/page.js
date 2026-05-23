"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useDeal } from "../../context/DealContext";
import { CONTRACT_CLAUSES, GLOSSARY } from "./contractData";
import Tooltip, { GlossaryFooter } from "../../components/Tooltip";

// 💰 Перевод суммы в слова (упрощённо для USD)
function amountToWords(amount) {
  if (!amount || amount === 0) return "Zero US Dollars";
  const rounded = Math.round(amount);
  const thousands = Math.floor(rounded / 1000);
  const hundreds = rounded % 1000;
  let result = "";
  if (thousands > 0) result += `${thousands} thousand `;
  if (hundreds > 0) result += `${hundreds} `;
  result += "US Dollars";
  return result.trim().replace(/\s+/g, " ");
}

// 📅 Дата окончания контракта (по умолчанию +6 месяцев)
function defaultExpiryDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split("T")[0];
}

export default function ContractPage() {
  const { deal, seller, isLoaded } = useDeal();
  const [language, setLanguage] = useState("both"); // 'en' | 'ru' | 'both'
  const [showGlossary, setShowGlossary] = useState(true);
  const [signed, setSigned] = useState(false);

  // 📝 Все редактируемые поля контракта
  const [contractData, setContractData] = useState({
    // Контракт
    contractNumber: `RU-TIMBER-${new Date().getFullYear()}-001`,
    contractDate: new Date().toISOString().split("T")[0],
    contractExpiryDate: defaultExpiryDate(),

    // Продавец (из seller context)
    sellerName: "",
    sellerAddress: "",
    sellerINN: "",
    sellerOGRN: "",
    sellerDirector: "",
    sellerBank: "",
    sellerSwift: "",
    sellerAccount: "",
    sellerCorrespondent: "",

    // Покупатель
    buyerName: "[BUYER COMPANY NAME LLC]",
    buyerAddress: "[Buyer's registered address]",
    buyerTaxId: "",
    buyerDirector: "",

    // Товар (из deal)
    productDescription: "Sawn timber, pine (Pinus sylvestris)",
    moisture: "KD 10-12%",
    dimensions: "50x150x6000",
    quantity: "62",
    packaging: "Strapped bundles, anti-stain treated, polypropylene wrapped",
    hsCode: "4407.11",

    // Цена
    unitPrice: "543",
    totalAmount: "33666",
    totalAmountWords: "Thirty-three thousand six hundred sixty-six US Dollars",
    incoterm: "CIF",
    loadingPort: "Novorossiysk",
    destinationPort: "Jebel Ali, UAE",
    leadTime: "45",
    transitDays: "30",
  });

  // 🔄 Автозаполнение из текущей сделки
  const autofill = () => {
    if (!deal || !seller) return;

    const totalAmount = deal.pricingTotalUSD || deal.pricingPerM3 * deal.volumeTotal || 0;
    
    setContractData((prev) => ({
      ...prev,
      // Из seller
      sellerName: seller.companyName || prev.sellerName,
      sellerAddress: seller.legalAddress || prev.sellerAddress,
      sellerINN: seller.inn || prev.sellerINN,
      sellerOGRN: seller.ogrn || prev.sellerOGRN,
      sellerDirector: seller.director || prev.sellerDirector,
      sellerBank: seller.bankName || prev.sellerBank,
      sellerSwift: seller.bankSwift || prev.sellerSwift,
      sellerAccount: seller.bankAccountUSD || prev.sellerAccount,
      sellerCorrespondent: seller.correspondentBank || prev.sellerCorrespondent,

      // Из deal
      productDescription: deal.species ? `Sawn timber, ${deal.species}` : prev.productDescription,
      moisture: deal.drying || prev.moisture,
      dimensions: deal.dimensions || prev.dimensions,
      quantity: deal.volumeTotal?.toFixed(2) || prev.quantity,
      packaging: deal.packaging || prev.packaging,

      // Из pricing
      unitPrice: deal.pricingPerM3?.toFixed(0) || prev.unitPrice,
      totalAmount: totalAmount.toFixed(0) || prev.totalAmount,
      totalAmountWords: amountToWords(totalAmount),
      incoterm: deal.freightPreset?.includes("CIF") ? "CIF" : (deal.freightPreset?.includes("FOB") ? "FOB" : prev.incoterm),

      // Из shipping
      loadingPort: deal.loadingPort || prev.loadingPort,
      destinationPort: deal.destinationPort || prev.destinationPort,
    }));
  };

  // 📝 Обновление поля
  const updateField = (key, value) => {
    setContractData((prev) => {
      const updated = { ...prev, [key]: value };
      // Автообновление суммы прописью при изменении totalAmount
      if (key === "totalAmount") {
        updated.totalAmountWords = amountToWords(parseFloat(value) || 0);
      }
      return updated;
    });
  };

  // 🖨 Печать
  const handlePrint = () => {
    window.print();
  };

  // 📊 Прогресс заполненности
  const filledFieldsCount = useMemo(() => {
    const requiredFields = [
      "sellerName", "sellerAddress", "sellerINN", "sellerDirector",
      "buyerName", "buyerAddress", "buyerDirector",
      "productDescription", "quantity", "unitPrice", "totalAmount",
      "loadingPort", "destinationPort",
      "sellerBank", "sellerSwift", "sellerAccount",
    ];
    const filled = requiredFields.filter((f) => contractData[f] && !contractData[f].includes("[")).length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [contractData]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading contract generator...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* 🎨 Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .contract-page {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          .clause-row {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* NAV */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg print:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/captain" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
            <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30 font-bold">
              📜 CONTRACT
            </span>
          </Link>
          <div className="flex gap-3 text-sm">
            <Link href="/captain" className="text-slate-300 hover:text-orange-500">← Captain</Link>
            <Link href="/calculator" className="text-orange-400 hover:text-orange-500">🧮 Calculator</Link>
          </div>
        </div>
      </nav>

      {/* CONTROLS PANEL (hidden in print) */}
      <div className="max-w-6xl mx-auto p-4 print:hidden">
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900">📜 International Sales Contract</h1>
              <p className="text-sm text-slate-600 mt-1">
                Bilingual EN/RU · 15 clauses · ICAC Moscow arbitration
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={autofill}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95"
              >
                🔄 Autofill from Deal
              </button>
              <button
                onClick={handlePrint}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95"
              >
                🖨 Print / PDF
              </button>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Заполненность ключевых полей</span>
              <span className="font-bold">{filledFieldsCount}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                style={{ width: `${filledFieldsCount}%` }}
              />
            </div>
          </div>

          {/* Language toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-700">View mode:</span>
            {[
              { id: "en", label: "🇬🇧 English only" },
              { id: "ru", label: "🇷🇺 Russian only" },
              { id: "both", label: "🌐 Both (recommended)" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLanguage(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  language === opt.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <label className="ml-3 flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showGlossary}
                onChange={(e) => setShowGlossary(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-slate-700">📚 Show glossary</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={signed}
                onChange={(e) => setSigned(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-slate-700">✍️ Signed (remove DRAFT)</span>
            </label>
          </div>

          {/* Warnings */}
          <div className="border-t pt-3 space-y-2 text-xs">
            <div className="p-3 bg-rose-50 border-l-4 border-rose-400 rounded">
              <strong className="text-rose-800">🚨 КРИТИЧНО:</strong>{" "}
              <span className="text-rose-700">
                Этот шаблон — <strong>черновик</strong>. Обязательно покажи юристу-международнику перед подписанием!
                Стоимость проверки 5-10 тыс ₽ — окупится с первой сделки.
              </span>
            </div>
            <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
              <strong className="text-amber-800">💡 ПОДСКАЗКА:</strong>{" "}
              <span className="text-amber-700">
                Заполни <strong>профиль компании</strong> в `/captain/settings` (когда сделаем) — тогда autofill подтянет твои реквизиты автоматически. Сейчас введи их вручную.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* EDITOR PANEL (hidden in print) */}
      <div className="max-w-6xl mx-auto p-4 print:hidden">
        <details className="bg-white rounded-xl shadow-sm" open>
          <summary className="p-4 cursor-pointer font-bold text-slate-900 hover:bg-slate-50 rounded-t-xl">
            ✏️ Edit Contract Fields ({filledFieldsCount}% filled)
          </summary>
          <div className="p-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Contract */}
            <EditorSection title="📜 Contract">
              <Field label="Contract №" value={contractData.contractNumber} onChange={(v) => updateField("contractNumber", v)} />
              <Field label="Contract Date" type="date" value={contractData.contractDate} onChange={(v) => updateField("contractDate", v)} />
              <Field label="Expiry Date" type="date" value={contractData.contractExpiryDate} onChange={(v) => updateField("contractExpiryDate", v)} />
            </EditorSection>

            {/* Seller */}
            <EditorSection title="🏢 Seller">
              <Field label="Company Name" value={contractData.sellerName} onChange={(v) => updateField("sellerName", v)} />
              <Field label="Legal Address" value={contractData.sellerAddress} onChange={(v) => updateField("sellerAddress", v)} />
              <Field label="INN" value={contractData.sellerINN} onChange={(v) => updateField("sellerINN", v)} />
              <Field label="OGRN" value={contractData.sellerOGRN} onChange={(v) => updateField("sellerOGRN", v)} />
              <Field label="Director" value={contractData.sellerDirector} onChange={(v) => updateField("sellerDirector", v)} />
            </EditorSection>

            {/* Buyer */}
            <EditorSection title="🌍 Buyer">
              <Field label="Company Name" value={contractData.buyerName} onChange={(v) => updateField("buyerName", v)} />
              <Field label="Legal Address" value={contractData.buyerAddress} onChange={(v) => updateField("buyerAddress", v)} />
              <Field label="Tax ID / Trade License" value={contractData.buyerTaxId} onChange={(v) => updateField("buyerTaxId", v)} />
              <Field label="Representative" value={contractData.buyerDirector} onChange={(v) => updateField("buyerDirector", v)} />
            </EditorSection>

            {/* Product */}
            <EditorSection title="🌲 Product">
              <Field label="Description" value={contractData.productDescription} onChange={(v) => updateField("productDescription", v)} />
              <Field label="Moisture" value={contractData.moisture} onChange={(v) => updateField("moisture", v)} />
              <Field label="Dimensions (mm)" value={contractData.dimensions} onChange={(v) => updateField("dimensions", v)} />
              <Field label="Quantity (m³)" value={contractData.quantity} onChange={(v) => updateField("quantity", v)} />
              <Field label="Packaging" value={contractData.packaging} onChange={(v) => updateField("packaging", v)} />
              <Field label="HS Code" value={contractData.hsCode} onChange={(v) => updateField("hsCode", v)} />
            </EditorSection>

            {/* Pricing */}
            <EditorSection title="💰 Pricing & Delivery">
              <Field label="Unit Price (USD/m³)" value={contractData.unitPrice} onChange={(v) => updateField("unitPrice", v)} />
              <Field label="Total Amount (USD)" value={contractData.totalAmount} onChange={(v) => updateField("totalAmount", v)} />
              <Field label="Amount in Words" value={contractData.totalAmountWords} onChange={(v) => updateField("totalAmountWords", v)} />
              <Field label="Incoterm (CIF/FOB/EXW)" value={contractData.incoterm} onChange={(v) => updateField("incoterm", v)} />
              <Field label="Loading Port" value={contractData.loadingPort} onChange={(v) => updateField("loadingPort", v)} />
              <Field label="Destination Port" value={contractData.destinationPort} onChange={(v) => updateField("destinationPort", v)} />
              <Field label="Lead Time (days)" value={contractData.leadTime} onChange={(v) => updateField("leadTime", v)} />
              <Field label="Transit Days" value={contractData.transitDays} onChange={(v) => updateField("transitDays", v)} />
            </EditorSection>

            {/* Bank */}
            <EditorSection title="🏦 Seller Bank">
              <Field label="Bank Name" value={contractData.sellerBank} onChange={(v) => updateField("sellerBank", v)} />
              <Field label="SWIFT Code" value={contractData.sellerSwift} onChange={(v) => updateField("sellerSwift", v)} />
              <Field label="Account (USD)" value={contractData.sellerAccount} onChange={(v) => updateField("sellerAccount", v)} />
              <Field label="Correspondent Bank" value={contractData.sellerCorrespondent} onChange={(v) => updateField("sellerCorrespondent", v)} />
            </EditorSection>
          </div>
        </details>
      </div>

      {/* ========== THE CONTRACT (PRINTABLE) ========== */}
      <div className="max-w-6xl mx-auto p-4 pb-12">
        <div className="contract-page bg-white shadow-2xl rounded-xl p-8 sm:p-12 relative overflow-hidden">
          {/* DRAFT watermark */}
          {!signed && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-10">
              <div className="text-[120px] sm:text-[200px] font-black text-rose-600 transform -rotate-45 select-none">
                DRAFT
              </div>
            </div>
          )}

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8 border-b-4 border-orange-500 pb-6">
              <div className="text-xs tracking-widest text-slate-500 font-bold mb-2">
                INTERNATIONAL COMMERCIAL CONTRACT · МЕЖДУНАРОДНЫЙ КОММЕРЧЕСКИЙ КОНТРАКТ
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                CONTRACT FOR INTERNATIONAL SALE OF GOODS
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mt-2">
                КОНТРАКТ МЕЖДУНАРОДНОЙ КУПЛИ-ПРОДАЖИ ТОВАРОВ
              </h2>
              <div className="mt-4 inline-block bg-slate-900 text-white px-4 py-2 rounded font-bold">
                № {contractData.contractNumber}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Date / Дата: <strong>{contractData.contractDate}</strong>
              </div>
            </div>

            {/* 15 Clauses */}
            <div className="space-y-6">
              {CONTRACT_CLAUSES.map((clause) => {
                const bodyEn = typeof clause.body_en === "function" ? clause.body_en(contractData) : clause.body_en;
                const bodyRu = typeof clause.body_ru === "function" ? clause.body_ru(contractData) : clause.body_ru;

                return (
                  <div
                    key={clause.id}
                    className={`clause-row ${clause.critical ? "border-l-4 border-rose-400 bg-rose-50/30 pl-4 py-2 rounded-r" : ""}`}
                  >
                    {/* Heading row */}
                    <div className={`grid ${language === "both" ? "grid-cols-1 md:grid-cols-2 gap-4" : "grid-cols-1"} mb-2`}>
                      {(language === "en" || language === "both") && (
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                          {clause.title_en}
                          {clause.critical && (
                            <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold print:hidden">
                              CRITICAL
                            </span>
                          )}
                          {clause.tooltipKey && (
                            <span className="print:hidden">
                              <Tooltip term={clause.tooltipKey}>
                                <span className="text-xs">ⓘ</span>
                              </Tooltip>
                            </span>
                          )}
                        </h3>
                      )}
                      {(language === "ru" || language === "both") && (
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
                          {clause.title_ru}
                        </h3>
                      )}
                    </div>

                    {/* Body row */}
                    <div className={`grid ${language === "both" ? "grid-cols-1 md:grid-cols-2 gap-4" : "grid-cols-1"}`}>
                      {(language === "en" || language === "both") && (
                        <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                          {bodyEn}
                        </div>
                      )}
                      {(language === "ru" || language === "both") && (
                        <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed border-l-2 border-slate-100 md:pl-4">
                          {bodyRu}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glossary footer */}
            {showGlossary && <GlossaryFooter />}

            {/* Final footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-200 text-center text-xs text-slate-500">
              <div>
                Generated by RU-TIMBER Captain Mode · Contract Engine v1.0
              </div>
              <div className="mt-1 italic">
                ⚠️ This is a template. Please consult with a qualified international lawyer before signing.
                Данный документ является шаблоном. Перед подписанием проконсультируйтесь с квалифицированным юристом-международником.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA footer (hidden in print) */}
      <div className="max-w-6xl mx-auto p-4 pb-12 print:hidden">
        <div className="bg-slate-900 text-white rounded-xl p-6 text-center">
          <h3 className="text-lg font-black mb-2">📋 Что дальше?</h3>
          <ol className="text-sm text-slate-300 text-left max-w-xl mx-auto space-y-2 mb-4">
            <li><strong className="text-orange-400">1.</strong> Заполни все поля (или жми «Autofill from Deal»)</li>
            <li><strong className="text-orange-400">2.</strong> Покажи юристу — пусть проверит Force Majeure, ICAC Moscow, Payment terms</li>
            <li><strong className="text-orange-400">3.</strong> Распечатай в PDF (кнопка «🖨 Print») и отправь покупателю на согласование</li>
            <li><strong className="text-orange-400">4.</strong> После согласования — отметь «Signed» и распечатай финальную версию</li>
            <li><strong className="text-orange-400">5.</strong> Подписать в 2 оригиналах, обменяться по DHL</li>
          </ol>
          <Link
            href="/checklist"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold active:scale-95"
          >
            ✅ Проверить Checklist
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============ COMPONENTS ============

function EditorSection({ title, children }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs text-slate-600 mb-0.5">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </div>
  );
}

// END OF FILE