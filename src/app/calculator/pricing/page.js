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
  LEAD_TIME_BREAKDOWN,
  calcLeadTime,
  DISCOUNT_TIERS,
  calcAutoDiscount,
  PAYMENT_SCHEMAS,
  getPaymentSchema,
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

const DEFAULT_CASHFLOW = {
  millPrepayPercent: 100,
  daysToReceiveBalance: 22,
  safetyMarginPercent: 20,
};

const STORAGE_KEY = "ru-timber-pricing-costs";
const CASHFLOW_KEY = "ru-timber-cashflow-settings";

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
      <button type="button" onClick={() => setOpen(!open)}
        className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-300 active:scale-95">
        ℹ
      </button>
      {open && (
        <span onClick={() => setOpen(false)}
          className="absolute z-50 left-0 top-6 w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl leading-relaxed">
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
            <input type="number" value={value} onChange={onChange} onFocus={(e) => e.target.select()}
              step="0.01"
              className="w-[70px] p-1.5 text-right text-sm border-2 border-slate-300 rounded font-mono font-bold focus:border-orange-500 outline-none" />
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
    deal, updateDeal, isLoaded,
    addPosition, removePosition, clearPositions,
    customRoutes, addCustomRoute, removeCustomRoute,
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

  const [portSearch, setPortSearch] = useState("");
  const [expandedCountries, setExpandedCountries] = useState({});
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  const [customLoadingPort, setCustomLoadingPort] = useState("Novorossiysk");
  const [customDestPort, setCustomDestPort] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [customRate, setCustomRate] = useState("");

  const [showLeadTimeBreakdown, setShowLeadTimeBreakdown] = useState(false);
  
  const [cashflow, setCashflow] = useState(DEFAULT_CASHFLOW);
  const [showCashflowSettings, setShowCashflowSettings] = useState(false);
  const [showCashflowTimeline, setShowCashflowTimeline] = useState(false);

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
      if (savedCosts) setCosts({ ...DEFAULT_COSTS, ...JSON.parse(savedCosts) });
      const savedCashflow = localStorage.getItem(CASHFLOW_KEY);
      if (savedCashflow) setCashflow({ ...DEFAULT_CASHFLOW, ...JSON.parse(savedCashflow) });
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
    if (value === null || value === undefined) newValue = null;
    else {
      const num = parseFloat(value);
      newValue = isNaN(num) ? 0 : num;
    }
    const newCosts = { ...costs, [field]: newValue };
    setCosts(newCosts);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newCosts)); } catch (e) {}
  };

  const updateCashflow = (field, value) => {
    const num = parseFloat(value);
    const newCashflow = { ...cashflow, [field]: isNaN(num) ? 0 : num };
    setCashflow(newCashflow);
    try { localStorage.setItem(CASHFLOW_KEY, JSON.stringify(newCashflow)); } catch (e) {}
  };

  const resetCosts = () => {
    if (confirm("Сбросить параметры?")) {
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
    if (v === "") updateDeal({ [field]: "" });
    else {
      const num = parseFloat(v);
      if (!isNaN(num) && num >= 0) updateDeal({ [field]: num });
    }
  };

  const species = deal.species || "pine-spruce-50-50";
  const moisture = deal.moisture || "kd";
  const packaging = deal.packaging || "crate";
  const incoterm = deal.incoterm || "cif";
  const totalVol = deal.totalVolume === "" ? 0 : parseFloat(deal.totalVolume) || 50;
  const margin = deal.margin === "" ? 0 : parseFloat(deal.margin) || 18;
  const rate = deal.usdRubRate === "" ? 76.25 : parseFloat(deal.usdRubRate) || 76.25;
  
  // 🆕 PAYMENT SCHEMA
  const paymentSchemaId = deal.paymentSchema || "prepay100";
  const paymentSchema = getPaymentSchema(paymentSchemaId);

  const activeRoute = useMemo(() => {
    if (deal.customRoute) {
      return {
        type: "custom",
        loadingPort: deal.customRoute.loadingPort,
        loadingPortFlag: "🇷🇺",
        destinationPort: deal.customRoute.destinationPort,
        country: deal.customRoute.country,
        flag: deal.customRoute.flag || "🌍",
        rate: deal.customRoute.rate,
        transit: 21,
      };
    }
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
        transit: preset.transit || 21,
      };
    }
    return {
      type: "preset", loadingPort: "Novorossiysk", loadingPortFlag: "🇷🇺",
      destinationPort: "Jebel Ali", country: "UAE", flag: "🇦🇪", rate: 2400, transit: 21,
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
    ? costs.millPriceOverride : calculatedMillPrice;
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
  if (["fca-factory", "fca-port", "fob", "cif"].includes(incoterm)) totalCostPerM3 += factoryLoadingPerM3;
  if (["fca-port", "fob", "cif"].includes(incoterm)) totalCostPerM3 += landTransportPerM3;
  if (["fob", "cif"].includes(incoterm)) totalCostPerM3 += portTHCPerM3 + portBLPerM3 + portTelexPerM3 + portOtherPerM3;
  if (incoterm === "cif") totalCostPerM3 += oceanPerM3;

  const insurancePerM3 = incoterm === "cif" ? (costs.insuranceRate / 100) * totalCostPerM3 : 0;
  const insuranceTotal = insurancePerM3 * totalVol;
  const insurancePerContainer = containers > 0 ? insuranceTotal / containers : 0;
  if (incoterm === "cif") totalCostPerM3 += insurancePerM3;

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
  const subtotal = sellPricePerM3 * totalVol;
  const totalProfit = profitPerM3 * totalVol;
  const profitPerContainer = containers > 0 ? totalProfit / containers : 0;

  const leadTimeAuto = calcLeadTime(deal.freightRoute, activeRoute.transit);
  const leadTimeTotal = deal.leadTimeOverride !== null && deal.leadTimeOverride !== undefined
    ? parseInt(deal.leadTimeOverride) : leadTimeAuto.total;

  const basketContainers = (deal.positions || []).reduce((sum, p) => sum + (p.containers || 0), 0);
  const totalContainersForDiscount = basketContainers > 0 ? basketContainers : containers;
  const autoDiscountPercent = calcAutoDiscount(totalContainersForDiscount);
  let appliedDiscountPercent = 0;
  if (deal.discountMode === "auto" || !deal.discountMode) appliedDiscountPercent = autoDiscountPercent;
  else if (deal.discountMode === "custom") appliedDiscountPercent = parseFloat(deal.customDiscountPercent) || 0;
  
  const discountAmount = (subtotal * appliedDiscountPercent) / 100;
  const grandTotal = subtotal - discountAmount;

  // ═══════════════════════════════════════════
  // 🆕 CASH FLOW с PAYMENT SCHEMA
  // ═══════════════════════════════════════════
  
  const millCostPerCont = millPricePerContainer + factoryLoadingPerContainer;
  const logisticsPerCont = landTransportPerContainer + costs.portTHC + costs.portBL + costs.portTelex + costs.portOther;
  const oceanInsurancePerCont = oceanPerContainer + insurancePerContainer;
  const dutyPerCont = dutyPerContainer;
  
  const totalSpendPerCont = millCostPerCont + logisticsPerCont + oceanInsurancePerCont + dutyPerCont;
  const totalMillSpend = (millCostPerCont * (cashflow.millPrepayPercent / 100)) * containers;
  const totalLogisticsSpend = logisticsPerCont * containers;
  const totalOceanInsuranceSpend = oceanInsurancePerCont * containers;
  const totalDutySpend = dutyPerCont * containers;
  
  const totalSpend = totalMillSpend + totalLogisticsSpend + totalOceanInsuranceSpend + totalDutySpend;
  
  // 🆕 По выбранной схеме
  const buyerAdvance = (grandTotal * paymentSchema.advancePercent) / 100;
  const buyerBalance = grandTotal - buyerAdvance;
  
  // Капитал нужен
  const capitalNeeded = Math.max(0, totalSpend - buyerAdvance);
  const safetyCapital = capitalNeeded * (1 + cashflow.safetyMarginPercent / 100);
  
  const daysFrozen = paymentSchema.advancePercent === 100 ? 0 : cashflow.daysToReceiveBalance;
  
  const profitAfterDiscount = totalProfit - discountAmount;
  const roiPeriod = capitalNeeded > 0 ? (profitAfterDiscount / capitalNeeded) * 100 : 0;
  const roiAnnual = daysFrozen > 0 ? roiPeriod * (365 / daysFrozen) : (capitalNeeded === 0 ? Infinity : 0);
  
  const timeline = useMemo(() => {
    const events = [];
    
    // Day 0: получаем аванс от покупателя
    if (buyerAdvance > 0) {
      events.push({ 
        day: 0, 
        label: `Buyer advance (${paymentSchema.advancePercent}%)`, 
        amount: buyerAdvance, 
        type: "in" 
      });
    }
    
    // Day 0: платим лесопилке
    events.push({ 
      day: 0, 
      label: `Mill payment (${cashflow.millPrepayPercent}%)`, 
      amount: -totalMillSpend, 
      type: "out" 
    });
    
    // Day 17: land transport
    events.push({ day: 17, label: "Land transport", amount: -totalLogisticsSpend, type: "out" });
    
    // Day 21: ocean + insurance + duty
    if (incoterm === "cif") {
      events.push({ day: 21, label: "Ocean freight + Insurance", amount: -totalOceanInsuranceSpend, type: "out" });
    }
    if (!dutyFree) {
      events.push({ day: 21, label: "Export duty", amount: -totalDutySpend, type: "out" });
    }
    
    // Day X: получаем остаток (если не 100% prepay)
    if (paymentSchema.balancePercent > 0) {
      events.push({ 
        day: cashflow.daysToReceiveBalance, 
        label: `Buyer balance (${paymentSchema.balancePercent}%)`, 
        amount: buyerBalance, 
        type: "in" 
      });
    }
    
    // Day leadTime: доставка
    events.push({ day: leadTimeTotal, label: "Cargo delivered ✅", amount: 0, type: "info" });
    
    events.sort((a, b) => a.day - b.day);
    let cumulative = 0;
    return events.map(e => {
      cumulative += e.amount;
      return { ...e, cumulative };
    });
  }, [buyerAdvance, buyerBalance, paymentSchema, cashflow, totalMillSpend, totalLogisticsSpend, totalOceanInsuranceSpend, totalDutySpend, incoterm, dutyFree, leadTimeTotal]);

  const maxGapAmount = Math.abs(Math.min(...timeline.map(e => e.cumulative), 0));
  
  const scalingScenarios = [1, 2, 3, 5, 10].map(n => ({
    containers: n,
    capital: (capitalNeeded / Math.max(containers, 1)) * n,
    safetyCapital: (safetyCapital / Math.max(containers, 1)) * n,
    profit: (profitAfterDiscount / Math.max(containers, 1)) * n,
  }));

  useEffect(() => {
    if (!isLoaded) return;
    if (totalVol <= 0 || sellPricePerM3 <= 0) return;

    const needsUpdate =
      deal.finalPricePerM3 !== sellPricePerM3 ||
      deal.finalContainers !== containers ||
      deal.finalTotalAmount !== subtotal ||
      deal.finalCostPerM3 !== totalCostWithDutyPerM3;

    if (needsUpdate) {
      updateDeal({
        finalPricePerM3: sellPricePerM3,
        finalCostPerM3: totalCostWithDutyPerM3,
        finalContainers: containers,
        finalTotalAmount: subtotal,
        finalProfitPerM3: profitPerM3,
        finalProfitTotal: totalProfit,
        finalIncoterm: incoterm,
        finalFreightRoute: deal.freightRoute,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, sellPricePerM3, totalCostWithDutyPerM3, containers, subtotal, profitPerM3, totalProfit, incoterm]);

  const handleAddToBasket = () => {
    if (totalVol <= 0 || sellPricePerM3 <= 0) {
      alert("Сначала заполни калькулятор");
      return;
    }
    addPosition({
      species, speciesLabel: SPECIES_NAMES[species] || species,
      thickness: parseFloat(deal.thickness) || 50,
      width: parseFloat(deal.width) || 150,
      length: parseFloat(deal.length) || 6000,
      moisture, moistureLabel: MOISTURE_LABELS[moisture] || moisture,
      packaging, packagingLabel: PACKAGING_LABELS[packaging] || packaging,
      totalVolume: totalVol, containers,
      volumePerContainer: containers > 0 ? totalVol / containers : 0,
      pricePerM3: sellPricePerM3, costPerM3: totalCostWithDutyPerM3,
      profitPerM3, totalAmount: subtotal, totalProfit,
      incoterm, freightRoute: deal.freightRoute, margin,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const positions = deal.positions || [];
  const basketTotalVolume = positions.reduce((sum, p) => sum + (p.totalVolume || 0), 0);
  const basketTotalContainers = positions.reduce((sum, p) => sum + (p.containers || 0), 0);
  const basketTotalAmount = positions.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const routesByCountry = useMemo(() => {
    const groups = {};
    Object.entries(FREIGHT_PRESETS).forEach(([key, route]) => {
      if (!groups[route.country]) groups[route.country] = { flag: route.flag, routes: [] };
      groups[route.country].routes.push({ key, ...route });
    });
    return groups;
  }, []);

  const popularRoutes = useMemo(() => {
    return Object.entries(FREIGHT_PRESETS).filter(([_, r]) => r.star).map(([key, r]) => ({ key, ...r }));
  }, []);

  const searchResults = useMemo(() => {
    if (!portSearch.trim()) return [];
    const q = portSearch.toLowerCase();
    return Object.entries(FREIGHT_PRESETS)
      .filter(([_, r]) => r.port.toLowerCase().includes(q) || r.country.toLowerCase().includes(q) || r.label.toLowerCase().includes(q))
      .map(([key, r]) => ({ key, ...r })).slice(0, 10);
  }, [portSearch]);

  const applyCustomRoute = () => {
    if (!customDestPort.trim() || !customRate) {
      alert("Заполни Destination Port и Rate");
      return;
    }
    const routeData = {
      loadingPort: customLoadingPort.trim() || "Novorossiysk",
      destinationPort: customDestPort.trim(),
      country: customCountry.trim(),
      flag: "🌍", rate: parseFloat(customRate),
    };
    addCustomRoute(routeData);
    updateDeal({ customRoute: routeData, freightRoute: null });
    setCustomDestPort(""); setCustomCountry(""); setCustomRate(""); setShowCustomForm(false);
  };

  const selectPresetRoute = (routeKey) => {
    updateDeal({ freightRoute: routeKey, customRoute: null });
    setUseCustomFreight(false);
    saveCustomFreight(false, customFreightRate);
  };

  const useCustomFromHistory = (route) => {
    updateDeal({
      customRoute: { loadingPort: route.loadingPort, destinationPort: route.destinationPort, country: route.country, flag: route.flag, rate: route.rate },
      freightRoute: null,
    });
  };

  const clearCustom = () => updateDeal({ customRoute: null, freightRoute: "nvr-jebelali" });
  const toggleCountry = (country) => setExpandedCountries(prev => ({ ...prev, [country]: !prev[country] }));

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
          <p className="text-sm text-slate-500 mt-1">💰 Cost breakdown · payment schema · cashflow · scaling</p>
        </div>

        {positions.length > 0 && (
          <section className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-purple-900 flex items-center gap-2">
                🛒 Quotation Basket
                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {positions.length} pos
                </span>
              </h2>
              <button onClick={() => { if (confirm("Очистить?")) clearPositions(); }}
                className="text-xs text-rose-600 active:scale-95">🗑 Clear</button>
            </div>
            <div className="space-y-2">
              {positions.map((p, idx) => (
                <div key={p.id} className="bg-white rounded-lg p-3 flex items-start gap-3 shadow-sm">
                  <div className="bg-purple-100 text-purple-800 font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">🌲 {p.speciesLabel} {p.thickness}×{p.width}×{p.length}mm</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.moistureLabel} · {p.containers} × 40HC</div>
                    <div className="text-xs font-mono mt-1">
                      {p.totalVolume.toFixed(1)} m³ × ${p.pricePerM3.toFixed(0)} = 
                      <span className="font-bold text-emerald-600 ml-1">${p.totalAmount.toFixed(0)}</span>
                    </div>
                  </div>
                  <button onClick={() => removePosition(p.id)} className="text-rose-500 text-xl active:scale-95">✕</button>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t-2 border-purple-300 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] uppercase text-purple-700">Vol</div>
                <div className="font-mono font-black text-purple-900">{basketTotalVolume.toFixed(1)}m³</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-purple-700">Cont</div>
                <div className="font-mono font-black text-purple-900">{basketTotalContainers}×40HC</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-purple-700">Total</div>
                <div className="font-mono font-black text-emerald-600 text-lg">${basketTotalAmount.toFixed(0)}</div>
              </div>
            </div>
            <Link href="/calculator/quotation" className="block w-full mt-4 bg-emerald-600 text-white text-center py-3 rounded-lg font-bold active:scale-95">
              📄 Generate Quotation →
            </Link>
          </section>
        )}

        <Reminder priority="high" icon="💱" title="Проверь курс USD/RUB"
          description="Закладывай запас 2-3%." dismissKey="usd-rate-tip-2026" />

        {/* Volume & Containers */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-3">📦 Volume & Containers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-500">Total Volume (m³)</label>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalVol.toFixed(2)}</div>
              <Link href="/calculator" className="text-xs text-orange-500 active:scale-95">✏ Edit →</Link>
            </div>
            <div>
              <label className="text-xs text-slate-500">Capacity (m³)</label>
              <input type="number" value={costs.containerCapacity}
                onChange={(e) => updateCost("containerCapacity", e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-lg font-bold focus:border-orange-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Containers</label>
              <input type="number" value={containers}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setManualContainers(isNaN(v) ? null : Math.max(1, v));
                }}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border-2 border-orange-500 rounded-lg text-lg font-bold outline-none" />
              <div className="text-xs text-slate-500 mt-1">
                Fill: <span className={`font-bold ${fillRate < 90 ? "text-rose-500" : "text-emerald-600"}`}>{fillRate.toFixed(0)}%</span>
                {manualContainers !== null && <button onClick={() => setManualContainers(null)} className="ml-2 text-orange-500 active:scale-95">🔄</button>}
              </div>
            </div>
          </div>
        </section>

        {/* FREIGHT ROUTE */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-3">🚢 Freight Route</h2>

          <div className={`rounded-xl p-4 mb-4 border-2 ${
            activeRoute.type === "custom" 
              ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400" 
              : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400"
          }`}>
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-60 mb-2">
              📍 CURRENT {activeRoute.type === "custom" && "(CUSTOM)"}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-black">
                  <span>{activeRoute.loadingPortFlag}</span>
                  <span className="truncate">{activeRoute.loadingPort}</span>
                  <span className="text-orange-500">→</span>
                  <span>{activeRoute.flag}</span>
                  <span className="truncate">{activeRoute.destinationPort}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {activeRoute.country} · <span className="font-mono font-bold">${activeRoute.rate}</span>
                  {activeRoute.type === "preset" && <span className="ml-2 text-blue-600">🚢 {activeRoute.transit}d</span>}
                </div>
              </div>
              {activeRoute.type === "custom" && (
                <button onClick={clearCustom} className="bg-white text-rose-600 text-xs px-3 py-2 rounded-lg border border-rose-300 active:scale-95">✕</button>
              )}
            </div>
          </div>

          <input type="text" value={portSearch} onChange={(e) => setPortSearch(e.target.value)}
            placeholder="🔍 Search port..."
            className="w-full p-3 border-2 border-slate-300 rounded-lg text-sm focus:border-orange-500 outline-none mb-4" />

          {portSearch.trim() && (
            <div className="mb-4 bg-slate-50 rounded-lg p-3">
              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">
                  Не найдено. <button onClick={() => setShowCustomForm(true)} className="text-orange-500 underline">Custom Port</button>
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map(r => (
                    <button key={r.key} onClick={() => { selectPresetRoute(r.key); setPortSearch(""); }}
                      className={`w-full text-left p-2 rounded text-sm active:scale-95 flex items-center justify-between ${
                        deal.freightRoute === r.key && !deal.customRoute ? "bg-orange-500 text-white" : "bg-white hover:bg-orange-50"
                      }`}>
                      <div className="flex items-center gap-2">
                        <span>{r.flag}</span><span className="font-bold">{r.port}</span>
                        <span className="text-xs opacity-75">· {r.transit}d</span>
                      </div>
                      <span className="font-mono font-bold text-xs">${r.rate}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!portSearch.trim() && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 mb-2">⭐ POPULAR</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {popularRoutes.map(r => {
                  const active = deal.freightRoute === r.key && !deal.customRoute;
                  return (
                    <button key={r.key} onClick={() => selectPresetRoute(r.key)}
                      className={`p-3 rounded-lg text-left text-sm active:scale-95 border-2 ${
                        active ? "bg-orange-500 text-white border-orange-600 shadow-lg" : "bg-slate-50 border-transparent hover:border-orange-300"
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="font-bold flex items-center gap-1"><span>{r.flag}</span><span>{r.port}</span></div>
                        <span className="font-mono text-xs font-bold">${r.rate}</span>
                      </div>
                      <div className="text-[10px] opacity-75 mt-1">{r.country} · {r.transit}d</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!portSearch.trim() && (
            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 mb-2">📋 ALL ROUTES</div>
              <div className="space-y-2">
                {Object.entries(routesByCountry).map(([country, data]) => {
                  const isExpanded = expandedCountries[country];
                  return (
                    <div key={country} className="bg-slate-50 rounded-lg overflow-hidden">
                      <button onClick={() => toggleCountry(country)}
                        className="w-full p-3 flex items-center justify-between hover:bg-slate-100 active:scale-[0.99] text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{data.flag}</span>
                          <span className="font-bold">{country}</span>
                          <span className="text-xs text-slate-500">({data.routes.length})</span>
                        </div>
                        <span>{isExpanded ? "▲" : "▼"}</span>
                      </button>
                      {isExpanded && (
                        <div className="p-2 space-y-1 border-t border-slate-200">
                          {data.routes.map(r => {
                            const active = deal.freightRoute === r.key && !deal.customRoute;
                            return (
                              <button key={r.key} onClick={() => selectPresetRoute(r.key)}
                                className={`w-full text-left p-2 rounded text-xs active:scale-95 flex items-center justify-between ${
                                  active ? "bg-orange-500 text-white" : "bg-white hover:bg-orange-50"
                                }`}>
                                <span className="flex items-center gap-2">
                                  <span className="font-bold">{r.port}</span>
                                  {r.star && <span>⭐</span>}
                                  <span className="text-[10px] opacity-60">{r.transit}d</span>
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

          <div className="mt-4 border-t-2 border-slate-200 pt-4">
            <button onClick={() => setShowCustomForm(!showCustomForm)}
              className="w-full bg-emerald-100 text-emerald-800 font-bold p-3 rounded-lg text-sm active:scale-95">
              {showCustomForm ? "▲ Hide" : "✏️ Custom Port"}
            </button>
            {showCustomForm && (
              <div className="mt-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold">Loading</label>
                    <input type="text" value={customLoadingPort} onChange={(e) => setCustomLoadingPort(e.target.value)}
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold">Destination *</label>
                    <input type="text" value={customDestPort} onChange={(e) => setCustomDestPort(e.target.value)}
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold">Country</label>
                    <input type="text" value={customCountry} onChange={(e) => setCustomCountry(e.target.value)}
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold">Rate $ *</label>
                    <input type="number" value={customRate} onChange={(e) => setCustomRate(e.target.value)}
                      className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm outline-none" />
                  </div>
                </div>
                <button onClick={applyCustomRoute}
                  className="w-full mt-3 bg-emerald-600 text-white font-bold py-3 rounded-lg text-sm active:scale-95">
                  ✓ Use Custom
                </button>
              </div>
            )}
            {customRoutes && customRoutes.length > 0 && (
              <div className="mt-3">
                <div className="text-xs font-bold text-slate-600 mb-2">📜 RECENT</div>
                <div className="space-y-1">
                  {customRoutes.slice(0, 5).map(r => (
                    <div key={r.id} className="bg-slate-50 rounded p-2 flex items-center justify-between gap-2 text-xs">
                      <button onClick={() => useCustomFromHistory(r)} className="flex-1 text-left hover:text-orange-600 active:scale-95">
                        <span className="font-bold">{r.loadingPort} → {r.destinationPort}</span>
                        <span className="ml-2 font-mono text-emerald-600 font-bold">${r.rate}</span>
                      </button>
                      <button onClick={() => removeCustomRoute(r.id)} className="text-rose-500 active:scale-95">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Override freight */}
        <section className={`rounded-xl p-5 shadow-sm border-2 ${useCustomFreight ? "bg-emerald-50 border-emerald-400" : "bg-white border-slate-200"}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">✏️ Override Freight</h2>
            {useCustomFreight && <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold">ACTIVE</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500">Rate ($/40HC)</label>
              <input type="number" value={customFreightRate}
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  setCustomFreightRate(v);
                  if (useCustomFreight) saveCustomFreight(true, v);
                }}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-3 border-2 border-slate-300 rounded-lg text-xl font-bold outline-none" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { const newState = !useCustomFreight; setUseCustomFreight(newState); saveCustomFreight(newState, customFreightRate); }}
                className={`w-full p-3 rounded-lg font-bold text-sm active:scale-95 ${useCustomFreight ? "bg-slate-500 text-white" : "bg-emerald-600 text-white"}`}>
                {useCustomFreight ? "⬅ Use Route" : "✓ Override"}
              </button>
            </div>
          </div>
        </section>

        {/* Incoterms */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800">📋 Incoterms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
            {[
              { id: "exw", label: "EXW", ru: "Самовывоз" },
              { id: "fca-factory", label: "FCA завод", ru: "+погрузка" },
              { id: "fca-port", label: "FCA порт", ru: "+фура" },
              { id: "fob", label: "FOB", ru: "+судно" },
              { id: "cif", label: "CIF ⭐", ru: "+фрахт+страх." },
            ].map((t) => (
              <button key={t.id} onClick={() => updateDeal({ incoterm: t.id })}
                className={`p-2 rounded-lg text-xs active:scale-95 border-2 ${
                  deal.incoterm === t.id ? "bg-orange-500 text-white border-orange-600 shadow-lg" : "bg-slate-100 border-transparent"
                }`}>
                <div className="font-bold">{t.label}</div>
                <div className="opacity-75 text-[10px] mt-1">{t.ru}</div>
              </button>
            ))}
          </div>
        </section>

        {/* LEAD TIME */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">⏱ Lead Time</h2>
            <button onClick={() => setShowLeadTimeBreakdown(!showLeadTimeBreakdown)}
              className="text-xs text-orange-500 active:scale-95">
              {showLeadTimeBreakdown ? "▲ Hide" : "▼ Breakdown"}
            </button>
          </div>
          <div className={`rounded-xl p-4 mb-3 border-2 ${
            deal.leadTimeOverride !== null && deal.leadTimeOverride !== undefined
              ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400"
              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400"
          }`}>
            <div className="text-[10px] uppercase font-bold opacity-60 mb-1">
              📅 TOTAL {deal.leadTimeOverride !== null && deal.leadTimeOverride !== undefined && "(OVERRIDE)"}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{leadTimeTotal}</span>
              <span className="text-lg text-slate-600">days</span>
              <span className="text-xs text-slate-500">from advance</span>
            </div>
          </div>
          {showLeadTimeBreakdown && (
            <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs space-y-2">
              <div className="flex justify-between"><span>🪚 Production</span><span className="font-mono font-bold">{leadTimeAuto.production}d</span></div>
              <div className="flex justify-between"><span>🚛 Land</span><span className="font-mono font-bold">{leadTimeAuto.landTransport}d</span></div>
              <div className="flex justify-between"><span>⚓ Port</span><span className="font-mono font-bold">{leadTimeAuto.portHandling}d</span></div>
              <div className="flex justify-between text-blue-700"><span>🚢 Ocean</span><span className="font-mono font-bold">{leadTimeAuto.ocean}d</span></div>
              <div className="flex justify-between"><span>📦 Discharge</span><span className="font-mono font-bold">{leadTimeAuto.discharge}d</span></div>
              <div className="flex justify-between border-t-2 border-slate-300 pt-2 font-bold"><span>TOTAL</span><span className="font-mono">{leadTimeAuto.total}d</span></div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-slate-500 font-bold">Override</label>
              <input type="number" value={deal.leadTimeOverride ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  updateDeal({ leadTimeOverride: v === "" ? null : parseInt(v) });
                }}
                onFocus={(e) => e.target.select()}
                placeholder={`Auto: ${leadTimeAuto.total}`}
                className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-base font-bold outline-none" />
            </div>
            {deal.leadTimeOverride !== null && deal.leadTimeOverride !== undefined && (
              <button onClick={() => updateDeal({ leadTimeOverride: null })}
                className="bg-orange-100 text-orange-700 px-3 py-2 rounded text-xs font-bold active:scale-95">🔄 Auto</button>
            )}
          </div>
        </section>

        {/* COST BREAKDOWN */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">💰 Cost Breakdown</h2>
            <button onClick={resetCosts} className="text-xs text-rose-500 active:scale-95">🔄 Reset</button>
          </div>

          <CostRow icon="🪵" label={`Mill price (${species} ${moisture})${costs.millPriceOverride !== null ? " ✏️" : ""}`}
            perM3={millPricePerM3} perContainer={millPricePerContainer} total={millPriceTotal}
            badge={costs.millPriceOverride !== null ? "MANUAL" : null}
            editable value={costs.millPriceOverride !== null ? costs.millPriceOverride : calculatedMillPrice}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || v === null) updateCost("millPriceOverride", null);
              else updateCost("millPriceOverride", parseFloat(v) || 0);
            }}
            unit="$/m³" />

          {["fca-factory", "fca-port", "fob", "cif"].includes(incoterm) && (
            <CostRow icon="🚚" label="Factory loading" perM3={factoryLoadingPerM3} perContainer={factoryLoadingPerContainer} total={factoryLoadingTotal}
              editable value={costs.factoryLoading} onChange={(e) => updateCost("factoryLoading", e.target.value)} unit="$/m³" />
          )}
          {["fca-port", "fob", "cif"].includes(incoterm) && (
            <CostRow icon="🚛" label="Land transport" perM3={landTransportPerM3} perContainer={landTransportPerContainer} total={landTransportTotal}
              editable value={costs.landTransport} onChange={(e) => updateCost("landTransport", e.target.value)} unit="$/cont" />
          )}
          {["fob", "cif"].includes(incoterm) && (
            <>
              <CostRow icon="⚓" label="Port THC" perM3={portTHCPerM3} perContainer={costs.portTHC} total={portTHCTotal}
                editable value={costs.portTHC} onChange={(e) => updateCost("portTHC", e.target.value)} unit="$/cont" />
              <CostRow icon="📄" label="B/L" perM3={portBLPerM3} perContainer={costs.portBL} total={portBLTotal}
                editable value={costs.portBL} onChange={(e) => updateCost("portBL", e.target.value)} unit="$/cont" />
              <CostRow icon="📡" label="Telex" perM3={portTelexPerM3} perContainer={costs.portTelex} total={portTelexTotal}
                editable value={costs.portTelex} onChange={(e) => updateCost("portTelex", e.target.value)} unit="$/cont" />
              <CostRow icon="📋" label="Other port" perM3={portOtherPerM3} perContainer={costs.portOther} total={portOtherTotal}
                editable value={costs.portOther} onChange={(e) => updateCost("portOther", e.target.value)} unit="$/cont" />
            </>
          )}
          {incoterm === "cif" && (
            <CostRow icon="🚢" label={`Ocean (${activeRoute.loadingPort} → ${activeRoute.destinationPort})`}
              perM3={oceanPerM3} perContainer={oceanPerContainer} total={oceanTotal}
              badge={useCustomFreight ? "OVERRIDE" : activeRoute.type === "custom" ? "CUSTOM" : null} />
          )}
          {incoterm === "cif" && (
            <CostRow icon="🛡" label="Insurance" perM3={insurancePerM3} perContainer={insurancePerContainer} total={insuranceTotal}
              editable value={costs.insuranceRate} onChange={(e) => updateCost("insuranceRate", e.target.value)} unit="%" />
          )}
          <CostRow icon="🏛" label={`Export duty ${dutyFree ? "(0%)" : `(${costs.exportDutyRate}%)`}`}
            perM3={dutyPerM3} perContainer={dutyPerContainer} total={dutyTotal}
            success={dutyFree} danger={!dutyFree} editable={!dutyFree}
            value={costs.exportDutyRate} onChange={(e) => updateCost("exportDutyRate", e.target.value)} unit="%" />

          <div className="mt-3 pt-3 border-t-2 border-slate-900 bg-slate-50 -mx-5 px-5 py-3">
            <div className="font-bold text-lg text-slate-900">TOTAL COST</div>
            <div className="text-sm font-mono mt-1">
              <span className="text-2xl font-black">${totalCostWithDutyPerM3.toFixed(2)}</span>/m³
              <span className="text-slate-400 mx-2">·</span>
              <span className="font-bold">${totalCostWithDutyTotal.toFixed(0)} total</span>
            </div>
          </div>
        </section>

        {/* MARGIN */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800">📊 Margin & Exchange</h2>
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(COUNTRY_MARGINS).map(([country, m]) => (
                <button key={country} onClick={() => updateDeal({ margin: m })}
                  className={`px-3 py-2 rounded-lg text-xs active:scale-95 border-2 ${
                    deal.margin === m ? "bg-orange-500 text-white border-orange-600 shadow-lg" : "bg-slate-100 border-transparent"
                  }`}>
                  {country === "india" && "🇮🇳"}{country === "china" && "🇨🇳"}{country === "uae" && "🇦🇪"}{country === "egypt" && "🇪🇬"}{country === "turkey" && "🇹🇷"} {m}%
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
              </div>
            </div>
          </div>
        </section>

        {/* VOLUME DISCOUNT */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-3">💸 Volume Discount</h2>
          <div className="bg-slate-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-5 gap-1 text-center text-xs">
              {DISCOUNT_TIERS.map((tier, idx) => {
                const isActive = totalContainersForDiscount >= tier.minContainers && totalContainersForDiscount <= tier.maxContainers;
                return (
                  <div key={idx} className={`p-2 rounded ${isActive ? "bg-emerald-500 text-white shadow-lg scale-105 font-bold" : "bg-white"}`}>
                    <div className="font-bold">{tier.label}</div>
                    <div className="text-lg font-black mt-0.5">{tier.percent}%</div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 mt-2 text-center">
              {totalContainersForDiscount} × 40HC → <span className="font-bold text-emerald-600">{autoDiscountPercent}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button onClick={() => updateDeal({ discountMode: "none" })}
              className={`p-3 rounded-lg text-xs active:scale-95 border-2 ${deal.discountMode === "none" ? "bg-slate-700 text-white border-slate-800 shadow-lg" : "bg-slate-100 border-transparent"}`}>
              <div className="font-bold">❌ No</div><div className="opacity-75 mt-0.5">0%</div>
            </button>
            <button onClick={() => updateDeal({ discountMode: "auto" })}
              className={`p-3 rounded-lg text-xs active:scale-95 border-2 ${deal.discountMode === "auto" || !deal.discountMode ? "bg-emerald-500 text-white border-emerald-600 shadow-lg" : "bg-slate-100 border-transparent"}`}>
              <div className="font-bold">⚡ Auto</div><div className="opacity-75 mt-0.5">{autoDiscountPercent}%</div>
            </button>
            <button onClick={() => updateDeal({ discountMode: "custom" })}
              className={`p-3 rounded-lg text-xs active:scale-95 border-2 ${deal.discountMode === "custom" ? "bg-orange-500 text-white border-orange-600 shadow-lg" : "bg-slate-100 border-transparent"}`}>
              <div className="font-bold">✏️ Custom</div><div className="opacity-75 mt-0.5">{deal.customDiscountPercent || 0}%</div>
            </button>
          </div>
          {deal.discountMode === "custom" && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-3">
              <label className="text-xs font-bold">Custom %</label>
              <input type="number" step="0.1" value={deal.customDiscountPercent || ""}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  updateDeal({ customDiscountPercent: isNaN(v) ? 0 : Math.max(0, Math.min(50, v)) });
                }}
                onFocus={(e) => e.target.select()}
                className="w-full mt-1 p-2 border-2 border-orange-300 rounded text-lg font-bold outline-none" />
            </div>
          )}
          {appliedDiscountPercent > 0 && (
            <div className="mt-3 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-700 font-bold">💸 APPLIED</div>
                <div className="text-2xl font-black text-emerald-700">-{appliedDiscountPercent}% = -${discountAmount.toFixed(0)}</div>
              </div>
            </div>
          )}
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* 🆕 ━━━━━━ PAYMENT SCHEMA SELECTOR ━━━━━ */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-400 rounded-xl p-5 shadow-lg">
          <h2 className="font-black text-slate-900 flex items-center mb-1 text-lg">
            💳 Payment Schema
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            🎯 Выбери схему оплаты для этой сделки. Влияет на безопасность и капитал.
          </p>

          <div className="grid grid-cols-1 gap-2 mb-4">
            {Object.values(PAYMENT_SCHEMAS).map(schema => {
              const isActive = paymentSchemaId === schema.id;
              const colorMap = {
                emerald: { bg: "bg-emerald-500", border: "border-emerald-600", text: "text-emerald-700", bgLight: "bg-emerald-50" },
                blue: { bg: "bg-blue-500", border: "border-blue-600", text: "text-blue-700", bgLight: "bg-blue-50" },
                amber: { bg: "bg-amber-500", border: "border-amber-600", text: "text-amber-700", bgLight: "bg-amber-50" },
                purple: { bg: "bg-purple-500", border: "border-purple-600", text: "text-purple-700", bgLight: "bg-purple-50" },
              };
              const colors = colorMap[schema.color] || colorMap.amber;
              
              return (
                <button key={schema.id}
                  onClick={() => updateDeal({ paymentSchema: schema.id })}
                  className={`text-left p-4 rounded-lg transition-all active:scale-[0.98] border-2 ${
                    isActive 
                      ? `${colors.bg} text-white ${colors.border} shadow-lg` 
                      : `bg-white text-slate-700 border-transparent hover:${colors.border}`
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{schema.icon}</span>
                      <span className="font-black text-base">{schema.nameRu}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs ${isActive ? "opacity-90" : "opacity-60"}`}>
                        Risk: {schema.risk === "zero" ? "🟢 нет" : schema.risk === "low" ? "🟡 низкий" : schema.risk === "medium" ? "🟠 средний" : "🔴 высокий"}
                      </div>
                      <div className={`text-xs ${isActive ? "opacity-90" : "opacity-60"}`}>
                        Capital: {schema.capitalNeed === "none" ? "🟢 0$" : schema.capitalNeed === "medium" ? "🟡 средне" : "🔴 много"}
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

          {/* Текущая схема — карточка с расчётом */}
          <div className="bg-white rounded-xl p-4 border-2 border-purple-300 shadow-inner">
            <div className="text-xs uppercase tracking-wider font-bold text-purple-700 mb-2">
              💼 SELECTED SCHEMA
            </div>
            <div className="text-2xl font-black text-slate-900 mb-2">
              {paymentSchema.icon} {paymentSchema.nameRu}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-xs text-emerald-700 font-bold">Buyer pays UPFRONT</div>
                <div className="text-2xl font-black text-emerald-700">${buyerAdvance.toFixed(0)}</div>
                <div className="text-xs text-emerald-600">{paymentSchema.advancePercent}% от Grand Total</div>
              </div>
              <div className={`rounded-lg p-3 ${paymentSchema.balancePercent === 0 ? "bg-slate-100" : "bg-amber-50"}`}>
                <div className={`text-xs font-bold ${paymentSchema.balancePercent === 0 ? "text-slate-500" : "text-amber-700"}`}>
                  Buyer pays AFTER
                </div>
                <div className={`text-2xl font-black ${paymentSchema.balancePercent === 0 ? "text-slate-500" : "text-amber-700"}`}>
                  ${buyerBalance.toFixed(0)}
                </div>
                <div className={`text-xs ${paymentSchema.balancePercent === 0 ? "text-slate-500" : "text-amber-600"}`}>
                  {paymentSchema.balancePercent}% {paymentSchema.balancePercent > 0 && `через ${cashflow.daysToReceiveBalance} дней`}
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-900 text-white rounded-lg text-xs">
              <div className="font-bold mb-1">📄 Для контракта (текст пункта 6.2):</div>
              <div className="opacity-90 italic">{paymentSchema.contractTextRu}</div>
            </div>
          </div>
        </section>

        {/* CASH FLOW */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-5 shadow-lg">
          <h2 className="font-black text-slate-900 flex items-center mb-1 text-lg">
            💰 Cash Flow & Working Capital
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            🎯 Капитал нужный для сделки. Зависит от выбранной Payment Schema.
          </p>

          <button onClick={() => setShowCashflowSettings(!showCashflowSettings)}
            className="w-full bg-white text-slate-700 font-bold p-2 rounded-lg text-xs active:scale-95 mb-3 border border-slate-300">
            {showCashflowSettings ? "▲ Hide settings" : "⚙️ Cash Flow Settings"}
          </button>

          {showCashflowSettings && (
            <div className="bg-white rounded-lg p-3 mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-bold">Mill prepay %</label>
                <input type="number" value={cashflow.millPrepayPercent}
                  onChange={(e) => updateCashflow("millPrepayPercent", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm font-bold outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-bold">Days to receive balance</label>
                <input type="number" value={cashflow.daysToReceiveBalance}
                  onChange={(e) => updateCashflow("daysToReceiveBalance", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm font-bold outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-600 font-bold">Safety margin %</label>
                <input type="number" value={cashflow.safetyMarginPercent}
                  onChange={(e) => updateCashflow("safetyMarginPercent", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full mt-1 p-2 border-2 border-slate-300 rounded text-sm font-bold outline-none" />
              </div>
            </div>
          )}

          {/* MAIN CARD */}
          <div className={`rounded-xl p-5 shadow-xl mb-4 ${
            capitalNeeded === 0 
              ? "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white" 
              : "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          }`}>
            <div className="text-xs uppercase tracking-wider opacity-60 mb-2 font-bold">
              💎 YOUR CAPITAL NEEDED ({containers} × 40HC) · {paymentSchema.nameRu}
            </div>
            
            {capitalNeeded === 0 ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-2">🎉</div>
                <div className="text-3xl font-black text-emerald-300">$0</div>
                <div className="text-sm opacity-90 mt-1">Капитал НЕ НУЖЕН!</div>
                <div className="text-xs opacity-75 mt-2">Покупатель оплатил всё авансом</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-orange-400">
                      ${capitalNeeded.toFixed(0)}
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      ≈ ₽{(capitalNeeded * rate).toLocaleString("ru-RU", { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-60">+ Safety {cashflow.safetyMarginPercent}%</div>
                    <div className="text-xl font-bold text-amber-400">${safetyCapital.toFixed(0)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700">
                  <div>
                    <div className="text-xs opacity-50">⏱ Frozen</div>
                    <div className="font-bold text-sm">{daysFrozen}d</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-50">📈 ROI</div>
                    <div className="font-bold text-sm text-emerald-400">
                      {roiAnnual === Infinity ? "∞" : `${roiAnnual.toFixed(0)}%`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-50">💎 Profit</div>
                    <div className="font-bold text-sm text-emerald-400">${profitAfterDiscount.toFixed(0)}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* TIMELINE */}
          <button onClick={() => setShowCashflowTimeline(!showCashflowTimeline)}
            className="w-full bg-white text-slate-700 font-bold p-3 rounded-lg text-sm active:scale-95 mb-3 border-2 border-slate-300">
            📅 {showCashflowTimeline ? "▲ Hide timeline" : "▼ Show payment timeline"}
          </button>

          {showCashflowTimeline && (
            <div className="bg-white rounded-lg p-4 mb-3">
              <div className="space-y-2">
                {timeline.map((e, idx) => {
                  const minCum = Math.min(...timeline.map(t => t.cumulative));
                  const isMax = e.cumulative === minCum && e.cumulative < 0;
                  return (
                    <div key={idx} className={`p-2 rounded text-xs ${
                      isMax ? "bg-rose-50 border-2 border-rose-300" :
                      e.type === "in" ? "bg-emerald-50" : 
                      e.type === "out" ? "bg-slate-50" : 
                      "bg-blue-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold w-12 text-slate-500">D{e.day}</span>
                          <span>{e.label}</span>
                          {isMax && <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">MAX</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          {e.amount !== 0 && (
                            <span className={`font-mono font-bold ${e.amount > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                              {e.amount > 0 ? "+" : ""}${e.amount.toFixed(0)}
                            </span>
                          )}
                          <span className={`font-mono text-xs ${e.cumulative < 0 ? "text-rose-700 font-bold" : "text-emerald-700 font-bold"}`}>
                            = ${e.cumulative.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-2 bg-amber-50 border border-amber-300 rounded text-xs text-amber-800">
                ⚠️ <strong>Max gap:</strong> -${maxGapAmount.toFixed(0)}
              </div>
            </div>
          )}

          {/* SCALING */}
          {capitalNeeded > 0 && (
            <div className="bg-white rounded-lg p-4 mb-3">
              <div className="text-xs font-bold text-slate-700 mb-3">📊 Scaling capital</div>
              <div className="space-y-2">
                {scalingScenarios.map(s => {
                  const barWidth = Math.min(100, (s.capital / 200000) * 100);
                  const isCurrent = s.containers === containers;
                  return (
                    <div key={s.containers} className={`p-2 rounded ${isCurrent ? "bg-orange-100 border border-orange-300" : "bg-slate-50"}`}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold">{s.containers} cont {isCurrent && "← current"}</span>
                        <span className="font-mono font-bold">
                          ${s.capital.toFixed(0)} <span className="text-emerald-600 ml-2">+${s.profit.toFixed(0)}</span>
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                        <div className={`h-full ${isCurrent ? "bg-orange-500" : "bg-slate-400"}`}
                          style={{ width: `${barWidth}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RISK WARNINGS */}
          <div className={`border-2 rounded-lg p-4 mb-3 ${
            paymentSchema.risk === "zero" 
              ? "bg-emerald-50 border-emerald-300" 
              : "bg-rose-50 border-rose-300"
          }`}>
            <div className={`font-bold text-sm mb-2 flex items-center gap-2 ${
              paymentSchema.risk === "zero" ? "text-emerald-900" : "text-rose-900"
            }`}>
              {paymentSchema.risk === "zero" ? "✅ ZERO RISK" : "⚠️ RISK WARNINGS"}
            </div>
            <ul className={`text-xs space-y-1 ${paymentSchema.risk === "zero" ? "text-emerald-800" : "text-rose-800"}`}>
              {paymentSchema.risk === "zero" ? (
                <>
                  <li>• ✅ Покупатель оплатил всё авансом</li>
                  <li>• ✅ Нет риска неоплаты</li>
                  <li>• ✅ Капитал не нужен</li>
                  <li>• ✅ Идеально для первой сделки</li>
                </>
              ) : (
                <>
                  <li>• <strong>Если покупатель не платит {paymentSchema.balancePercent}%</strong> → потеря ${capitalNeeded.toFixed(0)}</li>
                  <li>• <strong>Курсовая разница:</strong> доходы в $, расходы в ₽</li>
                  <li>• <strong>Задержка отгрузки</strong> → ROI падает</li>
                </>
              )}
            </ul>
          </div>

          {/* PROTECTION OPTIONS (только если есть риск) */}
          {paymentSchema.risk !== "zero" && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
              <div className="font-bold text-emerald-900 text-sm mb-2">🛡 PROTECTION</div>
              <ul className="text-xs text-emerald-800 space-y-1">
                <li>• <strong>EXIAR insurance</strong> — страхование риска</li>
                <li>• <strong>L/C</strong> — переключи схему на L/C для гарантии</li>
                <li>• <strong>100% prepay</strong> для новых клиентов</li>
                <li>• <strong>Telex Release control</strong> — отправляй после получения остатка</li>
              </ul>
            </div>
          )}
        </section>

        {/* FINAL PRICING */}
        <section className="bg-slate-900 text-white rounded-xl p-5 shadow-lg">
          <h2 className="font-bold">🎯 Final Pricing</h2>
          <div className="text-xs opacity-60 mt-1">
            {incoterm.toUpperCase()} {activeRoute.destinationPort} · {margin}% · {totalVol.toFixed(2)}m³ · {containers}×40HC · {leadTimeTotal}d · {paymentSchema.icon} {paymentSchema.nameRu}
          </div>

          <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <div className="text-xs opacity-60 mb-2">💵 SELLING PRICE</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="text-xl sm:text-2xl font-black">${sellPricePerM3.toFixed(2)}</div><div className="text-xs opacity-50">per m³</div></div>
              <div className="border-l border-r border-slate-700"><div className="text-xl sm:text-2xl font-black">${sellPricePerContainer.toFixed(0)}</div><div className="text-xs opacity-50">per cont</div></div>
              <div><div className="text-xl sm:text-2xl font-black">${subtotal.toFixed(0)}</div><div className="text-xs opacity-50">subtotal</div></div>
            </div>
          </div>

          {appliedDiscountPercent > 0 && (
            <div className="mt-2 p-3 bg-emerald-900/40 border border-emerald-600 rounded-lg flex justify-between items-center">
              <div>
                <div className="text-xs opacity-75">💸 Discount ({appliedDiscountPercent}%)</div>
              </div>
              <div className="text-2xl font-black text-emerald-400">-${discountAmount.toFixed(0)}</div>
            </div>
          )}

          <div className="mt-2 p-4 bg-orange-600 rounded-lg">
            <div className="text-xs opacity-90 mb-1">💎 GRAND TOTAL</div>
            <div className="text-3xl font-black">${grandTotal.toFixed(0)}</div>
            <div className="text-xs opacity-75 mt-1">≈ ₽{(grandTotal * rate).toLocaleString("ru-RU", { maximumFractionDigits: 0 })}</div>
          </div>

          {/* Buyer payment schedule */}
          <div className="mt-2 p-4 bg-purple-700 rounded-lg">
            <div className="text-xs opacity-90 mb-2">💳 BUYER PAYMENT SCHEDULE</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{paymentSchema.icon} Advance ({paymentSchema.advancePercent}%):</span>
                <span className="font-bold">${buyerAdvance.toFixed(0)}</span>
              </div>
              {paymentSchema.balancePercent > 0 && (
                <div className="flex justify-between">
                  <span>📦 Balance ({paymentSchema.balancePercent}% after B/L):</span>
                  <span className="font-bold">${buyerBalance.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Capital */}
          <div className={`mt-2 p-4 rounded-lg ${capitalNeeded === 0 ? "bg-emerald-700" : "bg-amber-600"}`}>
            <div className="text-xs opacity-90 mb-1">💰 YOUR CAPITAL NEEDED</div>
            <div className="text-3xl font-black">${capitalNeeded.toFixed(0)}</div>
            <div className="text-xs opacity-75 mt-1">
              {capitalNeeded === 0 ? "🎉 Не нужен! 100% prepay" : `≈ ₽${(capitalNeeded * rate).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} · ${daysFrozen}d`}
            </div>
          </div>

          <div className="mt-3 p-4 bg-emerald-900/50 border border-emerald-700 rounded-lg">
            <div className="text-xs opacity-75 mb-2">💚 YOUR PROFIT</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="text-lg font-black text-emerald-400">${(profitAfterDiscount / totalVol).toFixed(2)}</div><div className="text-xs opacity-50">per m³</div></div>
              <div className="border-l border-r border-emerald-700/50"><div className="text-lg font-black text-emerald-400">${(profitAfterDiscount / containers).toFixed(0)}</div><div className="text-xs opacity-50">per cont</div></div>
              <div><div className="text-lg font-black text-emerald-400">${profitAfterDiscount.toFixed(0)}</div><div className="text-xs opacity-50">total</div></div>
            </div>
          </div>

          <button onClick={handleAddToBasket}
            className={`block w-full mt-5 text-white text-center py-4 rounded-lg font-black text-lg active:scale-95 ${
              justAdded ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-purple-600 hover:bg-purple-700"
            }`}>
            {justAdded ? <>✓ ADDED</> : <>➕ ADD TO BASKET</>}
          </button>

          <Link href="/calculator/container" className="block w-full mt-3 bg-orange-500 text-white text-center py-3 rounded-lg font-bold active:scale-95">
            📦 3D View →
          </Link>
          <Link href="/calculator/quotation" className="block w-full mt-2 bg-emerald-600 text-white text-center py-3 rounded-lg font-bold active:scale-95">
            📄 {positions.length > 0 ? `Generate Quotation (${positions.length})` : "Generate Quotation"} →
          </Link>
        </section>

        <div className="text-center text-xs text-slate-400">
          Powered by RU-TIMBER · +7 915 349 00 07
        </div>
      </div>
    </main>
  );
}