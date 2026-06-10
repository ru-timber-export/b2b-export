"use client";

import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "ru-timber-deal";
const ROUTES_KEY = "ru-timber-custom-routes";
const PRICES_KEY = "ru-timber-species-prices";
const PRICE_HISTORY_KEY = "ru-timber-price-history";
const SUPPLIERS_KEY = "ru-timber-suppliers";

// ═══════════════════════════════════════════
// 🆕 КОНТЕЙНЕР 40HC — ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ
// Все экраны берут вместимость ОТСЮДА
// ═══════════════════════════════════════════
export const CONTAINER_40HC = {
  nominalM3: 76,        // паспортный объём (внутренний)
  capacityM3: 58,       // реально влезает досок в пачках (лимит по весу!)
  maxPayloadKg: 26500,  // максимальная загрузка по морю
  safePayloadKg: 24000, // безопасный вес (запас на влажность + дороги РФ)
};

// ═══════════════════════════════════════════
// 🆕 ДЕФОЛТНЫЕ ЦЕНЫ ПОРОД (на основе рынка 2025)
// ═══════════════════════════════════════════
export const DEFAULT_SPECIES_PRICES = {
  // Чистые породы — хвойные
  pine: 175,         // Сосна — массовая
  spruce: 165,       // Ель — чуть дешевле
  larch: 230,        // Лиственница — премиум хвоя
  cedar: 280,        // Кедр — премиум
  spf: 180,          // SPF mix
  
  // Чистые породы — лиственные
  birch: 220,        // Берёза — премиум
  oak: 450,          // Дуб — самая дорогая
  aspen: 140,        // Осина — sauna market
  
  // Смеси
  "pine-spruce-50-50": 170,
  "pine-spruce-70-30": 172,
};

// Старое имя для обратной совместимости
export const SPECIES_BASE_PRICES = DEFAULT_SPECIES_PRICES;

// ═══════════════════════════════════════════
// 🆕 КОЭФФИЦИЕНТЫ ВЛАЖНОСТИ
// ═══════════════════════════════════════════
export const MOISTURE_MULTIPLIERS = {
  kd: 1.00,      // KD 10-12% — базовая
  ad: 0.88,      // AD 18-22% — -12%
  fresh: 0.72,   // Fresh 22-30% — -28%
};

// Старое название (доплата) — для обратной совместимости в коде
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
// 🆕 РЕГИОНЫ ЛЕСОПИЛОК (для бонуса)
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
// 🆕 ДЕФОЛТНЫЕ ПОСТАВЩИКИ (можешь добавлять свои)
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
// COUNTRY MARGINS — реалистичные для новичка
// India 12% (торгуются жёстко), China 10% (ценовая война),
// UAE 18% (премиум-рынок), Egypt 15% (риск платежей),
// Turkey 10% (близко, конкуренция высокая)
// ═══════════════════════════════════════════
export const COUNTRY_MARGINS = {
  india: 12,
  china: 10,
  uae: 18,
  egypt: 15,
  turkey: 10,
};

// ═══════════════════════════════════════════
// LEAD TIME BREAKDOWN
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
// 📜 PAYMENT SCHEMAS (для контрактов и квотаций)
// ═══════════════════════════════════════════
export const PAYMENT_SCHEMAS = {
  "30-70-bl": {
    id: "30-70-bl",
    icon: "🤝",
    name: "30/70 vs B/L",
    label: "30% advance + 70% vs B/L copy",
    advance: 30,
    balance: 70,
    advancePercent: 30,
    balancePercent: 70,
    trigger: "B/L copy",
    risk: "low",
    description: "Классическая схема. 30% при заказе, 70% после получения копии B/L (Telex Release).",
    contractText: "30% advance payment within 5 (five) banking days of Contract signing. 70% balance payment against scan copy of Bill of Lading (Telex Release at destination port).",
    forNewClient: false,
  },
  "50-50-bl": {
    id: "50-50-bl",
    icon: "🛡",
    name: "50/50 vs B/L",
    label: "50% advance + 50% vs B/L copy",
    advance: 50,
    balance: 50,
    advancePercent: 50,
    balancePercent: 50,
    trigger: "B/L copy",
    risk: "very-low",
    description: "Для новых клиентов без истории. Снижает риск кассового разрыва.",
    contractText: "50% advance payment within 5 (five) banking days of Contract signing. 50% balance payment against scan copy of Bill of Lading (Telex Release at destination port).",
    forNewClient: true,
  },
  "100-advance": {
    id: "100-advance",
    icon: "💯",
    name: "100% Advance",
    label: "100% advance payment",
    advance: 100,
    balance: 0,
    advancePercent: 100,
    balancePercent: 0,
    trigger: "none",
    risk: "zero",
    description: "Полная предоплата. Для самых рисковых клиентов или первой сделки.",
    contractText: "100% advance payment within 5 (five) banking days of Contract signing. Production starts upon receipt of funds.",
    forNewClient: true,
  },
  "lc-sight": {
    id: "lc-sight",
    icon: "🏦",
    name: "L/C at Sight",
    label: "Letter of Credit at sight",
    advance: 0,
    balance: 100,
    advancePercent: 0,
    balancePercent: 100,
    trigger: "L/C documents",
    risk: "low",
    description: "Аккредитив с оплатой по предъявлении документов. Банковская гарантия.",
    contractText: "Payment by irrevocable Letter of Credit at sight, issued by a first-class international bank, payable against presentation of shipping documents.",
    forNewClient: false,
  },
  "20-80-bl": {
    id: "20-80-bl",
    icon: "⭐",
    name: "20/80 vs B/L",
    label: "20% advance + 80% vs B/L copy",
    advance: 20,
    balance: 80,
    advancePercent: 20,
    balancePercent: 80,
    trigger: "B/L copy",
    risk: "medium",
    description: "Мягкие условия для постоянного клиента с хорошей историей.",
    contractText: "20% advance payment within 5 (five) banking days of Contract signing. 80% balance payment against scan copy of Bill of Lading (Telex Release at destination port).",
    forNewClient: false,
  },
};

export function getPaymentSchema(schemaId) {
  return PAYMENT_SCHEMAS[schemaId] || PAYMENT_SCHEMAS["30-70-bl"];
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
  
  paymentSchema: "30-70-bl",
};

// ═══════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════
const DealContext = createContext(null);

export function DealProvider({ children }) {
  const [deal, setDeal] = useState(DEFAULT_DEAL);
  const [customRoutes, setCustomRoutes] = useState([]);
  
  // 🆕 Кастомные цены пород
  const [customSpeciesPrices, setCustomSpeciesPrices] = useState({});
  
  // 🆕 История цен
  const [priceHistory, setPriceHistory] = useState({});
  
  // 🆕 Поставщики
  const [suppliers, setSuppliers] = useState(DEFAULT_SUPPLIERS);
  
  // 🆕 Дата последнего обновления цен
  const [pricesLastUpdated, setPricesLastUpdated] = useState(null);
  
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
      if (savedRoutes) {
        setCustomRoutes(JSON.parse(savedRoutes));
      }
      
      const savedPrices = localStorage.getItem(PRICES_KEY);
      if (savedPrices) {
        const parsed = JSON.parse(savedPrices);
        setCustomSpeciesPrices(parsed.prices || {});
        setPricesLastUpdated(parsed.lastUpdated || null);
      }
      
      const savedHistory = localStorage.getItem(PRICE_HISTORY_KEY);
      if (savedHistory) {
        setPriceHistory(JSON.parse(savedHistory));
      }
      
      const savedSuppliers = localStorage.getItem(SUPPLIERS_KEY);
      if (savedSuppliers) {
        setSuppliers(JSON.parse(savedSuppliers));
      }
    } catch (e) {
      console.error("Load failed:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save deal
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deal));
    } catch (e) {
      console.error("Save deal failed:", e);
    }
  }, [deal, isLoaded]);

  // Save custom routes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(ROUTES_KEY, JSON.stringify(customRoutes));
    } catch (e) {
      console.error("Save routes failed:", e);
    }
  }, [customRoutes, isLoaded]);

  // 🆕 Save species prices
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(PRICES_KEY, JSON.stringify({
        prices: customSpeciesPrices,
        lastUpdated: pricesLastUpdated,
      }));
    } catch (e) {
      console.error("Save prices failed:", e);
    }
  }, [customSpeciesPrices, pricesLastUpdated, isLoaded]);

  // 🆕 Save price history
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(priceHistory));
    } catch (e) {
      console.error("Save history failed:", e);
    }
  }, [priceHistory, isLoaded]);

  // 🆕 Save suppliers
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
    } catch (e) {
      console.error("Save suppliers failed:", e);
    }
  }, [suppliers, isLoaded]);

  const updateDeal = (updates) => {
    setDeal(prev => ({ ...prev, ...updates }));
  };

  const resetDeal = () => {
    setDeal(DEFAULT_DEAL);
  };

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
  // 🆕 ФУНКЦИИ УПРАВЛЕНИЯ ЦЕНАМИ
  // ═══════════════════════════════════════════
  
  // Получить актуальную цену породы
  const getSpeciesPrice = (speciesKey) => {
    if (customSpeciesPrices[speciesKey] !== undefined && customSpeciesPrices[speciesKey] !== null) {
      return customSpeciesPrices[speciesKey];
    }
    return DEFAULT_SPECIES_PRICES[speciesKey] || 0;
  };

  // Получить цену с учётом влажности
  const getSpeciesPriceWithMoisture = (speciesKey, moistureKey) => {
    const basePrice = getSpeciesPrice(speciesKey);
    const multiplier = MOISTURE_MULTIPLIERS[moistureKey] || 1;
    return Math.round(basePrice * multiplier);
  };

  // Обновить цену породы
  const updateSpeciesPrice = (speciesKey, newPrice) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;
    
    // Сохраняем историю (последние 30 записей на каждую породу)
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

  // Сбросить цены к дефолтным
  const resetSpeciesPrices = () => {
    setCustomSpeciesPrices({});
    setPricesLastUpdated(null);
  };

  // Сбросить цену одной породы
  const resetSpeciesPrice = (speciesKey) => {
    setCustomSpeciesPrices(prev => {
      const newPrices = { ...prev };
      delete newPrices[speciesKey];
      return newPrices;
    });
  };

  // Быстрая корректировка ±%
  const adjustAllPrices = (percentChange) => {
    const factor = 1 + (percentChange / 100);
    const newPrices = {};
    Object.keys(DEFAULT_SPECIES_PRICES).forEach(key => {
      const currentPrice = getSpeciesPrice(key);
      newPrices[key] = Math.round(currentPrice * factor);
    });
    
    // История для каждой породы
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

  // Импорт цен из CSV
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
            // Маппинг ключей
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
  // 🆕 ФУНКЦИИ УПРАВЛЕНИЯ ПОСТАВЩИКАМИ
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
      
      // 🆕 Цены
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
      
      // 🆕 Поставщики
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