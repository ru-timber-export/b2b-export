"use client";

import { createContext, useContext, useState, useEffect } from "react";

// ═══════════════════════════════════════════════
// 💰 ЭКСПОРТНЫЕ КОНСТАНТЫ для pricing/page.js
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
// 🚢 РАСШИРЕННЫЙ СПИСОК МАРШРУТОВ (30+ портов)
// ═══════════════════════════════════════════════

export const FREIGHT_PRESETS = {
  // ━━━ 🇦🇪 ОАЭ (UAE) ━━━
  "nvr-jebelali":     { label: "Новороссийск → Jebel Ali",     port: "Jebel Ali", country: "UAE", flag: "🇦🇪", rate: 2400, star: true },
  "nvr-khalifa":      { label: "Новороссийск → Khalifa",       port: "Khalifa (Abu Dhabi)", country: "UAE", flag: "🇦🇪", rate: 2500 },
  "nvr-sharjah":      { label: "Новороссийск → Sharjah",       port: "Sharjah / Hamriyah", country: "UAE", flag: "🇦🇪", rate: 2450 },
  "nvr-khorfakkan":   { label: "Новороссийск → Khor Fakkan",   port: "Khor Fakkan", country: "UAE", flag: "🇦🇪", rate: 2500 },
  "nvr-fujairah":     { label: "Новороссийск → Fujairah",      port: "Fujairah", country: "UAE", flag: "🇦🇪", rate: 2500 },
  
  // ━━━ 🇮🇳 ИНДИЯ (India) ━━━
  "nvr-mumbai":       { label: "Новороссийск → Mumbai",        port: "Mumbai / Nhava Sheva (JNPT)", country: "India", flag: "🇮🇳", rate: 2700, star: true },
  "nvr-chennai":      { label: "Новороссийск → Chennai",       port: "Chennai", country: "India", flag: "🇮🇳", rate: 2750 },
  "nvr-mundra":       { label: "Новороссийск → Mundra",        port: "Mundra (Adani)", country: "India", flag: "🇮🇳", rate: 2650 },
  "nvr-kandla":       { label: "Новороссийск → Kandla",        port: "Kandla", country: "India", flag: "🇮🇳", rate: 2700 },
  "nvr-kolkata":      { label: "Новороссийск → Kolkata",       port: "Kolkata", country: "India", flag: "🇮🇳", rate: 2900 },
  "nvr-cochin":       { label: "Новороссийск → Cochin",        port: "Cochin / Kochi", country: "India", flag: "🇮🇳", rate: 2850 },
  "nvr-tuticorin":    { label: "Новороссийск → Tuticorin",     port: "Tuticorin", country: "India", flag: "🇮🇳", rate: 2850 },
  "nvr-hazira":       { label: "Новороссийск → Hazira",        port: "Hazira", country: "India", flag: "🇮🇳", rate: 2700 },
  
  // ━━━ 🇸🇦 САУДОВСКАЯ АРАВИЯ (KSA) ━━━
  "nvr-dammam":       { label: "Новороссийск → Dammam",        port: "Dammam", country: "Saudi Arabia", flag: "🇸🇦", rate: 2700, star: true },
  "nvr-jeddah":       { label: "Новороссийск → Jeddah",        port: "Jeddah", country: "Saudi Arabia", flag: "🇸🇦", rate: 2500 },
  "nvr-yanbu":        { label: "Новороссийск → Yanbu",         port: "Yanbu", country: "Saudi Arabia", flag: "🇸🇦", rate: 2550 },
  "nvr-kingabdullah": { label: "Новороссийск → King Abdullah", port: "King Abdullah Port", country: "Saudi Arabia", flag: "🇸🇦", rate: 2600 },
  
  // ━━━ 🇪🇬 ЕГИПЕТ (Egypt) ━━━
  "nvr-alex":         { label: "Новороссийск → Alexandria",    port: "Alexandria", country: "Egypt", flag: "🇪🇬", rate: 1800, star: true },
  "nvr-damietta":     { label: "Новороссийск → Damietta",      port: "Damietta", country: "Egypt", flag: "🇪🇬", rate: 1900 },
  "nvr-portsaid":     { label: "Новороссийск → Port Said",     port: "Port Said", country: "Egypt", flag: "🇪🇬", rate: 1850 },
  "nvr-sokhna":       { label: "Новороссийск → Sokhna",        port: "Ain Sokhna (Red Sea)", country: "Egypt", flag: "🇪🇬", rate: 2100 },
  
  // ━━━ 🇹🇷 ТУРЦИЯ (Türkiye) ━━━
  "nvr-istanbul":     { label: "Новороссийск → Istanbul",      port: "Istanbul (Ambarli)", country: "Türkiye", flag: "🇹🇷", rate: 1600, star: true },
  "nvr-mersin":       { label: "Новороссийск → Mersin",        port: "Mersin", country: "Türkiye", flag: "🇹🇷", rate: 1500 },
  "nvr-izmir":        { label: "Новороссийск → Izmir",         port: "Izmir", country: "Türkiye", flag: "🇹🇷", rate: 1700 },
  
  // ━━━ 🇶🇦 КАТАР (Qatar) ━━━
  "nvr-doha":         { label: "Новороссийск → Doha",          port: "Hamad Port (Doha)", country: "Qatar", flag: "🇶🇦", rate: 2800 },
  
  // ━━━ 🇰🇼 КУВЕЙТ (Kuwait) ━━━
  "nvr-shuwaikh":     { label: "Новороссийск → Shuwaikh",      port: "Shuwaikh", country: "Kuwait", flag: "🇰🇼", rate: 2700 },
  
  // ━━━ 🇧🇭 БАХРЕЙН (Bahrain) ━━━
  "nvr-bahrain":      { label: "Новороссийск → Khalifa Bin Salman", port: "Khalifa Bin Salman", country: "Bahrain", flag: "🇧🇭", rate: 2750 },
  
  // ━━━ 🇮🇶 ИРАК (Iraq) ━━━
  "nvr-ummqasr":      { label: "Новороссийск → Umm Qasr",      port: "Umm Qasr", country: "Iraq", flag: "🇮🇶", rate: 2900 },
  
  // ━━━ 🇨🇳 КИТАЙ (China) ━━━
  "vlv-shanghai":     { label: "Владивосток → Shanghai",       port: "Shanghai", country: "China", flag: "🇨🇳", rate: 1800 },
  "vlv-ningbo":       { label: "Владивосток → Ningbo",         port: "Ningbo", country: "China", flag: "🇨🇳", rate: 1900 },
  "vlv-qingdao":      { label: "Владивосток → Qingdao",        port: "Qingdao", country: "China", flag: "🇨🇳", rate: 1700 },
  
  // ━━━ 🇵🇰 ПАКИСТАН (Pakistan) ━━━
  "nvr-karachi":      { label: "Новороссийск → Karachi",       port: "Karachi", country: "Pakistan", flag: "🇵🇰", rate: 2800 },
  
  // ━━━ Из других портов РФ ━━━
  "spb-jebelali":     { label: "St.Petersburg → Jebel Ali",    port: "Jebel Ali", country: "UAE", flag: "🇦🇪", rate: 2800 },
  "vlv-mumbai":       { label: "Владивосток → Mumbai",         port: "Mumbai", country: "India", flag: "🇮🇳", rate: 2900 },
  "vlv-chennai":      { label: "Владивосток → Chennai",        port: "Chennai", country: "India", flag: "🇮🇳", rate: 2750 },
};

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
  
  // 🆕 Корзина для Quotation
  positions: [],
  
  // 🆕 Custom freight route (если выбран Custom)
  customRoute: null, // { loadingPort, destinationPort, country, flag, rate }
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
  // 🆕 История кастомных маршрутов
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

  useEffect(() => {
    if (isLoaded) localStorage.setItem("ru-timber-deal", JSON.stringify(deal));
  }, [deal, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("ru-timber-seller", JSON.stringify(seller));
  }, [seller, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("ru-timber-mission", JSON.stringify(mission));
  }, [mission, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("ru-timber-checklist", JSON.stringify(checklist));
  }, [checklist, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("ru-timber-deals", JSON.stringify(deals));
  }, [deals, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("ru-timber-customers", JSON.stringify(customers));
  }, [customers, isLoaded]);

  // 🆕 Сохранение истории кастомных маршрутов
  useEffect(() => {
    if (isLoaded) localStorage.setItem("ru-timber-custom-routes", JSON.stringify(customRoutes));
  }, [customRoutes, isLoaded]);

  const updateDeal = (updates) => setDeal((prev) => ({ ...prev, ...updates }));
  const updateSeller = (updates) => setSeller((prev) => ({ ...prev, ...updates }));
  const updateMission = (updates) => setMission((prev) => ({ ...prev, ...updates }));
  const toggleChecklistItem = (key) => setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  const resetDeal = () => setDeal(defaultDeal);

  // ═══════════════════════════════════════════════
  // 🛒 ФУНКЦИИ КОРЗИНЫ
  // ═══════════════════════════════════════════════

  const addPosition = (positionData) => {
    const newPosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...positionData,
    };
    setDeal((prev) => ({
      ...prev,
      positions: [...(prev.positions || []), newPosition],
    }));
    return newPosition;
  };

  const removePosition = (id) => {
    setDeal((prev) => ({
      ...prev,
      positions: (prev.positions || []).filter((p) => p.id !== id),
    }));
  };

  const clearPositions = () => {
    setDeal((prev) => ({
      ...prev,
      positions: [],
    }));
  };

  const updatePosition = (id, updates) => {
    setDeal((prev) => ({
      ...prev,
      positions: (prev.positions || []).map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  };

  // ═══════════════════════════════════════════════
  // 🆕 ФУНКЦИИ ИСТОРИИ КАСТОМНЫХ МАРШРУТОВ
  // ═══════════════════════════════════════════════

  // Добавить кастомный маршрут в историю (если ещё нет)
  const addCustomRoute = (routeData) => {
    const { loadingPort, destinationPort, country, flag, rate } = routeData;
    if (!loadingPort || !destinationPort || !rate) return;

    // Проверка на дубликат
    const exists = customRoutes.find(
      r => r.loadingPort.toLowerCase() === loadingPort.toLowerCase() &&
           r.destinationPort.toLowerCase() === destinationPort.toLowerCase()
    );
    if (exists) {
      // Обновляем ставку и поднимаем наверх
      setCustomRoutes((prev) => [
        { ...exists, rate: parseFloat(rate), lastUsed: new Date().toISOString() },
        ...prev.filter(r => r.id !== exists.id),
      ]);
      return exists.id;
    }

    // Новый маршрут
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
    setCustomRoutes((prev) => [newRoute, ...prev].slice(0, 20)); // макс 20 истории
    return newRoute.id;
  };

  const removeCustomRoute = (id) => {
    setCustomRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const clearCustomRoutes = () => {
    setCustomRoutes([]);
  };

  // ═══════════════════════════════════════════════
  // 📊 missionStats
  // ═══════════════════════════════════════════════
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
    
    const overallProgress = totalGoal > 0 
      ? Math.min((currentCapital / totalGoal) * 100, 100)
      : 0;
    
    const remaining = Math.max(totalGoal - currentCapital, 0);
    const profitPerContainer_rub = profitPerContainer_usd * usdRubRate;
    
    const containersNeeded = profitPerContainer_rub > 0
      ? Math.ceil(remaining / profitPerContainer_rub)
      : 0;
    
    const monthsNeeded = containersPerMonth > 0
      ? Math.ceil(containersNeeded / containersPerMonth)
      : 0;
    
    const yearsNeeded = monthsNeeded / 12;
    const profitPerMonthRub = containersPerMonth * profitPerContainer_rub;
    const profitPerYearRub = profitPerMonthRub * 12;
    
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
    
    return {
      totalGoal,
      totalTarget: totalGoal,
      totalCurrent: currentCapital,
      currentCapital,
      remaining,
      overallProgress,
      containersNeeded,
      monthsNeeded,
      monthsToGoal: monthsNeeded,
      yearsNeeded,
      profitPerContainer_rub,
      profitPerMonthRub,
      profitPerYearRub,
      targetDate,
    };
  })();

  return (
    <DealContext.Provider
      value={{
        deal,
        seller,
        mission,
        checklist,
        deals,
        customers,
        customRoutes,  // 🆕
        isLoaded,
        missionStats,
        setDeal,
        setSeller,
        setMission,
        setChecklist,
        setDeals,
        setCustomers,
        updateDeal,
        updateSeller,
        updateMission,
        toggleChecklistItem,
        resetDeal,
        // Функции корзины
        addPosition,
        removePosition,
        clearPositions,
        updatePosition,
        // 🆕 Функции истории маршрутов
        addCustomRoute,
        removeCustomRoute,
        clearCustomRoutes,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

// END OF FILE