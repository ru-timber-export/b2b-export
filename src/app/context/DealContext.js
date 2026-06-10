"use client";

import { createContext, useContext, useState, useEffect } from "react";

// ═══════════════════════════════════════════════
// 💰 ЭКСПОРТНЫЕ КОНСТАНТЫ
// ═══════════════════════════════════════════════

export const SPECIES_BASE_PRICES = {
  "pine": 175,
  "spruce": 165,
  "pine-spruce-50-50": 170,
  "larch": 230,
  "cedar": 280,
};

export const DRYING_SURCHARGE = {
  "ad": 0,
  "kd": 55,
  "kd-light": 30,
};

export const PACKAGING_SURCHARGE = {
  "strapped": 0,
  "crate": 8,
  "premium": 18,
};

// ═══════════════════════════════════════════════
// 🚢 МАРШРУТЫ
// ═══════════════════════════════════════════════

export const FREIGHT_PRESETS = {
  // ━━━ 🇦🇪 ОАЭ ━━━
  "nvr-jebelali":     { label: "Новороссийск → Jebel Ali",     port: "Jebel Ali", country: "UAE", flag: "🇦🇪", rate: 2400, transit: 21, star: true },
  "nvr-khalifa":      { label: "Новороссийск → Khalifa",       port: "Khalifa (Abu Dhabi)", country: "UAE", flag: "🇦🇪", rate: 2500, transit: 22 },
  "nvr-sharjah":      { label: "Новороссийск → Sharjah",       port: "Sharjah / Hamriyah", country: "UAE", flag: "🇦🇪", rate: 2450, transit: 21 },
  "nvr-khorfakkan":   { label: "Новороссийск → Khor Fakkan",   port: "Khor Fakkan", country: "UAE", flag: "🇦🇪", rate: 2500, transit: 23 },
  "nvr-fujairah":     { label: "Новороссийск → Fujairah",      port: "Fujairah", country: "UAE", flag: "🇦🇪", rate: 2500, transit: 22 },
  
  // ━━━ 🇮🇳 ИНДИЯ ━━━
  "nvr-mumbai":       { label: "Новороссийск → Mumbai",        port: "Mumbai / Nhava Sheva (JNPT)", country: "India", flag: "🇮🇳", rate: 2700, transit: 18, star: true },
  "nvr-chennai":      { label: "Новороссийск → Chennai",       port: "Chennai", country: "India", flag: "🇮🇳", rate: 2750, transit: 22 },
  "nvr-mundra":       { label: "Новороссийск → Mundra",        port: "Mundra (Adani)", country: "India", flag: "🇮🇳", rate: 2650, transit: 17 },
  "nvr-kandla":       { label: "Новороссийск → Kandla",        port: "Kandla", country: "India", flag: "🇮🇳", rate: 2700, transit: 17 },
  "nvr-kolkata":      { label: "Новороссийск → Kolkata",       port: "Kolkata", country: "India", flag: "🇮🇳", rate: 2900, transit: 28 },
  "nvr-cochin":       { label: "Новороссийск → Cochin",        port: "Cochin / Kochi", country: "India", flag: "🇮🇳", rate: 2850, transit: 20 },
  "nvr-tuticorin":    { label: "Новороссийск → Tuticorin",     port: "Tuticorin", country: "India", flag: "🇮🇳", rate: 2850, transit: 22 },
  "nvr-hazira":       { label: "Новороссийск → Hazira",        port: "Hazira", country: "India", flag: "🇮🇳", rate: 2700, transit: 18 },
  
  // ━━━ 🇸🇦 САУДОВСКАЯ АРАВИЯ ━━━
  "nvr-dammam":       { label: "Новороссийск → Dammam",        port: "Dammam", country: "Saudi Arabia", flag: "🇸🇦", rate: 2700, transit: 23, star: true },
  "nvr-jeddah":       { label: "Новороссийск → Jeddah",        port: "Jeddah", country: "Saudi Arabia", flag: "🇸🇦", rate: 2500, transit: 14 },
  "nvr-yanbu":        { label: "Новороссийск → Yanbu",         port: "Yanbu", country: "Saudi Arabia", flag: "🇸🇦", rate: 2550, transit: 15 },
  "nvr-kingabdullah": { label: "Новороссийск → King Abdullah", port: "King Abdullah Port", country: "Saudi Arabia", flag: "🇸🇦", rate: 2600, transit: 15 },
  
  // ━━━ 🇪🇬 ЕГИПЕТ ━━━
  "nvr-alex":         { label: "Новороссийск → Alexandria",    port: "Alexandria", country: "Egypt", flag: "🇪🇬", rate: 1800, transit: 12, star: true },
  "nvr-damietta":     { label: "Новороссийск → Damietta",      port: "Damietta", country: "Egypt", flag: "🇪🇬", rate: 1900, transit: 12 },
  "nvr-portsaid":     { label: "Новороссийск → Port Said",     port: "Port Said", country: "Egypt", flag: "🇪🇬", rate: 1850, transit: 11 },
  "nvr-sokhna":       { label: "Новороссийск → Sokhna",        port: "Ain Sokhna (Red Sea)", country: "Egypt", flag: "🇪🇬", rate: 2100, transit: 14 },
  
  // ━━━ 🇹🇷 ТУРЦИЯ ━━━
  "nvr-istanbul":     { label: "Новороссийск → Istanbul",      port: "Istanbul (Ambarli)", country: "Türkiye", flag: "🇹🇷", rate: 1600, transit: 8, star: true },
  "nvr-mersin":       { label: "Новороссийск → Mersin",        port: "Mersin", country: "Türkiye", flag: "🇹🇷", rate: 1500, transit: 7 },
  "nvr-izmir":        { label: "Новороссийск → Izmir",         port: "Izmir", country: "Türkiye", flag: "🇹🇷", rate: 1700, transit: 9 },
  
  // ━━━ 🇶🇦 КАТАР ━━━
  "nvr-doha":         { label: "Новороссийск → Doha",          port: "Hamad Port (Doha)", country: "Qatar", flag: "🇶🇦", rate: 2800, transit: 24 },
  
  // ━━━ 🇰🇼 КУВЕЙТ ━━━
  "nvr-shuwaikh":     { label: "Новороссийск → Shuwaikh",      port: "Shuwaikh", country: "Kuwait", flag: "🇰🇼", rate: 2700, transit: 24 },
  
  // ━━━ 🇧🇭 БАХРЕЙН ━━━
  "nvr-bahrain":      { label: "Новороссийск → Khalifa Bin Salman", port: "Khalifa Bin Salman", country: "Bahrain", flag: "🇧🇭", rate: 2750, transit: 24 },
  
  // ━━━ 🇮🇶 ИРАК ━━━
  "nvr-ummqasr":      { label: "Новороссийск → Umm Qasr",      port: "Umm Qasr", country: "Iraq", flag: "🇮🇶", rate: 2900, transit: 26 },
  
  // ━━━ 🇨🇳 КИТАЙ ━━━
  "vlv-shanghai":     { label: "Владивосток → Shanghai",       port: "Shanghai", country: "China", flag: "🇨🇳", rate: 1800, transit: 5 },
  "vlv-ningbo":       { label: "Владивосток → Ningbo",         port: "Ningbo", country: "China", flag: "🇨🇳", rate: 1900, transit: 6 },
  "vlv-qingdao":      { label: "Владивосток → Qingdao",        port: "Qingdao", country: "China", flag: "🇨🇳", rate: 1700, transit: 4 },
  
  // ━━━ 🇵🇰 ПАКИСТАН ━━━
  "nvr-karachi":      { label: "Новороссийск → Karachi",       port: "Karachi", country: "Pakistan", flag: "🇵🇰", rate: 2800, transit: 24 },
  
  // ━━━ Из других портов РФ ━━━
  "spb-jebelali":     { label: "St.Petersburg → Jebel Ali",    port: "Jebel Ali", country: "UAE", flag: "🇦🇪", rate: 2800, transit: 28 },
  "vlv-mumbai":       { label: "Владивосток → Mumbai",         port: "Mumbai", country: "India", flag: "🇮🇳", rate: 2900, transit: 14 },
  "vlv-chennai":      { label: "Владивосток → Chennai",        port: "Chennai", country: "India", flag: "🇮🇳", rate: 2750, transit: 16 },
};

// LEAD TIME
export const LEAD_TIME_BREAKDOWN = {
  production: 14,
  landTransport: 3,
  portHandling: 4,
  discharge: 3,
};

export function calcLeadTime(routeKey, customTransit = null) {
  const { production, landTransport, portHandling, discharge } = LEAD_TIME_BREAKDOWN;
  let ocean = 21;
  
  if (customTransit !== null && customTransit !== undefined) {
    ocean = customTransit;
  } else if (routeKey && FREIGHT_PRESETS[routeKey]) {
    ocean = FREIGHT_PRESETS[routeKey].transit || 21;
  }
  
  return {
    production,
    landTransport,
    portHandling,
    ocean,
    discharge,
    total: production + landTransport + portHandling + ocean + discharge,
  };
}

// СКИДКИ по контейнерам
export const DISCOUNT_TIERS = [
  { minContainers: 1,  maxContainers: 1,    percent: 0,   label: "1 cont" },
  { minContainers: 2,  maxContainers: 3,    percent: 1.5, label: "2-3 cont" },
  { minContainers: 4,  maxContainers: 6,    percent: 3,   label: "4-6 cont" },
  { minContainers: 7,  maxContainers: 10,   percent: 5,   label: "7-10 cont" },
  { minContainers: 11, maxContainers: 9999, percent: 7,   label: "11+ cont" },
];

export function calcAutoDiscount(containers) {
  const c = parseInt(containers) || 0;
  if (c <= 0) return 0;
  const tier = DISCOUNT_TIERS.find(t => c >= t.minContainers && c <= t.maxContainers);
  return tier ? tier.percent : 0;
}

// ═══════════════════════════════════════════════
// 🆕 ━━━━━━ СХЕМЫ ОПЛАТЫ ━━━━━━
// ═══════════════════════════════════════════════
export const PAYMENT_SCHEMAS = {
  "prepay100": {
    id: "prepay100",
    name: "100% Prepayment",
    nameRu: "100% Предоплата",
    advancePercent: 100,
    balancePercent: 0,
    description: "Full payment before shipment",
    descriptionRu: "Полная оплата до отгрузки",
    icon: "💯",
    color: "emerald",
    recommended: "new clients, test orders",
    recommendedRu: "новые клиенты, тестовые поставки",
    contractText: "100% advance payment within 5 (five) banking days from the date of signing the Contract.",
    contractTextRu: "100% авансовый платёж в течение 5 (пяти) банковских дней с даты подписания Контракта.",
    risk: "zero",
    capitalNeed: "none",
  },
  "prepay50": {
    id: "prepay50",
    name: "50% / 50%",
    nameRu: "50% / 50%",
    advancePercent: 50,
    balancePercent: 50,
    description: "50% advance + 50% against B/L copy",
    descriptionRu: "50% аванс + 50% против копии коносамента",
    icon: "⚖️",
    color: "blue",
    recommended: "trusted clients, medium orders",
    recommendedRu: "проверенные клиенты, средние заказы",
    contractText: "50% advance payment within 5 (five) banking days from the date of signing the Contract. 50% final payment against scan copy of Bill of Lading (B/L) within 5 (five) banking days from the date of receipt of B/L copy.",
    contractTextRu: "50% авансовый платёж в течение 5 (пяти) банковских дней с даты подписания Контракта. 50% окончательный платёж против скан-копии коносамента (B/L), в течение 5 (пяти) банковских дней с даты получения копии B/L.",
    risk: "low",
    capitalNeed: "medium",
  },
  "prepay30": {
    id: "prepay30",
    name: "30% / 70%",
    nameRu: "30% / 70%",
    advancePercent: 30,
    balancePercent: 70,
    description: "30% advance + 70% against B/L copy (standard)",
    descriptionRu: "30% аванс + 70% против копии B/L (стандарт)",
    icon: "📋",
    color: "amber",
    recommended: "regular clients, standard practice",
    recommendedRu: "постоянные клиенты, стандартная практика",
    contractText: "30% advance payment within 5 (five) banking days from the date of signing the Contract. 70% final payment against scan copy of Bill of Lading (B/L) within 5 (five) banking days from the date of receipt of B/L copy.",
    contractTextRu: "30% авансовый платёж в течение 5 (пяти) банковских дней с даты подписания Контракта. 70% окончательный платёж против скан-копии коносамента (B/L), в течение 5 (пяти) банковских дней с даты получения копии B/L.",
    risk: "medium",
    capitalNeed: "high",
  },
  "lc": {
    id: "lc",
    name: "Letter of Credit (L/C)",
    nameRu: "Аккредитив (L/C)",
    advancePercent: 0,
    balancePercent: 100,
    description: "Confirmed irrevocable L/C, payment against shipping documents",
    descriptionRu: "Подтверждённый безотзывный аккредитив, оплата против документов",
    icon: "🏦",
    color: "purple",
    recommended: "large deals, secured payment",
    recommendedRu: "крупные сделки, гарантированная оплата",
    contractText: "100% payment by irrevocable confirmed Letter of Credit (L/C), opened by Buyer in a first-class bank within 10 (ten) banking days from the date of signing the Contract. Payment against shipping documents (B/L, Commercial Invoice, Packing List, Certificate of Origin).",
    contractTextRu: "100% оплата безотзывным подтверждённым аккредитивом (L/C), открытым Покупателем в первоклассном банке в течение 10 (десяти) банковских дней с даты подписания Контракта. Оплата против отгрузочных документов (B/L, Commercial Invoice, Packing List, Certificate of Origin).",
    risk: "zero",
    capitalNeed: "high",
  },
};

// Helper для получения схемы
export function getPaymentSchema(schemaId) {
  return PAYMENT_SCHEMAS[schemaId] || PAYMENT_SCHEMAS["prepay100"];
}

export const COUNTRY_MARGINS = {
  "india":   18,
  "china":   15,
  "uae":     28,
  "egypt":   22,
  "turkey":  20,
};

// ═══════════════════════════════════════════════
// 🎯 КОНТЕКСТ
// ═══════════════════════════════════════════════

const DealContext = createContext();

export function useDeal() {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error("useDeal must be used within DealProvider");
  }
  return context;
}

const defaultDeal = {
  species: "pine",
  moisture: "kd",
  packaging: "crate",
  dimensions: "50x150x6000",
  length: 6,
  width: 0.15,
  thickness: 0.05,
  boardsPerBundle: 36,
  bundlesPerContainer: 24,
  totalVolume: 62,
  volumeTotal: 62,
  endUse: "construction",
  freightRoute: "nvr-jebelali",
  incoterm: "cif",
  margin: 28,
  usdRubRate: 76.25,
  profileProcessing: false,
  pricingPerM3: 540,
  pricingTotalUSD: 33480,
  containerType: "40HC",
  containerCount: 1,
  shipmentSchedule: "single",
  loadingPort: "Novorossiysk",
  destinationPort: "Jebel Ali, UAE",
  leadTime: 45,
  transitDays: 21,
  
  positions: [],
  customRoute: null,
  leadTimeOverride: null,
  discountMode: "auto",
  customDiscountPercent: 0,
  
  // 🆕 СХЕМА ОПЛАТЫ
  paymentSchema: "prepay100",  // дефолт для новых клиентов
};

const defaultSeller = {
  companyName: "IE Semakin Konstantin Fedorovich",
  legalAddress: "Zapovednaya Street 18/4, Apt. 69, Moscow, 127081, Russia",
  inn: "771617956514",
  ogrn: "322774600408727",
  director: "Konstantin Semakin",
  email: "ksemakin@icloud.com",
  phone: "+7 915 349 00 07",
  website: "ru-timber.com",
  bankName: "Sberbank, Moscow",
  bankSwift: "SABRRUMM",
  bankAccountUSD: "",
  bankAccountRUB: "",
  correspondentBank: "",
};

const defaultMission = {
  currentCapital: 0,
  avgProfitPerContainer_usd: 1000,
  containersPerMonth: 2,
  targetUsdRubRate: 85,
  goal_ship: 60000000,
  goal_house: 50000000,
  goal_wedding: 5000000,
  goal_reserve: 25000000,
};

const defaultChecklist = {
  ip_registered: false,
  lawyer_consulted: false,
  international_contract_reviewed: false,
  supply_contract_reviewed: false,
  ved_account_opened: false,
  lesegais_registered: false,
  customs_account: false,
  exiar_applied: false,
  rec_subsidy_applied: false,
  pefc_certificate: false,
  iso_certificate: false,
  domain_purchased: false,
  email_corporate_setup: false,
  whatsapp_business: false,
  google_drive_organized: false,
  it_accreditation: false,
  vpn_setup: false,
};

export function DealProvider({ children }) {
  const [deal, setDeal] = useState(defaultDeal);
  const [seller, setSeller] = useState(defaultSeller);
  const [mission, setMission] = useState(defaultMission);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customRoutes, setCustomRoutes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedDeal = localStorage.getItem("ru-timber-deal");
      const savedSeller = localStorage.getItem("ru-timber-seller");
      const savedMission = localStorage.getItem("ru-timber-mission");
      const savedChecklist = localStorage.getItem("ru-timber-checklist");
      const savedDeals = localStorage.getItem("ru-timber-deals");
      const savedCustomers = localStorage.getItem("ru-timber-customers");
      const savedCustomRoutes = localStorage.getItem("ru-timber-custom-routes");

      if (savedDeal) setDeal({ ...defaultDeal, ...JSON.parse(savedDeal) });
      if (savedSeller) setSeller({ ...defaultSeller, ...JSON.parse(savedSeller) });
      if (savedMission) setMission({ ...defaultMission, ...JSON.parse(savedMission) });
      if (savedChecklist) setChecklist({ ...defaultChecklist, ...JSON.parse(savedChecklist) });
      if (savedDeals) setDeals(JSON.parse(savedDeals));
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
      if (savedCustomRoutes) setCustomRoutes(JSON.parse(savedCustomRoutes));
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) localStorage.setItem("ru-timber-deal", JSON.stringify(deal)); }, [deal, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("ru-timber-seller", JSON.stringify(seller)); }, [seller, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("ru-timber-mission", JSON.stringify(mission)); }, [mission, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("ru-timber-checklist", JSON.stringify(checklist)); }, [checklist, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("ru-timber-deals", JSON.stringify(deals)); }, [deals, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("ru-timber-customers", JSON.stringify(customers)); }, [customers, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("ru-timber-custom-routes", JSON.stringify(customRoutes)); }, [customRoutes, isLoaded]);

  const updateDeal = (updates) => setDeal((prev) => ({ ...prev, ...updates }));
  const updateSeller = (updates) => setSeller((prev) => ({ ...prev, ...updates }));
  const updateMission = (updates) => setMission((prev) => ({ ...prev, ...updates }));
  const toggleChecklistItem = (key) => setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  const resetDeal = () => setDeal(defaultDeal);

  const addPosition = (positionData) => {
    const newPosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...positionData,
    };
    setDeal((prev) => ({ ...prev, positions: [...(prev.positions || []), newPosition] }));
    return newPosition;
  };

  const removePosition = (id) => {
    setDeal((prev) => ({ ...prev, positions: (prev.positions || []).filter((p) => p.id !== id) }));
  };

  const clearPositions = () => {
    setDeal((prev) => ({ ...prev, positions: [] }));
  };

  const updatePosition = (id, updates) => {
    setDeal((prev) => ({
      ...prev,
      positions: (prev.positions || []).map((p) => p.id === id ? { ...p, ...updates } : p),
    }));
  };

  const addCustomRoute = (routeData) => {
    const { loadingPort, destinationPort, country, flag, rate } = routeData;
    if (!loadingPort || !destinationPort || !rate) return;

    const exists = customRoutes.find(
      r => r.loadingPort.toLowerCase() === loadingPort.toLowerCase() &&
           r.destinationPort.toLowerCase() === destinationPort.toLowerCase()
    );
    if (exists) {
      setCustomRoutes((prev) => [
        { ...exists, rate: parseFloat(rate), lastUsed: new Date().toISOString() },
        ...prev.filter(r => r.id !== exists.id),
      ]);
      return exists.id;
    }

    const newRoute = {
      id: `custom-${Date.now()}`,
      loadingPort,
      destinationPort,
      country: country || "",
      flag: flag || "🌍",
      rate: parseFloat(rate),
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };
    setCustomRoutes((prev) => [newRoute, ...prev].slice(0, 20));
    return newRoute.id;
  };

  const removeCustomRoute = (id) => {
    setCustomRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const clearCustomRoutes = () => {
    setCustomRoutes([]);
  };

  const missionStats = (() => {
    const currentCapital = mission.currentCapital || 0;
    const profitPerContainer_usd = mission.avgProfitPerContainer_usd || 1000;
    const containersPerMonth = mission.containersPerMonth || 2;
    const usdRubRate = mission.targetUsdRubRate || 85;
    
    const goal_ship = mission.goal_ship || 0;
    const goal_house = mission.goal_house || 0;
    const goal_wedding = mission.goal_wedding || 0;
    const goal_reserve = mission.goal_reserve || 0;
    
    const totalGoal = goal_ship + goal_house + goal_wedding + goal_reserve;
    
    const overallProgress = totalGoal > 0 ? Math.min((currentCapital / totalGoal) * 100, 100) : 0;
    const remaining = Math.max(totalGoal - currentCapital, 0);
    const profitPerContainer_rub = profitPerContainer_usd * usdRubRate;
    const containersNeeded = profitPerContainer_rub > 0 ? Math.ceil(remaining / profitPerContainer_rub) : 0;
    const monthsNeeded = containersPerMonth > 0 ? Math.ceil(containersNeeded / containersPerMonth) : 0;
    const yearsNeeded = monthsNeeded / 12;
    const profitPerMonthRub = containersPerMonth * profitPerContainer_rub;
    const profitPerYearRub = profitPerMonthRub * 12;
    
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
    
    return {
      totalGoal, totalTarget: totalGoal, totalCurrent: currentCapital,
      currentCapital, remaining, overallProgress,
      containersNeeded, monthsNeeded, monthsToGoal: monthsNeeded, yearsNeeded,
      profitPerContainer_rub, profitPerMonthRub, profitPerYearRub, targetDate,
    };
  })();

  return (
    <DealContext.Provider
      value={{
        deal, seller, mission, checklist, deals, customers, customRoutes,
        isLoaded, missionStats,
        setDeal, setSeller, setMission, setChecklist, setDeals, setCustomers,
        updateDeal, updateSeller, updateMission, toggleChecklistItem, resetDeal,
        addPosition, removePosition, clearPositions, updatePosition,
        addCustomRoute, removeCustomRoute, clearCustomRoutes,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}