"use client";
import { useState, useEffect, useMemo } from "react";
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

const DEFAULT_COSTS = {
  containerCapacity: 50,
  millPriceOverride: null,
  factoryLoading: 6,
  landTransport: 1500,
  portTHC: 250,
  portBL: 100,
  portTelex: 50,
  portOther: 0,
  insuranceRate: 1.1,
  exportDutyRate: 6.5,
};

const STORAGE_KEY = "ru-timber-pricing-costs";

const SPECIES_NAMES = {
  pine: "Pine",
  spruce: "Spruce",
  larch: "Larch",
  cedar: "Cedar",
  birch: "Birch",
  oak: "Oak",
  aspen: "Aspen",
  "pine-spruce-50-50": "Pine+Spruce 50/50",
  "pine-spruce-70-30": "Pine+Spruce 70/30",
  spf: "SPF",
};

const MOISTURE_LABELS = {
  kd: "KD 10-12%",
  ad: "AD 18-22%",
  fresh: "Fresh 22-30%",
};

const PACKAGING_LABELS = {
  none: "Bulk",
  crate: "Crate",
  shrink: "Shrink+Crate",
  strapped: "Strapped",
  premium: "Premium",
};

// 🆕 LOADING PORTS (для определения откуда отгрузка)
const LOADING_PORTS = {
  nvr: { name: "Novorossiysk", country: "Russia", flag: "🇷🇺" },
  spb: { name: "Saint Petersburg", country: "Russia", flag: "🇷🇺" },
  vlv: { name: "Vladivostok", country: "Russia", flag: "🇷🇺" },
  kgd: { name: "Kaliningrad", country: "Russia", flag: "🇷🇺" },
};

function getLoadingPortInfo(routeKey) {
  if (!routeKey) return LOADING_PORTS.nvr;
  const prefix = routeKey.split("-")[0];
  return LOADING_PORTS[prefix] || LOADING_PORTS.nvr;
}

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

const CostRow = ({ icon, label, perM3, perContainer, total, badge, editable, value, onChange, unit, danger, success }) => {
  const color = danger ? "text-rose-600" : success ? "text-emerald-600" : "text-slate-700";
  return (
    <div className={`py-3 border-b border-slate-200 ${color}`}>
      <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
        <div className="min-w-0">
          <div className="text-sm font-semibold flex items-center flex-wrap gap-2">
            <span>{icon} {label}</span>
            {badge && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold whitespace-nowrap">
                {badge}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            ${perM3.toFixed(2)}/m³ · ${perContainer.toFixed(0)}/cont · <span className="font-bold">${total.toFixed(0)} total</span>
          </div>
        </div>
        {editable ? (
          <div className="flex items-center gap-1 w-[110px] flex-shrink-0">
            <input
              type="number"
              value={value}
              onChange={onChange}
              onFocus={(e) => e.target.select()}
              step="0.01"
              className="w-[70px] p-1.5 text-right text-sm border-2 border-slate-300 rounded font-mono font-bold focus:border-orange-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 whitespace-nowrap w-[36px]">{unit}</span>
          </div>
        ) : (
          <div className="w-[110px] flex-shrink-0"></div>
        )}
      </div>
    </div>
  );
};

export default function PricingPage() {
  const { 
    deal, 
    updateDeal, 
    isLoaded,
    addPosition,
    removePosition,
    clearPositions,
    customRoutes,
    addCustomRoute,
    removeCustomRoute,
  } = useDeal();
  
  const [cbrLoading, setCbrLoading] = useState(false);
  const [cbrDate, setCbrDate] = useState(null);
  const [cbrError, setCbrError] = useState(false);

  const [useCustomFreight, setUseCustomFreight] = useState(false);
  const [customFreightRate, setCustomFreightRate] = useState(2400);
  const [customFreightDate, setCustomFreightDate] = useState("");

  const [costs, setCosts] = useState(DEFAULT_COSTS);
  const [manualContainers, setManualContainers] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  // 🆕 СОСТОЯНИЕ ДЛЯ FREIGHT UI
  const [portSearch, setPortSearch] = useState("");
  const [expandedCountries, setExpandedCountries] = useState({}); // { "India": true }
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // 🆕 CUSTOM PORT INPUTS
  const [customLoadingPort, setCustomLoadingPort] = useState("Novorossiysk");
  const [customDestPort, setCustomDestPort] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [customRate, setCustomRate] = useState("");

  useEffect(() => {
    try {
      const savedFreight = localStorage.getItem("ru-timber-custom-freight");
      if (savedFreight) {
        const parsed = JSON.parse(savedFreight);
        setUseCustomFreight(parsed.enabled || false);
        setCustomFreightRate(parsed.rate || 2400);
        setCustomFreightDate(parsed.date || "");
      }
      const savedCosts = localStorage.getItem(STORAGE_KEY);
      if (savedCosts) {
        const parsed = JSON.parse(savedCosts);
        setCosts({ ...DEFAULT_COSTS, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load saved data:", e);
    }
  }, []);

  const saveCustomFreight = (enabled, rate) => {
    const today = new Date().toLocaleDateString("ru-RU");
    const data = { enabled, rate, date: today };
    localStorage.setItem("ru-timber-custom-freight", JSON.stringify(data));
    setCustomFreightDate(today);
  };

  const updateCost = (field, value) => {
    let newValue;
    if (value === null || value === undefined) {
      newValue = null;
    } else {
      const num = parseFloat(value);
      newValue = isNaN(num) ? 0 : num;
    }
    const newCosts = { ...costs, [field]: newValue };
    setCosts(newCosts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCosts));
    } catch (e) {
      console.error("Save costs failed:", e);
    }
  };

  const resetCosts = () => {
    if (confirm("Сбросить все параметры к дефолтным значениям?")) {
      setCosts(DEFAULT_COSTS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

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

  // 🆕 ЛОГИКА АКТИВНОГО МАРШРУТА
  const activeRoute = useMemo(() => {
    // Если активирован custom — берём custom
    if (deal.customRoute) {
      return {
        type: "custom",
        loadingPort: deal.customRoute.loadingPort,
        loadingPortFlag: "🇷🇺",
        destinationPort: deal.customRoute.destinationPort,
        country: deal.customRoute.country,
        flag: deal.customRoute.flag || "🌍",
        rate: deal.customRoute.rate,
      };
    }
    // Иначе из FREIGHT_PRESETS
    const preset = FREIGHT_PRESETS[deal.freightRoute];
    if (preset) {
      const loading = getLoadingPortInfo(deal.freightRoute);
      return {
        type: "preset",
        loadingPort: loading.name,
        loadingPortFlag: loading.flag,
        destinationPort: preset.port,
        country: preset.country,
        flag: preset.flag,
        rate: preset.rate,
      };
    }
    // Дефолт
    return {
      type: "preset",
      loadingPort: "Novorossiysk",
      loadingPortFlag: "🇷🇺",
      destinationPort: "Jebel Ali",
      country: "UAE",
      flag: "🇦🇪",
      rate: 2400,
    };
  }, [deal.customRoute, deal.freightRoute]);

  const effectiveFreightRate = useCustomFreight ? customFreightRate : activeRoute.rate;

  const autoContainers = totalVol > 0 ? Math.ceil(totalVol / costs.containerCapacity) : 0;
  const containers = manualContainers !== null ? manualContainers : autoContainers;
  const fillRate = containers > 0 ? (totalVol / (containers * costs.containerCapacity)) * 100 : 0;

  const speciesBase = SPECIES_BASE_PRICES[species] || 160;
  const dryingAdd = DRYING_SURCHARGE[moisture] || 0;
  const packAdd = PACKAGING_SURCHARGE[packaging] || 0;

  const calculatedMillPrice = speciesBase + dryingAdd + packAdd;
  const millPricePerM3 = costs.millPriceOverride !== null && costs.millPriceOverride !== undefined
    ? costs.millPriceOverride
    : calculatedMillPrice;
  const millPriceTotal = millPricePerM3 * totalVol;
  const millPricePerContainer = containers > 0 ? millPriceTotal / containers : 0;

  const factoryLoadingPerM3 = costs.factoryLoading;
  const factoryLoadingTotal = factoryLoadingPerM3 * totalVol;
  const factoryLoadingPerContainer = containers > 0 ? factoryLoadingTotal / containers : 0;

  const landTransportPerContainer = costs.landTransport;
  const landTransportTotal = landTransportPerContainer * containers;
  const landTransportPerM3 = totalVol > 0 ? landTransportTotal / totalVol : 0;

  const portTHCTotal = costs.portTHC * containers;
  const portTHCPerM3 = totalVol > 0 ? portTHCTotal / totalVol : 0;

  const portBLTotal = costs.portBL * containers;
  const portBLPerM3 = totalVol > 0 ? portBLTotal / totalVol : 0;

  const portTelexTotal = costs.portTelex * containers;
  const portTelexPerM3 = totalVol > 0 ? portTelexTotal / totalVol : 0;

  const portOtherTotal = costs.portOther * containers;
  const portOtherPerM3 = totalVol > 0 ? portOtherTotal / totalVol : 0;

  const oceanPerContainer = effectiveFreightRate;
  const oceanTotal = oceanPerContainer * containers;
  const oceanPerM3 = totalVol > 0 ? oceanTotal / totalVol : 0;

  let totalCostPerM3 = millPricePerM3;
  if (["fca-factory", "fca-port", "fob", "cif"].includes(incoterm)) {
    totalCostPerM3 += factoryLoadingPerM3;
  }
  if (["fca-port", "fob", "cif"].includes(incoterm)) {
    totalCostPerM3 += landTransportPerM3;
  }
  if (["fob", "cif"].includes(incoterm)) {
    totalCostPerM3 += portTHCPerM3 + portBLPerM3 + portTelexPerM3 + portOtherPerM3;
  }
  if (incoterm === "cif") {
    totalCostPerM3 += oceanPerM3;
  }

  const insurancePerM3 = incoterm === "cif" ? (costs.insuranceRate / 100) * totalCostPerM3 : 0;
  const insuranceTotal = insurancePerM3 * totalVol;
  const insurancePerContainer = containers > 0 ? insuranceTotal / containers : 0;
  
  if (incoterm === "cif") {
    totalCostPerM3 += insurancePerM3;
  }

  const dutyFree = moisture === "kd" || deal.profileProcessing;
  const dutyPerM3 = dutyFree ? 0 : (costs.exportDutyRate / 100) * totalCostPerM3;
  const dutyTotal = dutyPerM3 * totalVol;
  const dutyPerContainer = containers > 0 ? dutyTotal / containers : 0;

  const totalCostWithDutyPerM3 = totalCostPerM3 + dutyPerM3;
  const totalCostWithDutyTotal = totalCostWithDutyPerM3 * totalVol;
  const totalCostPerContainer = containers > 0 ? totalCostWithDutyTotal / containers : 0;

  const sellPricePerM3 = totalCostWithDutyPerM3 * (1 + margin / 100);
  const sellPricePerContainer = containers > 0 ? (sellPricePerM3 * totalVol) / containers : 0;
  const profitPerM3 = sellPricePerM3 - totalCostWithDutyPerM3;
  const totalAmount = sellPricePerM3 * totalVol;
  const totalProfit = profitPerM3 * totalVol;
  const profitPerContainer = containers > 0 ? totalProfit / containers : 0;

  useEffect(() => {
    if (!isLoaded) return;
    if (totalVol <= 0 || sellPricePerM3 <= 0) return;

    const needsUpdate =
      deal.finalPricePerM3 !== sellPricePerM3 ||
      deal.finalContainers !== containers ||
      deal.finalTotalAmount !== totalAmount ||
      deal.finalCostPerM3 !== totalCostWithDutyPerM3;

    if (needsUpdate) {
      updateDeal({
        finalPricePerM3: sellPricePerM3,
        finalCostPerM3: totalCostWithDutyPerM3,
        finalContainers: containers,
        finalTotalAmount: totalAmount,
        finalProfitPerM3: profitPerM3,
        finalProfitTotal: totalProfit,
        finalIncoterm: incoterm,
        finalFreightRoute: deal.freightRoute,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoaded,
    sellPricePerM3,
    totalCostWithDutyPerM3,
    containers,
    totalAmount,
    profitPerM3,
    totalProfit,
    incoterm,
  ]);

  const handleAddToBasket = () => {
    if (totalVol <= 0 || sellPricePerM3 <= 0) {
      alert("Сначала заполни калькулятор: объём, размеры, цена");
      return;
    }

    addPosition({
      species,
      speciesLabel: SPECIES_NAMES[species] || species,
      thickness: parseFloat(deal.thickness) || 50,
      width: parseFloat(deal.width) || 150,
      length: parseFloat(deal.length) || 6000,
      moisture,
      moistureLabel: MOISTURE_LABELS[moisture] || moisture,
      packaging,
      packagingLabel: PACKAGING_LABELS[packaging] || packaging,
      totalVolume: totalVol,
      containers,
      volumePerContainer: containers > 0 ? totalVol / containers : 0,
      pricePerM3: sellPricePerM3,
      costPerM3: totalCostWithDutyPerM3,
      profitPerM3,
      totalAmount,
      totalProfit,
      incoterm,
      freightRoute: deal.freightRoute,
      margin,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const positions = deal.positions || [];
  const basketTotalVolume = positions.reduce((sum, p) => sum + (p.totalVolume || 0), 0);
  const basketTotalContainers = positions.reduce((sum, p) => sum + (p.containers || 0), 0);
  const basketTotalAmount = positions.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  // 🆕 ГРУППИРОВКА ПОРТОВ ПО СТРАНАМ
  const routesByCountry = useMemo(() => {
    const groups = {};
    Object.entries(FREIGHT_PRESETS).forEach(([key, route]) => {
      if (!groups[route.country]) {
        groups[route.country] = { flag: route.flag, routes: [] };
      }
      groups[route.country].routes.push({ key, ...route });
    });
    return groups;
  }, []);

  // 🆕 ПОПУЛЯРНЫЕ МАРШРУТЫ (со звёздочкой)
  const popularRoutes = useMemo(() => {
    return Object.entries(FREIGHT_PRESETS)
      .filter(([_, r]) => r.star)
      .map(([key, r]) => ({ key, ...r }));
  }, []);

  // 🆕 ПОИСК ПО ПОРТАМ
  const searchResults = useMemo(() => {
    if (!portSearch.trim()) return [];
    const q = portSearch.toLowerCase();
    return Object.entries(FREIGHT_PRESETS)
      .filter(([_, r]) => 
        r.port.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q)
      )
      .map(([key, r]) => ({ key, ...r }))
      .slice(0, 10);
  }, [portSearch]);

  // 🆕 ПРИМЕНИТЬ CUSTOM МАРШРУТ
  const applyCustomRoute = () => {
    if (!customDestPort.trim() || !customRate) {
      alert("Заполни обязательные поля: Destination Port и Rate");
      return;
    }

    const routeData = {
      loadingPort: customLoadingPort.trim() || "Novorossiysk",
      destinationPort: customDestPort.trim(),
      country: customCountry.trim(),
      flag: "🌍",
      rate: parseFloat(customRate),
    };

    // Сохраняем в историю
    addCustomRoute(routeData);
    
    // Активируем в deal
    updateDeal({
      customRoute: routeData,
      freightRoute: null, // отключаем preset
    });

    // Очищаем форму
    setCustomDestPort("");
    setCustomCountry("");
    setCustomRate("");
    setShowCustomForm(false);
  };

  // 🆕 ВЫБРАТЬ PRESET МАРШРУТ
  const selectPresetRoute = (routeKey) => {
    updateDeal({
      freightRoute: routeKey,
      customRoute: null, // отключаем custom
    });
    setUseCustomFreight(false);
    saveCustomFreight(false, customFreightRate);
  };

  // 🆕 ВЫБРАТЬ СОХРАНЁННЫЙ CUSTOM МАРШРУТ
  const useCustomFromHistory = (route) => {
    updateDeal({
      customRoute: {
        loadingPort: route.loadingPort,
        destinationPort: route.destinationPort,
        country: route.country,
        flag: route.flag,
        rate: route.rate,
      },
      freightRoute: null,
    });
  };

  // 🆕 ВЫЙТИ ИЗ CUSTOM (вернуться к presets)
  const clearCustom = () => {
    updateDeal({
      customRoute: null,
      freightRoute: "nvr-jebelali",
    });
  };

  const toggleCountry = (country) => {
    setExpandedCountries(prev => ({ ...prev, [country]: !prev[country] }));
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm">← Home</Link>
          <div className="text-xs font-mono hidden sm:block">STEP 3.11 · PRICING</div>
          <div className="flex gap-1 text-xs">
            <Link href="/calculator" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📐 Vol</Link>
            <Link href="/calculator/container" className="bg-slate-700 px-2 py-1 rounded active:scale-95">📦 3D</Link>
            <Link href="/calculator/quotation" className="bg-emerald-600 px-2 py-1 rounded active:scale-95">
              📄 Quote {positions.length > 0 && <span className="bg-orange-500 ml-1 px-1.5 rounded-full">{positions.length}</span>}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Pricing Calculator</h1>
          <p className="text-sm text-slate-500 mt-1">
            💰 Editable cost breakdown · per m³ · per container · total
          </p>
        </div>

        {positions.length > 0 && (
          <section className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-purple-900 flex items-center gap-2">
                🛒 Quotation Basket
                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {positions.length} position{positions.length > 1 ? "s" : ""}
                </span>
              </h2>
              <button
                onClick={() => {
                  if (confirm("Очистить корзину? Все позиции будут удалены.")) {
                    clearPositions();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 active:scale-95"
              >
                🗑 Clear all
              </button>
            </div>

            <div className="space-y-2">
              {positions.map((p, idx) => (
                <div key={p.id} className="bg-white rounded-lg p-3 flex items-start gap-3 shadow-sm">
                  <div className="bg-purple-100 text-purple-800 font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900">
                      🌲 {p.speciesLabel} {p.thickness}×{p.width}×{p.length}mm
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {p.moistureLabel} · {p.packagingLabel} · {p.containers} × 40HC
                    </div>
                    <div className="text-xs font-mono text-slate-700 mt-1">
                      {p.totalVolume.toFixed(1)} m³ × ${p.pricePerM3.toFixed(0)}/m³ = 
                      <span className="font-bold text-emerald-600 ml-1">${p.totalAmount.toFixed(0)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removePosition(p.id)}
                    className="text-rose-500 hover:text-rose-700 text-xl active:scale-95 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t-2 border-purple-300 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-purple-700">Total Vol</div>
                <div className="font-mono font-black text-purple-900">{basketTotalVolume.toFixed(1)} m³</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-purple-700">Containers</div>
                <div className="font-mono font-black text-purple-900">{basketTotalContainers} × 40HC</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-purple-700">Grand Total</div>
                <div className="font-mono font-black text-emerald-600 text-lg">${basketTotalAmount.toFixed(0)}</div>
              </div>
            </div>

            <Link
              href="/calculator/quotation"
              className="block w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-lg font-bold active:scale-95"
            >
              📄 Generate Quotation ({positions.length} positions) →
            </Link>
          </section>
        )}

        <Reminder
          priority="high"
          icon="💱"
          title="Проверь курс USD/RUB перед отправкой Quotation"
          description="Курс ЦБ РФ обновляется в 13:00 МСК. Закладывай запас 2-3% на колебания."
          dismissKey="usd-rate-tip-2026"
        />

        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center mb-3">
            📦 Volume & Containers
            <Tooltip text="Объём из калькулятора. Количество контейнеров — авто." />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-500">Total Volume (m³)</label>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalVol.toFixed(2)}</div>
              <Link href="/calculator" className="text-xs text-orange-500 active:scale-95">✏ Edit →</Link>
            </div>
            <div>
              <label className="text-xs text-slate-500">Container Capacity (m³/40HC)</label>
              <input
                type="number"
                value={costs.containerCapacity}
                onChange={(e) => updateCost("containerCapacity", e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-lg font-bold focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Containers (40HC)</label>
              <input
                type="number"
                value={containers}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setManualContainers(isNaN(v) ? null : Math.max(1, v));
                }}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border-2 border-orange-500 rounded-lg text-lg font-bold focus:border-orange-600 outline-none"
              />
              <div className="text-xs text-slate-500 mt-1">
                Заполнение: <span className={`font-bold ${fillRate < 90 ? "text-rose-500" : "text-emerald-600"}`}>
                  {fillRate.toFixed(1)}%
                </span>
                {manualContainers !== null && (
                  <button onClick={() => setManualContainers(null)} className="ml-2 text-orange-500 active:scale-95">
                    🔄 Auto
                  </button>
                )}
              </div>
            </div>
          </div>
          {fillRate < 90 && containers > 0 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-800">
              ⚠️ Контейнер заполнен только на {fillRate.toFixed(0)}%. Рекомендуется ≥95%.
            </div>
          )}
        </section>

        {/* 🆕 ━━━━━━ FREIGHT ROUTE — НОВЫЙ КРАСИВЫЙ UI ━━━━━━ */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center mb-3">
            🚢 Freight Route
            <Tooltip text="Выбери порт из списка, найди через поиск, или введи custom." />
          </h2>

          {/* CURRENT ROUTE — большая карточка */}
          <div className={`rounded-xl p-4 mb-4 border-2 ${
            activeRoute.type === "custom" 
              ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400" 
              : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400"
          }`}>
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-60 mb-2">
              📍 CURRENT ROUTE {activeRoute.type === "custom" && "(CUSTOM)"}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-2xl font-black">
                  <span>{activeRoute.loadingPortFlag}</span>
                  <span className="truncate">{activeRoute.loadingPort}</span>
                  <span className="text-orange-500">→</span>
                  <span>{activeRoute.flag}</span>
                  <span className="truncate">{activeRoute.destinationPort}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {activeRoute.country} · <span className="font-mono font-bold">${activeRoute.rate} / 40HC</span>
                </div>
              </div>
              {activeRoute.type === "custom" && (
                <button
                  onClick={clearCustom}
                  className="bg-white hover:bg-rose-50 text-rose-600 text-xs px-3 py-2 rounded-lg border border-rose-300 active:scale-95 whitespace-nowrap"
                >
                  ✕ Reset
                </button>
              )}
            </div>
          </div>

          {/* SEARCH */}
          <div className="mb-4">
            <input
              type="text"
              value={portSearch}
              onChange={(e) => setPortSearch(e.target.value)}
              placeholder="🔍 Search port, city or country..."
              className="w-full p-3 border-2 border-slate-300 rounded-lg text-sm focus:border-orange-500 outline-none"
            />
          </div>

          {/* SEARCH RESULTS */}
          {portSearch.trim() && (
            <div className="mb-4 bg-slate-50 rounded-lg p-3">
              <div className="text-xs font-bold text-slate-600 mb-2">
                🔍 Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </div>
              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">
                  Ничего не найдено. Используй <button onClick={() => setShowCustomForm(true)} className="text-orange-500 underline">Custom Port</button>
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map(r => (
                    <button
                      key={r.key}
                      onClick={() => { selectPresetRoute(r.key); setPortSearch(""); }}
                      className={`w-full text-left p-2 rounded text-sm transition-all active:scale-95 flex items-center justify-between ${
                        deal.freightRoute === r.key && !deal.customRoute
                          ? "bg-orange-500 text-white" 
                          : "bg-white hover:bg-orange-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{r.flag}</span>
                        <span className="font-bold">{r.port}</span>
                        <span className="text-xs opacity-75">· {r.country}</span>
                      </div>
                      <span className="font-mono font-bold text-xs">${r.rate}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* POPULAR ROUTES (если нет поиска) */}
          {!portSearch.trim() && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 mb-2">⭐ POPULAR ROUTES</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {popularRoutes.map(r => {
                  const active = deal.freightRoute === r.key && !deal.customRoute;
                  return (
                    <button
                      key={r.key}
                      onClick={() => selectPresetRoute(r.key)}
                      className={`p-3 rounded-lg text-left text-sm transition-all active:scale-95 border-2 ${
                        active
                          ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                          : "bg-slate-50 text-slate-700 border-transparent hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold flex items-center gap-1">
                          <span>{r.flag}</span>
                          <span>{r.port}</span>
                        </div>
                        <span className="font-mono text-xs font-bold">${r.rate}</span>
                      </div>
                      <div className="text-[10px] opacity-75 mt-1">{r.country}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ALL ROUTES BY COUNTRY (collapsed) */}
          {!portSearch.trim() && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 mb-2">📋 ALL ROUTES BY COUNTRY</div>
              <div className="space-y-2">
                {Object.entries(routesByCountry).map(([country, data]) => {
                  const isExpanded = expandedCountries[country];
                  return (
                    <div key={country} className="bg-slate-50 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCountry(country)}
                        className="w-full p-3 flex items-center justify-between hover:bg-slate-100 active:scale-[0.99] text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{data.flag}</span>
                          <span className="font-bold">{country}</span>
                          <span className="text-xs text-slate-500">({data.routes.length} ports)</span>
                        </div>
                        <span>{isExpanded ? "▲" : "▼"}</span>
                      </button>
                      {isExpanded && (
                        <div className="p-2 space-y-1 border-t border-slate-200">
                          {data.routes.map(r => {
                            const active = deal.freightRoute === r.key && !deal.customRoute;
                            return (
                              <button
                                key={r.key}
                                onClick={() => selectPresetRoute(r.key)}
                                className={`w-full text-left p-2 rounded text-xs transition-all active:scale-95 flex items-center justify-between ${
                                  active
                                    ? "bg-orange-500 text-white"
                                    : "bg-white hover:bg-orange-50 text-slate-700"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="font-bold">{r.port}</span>
                                  {r.star && <span>⭐</span>}
                                </span>
                                <span className="font-mono font-bold">${r.rate}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CUSTOM PORT */}
          <div className="mt-4 border-t-2 border-slate-200 pt-4">
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold p-3 rounded-lg text-sm transition-all active:scale-95"
            >
              {showCustomForm ? "▲ Hide Custom Port" : "✏️ Custom Port (manual entry)"}
            </button>

            {showCustomForm && (
              <div className="mt-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 font-bold">🇷🇺 Loading Port</label>
                    <input
                      type="text"
                      value={customLoadingPort}
                      onChange={(e) => setCustomLoadingPort(e.target.value)}
                      placeholder="Novorossiysk"
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-bold">🌍 Destination Port *</label>
                    <input
                      type="text"
                      value={customDestPort}
                      onChange={(e) => setCustomDestPort(e.target.value)}
                      placeholder="Например: Cochin"
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-bold">Country</label>
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="India"
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-bold">Rate ($/40HC) *</label>
                    <input
                      type="number"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder="2850"
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={applyCustomRoute}
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-sm active:scale-95"
                >
                  ✓ Use Custom Route
                </button>
              </div>
            )}

            {/* CUSTOM HISTORY */}
            {customRoutes && customRoutes.length > 0 && (
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-600 mb-2">📜 RECENT CUSTOM ROUTES</div>
                <div className="space-y-1">
                  {customRoutes.slice(0, 5).map(r => (
                    <div
                      key={r.id}
                      className="bg-slate-50 rounded p-2 flex items-center justify-between gap-2 text-xs"
                    >
                      <button
                        onClick={() => useCustomFromHistory(r)}
                        className="flex-1 text-left hover:text-orange-600 active:scale-95"
                      >
                        <span className="font-bold">{r.loadingPort} → {r.destinationPort}</span>
                        {r.country && <span className="text-slate-500"> · {r.country}</span>}
                        <span className="ml-2 font-mono text-emerald-600 font-bold">${r.rate}</span>
                      </button>
                      <button
                        onClick={() => removeCustomRoute(r.id)}
                        className="text-rose-500 hover:text-rose-700 active:scale-95"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Custom Freight Rate Override (как было) */}
        <section className={`rounded-xl p-5 shadow-sm border-2 transition-all ${
          useCustomFreight ? "bg-emerald-50 border-emerald-400" : "bg-white border-slate-200"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 flex items-center">
              ✏️ Override Freight Rate
              <Tooltip text="Ставка от брокера, перебивает ставку из preset/custom port." />
            </h2>
            {useCustomFreight && (
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold">ACTIVE</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500">Ставка фрахта (USD за 40HC)</label>
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
                {useCustomFreight ? "⬅ Use Route Rate" : "✓ Override →"}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-500">Источник:</span>
            <a href="https://app.terminal.freightos.com/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold hover:bg-blue-200">
              📊 Freightos FBX
            </a>
            <a href="https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold hover:bg-purple-200">
              📈 Drewry WCI
            </a>
            {customFreightDate && <span className="text-slate-400 ml-auto">Updated: {customFreightDate}</span>}
          </div>
        </section>

        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📋 Incoterms (Delivery Basis)
            <Tooltip text="EXW=склад. FCA=+погрузка. FOB=+судно. CIF=+фрахт+страховка." />
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

        <section className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 flex items-center">
              💰 Cost Breakdown
              <Tooltip text="Все цифры РЕДАКТИРУЕМЫЕ." />
            </h2>
            <button onClick={resetCosts} className="text-xs text-rose-500 hover:text-rose-700 active:scale-95">
              🔄 Reset
            </button>
          </div>

          <div className="bg-slate-100 px-3 py-2 rounded-lg text-xs text-slate-600 mb-3 font-mono">
            📊 {containers} containers × {costs.containerCapacity} m³ = {(containers * costs.containerCapacity)} m³ slots · 
            actual {totalVol.toFixed(1)} m³ ({fillRate.toFixed(0)}% fill)
          </div>

          <CostRow
            icon="🪵"
            label={`Mill price (${species} ${moisture} ${packaging})${costs.millPriceOverride !== null ? " ✏️" : ""}`}
            perM3={millPricePerM3}
            perContainer={millPricePerContainer}
            total={millPriceTotal}
            badge={costs.millPriceOverride !== null ? "MANUAL" : null}
            editable
            value={costs.millPriceOverride !== null ? costs.millPriceOverride : calculatedMillPrice}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || v === null) updateCost("millPriceOverride", null);
              else updateCost("millPriceOverride", parseFloat(v) || 0);
            }}
            unit="$/m³"
          />

          {costs.millPriceOverride !== null && (
            <div className="mt-2 mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center justify-between">
              <span>
                ⚠️ Mill price вручную переопределён. 
                Расчёт по породе: <span className="font-mono font-bold">${calculatedMillPrice.toFixed(2)}/m³</span>
              </span>
              <button
                onClick={() => updateCost("millPriceOverride", null)}
                className="ml-2 bg-amber-600 text-white text-xs px-2 py-1 rounded hover:bg-amber-700 active:scale-95 whitespace-nowrap"
              >
                🔄 Auto
              </button>
            </div>
          )}

          {["fca-factory", "fca-port", "fob", "cif"].includes(incoterm) && (
            <CostRow icon="🚚" label="Factory loading"
              perM3={factoryLoadingPerM3} perContainer={factoryLoadingPerContainer} total={factoryLoadingTotal}
              editable value={costs.factoryLoading} onChange={(e) => updateCost("factoryLoading", e.target.value)} unit="$/m³" />
          )}

          {["fca-port", "fob", "cif"].includes(incoterm) && (
            <CostRow icon="🚛" label="Land transport (до порта РФ)"
              perM3={landTransportPerM3} perContainer={landTransportPerContainer} total={landTransportTotal}
              editable value={costs.landTransport} onChange={(e) => updateCost("landTransport", e.target.value)} unit="$/cont" />
          )}

          {["fob", "cif"].includes(incoterm) && (
            <>
              <CostRow icon="⚓" label="Port THC"
                perM3={portTHCPerM3} perContainer={costs.portTHC} total={portTHCTotal}
                editable value={costs.portTHC} onChange={(e) => updateCost("portTHC", e.target.value)} unit="$/cont" />
              <CostRow icon="📄" label="Bill of Lading (B/L)"
                perM3={portBLPerM3} perContainer={costs.portBL} total={portBLTotal}
                editable value={costs.portBL} onChange={(e) => updateCost("portBL", e.target.value)} unit="$/cont" />
              <CostRow icon="📡" label="Telex Release"
                perM3={portTelexPerM3} perContainer={costs.portTelex} total={portTelexTotal}
                editable value={costs.portTelex} onChange={(e) => updateCost("portTelex", e.target.value)} unit="$/cont" />
              <CostRow icon="📋" label="Other port fees"
                perM3={portOtherPerM3} perContainer={costs.portOther} total={portOtherTotal}
                editable value={costs.portOther} onChange={(e) => updateCost("portOther", e.target.value)} unit="$/cont" />
            </>
          )}

          {incoterm === "cif" && (
            <CostRow icon="🚢" label={`Ocean freight (${activeRoute.loadingPort} → ${activeRoute.destinationPort})`}
              perM3={oceanPerM3} perContainer={oceanPerContainer} total={oceanTotal}
              badge={useCustomFreight ? "OVERRIDE" : activeRoute.type === "custom" ? "CUSTOM" : null} />
          )}

          {incoterm === "cif" && (
            <CostRow icon="🛡" label="Insurance"
              perM3={insurancePerM3} perContainer={insurancePerContainer} total={insuranceTotal}
              editable value={costs.insuranceRate} onChange={(e) => updateCost("insuranceRate", e.target.value)} unit="%" />
          )}

          <CostRow
            icon="🏛"
            label={`Export duty ${dutyFree ? "(0% — KD/4409)" : `(${costs.exportDutyRate}% — AD raw)`}`}
            perM3={dutyPerM3} perContainer={dutyPerContainer} total={dutyTotal}
            success={dutyFree} danger={!dutyFree} editable={!dutyFree}
            value={costs.exportDutyRate} onChange={(e) => updateCost("exportDutyRate", e.target.value)} unit="%"
          />

          <div className="mt-3 pt-3 border-t-2 border-slate-900 bg-slate-50 -mx-5 px-5 py-3">
            <div className="font-bold text-lg text-slate-900">TOTAL COST ({incoterm.toUpperCase()})</div>
            <div className="text-sm font-mono mt-1">
              <span className="text-2xl font-black">${totalCostWithDutyPerM3.toFixed(2)}</span>/m³
              <span className="text-slate-400 mx-2">·</span>
              ${totalCostPerContainer.toFixed(0)}/cont
              <span className="text-slate-400 mx-2">·</span>
              <span className="font-bold">${totalCostWithDutyTotal.toFixed(0)} total</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={deal.profileProcessing}
                onChange={(e) => updateDeal({ profileProcessing: e.target.checked })} className="mt-1" />
              <div className="text-xs text-slate-700">
                <div className="font-bold flex items-center">
                  ⚙ Profile processing (HS 4409 — фаска/паз)
                  <Tooltip text="Лёгкая фаска 2×2мм → код 4409 → 0% пошлины." />
                </div>
                <div className="opacity-75 mt-1">
                  Для AD-доски: фаска 2×2мм → 0% пошлины РФ. Экономия ~$7/m³.
                </div>
              </div>
            </label>
          </div>
        </section>

        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center">
            📊 Margin & Exchange Rate
            <Tooltip text="Твоя наценка к себестоимости." />
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
              <label className="text-xs text-slate-500">Margin (%)</label>
              <input type="number" value={deal.margin} onChange={handleNum("margin")}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg font-bold" />
              <div className="text-xs text-emerald-600 mt-1">Profit: ${profitPerM3.toFixed(2)}/m³</div>
            </div>
            <div>
              <label className="text-xs text-slate-500">USD / RUB</label>
              <input type="number" value={deal.usdRubRate} onChange={handleNum("usdRubRate")}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-lg font-bold" />
              <div className="flex items-center gap-2 mt-1">
                <button onClick={fetchCBR} disabled={cbrLoading} className="text-xs text-orange-500 active:scale-95">
                  {cbrLoading ? "⏳" : "🔄 ЦБ"}
                </button>
                {cbrDate && !cbrError && <span className="text-[10px] text-slate-400">{cbrDate}</span>}
                {cbrError && <span className="text-[10px] text-rose-500">⚠ Ошибка</span>}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white rounded-xl p-5 shadow-lg">
          <h2 className="font-bold">🎯 Final Pricing</h2>
          <div className="text-xs opacity-60 mt-1">
            {incoterm.toUpperCase()} {activeRoute.destinationPort} · Margin {margin}% · {totalVol.toFixed(2)} m³ · {containers} × 40HC · ₽{rate}/$
          </div>

          <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <div className="text-xs opacity-60 mb-2">💵 SELLING PRICE</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black">${sellPricePerM3.toFixed(2)}</div>
                <div className="text-xs opacity-50">per m³</div>
              </div>
              <div className="border-l border-r border-slate-700">
                <div className="text-xl sm:text-2xl font-black">${sellPricePerContainer.toFixed(0)}</div>
                <div className="text-xs opacity-50">per cont</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black">${totalAmount.toFixed(0)}</div>
                <div className="text-xs opacity-50">total deal</div>
              </div>
            </div>
            <div className="text-center text-xs opacity-50 mt-2">≈ ₽{(totalAmount * rate).toLocaleString("ru-RU", { maximumFractionDigits: 0 })}</div>
          </div>

          <div className="mt-3 p-4 bg-emerald-900/50 border border-emerald-700 rounded-lg">
            <div className="text-xs opacity-75 mb-2">💚 YOUR PROFIT</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg sm:text-xl font-black text-emerald-400">${profitPerM3.toFixed(2)}</div>
                <div className="text-xs opacity-50">per m³</div>
              </div>
              <div className="border-l border-r border-emerald-700/50">
                <div className="text-lg sm:text-xl font-black text-emerald-400">${profitPerContainer.toFixed(0)}</div>
                <div className="text-xs opacity-50">per cont</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-emerald-400">${totalProfit.toFixed(0)}</div>
                <div className="text-xs opacity-50">total</div>
              </div>
            </div>
            <div className="text-center text-xs opacity-50 mt-2">≈ ₽{(totalProfit * rate).toLocaleString("ru-RU", { maximumFractionDigits: 0 })}</div>
          </div>

          <button
            onClick={handleAddToBasket}
            className={`block w-full mt-5 text-white text-center py-4 rounded-lg font-black text-lg transition-all active:scale-95 ${
              justAdded
                ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {justAdded ? (
              <>✓ ADDED TO BASKET</>
            ) : (
              <>➕ ADD TO QUOTATION BASKET</>
            )}
          </button>

          <div className="mt-2 text-center text-xs opacity-50">
            {positions.length === 0 ? (
              "💡 Добавляй разные позиции — Quotation объединит все"
            ) : (
              <>📦 В корзине {positions.length} позиц{positions.length === 1 ? "ия" : "ии"} · ${basketTotalAmount.toFixed(0)} total</>
            )}
          </div>

          <Link
            href="/calculator/container"
            className="block w-full mt-3 bg-orange-500 text-white text-center py-3 rounded-lg font-bold active:scale-95"
          >
            📦 Continue to 3D View →
          </Link>
          <Link
            href="/calculator/quotation"
            className="block w-full mt-2 bg-emerald-600 text-white text-center py-3 rounded-lg font-bold active:scale-95"
          >
            📄 {positions.length > 0 ? `Generate Quotation (${positions.length} pos)` : "Generate Commercial Quotation"} →
          </Link>
        </section>

        <div className="text-center text-xs text-slate-400">
          Powered by RU-TIMBER Export · +7 915 349 00 07
        </div>
      </div>
    </main>
  );
}