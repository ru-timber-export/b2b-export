"use client";

import { createContext, useContext, useState, useEffect } from "react";

// ═══════════════════════════════════════════════
// 💰 ЭКСПОРТНЫЕ КОНСТАНТЫ (нужны для pricing/page.js)
// ═══════════════════════════════════════════════

// Базовые цены за m³ (USD, FCA с лесопилки)
export const SPECIES_BASE_PRICES = {
  Pine: 180,
  Spruce: 170,
  Larch: 240,
  Cedar: 290,
};

// Маржа по странам (множитель)
export const COUNTRY_MARGINS = {
  "UAE": 1.85,
  "Saudi Arabia": 1.90,
  "Qatar": 1.95,
  "Egypt": 1.70,
  "Turkey": 1.65,
  "Uzbekistan": 1.50,
  "India": 1.75,
  "Other": 1.80,
};

// Надбавка за камерную сушку (USD за m³)
export const DRYING_SURCHARGE = {
  "Natural (20-25%)": 0,
  "KD 18-20%": 25,
  "KD 14-16%": 40,
  "KD 10-12%": 55,
  "KD 8-10%": 70,
};

// Надбавка за упаковку (USD за m³)
export const PACKAGING_SURCHARGE = {
  "Standard strapped": 0,
  "AST treated": 8,
  "Polypropylene wrapped": 12,
  "Premium export (AST + PP)": 18,
};

// Готовые пресеты фрахта (USD за контейнер)
export const FREIGHT_PRESETS = {
  "FOB Novorossiysk": 0,
  "FOB St. Petersburg": 0,
  "CIF Jebel Ali": 2400,
  "CIF Dammam": 2700,
  "CIF Doha": 2800,
  "CIF Alexandria": 1800,
  "CIF Istanbul": 1600,
  "CIF Mumbai (Nhava Sheva)": 2900,
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
  species: "Pine",
  drying: "KD 10-12%",
  dimensions: "50x150x6000",
  length: 6,
  width: 0.15,
  thickness: 0.05,
  boardsPerBundle: 36,
  bundlesPerContainer: 24,
  volumeTotal: 62,
  endUse: "construction",

  pricingPerM3: 540,
  pricingTotalUSD: 33480,
  freightPreset: "CIF Jebel Ali",

  containerType: "40HC",
  containerCount: 1,
  shipmentSchedule: "single",

  loadingPort: "Novorossiysk",
  destinationPort: "Jebel Ali, UAE",
  leadTime: 45,
  transitDays: 30,
  incoterm: "CIF",
  packaging: "Strapped bundles, AST treated, polypropylene wrapped",
};

// 🏢 Seller default — ОБНОВЛЁН под РЕАЛЬНЫЕ данные ИП
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