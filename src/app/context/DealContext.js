"use client";
import { createContext, useContext, useEffect, useState } from "react";

const DealContext = createContext(null);

// ============ DEFAULTS ============
const DEAL_DEFAULTS = {
  thickness: 44,
  width: 150,
  length: 5980,
  species: "PINE",
  moisture: "KD",
  packaging: "SHRINK",
  endUse: "CUSTOM",
  inputMode: "volume",
  totalVolume: 64,
  totalPieces: 0,
  incoterm: "CIF",
  margin: 18,
  usdRubRate: 90,
  freightRoute: "VLV_CHENNAI",
  mill_logistics: 35,
  port_fees: 6.25,
  freight_insurance: 26.56,
  profileProcessing: false,
  computedVolume_m3: 0,
  computedWeight_kg: 0,
  computedPieces: 0,
  currentDealId: null,
  lastUpdate: null,
};

const SELLER_DEFAULTS = {
  name: "",
  legalForm: "ИП",
  address: "",
  phone: "+7 915 349 00 07",
  email: "",
  website: "b2b-export.vercel.app",
  inn: "",
  ogrn: "",
  director: "Константин",
  bank: "",
  swift: "",
  account: "",
  correspondent: "",
  registered: false,
  registrationDate: null,
};

const CHECKLIST_DEFAULTS = {
  ip_registered: false,
  ved_account_opened: false,
  domain_purchased: false,
  email_corporate_setup: false,
  lesegais_registered: false,
  customs_account: false,
  lawyer_consulted: false,
  exiar_applied: false,
  rec_subsidy_applied: false,
  it_accreditation: false,
  vpn_setup: false,
  whatsapp_business: false,
  google_drive_organized: false,
  international_contract_reviewed: false,
  supply_contract_reviewed: false,
  pefc_certificate: false,
  iso_certificate: false,
};

// 🆕 B4: OCEAN MISSION
const MISSION_DEFAULTS = {
  // Цели (₽)
  goal_ship: 100_000_000,        // корабль исследовательский
  goal_house: 20_000_000,        // дом
  goal_wedding: 1_500_000,       // свадьба
  goal_reserve: 25_000_000,      // резерв 5 лет × 5 млн/год
  
  // Текущее состояние
  currentCapital: 0,             // ₽ — сколько накопил
  avgProfitPerContainer_usd: 5000, // профит в $ с контейнера
  containersPerMonth: 1,         // план контейнеров/мес
  targetUsdRubRate: 85,          // среднегодовой курс для расчёта
  
  // Дата старта миссии
  missionStartDate: null,
  oceanTargetDate: null,         // целевая дата выхода в океан
};

const BUSINESS_RULES = {
  FIAT_ONLY: true,
  NO_CRYPTO: true,
  JURISDICTION: "RU",
  ARBITRATION: "ICAC Moscow",
  TARGET_TIER: "TOP_1_PERCENT",
};

// ============ PROVIDER ============
export function DealProvider({ children }) {
  const [deal, setDeal] = useState(DEAL_DEFAULTS);
  const [seller, setSeller] = useState(SELLER_DEFAULTS);
  const [checklist, setChecklist] = useState(CHECKLIST_DEFAULTS);
  const [mission, setMission] = useState(MISSION_DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // Загрузка из LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedDeal = localStorage.getItem("rt_deal_v4");
      if (savedDeal) setDeal({ ...DEAL_DEFAULTS, ...JSON.parse(savedDeal) });

      const savedSeller = localStorage.getItem("rt_seller_v4");
      if (savedSeller) setSeller({ ...SELLER_DEFAULTS, ...JSON.parse(savedSeller) });

      const savedChecklist = localStorage.getItem("rt_checklist_v4");
      if (savedChecklist) setChecklist({ ...CHECKLIST_DEFAULTS, ...JSON.parse(savedChecklist) });

      const savedMission = localStorage.getItem("rt_mission_v4");
      if (savedMission) setMission({ ...MISSION_DEFAULTS, ...JSON.parse(savedMission) });
    } catch (e) {
      console.warn("DealContext: load error", e);
    }
    setHydrated(true);
  }, []);

  // Автосохранение
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("rt_deal_v4", JSON.stringify(deal));
    } catch (e) { console.warn("save deal error", e); }
  }, [deal, hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("rt_seller_v4", JSON.stringify(seller));
    } catch (e) { console.warn("save seller error", e); }
  }, [seller, hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("rt_checklist_v4", JSON.stringify(checklist));
    } catch (e) { console.warn("save checklist error", e); }
  }, [checklist, hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem("rt_mission_v4", JSON.stringify(mission));
    } catch (e) { console.warn("save mission error", e); }
  }, [mission, hydrated]);

  // ============ HELPERS ============
  const updateDeal = (patch) => setDeal((prev) => ({ ...prev, ...patch, lastUpdate: new Date().toISOString() }));
  const updateSeller = (patch) => setSeller((prev) => ({ ...prev, ...patch }));
  const updateChecklist = (patch) => setChecklist((prev) => ({ ...prev, ...patch }));
  const updateMission = (patch) => setMission((prev) => ({ ...prev, ...patch }));

  const resetDeal = () => setDeal(DEAL_DEFAULTS);

  const hasMemory = Boolean(deal.lastUpdate);

  // 🆕 B4: Mission calculations
  const missionStats = (() => {
    const totalGoal = mission.goal_ship + mission.goal_house + mission.goal_wedding + mission.goal_reserve;
    const profitPerContainerRub = mission.avgProfitPerContainer_usd * mission.targetUsdRubRate;
    const profitPerMonthRub = profitPerContainerRub * mission.containersPerMonth;
    const profitPerYearRub = profitPerMonthRub * 12;
    
    const remaining = Math.max(totalGoal - mission.currentCapital, 0);
    const containersNeeded = profitPerContainerRub > 0 ? Math.ceil(remaining / profitPerContainerRub) : 0;
    const monthsNeeded = mission.containersPerMonth > 0 ? Math.ceil(containersNeeded / mission.containersPerMonth) : 0;
    const yearsNeeded = monthsNeeded / 12;
    
    const overallProgress = totalGoal > 0 ? Math.min((mission.currentCapital / totalGoal) * 100, 100) : 0;
    
    // Дата выхода в океан (от сегодня)
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
    
    return {
      totalGoal,
      remaining,
      containersNeeded,
      monthsNeeded,
      yearsNeeded,
      profitPerContainerRub,
      profitPerMonthRub,
      profitPerYearRub,
      overallProgress,
      targetDate,
    };
  })();

  const value = {
    // state
    deal, seller, checklist, mission,
    // setters
    setDeal, setSeller, setChecklist, setMission,
    // patch helpers
    updateDeal, updateSeller, updateChecklist, updateMission,
    // utils
    resetDeal, hasMemory, hydrated,
    // computed
    missionStats,
    // constants
    BUSINESS_RULES,
  };

  return <DealContext.Provider value={value}>{children}</DealContext.Provider>;
}

export function useDeal() {
  const ctx = useContext(DealContext);
  if (!ctx) throw new Error("useDeal must be used within DealProvider");
  return ctx;
}