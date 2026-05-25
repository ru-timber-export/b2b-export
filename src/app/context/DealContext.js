"use client";

import { createContext, useContext, useState, useEffect } from "react";

// 🎯 Создаём контекст
const DealContext = createContext();

// 🪝 Хук для удобного использования
export function useDeal() {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error("useDeal must be used within DealProvider");
  }
  return context;
}

// 📦 Начальное состояние сделки (Volume + Pricing + Container + Shipping)
const defaultDeal = {
  // Volume
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

  // Pricing
  pricingPerM3: 540,
  pricingTotalUSD: 33480,
  freightPreset: "CIF Jebel Ali",

  // Container
  containerType: "40HC",
  containerCount: 1,
  shipmentSchedule: "single",

  // Shipping
  loadingPort: "Novorossiysk",
  destinationPort: "Jebel Ali, UAE",
  leadTime: 45,
  transitDays: 30,
  incoterm: "CIF",
  packaging: "Strapped bundles, AST treated, polypropylene wrapped",
};

// 🏢 Начальное состояние Seller
const defaultSeller = {
  companyName: "",
  legalAddress: "",
  inn: "",
  ogrn: "",
  director: "",
  email: "info@ru-timber.com",
  phone: "+7 915 349 00 07",
  website: "ru-timber.com",
  bankName: "",
  bankSwift: "",
  bankAccountUSD: "",
  bankAccountRUB: "",
  correspondentBank: "",
};

// 🌊 Начальное состояние Mission (мечта)
const defaultMission = {
  // Yacht
  yachtTarget: 60000000,
  yachtCurrent: 0,
  yachtModel: "Beneteau Oceanis 46.1",
  
  // House
  houseTarget: 50000000,
  houseCurrent: 0,
  houseLocation: "Sochi / Limassol",
  
  // Family
  familyTarget: 20000000,
  familyCurrent: 0,
  familyGoal: "Education for kids, healthcare, comfort",
  
  // Freedom
  freedomTarget: 16500000,
  freedomCurrent: 0,
  freedomGoal: "Financial independence, passive income",
  
  // Calculations
  marginPerContainer: 1000, // USD prof per container
  containersPerMonth: 5,
};

// 📋 Pre-Flight Checklist (17 пунктов)
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

// 🎬 Провайдер
export function DealProvider({ children }) {
  const [deal, setDeal] = useState(defaultDeal);
  const [seller, setSeller] = useState(defaultSeller);
  const [mission, setMission] = useState(defaultMission);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [deals, setDeals] = useState([]); // архив сделок
  const [customers, setCustomers] = useState([]); // CRM
  const [isLoaded, setIsLoaded] = useState(false);

  // 📂 Загружаем из localStorage при старте
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

  // 💾 Сохраняем в localStorage при изменениях
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ru-timber-deal", JSON.stringify(deal));
    }
  }, [deal, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ru-timber-seller", JSON.stringify(seller));
    }
  }, [seller, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ru-timber-mission", JSON.stringify(mission));
    }
  }, [mission, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ru-timber-checklist", JSON.stringify(checklist));
    }
  }, [checklist, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ru-timber-deals", JSON.stringify(deals));
    }
  }, [deals, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ru-timber-customers", JSON.stringify(customers));
    }
  }, [customers, isLoaded]);

  // 🛠️ Хелперы для обновления

  // Обновить отдельные поля сделки
  const updateDeal = (updates) => {
    setDeal((prev) => ({ ...prev, ...updates }));
  };

  // Обновить отдельные поля seller
  const updateSeller = (updates) => {
    setSeller((prev) => ({ ...prev, ...updates }));
  };

  // Обновить mission
  const updateMission = (updates) => {
    setMission((prev) => ({ ...prev, ...updates }));
  };

  // Переключить пункт checklist
  const toggleChecklistItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Сбросить текущую сделку
  const resetDeal = () => {
    setDeal(defaultDeal);
  };

  // 📊 Подсчёт статистики Mission
  const missionStats = {
    totalTarget:
      mission.yachtTarget +
      mission.houseTarget +
      mission.familyTarget +
      mission.freedomTarget,
    totalCurrent:
      mission.yachtCurrent +
      mission.houseCurrent +
      mission.familyCurrent +
      mission.freedomCurrent,
    get overallProgress() {
      return this.totalTarget > 0
        ? (this.totalCurrent / this.totalTarget) * 100
        : 0;
    },
    get remaining() {
      return this.totalTarget - this.totalCurrent;
    },
    get containersNeeded() {
      // Прибыль с одного контейнера в рублях (примерно ₽100 за USD)
      const profitPerContainerRUB = (mission.marginPerContainer || 1000) * 100;
      return profitPerContainerRUB > 0
        ? Math.ceil(this.remaining / profitPerContainerRUB)
        : 0;
    },
    get monthsToGoal() {
      const cpm = mission.containersPerMonth || 1;
      return cpm > 0 ? Math.ceil(this.containersNeeded / cpm) : 0;
    },
  };

  return (
    <DealContext.Provider
      value={{
        // State
        deal,
        seller,
        mission,
        checklist,
        deals,
        customers,
        isLoaded,
        missionStats,

        // Setters (full replacement)
        setDeal,
        setSeller,
        setMission,
        setChecklist,
        setDeals,
        setCustomers,

        // Helpers (partial updates)
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