"use client";

import { createContext, useContext, useState, useEffect } from "react";

// ═══════════════════════════════════════════════
// 💰 ЭКСПОРТНЫЕ КОНСТАНТЫ для pricing/page.js
// ═══════════════════════════════════════════════

// Базовые цены за m³ (USD, EXW лесопилка)
export const SPECIES_BASE_PRICES = {
  "pine": 175,
  "spruce": 165,
  "pine-spruce-50-50": 170,
  "larch": 230,
  "cedar": 280,
};

// Надбавка за сушку (USD за m³)
export const DRYING_SURCHARGE = {
  "ad": 0,           // Atmospheric Dry (natural)
  "kd": 55,          // Kiln Dried 10-12%
  "kd-light": 30,    // Light kiln dry
};

// Надбавка за упаковку (USD за m³)
export const PACKAGING_SURCHARGE = {
  "strapped": 0,
  "crate": 8,
  "premium": 18,
};

// Фрахт-пресеты (всё включено за 40HC)
export const FREIGHT_PRESETS = {
  "nvr-jebelali":  { label: "Новороссийск → Jebel Ali (UAE)",     rate: 2400 },
  "nvr-dammam":    { label: "Новороссийск → Dammam (KSA)",         rate: 2700 },
  "nvr-doha":      { label: "Новороссийск → Doha (Qatar)",         rate: 2800 },
  "nvr-alex":      { label: "Новороссийск → Alexandria (Egypt)",   rate: 1800 },
  "nvr-istanbul":  { label: "Новороссийск → Istanbul (Turkey)",    rate: 1600 },
  "spb-jebelali":  { label: "St.Petersburg → Jebel Ali (UAE)",     rate: 2800 },
  "vlv-mumbai":    { label: "Владивосток → Mumbai (India)",        rate: 2900 },
  "vlv-chennai":   { label: "Владивосток → Chennai (India)",       rate: 2750 },
};

// Маржа по странам (в процентах)
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

// 📦 Deal default
const defaultDeal = {
  // Volume
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

  // Pricing
  freightRoute: "nvr-jebelali",
  incoterm: "cif",
  margin: 28,
  usdRubRate: 76.25,
  profileProcessing: false,
  pricingPerM3: 540,
  pricingTotalUSD: 33480,

  // Container
  containerType: "40HC",
  containerCount: 1,
  shipmentSchedule: "single",

  // Shipping
  loadingPort: "Novorossiysk",
  destinationPort: "Jebel Ali, UAE",
  leadTime: 45,
  transitDays: 21,
};

// 🏢 Seller default — РЕАЛЬНЫЕ данные ИП
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

// 🌊 Mission default
const defaultMission = {
  yachtTarget: 60000000,
  yachtCurrent: 0,
  yachtModel: "Beneteau Oceanis 46.1",

  houseTarget: 50000000,
  houseCurrent: 0,
  houseLocation: "Sochi / Limassol",

  familyTarget: 20000000,
  familyCurrent: 0,
  familyGoal: "Education for kids, healthcare, comfort",

  freedomTarget: 16500000,
  freedomCurrent: 0,
  freedomGoal: "Financial independence, passive income",

  marginPerContainer: 1000,
  containersPerMonth: 5,
};

// 📋 Checklist default
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

// 🎬 Provider
export function DealProvider({ children }) {
  const [deal, setDeal] = useState(defaultDeal);
  const [seller, setSeller] = useState(defaultSeller);
  const [mission, setMission] = useState(defaultMission);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedDeal = localStorage.getItem("ru-timber-deal");
      const savedSeller = localStorage.getItem("ru-timber-seller");
      const savedMission = localStorage.getItem("ru-timber-mission");
      const savedChecklist = localStorage.getItem("ru-timber-checklist");
      const savedDeals = localStorage.getItem("ru-timber-deals");
      const savedCustomers = localStorage.getItem("ru-timber-customers");

      if (savedDeal) setDeal({ ...defaultDeal, ...JSON.parse(savedDeal) });
      if (savedSeller) setSeller({ ...defaultSeller, ...JSON.parse(savedSeller) });
      if (savedMission) setMission({ ...defaultMission, ...JSON.parse(savedMission) });
      if (savedChecklist) setChecklist({ ...defaultChecklist, ...JSON.parse(savedChecklist) });
      if (savedDeals) setDeals(JSON.parse(savedDeals));
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
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

  const updateDeal = (updates) => setDeal((prev) => ({ ...prev, ...updates }));
  const updateSeller = (updates) => setSeller((prev) => ({ ...prev, ...updates }));
  const updateMission = (updates) => setMission((prev) => ({ ...prev, ...updates }));
  const toggleChecklistItem = (key) => setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  const resetDeal = () => setDeal(defaultDeal);

  const missionStats = {
    totalTarget: mission.yachtTarget + mission.houseTarget + mission.familyTarget + mission.freedomTarget,
    totalCurrent: mission.yachtCurrent + mission.houseCurrent + mission.familyCurrent + mission.freedomCurrent,
    get overallProgress() {
      return this.totalTarget > 0 ? (this.totalCurrent / this.totalTarget) * 100 : 0;
    },
    get remaining() {
      return this.totalTarget - this.totalCurrent;
    },
    get containersNeeded() {
      const profitPerContainerRUB = (mission.marginPerContainer || 1000) * 100;
      return profitPerContainerRUB > 0 ? Math.ceil(this.remaining / profitPerContainerRUB) : 0;
    },
    get monthsToGoal() {
      const cpm = mission.containersPerMonth || 1;
      return cpm > 0 ? Math.ceil(this.containersNeeded / cpm) : 0;
    },
  };

  return (
    <DealContext.Provider
      value={{
        deal,
        seller,
        mission,
        checklist,
        deals,
        customers,
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
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

// END OF FILE