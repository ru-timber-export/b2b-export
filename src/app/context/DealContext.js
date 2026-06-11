"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { DEFAULT_BUSINESS_SETTINGS } from "../hooks/useBusinessSettings";

const STORAGE_KEY = "ru-timber-deal";
const ROUTES_KEY = "ru-timber-custom-routes";
const PRICES_KEY = "ru-timber-species-prices";
const PRICE_HISTORY_KEY = "ru-timber-price-history";
const SUPPLIERS_KEY = "ru-timber-suppliers";
const MISSION_KEY = "ru-timber-mission";
const SELLER_KEY = "ru-timber-business-settings";

// ═══════════════════════════════════════════
// КОНТЕЙНЕР 40HC — ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ
// ═══════════════════════════════════════════
export const CONTAINER_40HC = {
  nominalM3: 76,        // паспортный объём (внутренний)
  capacityM3: 58,       // реально влезает досок в пачках (лимит по весу!)
  maxPayloadKg: 26500,  // максимальная загрузка по морю
  safePayloadKg: 24000, // безопасный вес (запас на влажность + дороги РФ)
};

// ═══════════════════════════════════════════
// ДЕФОЛТНЫЕ ЦЕНЫ ПОРОД
// ═══════════════════════════════════════════
export const DEFAULT_SPECIES_PRICES = {
  pine: 175,
  spruce: 165,
  larch: 230,
  cedar: 280,
  spf: 180,
  birch: 220,
  oak: 450,
  aspen: 140,
  "pine-spruce-50-50": 170,
  "pine-spruce-70-30": 172,
};

export const SPECIES_BASE_PRICES = DEFAULT_SPECIES_PRICES;

// ═══════════════════════════════════════════
// КОЭФФИЦИЕНТЫ ВЛАЖНОСТИ
// ═══════════════════════════════════════════
export const MOISTURE_MULTIPLIERS = {
  kd: 1.00,
  ad: 0.88,
  fresh: 0.72,
};

export const DRYING_SURCHARGE = {
  kd: 0,
  ad: 0,
  fresh: 0,
};

// ═══════════════════════════════════════════
// УПАКОВКА (доплаты)
// ═══════════════════════════════════════════
export const PACKAGING_SURCHARGE = {
  none: 0,
  crate: 4,
  shrink: 8,
  strapped: 3,
  premium: 12,
};

// ═══════════════════════════════════════════
// РЕГИОНЫ ЛЕСОПИЛОК
// ═══════════════════════════════════════════
export const SAWMILL_REGIONS = {
  karelia: { name: "Карелия", flag: "🌲", multiplier: 1.00, baseFreight: 1500 },
  irkutsk: { name: "Иркутск", flag: "🌲", multiplier: 0.83, baseFreight: 2200 },
  krasnodar: { name: "Краснодар", flag: "🌲", multiplier: 1.09, baseFreight: 800 },
  arkhangelsk: { name: "Архангельск", flag: "🌲", multiplier: 0.95, baseFreight: 1700 },
  perm: { name: "Пермь", flag: "🌲", multiplier: 0.91, baseFreight: 1900 },
  vologda: { name: "Вологда", flag: "🌲", multiplier: 0.97, baseFreight: 1600 },
};

// ═══════════════════════════════════════════
// ДЕФОЛТНЫЕ ПОСТАВЩИКИ
// ═══════════════════════════════════════════
export const DEFAULT_SUPPLIERS = [
  {
    id: "default-1",
    name: "Лесозавод Карелия №1",
    region: "karelia",
    contact: "+7 814 XXX-XX-XX",
    notes: "Хвоя, KD, премиум",
    isDefault: true,
  },
];

// ═══════════════════════════════════════════
// COUNTRY MARGINS
// ═══════════════════════════════════════════
export const COUNTRY_MARGINS = {
  india: 12,
  china: 10,
  uae: 18,
  egypt: 15,
  turkey: 10,
};

// ═══════════════════════════════════════════
// LEAD TIME
// ═══════════════════════════════════════════
export const LEAD_TIME_BREAKDOWN = {
  production: 14,
  landTransport: 3,
  portHandling: 4,
  discharge: 3,
};

export function calcLeadTime(routeKey, oceanTransitDays) {
  const ocean = oceanTransitDays || 21;
  return {
    production: LEAD_TIME_BREAKDOWN.production,
    landTransport: LEAD_TIME_BREAKDOWN.landTransport,
    portHandling: LEAD_TIME_BREAKDOWN.portHandling,
    ocean,
    discharge: LEAD_TIME_BREAKDOWN.discharge,
    total: LEAD_TIME_BREAKDOWN.production + LEAD_TIME_BREAKDOWN.landTransport +
           LEAD_TIME_BREAKDOWN.portHandling + ocean + LEAD_TIME_BREAKDOWN.discharge,
  };
}

// ═══════════════════════════════════════════
// DISCOUNT TIERS
// ═══════════════════════════════════════════
export const DISCOUNT_TIERS = [
  { minContainers: 1, maxContainers: 2, percent: 0, label: "1-2 cont" },
  { minContainers: 3, maxContainers: 3, percent: 1.5, label: "3 cont" },
  { minContainers: 4, maxContainers: 6, percent: 3, label: "4-6 cont" },
  { minContainers: 7, maxContainers: 10, percent: 5, label: "7-10 cont" },
  { minContainers: 11, maxContainers: 9999, percent: 7, label: "11+ cont" },
];

export function calcAutoDiscount(containers) {
  const tier = DISCOUNT_TIERS.find(t =>
    containers >= t.minContainers && containers <= t.maxContainers
  );
  return tier ? tier.percent : 0;
}

// ═══════════════════════════════════════════
// 💳 PAYMENT SCHEMAS — v2.1 (Dynamic)
// ID совпадают с contractData.js: prepay100 / prepay50 / 30-70 / lc
// ═══════════════════════════════════════════
export const PAYMENT_SCHEMAS = {
  prepay100: {
    id: "prepay100",
    icon: "💯",
    color: "emerald",
    risk: "zero",
    advance: 100,
    balance: 0,
    advancePercent: 100,
    balancePercent: 0,
    name: "100% Prepayment",
    nameRu: "100% предоплата",
    label: "100% advance payment before shipment",
    labelRu: "100% предоплата до отгрузки",
    short: "100% advance",
    shortRu: "100% аванс",
    description: "Full prepayment before production. Zero risk for the Seller.",
    descriptionRu: "Полная предоплата до начала производства. Нулевой риск для продавца — производство стартует после зачисления денег.",
    recommendedRu: "первая сделка, новый покупатель без истории",
    contractText: "100% advance payment within 5 (five) banking days from the date of signing the Contract. Shipment commences after receipt of funds.",
    contractTextRu: "100% предоплата в течение 5 (пяти) банковских дней с даты подписания Контракта. Отгрузка начинается после зачисления средств на счёт Продавца.",
    forNewClient: true,
  },
  prepay50: {
    id: "prepay50",
    icon: "🛡",
    color: "blue",
    risk: "low",
    advance: 50,
    balance: 50,
    advancePercent: 50,
    balancePercent: 50,
    name: "50/50 vs B/L",
    nameRu: "50/50 против B/L",
    label: "50% advance + 50% against B/L copy",
    labelRu: "50% аванс + 50% против копии коносамента",
    short: "50/50 vs B/L",
    shortRu: "50/50 по B/L",
    description: "50% advance, 50% balance against Bill of Lading copy (Telex Release).",
    descriptionRu: "50% аванс при заказе, 50% после получения копии коносамента (Telex Release). Баланс риска для обеих сторон.",
    recommendedRu: "новые клиенты после первой успешной сделки",
    contractText: "50% advance payment within 5 (five) banking days of Contract signing. 50% balance against scan copy of Bill of Lading.",
    contractTextRu: "50% аванс в течение 5 (пяти) банковских дней с даты подписания Контракта. 50% — против скан-копии коносамента (B/L).",
    forNewClient: true,
  },
  "30-70": {
    id: "30-70",
    icon: "🤝",
    color: "amber",
    risk: "medium",
    advance: 30,
    balance: 70,
    advancePercent: 30,
    balancePercent: 70,
    name: "30/70 vs B/L",
    nameRu: "30/70 против B/L",
    label: "30% advance + 70% against B/L copy",
    labelRu: "30% аванс + 70% против копии коносамента",
    short: "30/70 vs B/L",
    shortRu: "30/70 по B/L",
    description: "Classic scheme: 30% advance, 70% against Bill of Lading copy (Telex Release).",
    descriptionRu: "Классическая схема. 30% при заказе, 70% после получения копии B/L (Telex Release).",
    recommendedRu: "проверенные клиенты с историей 2-3 сделок",
    contractText: "30% advance payment within 5 (five) banking days of Contract signing. 70% balance against scan copy of Bill of Lading.",
    contractTextRu: "30% аванс в течение 5 (пяти) банковских дней с даты подписания Контракта. 70% — против скан-копии коносамента (B/L).",
    forNewClient: false,
  },
  lc: {
    id: "lc",
    icon: "🏦",
    color: "purple",
    risk: "low",
    advance: 0,
    balance: 100,
    advancePercent: 0,
    balancePercent: 100,
    name: "L/C at Sight",
    nameRu: "Аккредитив (L/C at sight)",
    label: "Irrevocable Letter of Credit at sight",
    labelRu: "Безотзывный аккредитив по предъявлении документов",
    short: "L/C at sight",
    shortRu: "Аккредитив",
    description: "Irrevocable confirmed Letter of Credit, payable against shipping documents.",
    descriptionRu: "Безотзывный подтверждённый аккредитив. Банк покупателя гарантирует оплату против отгрузочных документов.",
    recommendedRu: "крупные сделки, корпоративные покупатели",
    contractText: "Payment by irrevocable confirmed Letter of Credit at sight, payable against presentation of shipping documents.",
    contractTextRu: "Оплата безотзывным подтверждённым аккредитивом по предъявлении отгрузочных документов через банк Продавца.",
    forNewClient: false,
  },
};

// Старые ID (если где-то сохранились в localStorage) → новые
const SCHEMA_ALIASES = {
  "100-advance": "prepay100",
  "50-50-bl": "prepay50",
  "30-70-bl": "30-70",
  "20-80-bl": "30-70",
  "lc-sight": "lc",
};

export function getPaymentSchema(schemaId) {
  if (PAYMENT_SCHEMAS[schemaId]) return PAYMENT_SCHEMAS[schemaId];
  const alias = SCHEMA_ALIASES[schemaId];
  if (alias && PAYMENT_SCHEMAS[alias]) return PAYMENT_SCHEMAS[alias];
  return PAYMENT_SCHEMAS["prepay100"];
}

// ═══════════════════════════════════════════
// FREIGHT PRESETS
// ═══════════════════════════════════════════
export const FREIGHT_PRESETS = {
  // UAE
  "nvr-jebelali": { port: "Jebel Ali", country: "UAE", flag: "🇦🇪", rate: 2400, transit: 18, label: "Novorossiysk → Jebel Ali", star: true },
  "nvr-khalifa": { port: "Khalifa Port", country: "UAE", flag: "🇦🇪", rate: 2450, transit: 19, label: "Novorossiysk → Khalifa" },
  "nvr-sharjah": { port: "Sharjah", country: "UAE", flag: "🇦🇪", rate: 2500, transit: 20, label: "Novorossiysk → Sharjah" },

  // INDIA
  "nvr-nhavasheva": { port: "Nhava Sheva / Mumbai", country: "India", flag: "🇮🇳", rate: 2850, transit: 21, label: "Novorossiysk → Mumbai", star: true },
  "nvr-mundra": { port: "Mundra", country: "India", flag: "🇮🇳", rate: 2750, transit: 20, label: "Novorossiysk → Mundra" },
  "nvr-chennai": { port: "Chennai", country: "India", flag: "🇮🇳", rate: 3100, transit: 25, label: "Novorossiysk → Chennai" },
  "nvr-cochin": { port: "Cochin", country: "India", flag: "🇮🇳", rate: 2950, transit: 23, label: "Novorossiysk → Cochin" },
  "nvr-kolkata": { port: "Kolkata", country: "India", flag: "🇮🇳", rate: 3300, transit: 28, label: "Novorossiysk → Kolkata" },

  // CHINA
  "vlv-shanghai": { port: "Shanghai", country: "China", flag: "🇨🇳", rate: 1800, transit: 8, label: "Vladivostok → Shanghai", star: true },
  "vlv-ningbo": { port: "Ningbo", country: "China", flag: "🇨🇳", rate: 1850, transit: 9, label: "Vladivostok → Ningbo" },
  "vlv-qingdao": { port: "Qingdao", country: "China", flag: "🇨🇳", rate: 1750, transit: 7, label: "Vladivostok → Qingdao" },

  // EGYPT
  "nvr-alexandria": { port: "Alexandria", country: "Egypt", flag: "🇪🇬", rate: 1900, transit: 12, label: "Novorossiysk → Alexandria", star: true },
  "nvr-portsaid": { port: "Port Said", country: "Egypt", flag: "🇪🇬", rate: 1950, transit: 13, label: "Novorossiysk → Port Said" },
  "nvr-damietta": { port: "Damietta", country: "Egypt", flag: "🇪🇬", rate: 1920, transit: 12, label: "Novorossiysk → Damietta" },

  // TURKEY
  "nvr-istanbul": { port: "Istanbul / Ambarli", country: "Turkey", flag: "🇹🇷", rate: 1400, transit: 8, label: "Novorossiysk → Istanbul", star: true },
  "nvr-izmir": { port: "Izmir", country: "Turkey", flag: "🇹🇷", rate: 1450, transit: 9, label: "Novorossiysk → Izmir" },
  "nvr-mersin": { port: "Mersin", country: "Turkey", flag: "🇹🇷", rate: 1500, transit: 10, label: "Novorossiysk → Mersin" },

  // SAUDI ARABIA
  "nvr-jeddah": { port: "Jeddah", country: "Saudi Arabia", flag: "🇸🇦", rate: 2200, transit: 17, label: "Novorossiysk → Jeddah" },
  "nvr-dammam": { port: "Dammam", country: "Saudi Arabia", flag: "🇸🇦", rate: 2600, transit: 22, label: "Novorossiysk → Dammam" },

  // EUROPE
  "spb-rotterdam": { port: "Rotterdam", country: "Netherlands", flag: "🇳🇱", rate: 1100, transit: 5, label: "Saint Petersburg → Rotterdam" },
  "spb-hamburg": { port: "Hamburg", country: "Germany", flag: "🇩🇪", rate: 1050, transit: 4, label: "Saint Petersburg → Hamburg" },
  "spb-gdansk": { port: "Gdansk", country: "Poland", flag: "🇵🇱", rate: 950, transit: 3, label: "Saint Petersburg → Gdansk" },

  // SOUTH KOREA / JAPAN
  "vlv-busan": { port: "Busan", country: "South Korea", flag: "🇰🇷", rate: 1600, transit: 6, label: "Vladivostok → Busan" },
  "vlv-tokyo": { port: "Tokyo", country: "Japan", flag: "🇯🇵", rate: 1900, transit: 9, label: "Vladivostok → Tokyo" },
  "vlv-yokohama": { port: "Yokohama", country: "Japan", flag: "🇯🇵", rate: 1950, transit: 10, label: "Vladivostok → Yokohama" },

  // VIETNAM
  "vlv-haiphong": { port: "Haiphong", country: "Vietnam", flag: "🇻🇳", rate: 2100, transit: 14, label: "Vladivostok → Haiphong" },
  "vlv-hochiminh": { port: "Ho Chi Minh", country: "Vietnam", flag: "🇻🇳", rate: 2200, transit: 15, label: "Vladivostok → Ho Chi Minh" },

  // INDONESIA / MALAYSIA
  "vlv-jakarta": { port: "Jakarta", country: "Indonesia", flag: "🇮🇩", rate: 2400, transit: 17, label: "Vladivostok → Jakarta" },
  "vlv-portklang": { port: "Port Klang", country: "Malaysia", flag: "🇲🇾", rate: 2350, transit: 16, label: "Vladivostok → Port Klang" },

  // KAZAKHSTAN (rail)
  "kgd-almaty": { port: "Almaty (rail)", country: "Kazakhstan", flag: "🇰🇿", rate: 1300, transit: 7, label: "Kaliningrad → Almaty" },
};

// ═══════════════════════════════════════════
// 🌊 OCEAN MISSION — дефолтные цели
// ═══════════════════════════════════════════
const DEFAULT_MISSION = {
  currentCapital: 0,               // сколько уже накоплено, ₽
  avgProfitPerContainer_usd: 4000, // средняя прибыль с контейнера, $
  containersPerMonth: 2,           // план отгрузок в месяц
  targetUsdRubRate: 90,            // плановый курс USD/RUB
  goal_ship: 50000000,             // 🚢 Корабль
  goal_house: 30000000,            // 🏠 Дом
  goal_wedding: 3000000,           // 💍 Свадьба
  goal_reserve: 25000000,          // 💰 Резерв (5 лет × 5 млн)
};

// ═══════════════════════════════════════════
// DEFAULT DEAL
// ═══════════════════════════════════════════
const DEFAULT_DEAL = {
  species: "pine-spruce-50-50",
  moisture: "kd",
  packaging: "crate",
  incoterm: "cif",
  freightRoute: "nvr-jebelali",
  customRoute: null,

  thickness: 50,
  width: 150,
  length: 6000,
  totalVolume: 50,

  margin: 18,
  usdRubRate: 91,

  finalContainers: 1,
  finalTotalAmount: 0,
  finalPricePerM3: 0,
  finalCostPerM3: 0,
  finalProfitPerM3: 0,
  finalProfitTotal: 0,
  finalIncoterm: "cif",
  finalFreightRoute: "nvr-jebelali",

  positions: [],
  leadTimeOverride: null,

  discountMode: "auto",
  customDiscountPercent: 0,

  profileProcessing: false,

  paymentSchema: "prepay100",
};

// ═══════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════
const DealContext = createContext(null);

export function DealProvider({ children }) {
  const [deal, setDeal] = useState(DEFAULT_DEAL);
  const [customRoutes, setCustomRoutes] = useState([]);
  const [customSpeciesPrices, setCustomSpeciesPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [suppliers, setSuppliers] = useState(DEFAULT_SUPPLIERS);
  const [pricesLastUpdated, setPricesLastUpdated] = useState(null);

  // 🌊 Mission
  const [mission, setMission] = useState(DEFAULT_MISSION);

  // 🏢 Seller (реквизиты продавца из Business Settings)
  const [seller, setSeller] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDeal({ ...DEFAULT_DEAL, ...parsed });
      }

      const savedRoutes = localStorage.getItem(ROUTES_KEY);
      if (savedRoutes) setCustomRoutes(JSON.parse(savedRoutes));

      const savedPrices = localStorage.getItem(PRICES_KEY);
      if (savedPrices) {
        const parsed = JSON.parse(savedPrices);
        setCustomSpeciesPrices(parsed.prices || {});
        setPricesLastUpdated(parsed.lastUpdated || null);
      }

      const savedHistory = localStorage.getItem(PRICE_HISTORY_KEY);
      if (savedHistory) setPriceHistory(JSON.parse(savedHistory));

      const savedSuppliers = localStorage.getItem(SUPPLIERS_KEY);
      if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));

      // 🌊 Mission
      const savedMission = localStorage.getItem(MISSION_KEY);
      if (savedMission) {
        setMission({ ...DEFAULT_MISSION, ...JSON.parse(savedMission) });
      }

      // 🏢 Seller — читаем Business Settings и маппим поля под контракт
      let bs = { ...DEFAULT_BUSINESS_SETTINGS };
      const rawSeller = localStorage.getItem(SELLER_KEY);
      if (rawSeller) {
        try {
          const parsed = JSON.parse(rawSeller);
          Object.keys(parsed).forEach((key) => {
            if (parsed[key] !== "" && parsed[key] !== null && parsed[key] !== undefined) {
              bs[key] = parsed[key];
            }
          });
        } catch (e) { /* broken JSON — используем дефолты */ }
      }

      const pick = (...vals) =>
        vals.find((v) => v !== undefined && v !== null && v !== "") || "";

      setSeller({
        ...bs, // все оригинальные поля тоже доступны
        // 📜 нормализованные поля для Contract Autofill:
        companyName: pick(bs.companyNameEn, bs.companyName),
        legalAddress: pick(bs.legalAddress, bs.warehouseAddressEn, bs.officeAddress),
        inn: pick(bs.inn),
        ogrn: pick(bs.ogrnip, bs.ogrn),
        director: pick(bs.signatureName, bs.fullName),
        bankName: pick(bs.bankNameEn, bs.bankName),
        bankSwift: pick(bs.bankSWIFT, bs.bankSwift),
        bankAccountUSD: pick(bs.bankAccountUSD),
        correspondentBank: pick(bs.bankCorrespondentUSD, bs.correspondentBank),
      });
    } catch (e) {
      console.error("Load failed:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save deal
  useEffect(() => {
    if (!isLoaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(deal)); }
    catch (e) { console.error("Save deal failed:", e); }
  }, [deal, isLoaded]);

  // Save custom routes
  useEffect(() => {
    if (!isLoaded) return;
    try { localStorage.setItem(ROUTES_KEY, JSON.stringify(customRoutes)); }
    catch (e) { console.error("Save routes failed:", e); }
  }, [customRoutes, isLoaded]);

  // Save species prices
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(PRICES_KEY, JSON.stringify({
        prices: customSpeciesPrices,
        lastUpdated: pricesLastUpdated,
      }));
    } catch (e) { console.error("Save prices failed:", e); }
  }, [customSpeciesPrices, pricesLastUpdated, isLoaded]);

  // Save price history
  useEffect(() => {
    if (!isLoaded) return;
    try { localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(priceHistory)); }
    catch (e) { console.error("Save history failed:", e); }
  }, [priceHistory, isLoaded]);

  // Save suppliers
  useEffect(() => {
    if (!isLoaded) return;
    try { localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers)); }
    catch (e) { console.error("Save suppliers failed:", e); }
  }, [suppliers, isLoaded]);

  // 🌊 Save mission
  useEffect(() => {
    if (!isLoaded) return;
    try { localStorage.setItem(MISSION_KEY, JSON.stringify(mission)); }
    catch (e) { console.error("Save mission failed:", e); }
  }, [mission, isLoaded]);

  const updateDeal = (updates) => {
    setDeal(prev => ({ ...prev, ...updates }));
  };

  const resetDeal = () => {
    setDeal(DEFAULT_DEAL);
  };

  // 🌊 Mission update
  const updateMission = (updates) => {
    setMission(prev => ({ ...prev, ...updates }));
  };

  // 🏢 Seller update
  const updateSeller = (updates) => {
    setSeller(prev => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem(SELLER_KEY, JSON.stringify(next)); }
      catch (e) { console.error("Save seller failed:", e); }
      return next;
    });
  };

  // ═══════════════════════════════════════════
  // 🌊 MISSION STATS — расчёт прогресса к океану
  // ═══════════════════════════════════════════
  const missionStats = useMemo(() => {
    const totalGoal =
      (mission.goal_ship || 0) +
      (mission.goal_house || 0) +
      (mission.goal_wedding || 0) +
      (mission.goal_reserve || 0);

    const current = mission.currentCapital || 0;
    const remaining = Math.max(totalGoal - current, 0);

    const profitPerContainerRub =
      (mission.avgProfitPerContainer_usd || 0) * (mission.targetUsdRubRate || 90);

    const containersNeeded = profitPerContainerRub > 0
      ? Math.ceil(remaining / profitPerContainerRub)
      : 0;

    const perMonth = mission.containersPerMonth || 1;
    const monthsNeeded = containersNeeded > 0
      ? Math.ceil(containersNeeded / perMonth)
      : 0;

    const yearsNeeded = monthsNeeded / 12;

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsNeeded);

    const profitPerMonthRub = profitPerContainerRub * perMonth;
    const profitPerYearRub = profitPerMonthRub * 12;

    const overallProgress = totalGoal > 0
      ? Math.min((current / totalGoal) * 100, 100)
      : 0;

    return {
      totalGoal,
      remaining,
      containersNeeded,
      monthsNeeded,
      yearsNeeded,
      targetDate,
      profitPerMonthRub,
      profitPerYearRub,
      overallProgress,
    };
  }, [mission]);

  // Positions (корзина)
  const addPosition = (position) => {
    const newPosition = { ...position, id: `pos-${Date.now()}-${Math.random()}` };
    setDeal(prev => ({ ...prev, positions: [...(prev.positions || []), newPosition] }));
  };

  const removePosition = (id) => {
    setDeal(prev => ({ ...prev, positions: (prev.positions || []).filter(p => p.id !== id) }));
  };

  const clearPositions = () => {
    setDeal(prev => ({ ...prev, positions: [] }));
  };

  // Custom routes
  const addCustomRoute = (route) => {
    const newRoute = { ...route, id: `route-${Date.now()}`, createdAt: new Date().toISOString() };
    setCustomRoutes(prev => [newRoute, ...prev].slice(0, 20));
  };

  const removeCustomRoute = (id) => {
    setCustomRoutes(prev => prev.filter(r => r.id !== id));
  };

  // ═══════════════════════════════════════════
  // ЦЕНЫ ПОРОД
  // ═══════════════════════════════════════════
  const getSpeciesPrice = (speciesKey) => {
    if (customSpeciesPrices[speciesKey] !== undefined && customSpeciesPrices[speciesKey] !== null) {
      return customSpeciesPrices[speciesKey];
    }
    return DEFAULT_SPECIES_PRICES[speciesKey] || 0;
  };

  const getSpeciesPriceWithMoisture = (speciesKey, moistureKey) => {
    const basePrice = getSpeciesPrice(speciesKey);
    const multiplier = MOISTURE_MULTIPLIERS[moistureKey] || 1;
    return Math.round(basePrice * multiplier);
  };

  const updateSpeciesPrice = (speciesKey, newPrice) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;

    const oldPrice = getSpeciesPrice(speciesKey);
    if (oldPrice !== price) {
      const historyEntry = {
        date: new Date().toISOString(),
        oldPrice,
        newPrice: price,
      };
      setPriceHistory(prev => ({
        ...prev,
        [speciesKey]: [historyEntry, ...(prev[speciesKey] || [])].slice(0, 30),
      }));
    }

    setCustomSpeciesPrices(prev => ({ ...prev, [speciesKey]: price }));
    setPricesLastUpdated(new Date().toISOString());
  };

  const resetSpeciesPrices = () => {
    setCustomSpeciesPrices({});
    setPricesLastUpdated(null);
  };

  const resetSpeciesPrice = (speciesKey) => {
    setCustomSpeciesPrices(prev => {
      const newPrices = { ...prev };
      delete newPrices[speciesKey];
      return newPrices;
    });
  };

  const adjustAllPrices = (percentChange) => {
    const factor = 1 + (percentChange / 100);
    const newPrices = {};
    Object.keys(DEFAULT_SPECIES_PRICES).forEach(key => {
      const currentPrice = getSpeciesPrice(key);
      newPrices[key] = Math.round(currentPrice * factor);
    });

    const historyDate = new Date().toISOString();
    const newHistory = { ...priceHistory };
    Object.keys(newPrices).forEach(key => {
      const oldPrice = getSpeciesPrice(key);
      newHistory[key] = [{
        date: historyDate,
        oldPrice,
        newPrice: newPrices[key],
        bulk: `${percentChange > 0 ? "+" : ""}${percentChange}%`,
      }, ...(priceHistory[key] || [])].slice(0, 30);
    });

    setCustomSpeciesPrices(newPrices);
    setPriceHistory(newHistory);
    setPricesLastUpdated(historyDate);
  };

  const importPricesFromCSV = (csvText) => {
    try {
      const lines = csvText.trim().split("\n");
      const newPrices = { ...customSpeciesPrices };
      const newHistory = { ...priceHistory };
      const historyDate = new Date().toISOString();
      let imported = 0;

      lines.forEach(line => {
        const parts = line.split(/[,;\t]/).map(p => p.trim());
        if (parts.length >= 2) {
          const key = parts[0].toLowerCase().replace(/\s+/g, "-");
          const price = parseFloat(parts[1]);

          if (!isNaN(price) && price > 0) {
            const keyMap = {
              "pine": "pine", "сосна": "pine",
              "spruce": "spruce", "ель": "spruce",
              "larch": "larch", "лиственница": "larch",
              "cedar": "cedar", "кедр": "cedar",
              "birch": "birch", "берёза": "birch", "береза": "birch",
              "oak": "oak", "дуб": "oak",
              "aspen": "aspen", "осина": "aspen",
              "spf": "spf",
            };

            const mappedKey = keyMap[key] || key;
            if (DEFAULT_SPECIES_PRICES[mappedKey] !== undefined) {
              const oldPrice = getSpeciesPrice(mappedKey);
              newPrices[mappedKey] = price;
              newHistory[mappedKey] = [{
                date: historyDate,
                oldPrice,
                newPrice: price,
                source: "CSV import",
              }, ...(priceHistory[mappedKey] || [])].slice(0, 30);
              imported++;
            }
          }
        }
      });

      if (imported > 0) {
        setCustomSpeciesPrices(newPrices);
        setPriceHistory(newHistory);
        setPricesLastUpdated(historyDate);
      }

      return { success: true, imported };
    } catch (e) {
      console.error("CSV import failed:", e);
      return { success: false, error: e.message };
    }
  };

  // ═══════════════════════════════════════════
  // ПОСТАВЩИКИ
  // ═══════════════════════════════════════════
  const addSupplier = (supplier) => {
    const newSupplier = {
      ...supplier,
      id: `supplier-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSuppliers(prev => [newSupplier, ...prev]);
  };

  const removeSupplier = (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const updateSupplier = (id, updates) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <DealContext.Provider value={{
      deal, updateDeal, resetDeal, isLoaded,
      addPosition, removePosition, clearPositions,
      customRoutes, addCustomRoute, removeCustomRoute,

      // 🌊 Mission
      mission, updateMission, missionStats,

      // 🏢 Seller
      seller, updateSeller,

      // Цены
      customSpeciesPrices,
      pricesLastUpdated,
      priceHistory,
      getSpeciesPrice,
      getSpeciesPriceWithMoisture,
      updateSpeciesPrice,
      resetSpeciesPrices,
      resetSpeciesPrice,
      adjustAllPrices,
      importPricesFromCSV,

      // Поставщики
      suppliers,
      addSupplier,
      removeSupplier,
      updateSupplier,
    }}>
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const ctx = useContext(DealContext);
  if (!ctx) {
    throw new Error("useDeal must be used within DealProvider");
  }
  return ctx;
}