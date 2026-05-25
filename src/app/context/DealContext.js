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

// ===========================================
// 💰 КОНСТАНТЫ ЦЕНООБРАЗОВАНИЯ
// ===========================================

// Базовые цены за м³ (USD) — закупка у лесопилки
export const SPECIES_BASE_PRICES = {
  Pine: 180,         // Сосна (Pinus sylvestris) — REDWOOD
  Spruce: 165,       // Ель европейская — WHITEWOOD
  Larch: 240,        // Лиственница — премиум
  Cedar: 320,        // Кедр — суперпремиум
  Birch: 200,        // Берёза
  Oak: 450,          // Дуб
};

// Наценка по странам назначения (% к базовой цене)
export const COUNTRY_MARGINS = {
  UAE: 2.8,          // ОАЭ — премиум рынок
  India: 2.4,        // Индия — массовый рынок
  China: 2.2,        // Китай — большие объёмы, низкая маржа
  Egypt: 2.6,        // Египет
  Turkey: 2.3,       // Турция
  Vietnam: 2.5,      // Вьетнам
  SouthKorea: 3.0,   // Южная Корея — премиум
  Japan: 3.2,        // Япония — суперпремиум
  Uzbekistan: 1.8,   // Узбекистан — рядом, дешёво
  Kazakhstan: 1.7,   // Казахстан
  Iran: 2.5,         // Иран
  Iraq: 2.7,         // Ирак
  SaudiArabia: 2.9,  // Саудовская Аравия
};

// Надбавка за сушку (USD/m³)
export const DRYING_SURCHARGE = {
  "Natural (20-24%)": 0,        // Естественная сушка
  "KD 18-20%": 25,              // Камерная средняя
  "KD 14-16%": 45,              // Камерная стандарт
  "KD 10-12%": 65,              // Камерная экспортная
  "KD 8-10%": 85,               // Камерная премиум
};

// Надбавка за обработку (USD/m³)
export const TREATMENT_SURCHARGE = {
  None: 0,
  AST: 15,           // Anti-Stain Treatment
  ISPM15: 8,         // Фумигация упаковки
  "AST + ISPM15": 23,
  Impregnation: 35,  // Импрегнация
};

// Надбавка за сорт (USD/m³)
export const GRADE_SURCHARGE = {
  "Grade 1 (отборный)": 50,
  "Grade 1-2": 25,
  "Grade 1-3": 0,        // стандарт
  "Grade 2-3": -20,
  "Grade 3-4": -40,
};

// End-use пресеты (тип конечного использования)
export const END_USE_PRESETS = {
  construction: { label: "🏗️ Construction (стройка)", priceMultiplier: 1.0 },
  furniture: { label: "🪑 Furniture (мебель)", priceMultiplier: 1.15 },
  packaging: { label: "📦 Packaging (упаковка)", priceMultiplier: 0.85 },
  pallets: { label: "🟦 Pallets (поддоны)", priceMultiplier: 0.75 },
  premium: { label: "💎 Premium (премиум)", priceMultiplier: 1.35 },
  decking: { label: "🛤️ Decking (террасы)", priceMultiplier: 1.25 },
};

// Курсы валют (статически, можно потом сделать API)
export const EXCHANGE_RATES = {
  USD_RUB: 100,
  EUR_RUB: 108,
  CNY_RUB: 14,
  AED_RUB: 27,
};

// Типы контейнеров
export const CONTAINER_TYPES = {
  "20DV": { name: "20' Dry Van", capacity: 28, payload: 21750 },
  "40DV": { name: "40' Dry Van", capacity: 58, payload: 26500 },
  "40HC": { name: "40' High Cube", capacity: 68, payload: 26500 },
  "45HC": { name: "45' High Cube", capacity: 76, payload: 27500 },
};

// ===========================================
// 📦 НАЧАЛЬНЫЕ СОСТОЯНИЯ
// ===========================================

// Начальное состояние сделки
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
  grade: "Grade 1-3",
  treatment: "AST",

  // Pricing
  pricingPerM3: 540,
  pricingTotalUSD: 33480,
  freightPreset: "CIF Jebel Ali",
  country: "UAE",

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

// Начальное состояние Seller
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

// Начальное состояние Mission
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

// Pre-Flight Checklist (17 пунктов)
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

// ===========================================
// 🎬 ПРОВАЙДЕР
// ===========================================

export function DealProvider({ children }) {
  const [deal, setDeal] = useState(defaultDeal);
  const [seller, setSeller] = useState(defaultSeller);
  const [mission, setMission] = useState(defaultMission);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
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

  // 🛠️ Хелперы
  const updateDeal = (updates) => {
    setDeal((prev) => ({ ...prev, ...updates }));
  };

  const updateSeller = (updates) => {
    setSeller((prev) => ({ ...prev, ...updates }));
  };

  const updateMission = (updates) => {
    setMission((prev) => ({ ...prev, ...updates }));
  };

  const toggleChecklistItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetDeal = () => {
    setDeal(defaultDeal);
  };

  // 📊 Статистика Mission
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