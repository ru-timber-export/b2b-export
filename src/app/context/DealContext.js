"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DealContext = createContext();

// === STORAGE KEYS (v4) ===
const STORAGE_KEYS = {
  DEAL: "ru-timber-current-deal-v4",
  SELLER: "ru-timber-seller-v1",
  CUSTOMERS: "ru-timber-customers-v1",
  SUPPLIERS: "ru-timber-suppliers-v1",
  DEALS: "ru-timber-deals-v1",
  REMINDERS: "ru-timber-reminders-v1",
  CHECKLIST: "ru-timber-checklist-v1",
};

// Old key (для миграции v3 → v4)
const OLD_DEAL_KEY = "ru-timber-current-deal-v3";

// === 🔒 ЖЁСТКИЕ ПРАВИЛА БИЗНЕСА ===
export const BUSINESS_RULES = {
  FIAT_ONLY: true,            // только USD/EUR/AED через банк
  NO_CRYPTO: true,             // никакой USDT/BTC
  JURISDICTION: "RU",          // юрисдикция РФ
  ARBITRATION: "ICAC Moscow",  // арбитраж в Москве
  TARGET_TIER: "TOP_1_PERCENT", // цель: топ-1% экспортёров
};

// === 💰 Таблица цен по породам (апрель 2026) ===
export const SPECIES_BASE_PRICES = {
  pine: 160,
  spruce: 155,
  "pine-spruce-50-50": 150,
  "pine-spruce-70-30": 158,
  spf: 152,
  larch: 285,
  cedar: 250,
  birch: 195,
  oak: 580,
  aspen: 140,
  custom: 160,
};

// === 💧 Надбавка за сушку ===
export const DRYING_SURCHARGE = {
  fresh: 0,
  ad: 15,
  kd: 35,
};

// === 📦 Надбавка за упаковку ===
export const PACKAGING_SURCHARGE = {
  none: 0,
  crate: 8,
  shrink: 18,
};

// === 🚢 Пресеты фрахта (Vladivostok приоритет) ===
export const FREIGHT_PRESETS = {
  "vlv-chennai": { label: "Vladivostok → Chennai (India)", rate: 2500, port: "Vladivostok" },
  "vlv-shanghai": { label: "Vladivostok → Shanghai (China)", rate: 1000, port: "Vladivostok" },
  "nvr-mumbai": { label: "Novorossiysk → Mumbai (India)", rate: 2000, port: "Novorossiysk" },
  "nvr-dubai": { label: "Novorossiysk → Dubai (UAE)", rate: 1700, port: "Novorossiysk" },
  "nvr-alexandria": { label: "Novorossiysk → Alexandria (Egypt)", rate: 1600, port: "Novorossiysk" },
  "nvr-istanbul": { label: "Novorossiysk → Istanbul (Turkey)", rate: 1400, port: "Novorossiysk" },
};

// === 💼 Рекомендуемая маржа по странам ===
export const COUNTRY_MARGINS = {
  india: 18,
  china: 15,
  uae: 25,
  egypt: 20,
  turkey: 17,
};

// === 📋 DEAL DEFAULTS (основная сделка) ===
const DEAL_DEFAULTS = {
  // Board
  thickness: 44,
  width: 150,
  length: 5980,
  species: "pine-spruce-50-50",
  moisture: "kd",
  packaging: "crate",
  endUse: "construction",
  inputMode: "volume",
  totalVolume: 50,
  totalPieces: 1267,

  // Pricing
  incoterm: "cif",
  margin: 18,
  usdRubRate: 76.25,
  freightRoute: "vlv-chennai",
  mill_logistics: 1500,
  port_fees: 400,
  freight_insurance: 2500,
  profileProcessing: false,

  // 🆕 Computed (для 3D, фикс бага в Шаге B2)
  computedVolume_m3: 0,
  computedWeight_kg: 0,
  computedPieces: 0,

  // 🆕 Текущая сделка (если открыта из архива)
  currentDealId: null,

  lastUpdate: null,
};

// === 🏢 SELLER DEFAULTS (твои реквизиты — пустые до регистрации ИП) ===
export const SELLER_DEFAULTS = {
  name: "RU-TIMBER EXPORT",
  legalForm: "",                       // LLC / IE / FZE (заполнить после ИП)
  address: "[Your Legal Address]",
  phone: "+7 915 349 00 07",
  email: "info@ru-timber.com",
  website: "ru-timber.com",
  inn: "[INN]",
  ogrn: "[OGRN]",
  director: "Konstantin",
  bank: "[Bank Name]",
  swift: "[SWIFT]",
  account: "[Account Number]",
  correspondent: "[Correspondent Bank on request]",
  registered: false,                    // 🚨 флаг: ИП зарегистрирован?
  registrationDate: null,
};

// === ✅ PRE-FLIGHT CHECKLIST (готовность к первой сделке) ===
export const CHECKLIST_DEFAULTS = {
  // Юридическая часть
  ip_registered: false,
  ved_account_opened: false,
  domain_purchased: false,
  email_corporate_setup: false,
  
  // Государственные системы
  lesegais_registered: false,
  customs_account: false,
  
  // Партнёры
  lawyer_consulted: false,
  exiar_applied: false,
  rec_subsidy_applied: false,
  it_accreditation: false,
  
  // Инструменты
  vpn_setup: false,
  whatsapp_business: false,
  google_drive_organized: false,
  
  // Документы-шаблоны
  international_contract_reviewed: false,
  supply_contract_reviewed: false,
  
  // Сертификаты (для маркетинга)
  pefc_certificate: false,
  iso_certificate: false,
};

// === 🔔 НАПОМИНАНИЯ ПО УМОЛЧАНИЮ ===
const DEFAULT_REMINDERS = [
  {
    id: "rem-001",
    type: "legal",
    priority: "high",
    icon: "⚖️",
    title: "Зарегистрировать ИП через Тинькофф",
    description: "ИП на ОСНО + НДС. Триггер: первый серьёзный запрос с готовностью платить.",
    when: "before-first-deal",
    done: false,
  },
  {
    id: "rem-002",
    type: "legal",
    priority: "high",
    icon: "📞",
    title: "Консультация с юристом-международником",
    description: "Показать оба контракта (EN + RU). 1-2 часа, 5-10 тыс. ₽. Окупится с первой сделки.",
    when: "before-first-deal",
    done: false,
  },
  {
    id: "rem-003",
    type: "tech",
    priority: "medium",
    icon: "🌐",
    title: "Настроить VPN (Outline + Hetzner VPS)",
    description: "$5.40/мес. Свой сервер в Германии. Стабильный доступ к Vercel, GitHub, Claude, Gmail.",
    when: "after-ip-registration",
    done: false,
  },
  {
    id: "rem-004",
    type: "benefits",
    priority: "medium",
    icon: "🎖️",
    title: "Применить льготы ВБД",
    description: "ЭКСАР скидка 20-30%, РЭЦ субсидия 80% на логистику, гранты Сколково/ФРИИ на IT.",
    when: "after-ip-registration",
    done: false,
  },
  {
    id: "rem-005",
    type: "finance",
    priority: "high",
    icon: "💰",
    title: "Подать на возврат НДС 20% при экспорте",
    description: "После первой отгрузки. Через таможню. +$30-50/м³ к прибыли!",
    when: "after-first-shipment",
    done: false,
  },
  {
    id: "rem-006",
    type: "compliance",
    priority: "critical",
    icon: "🚨",
    title: "ЛесЕГАИС: запросить выписку у пилорамы",
    description: "ОБЯЗАТЕЛЬНО к каждой партии! Без выписки = риск ст. 191.1 УК РФ.",
    when: "every-deal",
    done: false,
  },
  {
    id: "rem-007",
    type: "tech",
    priority: "low",
    icon: "🚀",
    title: "IT-аккредитация Минцифры",
    description: "Страховые 7.6% вместо 30%. Подавать после 3-5 сделок и стабильного дохода.",
    when: "after-3-deals",
    done: false,
  },
];

// === 📁 HELPER: безопасное чтение LocalStorage ===
function safeRead(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data);
  } catch (e) {
    console.error(`LocalStorage read error [${key}]:`, e);
    return fallback;
  }
}

function safeWrite(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`LocalStorage write error [${key}]:`, e);
  }
}

// === 🔄 MIGRATION: v3 → v4 ===
function migrateV3toV4() {
  if (typeof window === "undefined") return null;
  try {
    const oldDeal = localStorage.getItem(OLD_DEAL_KEY);
    if (!oldDeal) return null;
    
    const parsed = JSON.parse(oldDeal);
    // Сохраняем все старые поля + добавляем новые computed
    const migrated = {
      ...DEAL_DEFAULTS,
      ...parsed,
      computedVolume_m3: parseFloat(parsed.totalVolume) || 0,
      computedWeight_kg: 0,  // пересчитается на следующем входе
      computedPieces: parseFloat(parsed.totalPieces) || 0,
    };
    
    // Пишем в новый ключ, удаляем старый
    localStorage.setItem(STORAGE_KEYS.DEAL, JSON.stringify(migrated));
    localStorage.removeItem(OLD_DEAL_KEY);
    
    console.log("✅ Migrated DealContext v3 → v4");
    return migrated;
  } catch (e) {
    console.error("Migration error:", e);
    return null;
  }
}

// === 🎯 PROVIDER ===
export function DealProvider({ children }) {
  const [deal, setDeal] = useState(DEAL_DEFAULTS);
  const [seller, setSeller] = useState(SELLER_DEFAULTS);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
  const [checklist, setChecklist] = useState(CHECKLIST_DEFAULTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);

  // === Загрузка при старте ===
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Мигр��ция v3 → v4 (если есть старые данные)
    const migrated = migrateV3toV4();

    // 2. Загружаем все коллекции
    const loadedDeal = migrated || safeRead(STORAGE_KEYS.DEAL, DEAL_DEFAULTS);
    const loadedSeller = safeRead(STORAGE_KEYS.SELLER, SELLER_DEFAULTS);
    const loadedCustomers = safeRead(STORAGE_KEYS.CUSTOMERS, []);
    const loadedSuppliers = safeRead(STORAGE_KEYS.SUPPLIERS, []);
    const loadedDeals = safeRead(STORAGE_KEYS.DEALS, []);
    const loadedReminders = safeRead(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS);
    const loadedChecklist = safeRead(STORAGE_KEYS.CHECKLIST, CHECKLIST_DEFAULTS);

    // 3. Мерджим с дефолтами (на случай новых полей в будущем)
    setDeal({ ...DEAL_DEFAULTS, ...loadedDeal });
    setSeller({ ...SELLER_DEFAULTS, ...loadedSeller });
    setCustomers(Array.isArray(loadedCustomers) ? loadedCustomers : []);
    setSuppliers(Array.isArray(loadedSuppliers) ? loadedSuppliers : []);
    setDeals(Array.isArray(loadedDeals) ? loadedDeals : []);
    setReminders(Array.isArray(loadedReminders) ? loadedReminders : DEFAULT_REMINDERS);
    setChecklist({ ...CHECKLIST_DEFAULTS, ...loadedChecklist });

    // hasMemory = была ли память от прошлой сессии
    setHasMemory(!!(migrated || localStorage.getItem(STORAGE_KEYS.DEAL)));
    setIsLoaded(true);
  }, []);

  // === Автосохранение DEAL ===
  useEffect(() => {
    if (!isLoaded) return;
    safeWrite(STORAGE_KEYS.DEAL, deal);
  }, [deal, isLoaded]);

  // === Автосохранение SELLER ===
  useEffect(() => {
    if (!isLoaded) return;
    safeWrite(STORAGE_KEYS.SELLER, seller);
  }, [seller, isLoaded]);

  // === Автосохранение коллекций ===
  useEffect(() => {
    if (!isLoaded) return;
    safeWrite(STORAGE_KEYS.CUSTOMERS, customers);
  }, [customers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    safeWrite(STORAGE_KEYS.SUPPLIERS, suppliers);
  }, [suppliers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    safeWrite(STORAGE_KEYS.DEALS, deals);
  }, [deals, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    safeWrite(STORAGE_KEYS.REMINDERS, reminders);
  }, [reminders, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    safeWrite(STORAGE_KEYS.CHECKLIST, checklist);
  }, [checklist, isLoaded]);

  // === HELPERS ===
  const updateDeal = (updates) => {
    setDeal((prev) => ({ ...prev, ...updates, lastUpdate: Date.now() }));
  };

  const resetDeal = () => {
    setDeal(DEAL_DEFAULTS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.DEAL);
    }
  };

  const updateSeller = (updates) => {
    setSeller((prev) => ({ ...prev, ...updates }));
  };

  // Customers
  const addCustomer = (customer) => {
    const newCustomer = {
      id: `cust-${Date.now()}`,
      createdAt: Date.now(),
      ...customer,
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer.id;
  };

  const updateCustomer = (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Suppliers
  const addSupplier = (supplier) => {
    const newSupplier = {
      id: `sup-${Date.now()}`,
      createdAt: Date.now(),
      ...supplier,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    return newSupplier.id;
  };

  const updateSupplier = (id, updates) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // Deals
  const addDeal = (dealData) => {
    const newDeal = {
      id: `RT-${new Date().getFullYear()}-${String(deals.length + 1).padStart(4, "0")}`,
      createdAt: Date.now(),
      status: "draft",
      docs: {},
      ...dealData,
    };
    setDeals((prev) => [...prev, newDeal]);
    return newDeal.id;
  };

  const updateDealById = (id, updates) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDealById = (id) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  // Reminders
  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done, doneAt: !r.done ? Date.now() : null } : r))
    );
  };

  const addReminder = (reminder) => {
    const newReminder = {
      id: `rem-${Date.now()}`,
      createdAt: Date.now(),
      done: false,
      ...reminder,
    };
    setReminders((prev) => [...prev, newReminder]);
    return newReminder.id;
  };

  // Checklist
  const toggleChecklistItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getChecklistProgress = () => {
    const total = Object.keys(checklist).length;
    const done = Object.values(checklist).filter(Boolean).length;
    return { done, total, percent: Math.round((done / total) * 100) };
  };

  // Reset ALL (опасная кнопка для дебага)
  const resetAll = () => {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setDeal(DEAL_DEFAULTS);
    setSeller(SELLER_DEFAULTS);
    setCustomers([]);
    setSuppliers([]);
    setDeals([]);
    setReminders(DEFAULT_REMINDERS);
    setChecklist(CHECKLIST_DEFAULTS);
  };

  return (
    <DealContext.Provider
      value={{
        // Core deal
        deal,
        updateDeal,
        resetDeal,
        isLoaded,
        hasMemory,
        // Seller
        seller,
        updateSeller,
        // Customers
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        // Suppliers
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        // Deals
        deals,
        addDeal,
        updateDealById,
        deleteDealById,
        // Reminders
        reminders,
        toggleReminder,
        addReminder,
        // Checklist
        checklist,
        toggleChecklistItem,
        getChecklistProgress,
        // Danger zone
        resetAll,
        // Constants
        BUSINESS_RULES,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const ctx = useContext(DealContext);
  if (!ctx) throw new Error("useDeal must be used inside DealProvider");
  return ctx;
}