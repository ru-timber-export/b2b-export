"use client";

import { useState, useRef } from "react";
import { 
  DEFAULT_SPECIES_PRICES, 
  MOISTURE_MULTIPLIERS,
  SAWMILL_REGIONS,
  useDeal,
} from "../context/DealContext";

const SPECIES_INFO = {
  pine: { name: "Pine", ru: "Сосна", emoji: "🌲", category: "softwood" },
  spruce: { name: "Spruce", ru: "Ель", emoji: "🌲", category: "softwood" },
  larch: { name: "Larch", ru: "Лиственница", emoji: "🌲", category: "softwood" },
  cedar: { name: "Cedar", ru: "Кедр", emoji: "🌲", category: "softwood" },
  spf: { name: "SPF / Whitewood", ru: "Ель+Пихта", emoji: "🌲", category: "softwood" },
  birch: { name: "Birch", ru: "Берёза", emoji: "🌳", category: "hardwood" },
  oak: { name: "Oak", ru: "Дуб", emoji: "🌳", category: "hardwood" },
  aspen: { name: "Aspen", ru: "Осина", emoji: "🌳", category: "hardwood" },
  "pine-spruce-50-50": { name: "Pine+Spruce 50/50", ru: "Сосна+Ель 50/50", emoji: "🌲🌲", category: "mix" },
  "pine-spruce-70-30": { name: "Pine+Spruce 70/30", ru: "Сосна+Ель 70/30", emoji: "🌲🌲", category: "mix" },
};

function daysSince(isoDate) {
  if (!isoDate) return null;
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(isoDate) {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });
}

// Мини-график истории цен (SVG)
function PriceMiniChart({ history, currentPrice }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-[10px] text-slate-400 italic">No history yet</div>
    );
  }
  
  const points = [...history].slice(0, 10).reverse().map(h => h.newPrice);
  points.push(currentPrice);
  
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  
  const width = 80;
  const height = 24;
  const stepX = points.length > 1 ? width / (points.length - 1) : 0;
  
  const pathPoints = points.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  
  const lastTrend = points.length >= 2 ? points[points.length - 1] - points[points.length - 2] : 0;
  const color = lastTrend > 0 ? "#ef4444" : lastTrend < 0 ? "#10b981" : "#64748b";
  
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={pathPoints} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={width} cy={height - ((points[points.length-1] - min) / range) * height} r="2" fill={color} />
    </svg>
  );
}

export default function PriceEditor({ isOpen, onClose, usdRubRate }) {
  const {
    customSpeciesPrices,
    pricesLastUpdated,
    priceHistory,
    getSpeciesPrice,
    updateSpeciesPrice,
    resetSpeciesPrices,
    resetSpeciesPrice,
    adjustAllPrices,
    importPricesFromCSV,
    suppliers,
    addSupplier,
    removeSupplier,
  } = useDeal();

  const [activeTab, setActiveTab] = useState("prices"); // prices, history, suppliers, regions, import
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", region: "karelia", contact: "", notes: "" });
  const [csvText, setCsvText] = useState("");
  const [csvResult, setCsvResult] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const lastUpdatedDays = daysSince(pricesLastUpdated);
  const isOld = lastUpdatedDays !== null && lastUpdatedDays > 30;

  const handleQuickAdjust = (percent) => {
    if (confirm(`Изменить ВСЕ цены на ${percent > 0 ? "+" : ""}${percent}%?`)) {
      adjustAllPrices(percent);
    }
  };

  const handleResetAll = () => {
    if (confirm("Сбросить ВСЕ цены к дефолтным?\n\nИстория сохранится.")) {
      resetSpeciesPrices();
    }
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name.trim()) {
      alert("Введи название лесопилки");
      return;
    }
    addSupplier(newSupplier);
    setNewSupplier({ name: "", region: "karelia", contact: "", notes: "" });
    setShowSupplierForm(false);
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) {
      alert("Вставь CSV данные");
      return;
    }
    const result = importPricesFromCSV(csvText);
    setCsvResult(result);
    if (result.success && result.imported > 0) {
      setTimeout(() => {
        setCsvText("");
        setCsvResult(null);
        setActiveTab("prices");
      }, 2000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setCsvText(event.target.result);
    reader.readAsText(file);
  };

  const downloadCsvTemplate = () => {
    const template = `Pine,175
Spruce,165
Larch,230
Cedar,280
SPF,180
Birch,220
Oak,450
Aspen,140`;
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ru-timber-prices-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const speciesOrder = [
    "pine", "spruce", "larch", "cedar", "spf",
    "birch", "oak", "aspen",
    "pine-spruce-50-50", "pine-spruce-70-30"
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl shadow-2xl max-h-[95vh] flex flex-col rounded-t-2xl">
        
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                💰 Mill Prices Editor
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {pricesLastUpdated ? (
                  <>
                    Last updated: <strong>{formatDate(pricesLastUpdated)}</strong>
                    {lastUpdatedDays !== null && (
                      <span className={isOld ? "text-rose-600 ml-2 font-bold" : "text-slate-500 ml-2"}>
                        ({lastUpdatedDays === 0 ? "today" : `${lastUpdatedDays} days ago`})
                        {isOld && " ⚠️ outdated"}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-500">Using default prices</span>
                )}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl active:scale-95">✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-slate-50 px-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {[
              { id: "prices", label: "💵 Prices", icon: "💵" },
              { id: "history", label: "📈 History", icon: "📈" },
              { id: "suppliers", label: "🏭 Suppliers", icon: "🏭" },
              { id: "regions", label: "🗺 Regions", icon: "🗺" },
              { id: "import", label: "📂 Import CSV", icon: "📂" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg whitespace-nowrap active:scale-95 ${
                  activeTab === tab.id 
                    ? "bg-white text-amber-700 border-t-2 border-x-2 border-amber-300" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* TAB: PRICES */}
          {activeTab === "prices" && (
            <div className="space-y-3">
              {/* Warning if old */}
              {isOld && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-3 text-xs text-rose-800">
                  ⚠️ <strong>Цены старше 30 дней!</strong> Свяжись с поставщиком и обнови.
                </div>
              )}

              {/* Quick actions */}
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs font-bold text-slate-600 mb-2">⚡ Quick actions:</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleQuickAdjust(5)}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded active:scale-95">
                    📈 All +5%
                  </button>
                  <button onClick={() => handleQuickAdjust(-5)}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded active:scale-95">
                    📉 All -5%
                  </button>
                  <button onClick={() => handleQuickAdjust(10)}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded active:scale-95">
                    📈 All +10%
                  </button>
                  <button onClick={() => handleQuickAdjust(-10)}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded active:scale-95">
                    📉 All -10%
                  </button>
                  <button onClick={handleResetAll}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded active:scale-95 ml-auto">
                    🔄 Reset all
                  </button>
                </div>
              </div>

              {/* Moisture coefficients info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                <div className="font-bold text-blue-900 mb-1">💧 Moisture multipliers:</div>
                <div className="text-blue-800 flex flex-wrap gap-3">
                  <span>KD 10-12%: <strong>×{MOISTURE_MULTIPLIERS.kd}</strong> (base)</span>
                  <span>AD 18-22%: <strong>×{MOISTURE_MULTIPLIERS.ad}</strong> (-12%)</span>
                  <span>Fresh 22-30%: <strong>×{MOISTURE_MULTIPLIERS.fresh}</strong> (-28%)</span>
                </div>
              </div>

              {/* Price list */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 mb-1">🌲 SOFTWOOD (хвойные)</div>
                {speciesOrder.filter(k => SPECIES_INFO[k]?.category === "softwood").map(key => (
                  <SpeciesPriceRow 
                    key={key} 
                    speciesKey={key} 
                    info={SPECIES_INFO[key]}
                    currentPrice={getSpeciesPrice(key)}
                    defaultPrice={DEFAULT_SPECIES_PRICES[key]}
                    isCustom={customSpeciesPrices[key] !== undefined}
                    history={priceHistory[key]}
                    usdRubRate={usdRubRate}
                    onUpdate={updateSpeciesPrice}
                    onReset={resetSpeciesPrice}
                  />
                ))}

                <div className="text-xs font-bold text-slate-700 mb-1 mt-4">🌳 HARDWOOD (лиственные)</div>
                {speciesOrder.filter(k => SPECIES_INFO[k]?.category === "hardwood").map(key => (
                  <SpeciesPriceRow 
                    key={key} 
                    speciesKey={key} 
                    info={SPECIES_INFO[key]}
                    currentPrice={getSpeciesPrice(key)}
                    defaultPrice={DEFAULT_SPECIES_PRICES[key]}
                    isCustom={customSpeciesPrices[key] !== undefined}
                    history={priceHistory[key]}
                    usdRubRate={usdRubRate}
                    onUpdate={updateSpeciesPrice}
                    onReset={resetSpeciesPrice}
                  />
                ))}

                <div className="text-xs font-bold text-slate-700 mb-1 mt-4">🌲🌲 MIX (смеси)</div>
                {speciesOrder.filter(k => SPECIES_INFO[k]?.category === "mix").map(key => (
                  <SpeciesPriceRow 
                    key={key} 
                    speciesKey={key} 
                    info={SPECIES_INFO[key]}
                    currentPrice={getSpeciesPrice(key)}
                    defaultPrice={DEFAULT_SPECIES_PRICES[key]}
                    isCustom={customSpeciesPrices[key] !== undefined}
                    history={priceHistory[key]}
                    usdRubRate={usdRubRate}
                    onUpdate={updateSpeciesPrice}
                    onReset={resetSpeciesPrice}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB: HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                📈 История изменений цен (последние 30 на породу)
              </div>
              {Object.keys(priceHistory).length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="text-5xl mb-2">📊</div>
                  <div className="text-sm">История пуста</div>
                  <div className="text-xs mt-1">Измени любую цену — здесь появится запись</div>
                </div>
              ) : (
                speciesOrder.filter(k => priceHistory[k] && priceHistory[k].length > 0).map(key => {
                  const info = SPECIES_INFO[key];
                  const history = priceHistory[key];
                  return (
                    <div key={key} className="bg-slate-50 rounded-lg p-3">
                      <div className="font-bold text-sm text-slate-900 mb-2">
                        {info.emoji} {info.name} ({info.ru})
                      </div>
                      <div className="space-y-1">
                        {history.slice(0, 10).map((h, idx) => {
                          const change = h.newPrice - h.oldPrice;
                          const changePercent = h.oldPrice > 0 ? (change / h.oldPrice) * 100 : 0;
                          return (
                            <div key={idx} className="bg-white rounded p-2 text-xs flex items-center justify-between">
                              <div>
                                <div className="text-slate-500">{formatDate(h.date)}</div>
                                <div className="text-slate-700">
                                  ${h.oldPrice} → <strong>${h.newPrice}</strong>
                                  {h.source && <span className="ml-2 text-blue-600">({h.source})</span>}
                                  {h.bulk && <span className="ml-2 text-purple-600">({h.bulk})</span>}
                                </div>
                              </div>
                              <div className={`font-bold ${change > 0 ? "text-rose-600" : change < 0 ? "text-emerald-600" : "text-slate-500"}`}>
                                {change > 0 ? "+" : ""}${change.toFixed(0)}
                                <span className="text-[10px] ml-1">
                                  ({change > 0 ? "+" : ""}{changePercent.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB: SUPPLIERS */}
          {activeTab === "suppliers" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-600">🏭 Твои поставщики (лесопилки)</div>
                <button onClick={() => setShowSupplierForm(!showSupplierForm)}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded active:scale-95">
                  {showSupplierForm ? "✕ Cancel" : "+ Add supplier"}
                </button>
              </div>

              {showSupplierForm && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 space-y-2">
                  <input type="text" value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    placeholder="Название лесопилки *"
                    className="w-full p-2 border-2 border-slate-300 rounded text-sm focus:border-amber-500 outline-none" />
                  <select value={newSupplier.region}
                    onChange={(e) => setNewSupplier({...newSupplier, region: e.target.value})}
                    className="w-full p-2 border-2 border-slate-300 rounded text-sm focus:border-amber-500 outline-none">
                    {Object.entries(SAWMILL_REGIONS).map(([key, r]) => (
                      <option key={key} value={key}>{r.flag} {r.name}</option>
                    ))}
                  </select>
                  <input type="text" value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                    placeholder="Контакт (телефон/email)"
                    className="w-full p-2 border-2 border-slate-300 rounded text-sm focus:border-amber-500 outline-none" />
                  <textarea value={newSupplier.notes}
                    onChange={(e) => setNewSupplier({...newSupplier, notes: e.target.value})}
                    placeholder="Заметки (что производит, условия...)"
                    rows="2"
                    className="w-full p-2 border-2 border-slate-300 rounded text-sm focus:border-amber-500 outline-none" />
                  <button onClick={handleAddSupplier}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded text-sm active:scale-95">
                    ✓ Save supplier
                  </button>
                </div>
              )}

              {suppliers.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="text-5xl mb-2">🏭</div>
                  <div className="text-sm">Нет поставщиков</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {suppliers.map(s => {
                    const region = SAWMILL_REGIONS[s.region];
                    return (
                      <div key={s.id} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-slate-900">{s.name}</div>
                            {region && (
                              <div className="text-xs text-slate-600 mt-0.5">
                                {region.flag} {region.name} · multiplier ×{region.multiplier}
                              </div>
                            )}
                            {s.contact && (
                              <div className="text-xs text-blue-600 mt-0.5">📞 {s.contact}</div>
                            )}
                            {s.notes && (
                              <div className="text-xs text-slate-500 mt-1 italic">{s.notes}</div>
                            )}
                          </div>
                          {!s.isDefault && (
                            <button onClick={() => removeSupplier(s.id)}
                              className="text-rose-500 hover:text-rose-700 active:scale-95">✕</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: REGIONS */}
          {activeTab === "regions" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 mb-2">
                🗺 Регионы лесопилок и ценовые коэффициенты
              </div>
              <div className="text-[10px] text-slate-500 italic mb-3">
                Multiplier применяется к базовым ценам. Karelia = базовый (×1.00)
              </div>
              {Object.entries(SAWMILL_REGIONS).map(([key, r]) => (
                <div key={key} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-sm flex items-center gap-2">
                      {r.flag} {r.name}
                    </div>
                    <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      r.multiplier < 1 ? "bg-emerald-100 text-emerald-700" : 
                      r.multiplier > 1 ? "bg-rose-100 text-rose-700" : 
                      "bg-slate-200 text-slate-700"
                    }`}>
                      ×{r.multiplier}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white rounded p-2">
                      <div className="text-slate-500 text-[10px] uppercase">Pine</div>
                      <div className="font-mono font-bold">${(175 * r.multiplier).toFixed(0)}/m³</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-slate-500 text-[10px] uppercase">Spruce</div>
                      <div className="font-mono font-bold">${(165 * r.multiplier).toFixed(0)}/m³</div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-slate-500 text-[10px] uppercase">Land freight</div>
                      <div className="font-mono font-bold">${r.baseFreight}/cont</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                💡 <strong>Совет:</strong> Иркутск дешевле на 17%, но фрахт +$700/cont — посчитай выгоду
              </div>
            </div>
          )}

          {/* TAB: IMPORT */}
          {activeTab === "import" && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                💡 <strong>Формат CSV:</strong> 
                <code className="bg-white px-1 ml-1 rounded">Species,Price</code>
                <br />
                Можно использовать русские названия: Сосна, Ель, Лиственница и т.д.
              </div>

              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-2 rounded active:scale-95">
                  📂 Choose CSV file
                </button>
                <button onClick={downloadCsvTemplate}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded active:scale-95">
                  📥 Template
                </button>
                <input ref={fileInputRef} type="file" accept=".csv,.txt"
                  onChange={handleFileUpload} className="hidden" />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-bold">Или вставь CSV напрямую:</label>
                <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)}
                  rows="8" placeholder={`Pine,175\nSpruce,165\nLarch,230\nBirch,220\nOak,450`}
                  className="w-full mt-1 p-3 border-2 border-slate-300 rounded text-sm font-mono focus:border-amber-500 outline-none" />
              </div>

              {csvResult && (
                <div className={`rounded-lg p-3 text-sm ${
                  csvResult.success && csvResult.imported > 0 
                    ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                    : "bg-rose-50 border border-rose-300 text-rose-800"
                }`}>
                  {csvResult.success ? (
                    csvResult.imported > 0 
                      ? `✅ Импортировано ${csvResult.imported} цен`
                      : "⚠️ Не найдено валидных строк"
                  ) : (
                    `❌ Ошибка: ${csvResult.error}`
                  )}
                </div>
              )}

              <button onClick={handleCsvImport}
                disabled={!csvText.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded active:scale-95">
                📂 Import prices
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            💵 USD/RUB: <strong>₽{usdRubRate}</strong>
          </div>
          <button onClick={onClose}
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded active:scale-95">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Sub-component: Species Price Row
// ═══════════════════════════════════════════
function SpeciesPriceRow({ speciesKey, info, currentPrice, defaultPrice, isCustom, history, usdRubRate, onUpdate, onReset }) {
  const [editValue, setEditValue] = useState(currentPrice.toString());
  
  const handleBlur = () => {
    const newPrice = parseFloat(editValue);
    if (!isNaN(newPrice) && newPrice > 0 && newPrice !== currentPrice) {
      onUpdate(speciesKey, newPrice);
    } else {
      setEditValue(currentPrice.toString());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.target.blur();
    if (e.key === "Escape") {
      setEditValue(currentPrice.toString());
      e.target.blur();
    }
  };

  // Обновляем editValue если currentPrice изменился извне
  if (parseFloat(editValue) !== currentPrice && document.activeElement?.dataset?.species !== speciesKey) {
    setTimeout(() => setEditValue(currentPrice.toString()), 0);
  }

  const priceInRub = Math.round(currentPrice * (usdRubRate || 91));
  
  return (
    <div className={`rounded-lg p-3 border-2 ${
      isCustom ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-transparent"
    }`}>
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">
              {info.emoji} {info.name}
            </span>
            {isCustom && (
              <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                CUSTOM
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500">{info.ru}</div>
          {isCustom && (
            <div className="text-[10px] text-slate-400 mt-0.5">
              Default: ${defaultPrice}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <PriceMiniChart history={history} currentPrice={currentPrice} />
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">$</span>
              <input 
                type="number" 
                value={editValue}
                data-species={speciesKey}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onFocus={(e) => e.target.select()}
                step="1"
                className="w-16 p-1.5 text-right text-sm border-2 border-slate-300 rounded font-mono font-bold focus:border-amber-500 outline-none"
              />
              <span className="text-[10px] text-slate-400">/m³</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              ≈ ₽{priceInRub.toLocaleString("ru-RU")}
            </div>
          </div>
        </div>

        {isCustom && (
          <button onClick={() => onReset(speciesKey)}
            title="Reset to default"
            className="text-slate-400 hover:text-rose-600 text-xs active:scale-95 px-1">
            🔄
          </button>
        )}
      </div>
    </div>
  );
}