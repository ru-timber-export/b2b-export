"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useDeal,
  SPECIES_BASE_PRICES,
  DRYING_SURCHARGE,
  PACKAGING_SURCHARGE,
  FREIGHT_PRESETS,
} from "../../context/DealContext";

// 💼 Демо-реквизиты компании (потом поменяете на реальные)
const DEFAULT_COMPANY = {
  name: "RU-TIMBER EXPORT LLC",
  address: "123 Lesnaya str., Bratsk, Irkutsk region, 665717, Russia",
  phone: "+7 915 349 00 07",
  email: "director@ru-timber.com",
  website: "ru-timber.com",
  inn: "3804XXXXXX",
  ogrn: "1XXXXXXXXXXXX",
  bank: "JSC ALPHA-BANK",
  swift: "ALFARUMM",
  account: "40702840XXXXXXXXXXXX",
  correspondent: "Correspondent bank on request",
};

// 📝 Описание товара для клиента (умная подстановка)
const SPECIES_DESCRIPTION = {
  pine: "Russian Pine (Pinus Sylvestris)",
  spruce: "Russian Spruce (Picea Abies)",
  "pine-spruce-50-50": "Russian Softwood (Pine/Spruce mix)",
  "pine-spruce-70-30": "Russian Pine-Dominant Softwood (Pine 70% / Spruce 30%)",
  spf: "Russian Whitewood (Spruce/Fir — SPF)",
  larch: "Siberian Larch (Larix Sibirica) — Premium",
  cedar: "Siberian Cedar (Pinus Sibirica)",
  birch: "Russian Birch (Betula Pendula)",
  oak: "Russian Oak (Quercus Robur)",
  aspen: "Russian Aspen (Populus Tremula)",
};

const HS_CODES = {
  pine: "4407.11",
  spruce: "4407.12",
  larch: "4407.19",
  cedar: "4407.19",
  birch: "4407.96",
  oak: "4407.91",
  aspen: "4407.97",
  "pine-spruce-50-50": "4407.11",
  "pine-spruce-70-30": "4407.11",
  spf: "4407.12",
};

const MOISTURE_DESC = {
  kd: "Kiln Dried (KD) 10-12%",
  ad: "Air Dried (AD) 18-22%",
  fresh: "Fresh Sawn 22-30%",
};

const PACKAGING_DESC = {
  none: "Loose (bulk)",
  crate: "Crated (wooden pallets + strapping)",
  shrink: "Shrink-wrapped + crated",
};

// Порт отгрузки по направлению
const ROUTE_PORTS = {
  "vlv-chennai": { from: "Vladivostok, Russia", to: "Chennai, India" },
  "vlv-shanghai": { from: "Vladivostok, Russia", to: "Shanghai, China" },
  "nvr-mumbai": { from: "Novorossiysk, Russia", to: "Mumbai, India" },
  "nvr-dubai": { from: "Novorossiysk, Russia", to: "Jebel Ali, UAE" },
  "nvr-alexandria": { from: "Novorossiysk, Russia", to: "Alexandria, Egypt" },
  "nvr-istanbul": { from: "Novorossiysk, Russia", to: "Istanbul, Turkey" },
};

export default function QuotationPage() {
  const { deal, isLoaded } = useDeal();
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [editMode, setEditMode] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerCountry, setCustomerCountry] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");

  // 📅 Даты
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(today.getDate() + 7);

  const formatDate = (d) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  // 🔢 Auto quote number
  useEffect(() => {
    if (typeof window === "undefined") return;
    const counterKey = "ru-timber-quote-counter";
    const saved = localStorage.getItem(counterKey);
    const num = saved ? parseInt(saved) + 1 : 1;
    localStorage.setItem(counterKey, num.toString());
    const year = today.getFullYear();
    setQuoteNumber(`RT-${year}-${String(num).padStart(4, "0")}`);

    // Загрузка сохранённых реквизитов
    const savedCompany = localStorage.getItem("ru-timber-company-details");
    if (savedCompany) {
      try {
        setCompany(JSON.parse(savedCompany));
      } catch (e) {
        console.error("Company load error:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 💾 Сохранение реквизитов
  const saveCompany = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ru-timber-company-details", JSON.stringify(company));
    }
    setEditMode(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🧮 Расчёт цены (копия логики из Pricing)
  const species = deal.species || "pine-spruce-50-50";
  const moisture = deal.moisture || "kd";
  const packaging = deal.packaging || "crate";
  const incoterm = deal.incoterm || "cif";
  const totalVol = deal.totalVolume === "" ? 0 : parseFloat(deal.totalVolume) || 50;
  const margin = deal.margin === "" ? 0 : parseFloat(deal.margin) || 18;
  const freightPreset = FREIGHT_PRESETS[deal.freightRoute] || FREIGHT_PRESETS["vlv-chennai"];

  const speciesBase = SPECIES_BASE_PRICES[species] || 160;
  const dryingAdd = DRYING_SURCHARGE[moisture] || 0;
  const packAdd = PACKAGING_SURCHARGE[packaging] || 0;
  const millPrice = speciesBase + dryingAdd + packAdd;

  const loadFactory = 6;
  const landTransport = totalVol > 0 ? 1500 / totalVol : 0;
  const portFees = totalVol > 0 ? 400 / totalVol : 0;
  const ocean = totalVol > 0 ? freightPreset.rate / totalVol : 0;
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
  const totalAmount = sellPricePerM3 * totalVol;

  const thickness = deal.thickness || 44;
  const width = deal.width || 150;
  const length = deal.length || 5980;

  const ports = ROUTE_PORTS[deal.freightRoute] || ROUTE_PORTS["vlv-chennai"];
  const speciesDesc = SPECIES_DESCRIPTION[species] || "Russian Softwood Timber";
  const hsCode = HS_CODES[species] || "4407.11";
  const incotermLabel = {
    exw: "EXW Bratsk Sawmill",
    "fca-factory": "FCA Bratsk Sawmill",
    "fca-port": `FCA ${ports.from.split(",")[0]}`,
    fob: `FOB ${ports.from.split(",")[0]}`,
    cif: `CIF ${ports.to}`,
  }[incoterm];

  return (
    <>
      {/* 🖨 Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print-page {
            padding: 20mm !important;
            max-width: 100% !important;
            box-shadow: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      <main className="min-h-screen bg-slate-100 pb-20">
        {/* Header (hidden in print) */}
        <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40 print:hidden">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-sm active:scale-95">← Home</Link>
            <div className="text-xs font-mono">STEP 4B · QUOTATION</div>
            <div className="flex gap-2 text-xs">
              <Link href="/calculator" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📐 Volume</Link>
              <Link href="/calculator/pricing" className="bg-slate-700 px-2 py-1 rounded active:scale-95">💰 Pricing</Link>
            </div>
          </div>
        </header>

        {/* Controls (hidden in print) */}
        <div className="max-w-4xl mx-auto p-4 print:hidden">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h1 className="text-2xl font-black text-slate-900">📄 Commercial Quotation</h1>
            <p className="text-sm text-slate-500 mt-1">Auto-synced from Calculator · Ready for PDF export</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs text-slate-500">Customer Name / Company</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ABC Traders Pvt. Ltd."
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Customer Country / City</label>
                <input
                  type="text"
                  value={customerCountry}
                  onChange={(e) => setCustomerCountry(e.target.value)}
                  placeholder="Chennai, India"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => window.print()}
                className="bg-orange-500 text-white px-5 py-3 rounded-lg font-bold active:scale-95"
              >
                🖨 Export to PDF / Print
              </button>
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-slate-200 text-slate-700 px-5 py-3 rounded-lg font-bold active:scale-95"
              >
                ✏ {editMode ? "Cancel Edit" : "Edit Company Details"}
              </button>
            </div>

            {/* Edit Company Form */}
            {editMode && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-bold text-sm text-slate-800 mb-3">🏢 Edit Company Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(company).map(([key, val]) => (
                    <div key={key}>
                      <label className="text-xs text-slate-500 capitalize">{key}</label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setCompany({ ...company, [key]: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={saveCompany}
                  className="mt-3 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95"
                >
                  💾 Save Company Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 📄 PDF Document */}
        <div className="max-w-4xl mx-auto p-4">
          <div className="print-page bg-white shadow-lg p-8 sm:p-12 relative overflow-hidden">
            {/* 🔶 Watermark DRAFT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div
                className="text-rose-200 font-black"
                style={{
                  fontSize: "120px",
                  transform: "rotate(-30deg)",
                  opacity: 0.25,
                  letterSpacing: "10px",
                }}
              >
                DRAFT
              </div>
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="border-b-4 border-orange-500 pb-4 flex justify-between items-start">
                <div>
                  <div className="text-3xl font-black text-slate-900">RU-TIMBER</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Russian Sawn Timber · Export Worldwide</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">QUOTATION №</div>
                  <div className="text-xl font-black text-slate-900 font-mono">{quoteNumber}</div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-center text-3xl font-black text-slate-900 mt-6 tracking-wider">
                COMMERCIAL QUOTATION
              </h1>
              <div className="text-center text-xs text-rose-600 font-bold mt-1">
                ⚠ DRAFT / VALID FOR DEMO ONLY
              </div>

              {/* Dates + Parties */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Seller</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{company.name}</div>
                  <div className="text-xs text-slate-600 mt-1">{company.address}</div>
                  <div className="text-xs text-slate-600 mt-1">Tel: {company.phone}</div>
                  <div className="text-xs text-slate-600">Email: {company.email}</div>
                  <div className="text-xs text-slate-600">Web: {company.website}</div>
                  <div className="text-xs text-slate-500 mt-1">INN: {company.inn}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Buyer</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {customerName || "[Customer Name]"}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {customerCountry || "[Customer Location]"}
                  </div>
                  <div className="mt-4 text-xs text-slate-500 uppercase font-bold">Dates</div>
                  <div className="text-xs text-slate-600 mt-1">
                    <span className="font-bold">Date:</span> {formatDate(today)}
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-bold">Valid Until:</span> {formatDate(validUntil)}
                  </div>
                </div>
              </div>

              {/* Product Table */}
              <div className="mt-8">
                <div className="text-xs text-slate-500 uppercase font-bold mb-2">Product Specification</div>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-3 text-left text-xs">№</th>
                      <th className="p-3 text-left text-xs">Description</th>
                      <th className="p-3 text-center text-xs">Dimensions (mm)</th>
                      <th className="p-3 text-center text-xs">Qty (m³)</th>
                      <th className="p-3 text-right text-xs">Unit Price ($)</th>
                      <th className="p-3 text-right text-xs">Total ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-3 align-top">1</td>
                      <td className="p-3 align-top">
                        <div className="font-bold">{speciesDesc}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          {MOISTURE_DESC[moisture]} · GOST 8486-86 · Grade 1-3
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Packaging: {PACKAGING_DESC[packaging]}
                        </div>
                        <div className="text-xs text-slate-500">
                          HS Code: {hsCode} {dutyFree && "· Duty-Free (KD/4409)"}
                        </div>
                        {deal.profileProcessing && (
                          <div className="text-xs text-emerald-600">✓ Profiled (4409)</div>
                        )}
                      </td>
                      <td className="p-3 text-center align-top font-mono">
                        {thickness} × {width} × {length}
                      </td>
                      <td className="p-3 text-center align-top font-mono font-bold">
                        {totalVol.toFixed(2)}
                      </td>
                      <td className="p-3 text-right align-top font-mono font-bold">
                        ${sellPricePerM3.toFixed(2)}
                      </td>
                      <td className="p-3 text-right align-top font-mono font-bold">
                        ${totalAmount.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={5} className="p-3 text-right">
                        TOTAL AMOUNT ({incoterm.toUpperCase()}):
                      </td>
                      <td className="p-3 text-right font-mono text-lg text-orange-600">
                        ${totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terms & Conditions */}
              <div className="mt-8">
                <div className="text-xs text-slate-500 uppercase font-bold mb-3">Terms &amp; Conditions</div>
                <div className="text-xs space-y-2 text-slate-700">
                  <div>
                    <span className="font-bold">1. Delivery Basis:</span> {incotermLabel} (Incoterms 2020)
                  </div>
                  <div>
                    <span className="font-bold">2. Loading Port:</span> {ports.from}
                  </div>
                  <div>
                    <span className="font-bold">3. Destination Port:</span> {ports.to}
                  </div>
                  <div>
                    <span className="font-bold">4. Container Type:</span> 40&apos; High Cube (40HC)
                  </div>
                  <div>
                    <span className="font-bold">5. Payment Terms:</span> 30% advance payment by T/T before production,
                    70% against scan copy of Bill of Lading (B/L).
                  </div>
                  <div>
                    <span className="font-bold">6. Lead Time:</span> 20-30 days from receipt of advance payment.
                  </div>
                  <div>
                    <span className="font-bold">7. Packaging:</span> {PACKAGING_DESC[packaging]}, suitable for ocean transit.
                  </div>
                  <div>
                    <span className="font-bold">8. Documents Provided:</span> Commercial Invoice, Packing List,
                    Bill of Lading, Certificate of Origin (Form A/CT-1), Phytosanitary Certificate, Fumigation Certificate (IPPC/ISPM-15).
                  </div>
                  <div>
                    <span className="font-bold">9. Quality:</span> As per GOST 8486-86 standard. Pre-shipment photos provided.
                  </div>
                  <div>
                    <span className="font-bold">10. Validity:</span> This quotation is valid for 7 (seven) days from the date of issue.
                  </div>
                </div>
              </div>

              {/* Banking Details */}
              <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500 uppercase font-bold mb-2">Banking Details (for 30% advance)</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">Beneficiary:</div>
                    <div className="font-bold">{company.name}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Bank:</div>
                    <div className="font-bold">{company.bank}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">SWIFT:</div>
                    <div className="font-mono font-bold">{company.swift}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Account:</div>
                    <div className="font-mono font-bold">{company.account}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-slate-500">Correspondent:</div>
                    <div className="font-bold">{company.correspondent}</div>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <div className="border-t-2 border-slate-400 pt-2">
                    <div className="text-xs text-slate-500">Authorized Signature (Seller)</div>
                    <div className="text-sm font-bold mt-1">{company.name}</div>
                    <div className="text-xs text-rose-600 mt-3 font-bold">
                      [DRAFT — signature &amp; stamp not affixed]
                    </div>
                  </div>
                </div>
                <div>
                  <div className="border-t-2 border-slate-400 pt-2">
                    <div className="text-xs text-slate-500">Accepted by Buyer</div>
                    <div className="text-xs text-slate-400 mt-1">Name, Position, Date</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                {company.name} · {company.website} · {company.phone} · {company.email}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom nav (hidden in print) */}
        <div className="max-w-4xl mx-auto p-4 print:hidden">
          <div className="flex gap-2">
            <Link
              href="/calculator/pricing"
              className="flex-1 bg-slate-200 text-slate-700 text-center py-3 rounded-lg font-bold active:scale-95"
            >
              ← Back to Pricing
            </Link>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-orange-500 text-white text-center py-3 rounded-lg font-bold active:scale-95"
            >
              🖨 Export PDF
            </button>
          </div>
        </div>
      </main>
    </>
  );
}