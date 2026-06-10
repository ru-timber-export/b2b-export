"use client";
import { SignatureWithStamp } from "../../components/CompanyStamp";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useDeal, PAYMENT_SCHEMAS, getPaymentSchema } from "../../context/DealContext";
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
  const [language, setLanguage] = useState("both");
  const [showGlossary, setShowGlossary] = useState(true);
  const [signed, setSigned] = useState(false);

  // 📝 Все редактируемые поля контракта
  const [contractData, setContractData] = useState({
    contractNumber: `RU-TIMBER-${new Date().getFullYear()}-001`,
    contractDate: new Date().toISOString().split("T")[0],
    contractExpiryDate: defaultExpiryDate(),

    sellerName: "",
    sellerAddress: "",
    sellerINN: "",
    sellerOGRN: "",
    sellerDirector: "",
    sellerBank: "",
    sellerSwift: "",
    sellerAccount: "",
    sellerCorrespondent: "",

    buyerName: "[BUYER COMPANY NAME LLC]",
    buyerAddress: "[Buyer's registered address]",
    buyerTaxId: "",
    buyerDirector: "",

    productDescription: "Sawn timber, pine (Pinus sylvestris)",
    moisture: "KD 10-12%",
    dimensions: "50x150x6000",
    quantity: "62",
    packaging: "Strapped bundles, anti-stain treated, polypropylene wrapped",
    hsCode: "4407.11",

    unitPrice: "543",
    totalAmount: "33666",
    totalAmountWords: "Thirty-three thousand six hundred sixty-six US Dollars",
    incoterm: "CIF",
    loadingPort: "Novorossiysk",
    destinationPort: "Jebel Ali, UAE",
    leadTime: "45",
    transitDays: "30",
    
    // 🆕 СХЕМА ОПЛАТЫ (дефолт: 100% предоплата)
    paymentSchemaId: "prepay100",
  });

  // 🔄 Автозаполнение из текущей сделки
  const autofill = () => {
    if (!deal || !seller) return;

    const totalAmount = deal.pricingTotalUSD || deal.pricingPerM3 * deal.volumeTotal || 0;
    
    setContractData((prev) => ({
      ...prev,
      sellerName: seller.companyName || prev.sellerName,
      sellerAddress: seller.legalAddress || prev.sellerAddress,
      sellerINN: seller.inn || prev.sellerINN,
      sellerOGRN: seller.ogrn || prev.sellerOGRN,
      sellerDirector: seller.director || prev.sellerDirector,
      sellerBank: seller.bankName || prev.sellerBank,
      sellerSwift: seller.bankSwift || prev.sellerSwift,
      sellerAccount: seller.bankAccountUSD || prev.sellerAccount,
      sellerCorrespondent: seller.correspondentBank || prev.sellerCorrespondent,

      productDescription: deal.species ? `Sawn timber, ${deal.species}` : prev.productDescription,
      moisture: deal.drying || prev.moisture,
      dimensions: deal.dimensions || prev.dimensions,
      quantity: deal.volumeTotal?.toFixed(2) || prev.quantity,
      packaging: deal.packaging || prev.packaging,

      unitPrice: deal.pricingPerM3?.toFixed(0) || prev.unitPrice,
      totalAmount: totalAmount.toFixed(0) || prev.totalAmount,
      totalAmountWords: amountToWords(totalAmount),
      incoterm: deal.freightPreset?.includes("CIF") ? "CIF" : (deal.freightPreset?.includes("FOB") ? "FOB" : prev.incoterm),

      loadingPort: deal.loadingPort || prev.loadingPort,
      destinationPort: deal.destinationPort || prev.destinationPort,
      
      // 🆕 Подтягиваем схему оплаты из deal
      paymentSchemaId: deal.paymentSchema || prev.paymentSchemaId,
    }));
  };

  const updateField = (key, value) => {
    setContractData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "totalAmount") {
        updated.totalAmountWords = amountToWords(parseFloat(value) || 0);
      }
      return updated;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // 🆕 Текущая схема оплаты
  const currentSchema = getPaymentSchema(contractData.paymentSchemaId);

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
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .contract-page { box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; }
          .clause-row { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

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

      {/* CONTROLS PANEL */}
      <div className="max-w-6xl mx-auto p-4 print:hidden">
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900">📜 International Sales Contract</h1>
              <p className="text-sm text-slate-600 mt-1">
                Bilingual EN/RU · 15 clauses · ICAC Moscow arbitration
              </p>
              {/* 🆕 Текущая схема оплаты — бейдж */}
              <p className="text-xs text-slate-500 mt-2">
                💳 Current payment: <strong className="text-purple-600">{currentSchema.icon} {currentSchema.nameRu}</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={autofill}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95">
                🔄 Autofill from Deal
              </button>
              <button onClick={handlePrint}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 active:scale-95">
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
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                style={{ width: `${filledFieldsCount}%` }} />
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
              <button key={opt.id} onClick={() => setLanguage(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  language === opt.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {opt.label}
              </button>
            ))}
            <label className="ml-3 flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={showGlossary}
                onChange={(e) => setShowGlossary(e.target.checked)} className="w-4 h-4" />
              <span className="text-slate-700">📚 Show glossary</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={signed}
                onChange={(e) => setSigned(e.target.checked)} className="w-4 h-4" />
              <span className="text-slate-700">✍️ Signed (remove DRAFT)</span>
            </label>
          </div>

          {/* Warnings */}
          <div className="border-t pt-3 space-y-2 text-xs">
            <div className="p-3 bg-rose-50 border-l-4 border-rose-400 rounded">
              <strong className="text-rose-800">🚨 КРИТИЧНО:</strong>{" "}
              <span className="text-rose-700">
                Этот шаблон — <strong>черновик</strong>. Покажи юристу-международнику перед подписанием!
              </span>
            </div>
            <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
              <strong className="text-amber-800">💡 ПОДСКАЗКА:</strong>{" "}
              <span className="text-amber-700">
                Заполни <strong>профиль компании</strong> в `/captain/settings` — autofill подтянет реквизиты.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 🆕 ━━━━━━ PAYMENT SCHEMA SELECTOR ━━━━ */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="max-w-6xl mx-auto p-4 print:hidden">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-5 shadow-sm">
          <h2 className="font-black text-slate-900 flex items-center mb-1 text-lg">
            💳 Payment Schema (Clause 6)
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            🎯 Выбери схему оплаты — текст пункта 6 автоматически обновится в контракте.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {Object.values(PAYMENT_SCHEMAS).map(schema => {
              const isActive = contractData.paymentSchemaId === schema.id;
              const colorMap = {
                emerald: { bg: "bg-emerald-500", border: "border-emerald-600" },
                blue: { bg: "bg-blue-500", border: "border-blue-600" },
                amber: { bg: "bg-amber-500", border: "border-amber-600" },
                purple: { bg: "bg-purple-500", border: "border-purple-600" },
              };
              const colors = colorMap[schema.color] || colorMap.amber;
              
              return (
                <button key={schema.id}
                  onClick={() => updateField("paymentSchemaId", schema.id)}
                  className={`text-left p-4 rounded-lg transition-all active:scale-[0.98] border-2 ${
                    isActive 
                      ? `${colors.bg} text-white ${colors.border} shadow-lg` 
                      : "bg-white text-slate-700 border-transparent hover:border-purple-300"
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{schema.icon}</span>
                      <span className="font-black">{schema.nameRu}</span>
                    </div>
                    <div className="text-right text-xs">
                      <div className={isActive ? "opacity-90" : "opacity-60"}>
                        Risk: {schema.risk === "zero" ? "🟢" : schema.risk === "low" ? "🟡" : "🔴"}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs mt-1 ${isActive ? "opacity-90" : "opacity-75"}`}>
                    {schema.descriptionRu}
                  </div>
                  <div className={`text-[10px] mt-2 italic ${isActive ? "opacity-80" : "opacity-60"}`}>
                    💡 Для: {schema.recommendedRu}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Текущая выбранная — preview */}
          <div className="bg-white rounded-lg p-3 border border-purple-300">
            <div className="text-xs uppercase tracking-wider font-bold text-purple-700 mb-1">
              📄 SELECTED FOR CONTRACT
            </div>
            <div className="font-black text-slate-900 mb-2">
              {currentSchema.icon} {currentSchema.nameRu}
            </div>
            <div className="text-xs text-slate-600 italic">
              {currentSchema.contractTextRu}
            </div>
          </div>
        </div>
      </div>

      {/* EDITOR PANEL */}
      <div className="max-w-6xl mx-auto p-4 print:hidden">
        <details className="bg-white rounded-xl shadow-sm" open>
          <summary className="p-4 cursor-pointer font-bold text-slate-900 hover:bg-slate-50 rounded-t-xl">
            ✏️ Edit Contract Fields ({filledFieldsCount}% filled)
          </summary>
          <div className="p-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <EditorSection title="📜 Contract">
              <Field label="Contract №" value={contractData.contractNumber} onChange={(v) => updateField("contractNumber", v)} />
              <Field label="Contract Date" type="date" value={contractData.contractDate} onChange={(v) => updateField("contractDate", v)} />
              <Field label="Expiry Date" type="date" value={contractData.contractExpiryDate} onChange={(v) => updateField("contractExpiryDate", v)} />
            </EditorSection>

            <EditorSection title="🏢 Seller">
              <Field label="Company Name" value={contractData.sellerName} onChange={(v) => updateField("sellerName", v)} />
              <Field label="Legal Address" value={contractData.sellerAddress} onChange={(v) => updateField("sellerAddress", v)} />
              <Field label="INN" value={contractData.sellerINN} onChange={(v) => updateField("sellerINN", v)} />
              <Field label="OGRN" value={contractData.sellerOGRN} onChange={(v) => updateField("sellerOGRN", v)} />
              <Field label="Director" value={contractData.sellerDirector} onChange={(v) => updateField("sellerDirector", v)} />
            </EditorSection>

            <EditorSection title="🌍 Buyer">
              <Field label="Company Name" value={contractData.buyerName} onChange={(v) => updateField("buyerName", v)} />
              <Field label="Legal Address" value={contractData.buyerAddress} onChange={(v) => updateField("buyerAddress", v)} />
              <Field label="Tax ID / Trade License" value={contractData.buyerTaxId} onChange={(v) => updateField("buyerTaxId", v)} />
              <Field label="Representative" value={contractData.buyerDirector} onChange={(v) => updateField("buyerDirector", v)} />
            </EditorSection>

            <EditorSection title="🌲 Product">
              <Field label="Description" value={contractData.productDescription} onChange={(v) => updateField("productDescription", v)} />
              <Field label="Moisture" value={contractData.moisture} onChange={(v) => updateField("moisture", v)} />
              <Field label="Dimensions (mm)" value={contractData.dimensions} onChange={(v) => updateField("dimensions", v)} />
              <Field label="Quantity (m³)" value={contractData.quantity} onChange={(v) => updateField("quantity", v)} />
              <Field label="Packaging" value={contractData.packaging} onChange={(v) => updateField("packaging", v)} />
              <Field label="HS Code" value={contractData.hsCode} onChange={(v) => updateField("hsCode", v)} />
            </EditorSection>

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

            <EditorSection title="🏦 Seller Bank">
              <Field label="Bank Name" value={contractData.sellerBank} onChange={(v) => updateField("sellerBank", v)} />
              <Field label="SWIFT Code" value={contractData.sellerSwift} onChange={(v) => updateField("sellerSwift", v)} />
              <Field label="Account (USD)" value={contractData.sellerAccount} onChange={(v) => updateField("sellerAccount", v)} />
              <Field label="Correspondent Bank" value={contractData.sellerCorrespondent} onChange={(v) => updateField("sellerCorrespondent", v)} />
            </EditorSection>
          </div>
        </details>
      </div>

      {/* ========== THE CONTRACT ========== */}
      <div className="max-w-6xl mx-auto p-4 pb-12">
        <div className="contract-page bg-white shadow-2xl rounded-xl p-8 sm:p-12 relative overflow-hidden">
          {!signed && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-10">
              <div className="text-[120px] sm:text-[200px] font-black text-rose-600 transform -rotate-45 select-none">
                DRAFT
              </div>
            </div>
          )}

          <div className="relative z-10">
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
              {/* 🆕 Payment schema badge */}
              <div className="mt-3 inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                💳 {currentSchema.icon} {currentSchema.name}
              </div>
            </div>

            {/* 15 Clauses */}
            <div className="space-y-6">
              {CONTRACT_CLAUSES.map((clause) => {
                const bodyEn = typeof clause.body_en === "function" ? clause.body_en(contractData) : clause.body_en;
                const bodyRu = typeof clause.body_ru === "function" ? clause.body_ru(contractData) : clause.body_ru;

                return (
                  <div key={clause.id}
                    className={`clause-row ${clause.critical ? "border-l-4 border-rose-400 bg-rose-50/30 pl-4 py-2 rounded-r" : ""}`}>
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

            {/* СЕКЦИЯ ПОДПИСЕЙ И ПЕЧАТЕЙ */}
            <div className="mt-12 pt-8 border-t-2 border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                  Seller / Продавец
                </div>
                <SignatureWithStamp
                  name={contractData.sellerDirector}
                  role={contractData.sellerName}
                  companyName="RU-TIMBER EXPORT"
                  inn={contractData.sellerINN || "1234567890"}
                  ogrn={contractData.sellerOGRN || "1234567890123"}
                  city="MOSCOW"
                />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                  Buyer / Покупатель
                </div>
                <div className="border-b-2 border-slate-700 w-64 mb-2 h-12"></div>
                <div className="text-xs font-bold">{contractData.buyerDirector}</div>
                <div className="text-xs text-slate-600">{contractData.buyerName}</div>
                <div className="text-xs text-slate-400 italic mt-2">
                  Buyer's seal & signature
                </div>
              </div>
            </div>

            {showGlossary && <GlossaryFooter />}

            <div className="mt-12 pt-6 border-t-2 border-slate-200 text-center text-xs text-slate-500">
              <div>Generated by RU-TIMBER Captain Mode · Contract Engine v1.0</div>
              <div className="mt-1 italic">
                ⚠️ This is a template. Please consult with a qualified international lawyer before signing.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-12 print:hidden">
        <div className="bg-slate-900 text-white rounded-xl p-6 text-center">
          <h3 className="text-lg font-black mb-2">📋 Что дальше?</h3>
          <ol className="text-sm text-slate-300 text-left max-w-xl mx-auto space-y-2 mb-4">
            <li><strong className="text-orange-400">1.</strong> Выбери схему оплаты (по умолчанию 100% prepay) ✅</li>
            <li><strong className="text-orange-400">2.</strong> Заполни все поля или жми «Autofill from Deal»</li>
            <li><strong className="text-orange-400">3.</strong> Покажи юристу — пусть проверит</li>
            <li><strong className="text-orange-400">4.</strong> Распечатай в PDF и отправь покупателю</li>
            <li><strong className="text-orange-400">5.</strong> После согласования — Signed + финальная печать</li>
          </ol>
          <Link href="/checklist"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold active:scale-95">
            ✅ Проверить Checklist
          </Link>
        </div>
      </div>
    </div>
  );
}

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