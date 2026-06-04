"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "ru-timber-business-settings";

// 🌍 ВАЛЮТЫ
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", flag: "🇹🇷" },
];

export const TAX_SYSTEMS = [
  { code: "USN-6", label: "УСН 6% (доходы)" },
  { code: "USN-15", label: "УСН 15% (доходы минус расходы)" },
  { code: "OSN", label: "ОСН (общая)" },
  { code: "PSN", label: "Патент (ПСН)" },
  { code: "NPD", label: "НПД (самозанятый)" },
];

export const INCOTERMS = [
  { code: "FOB", label: "FOB (только погрузка)" },
  { code: "CFR", label: "CFR (с фрахтом)" },
  { code: "CIF", label: "CIF (с фрахтом+страховкой)" },
  { code: "EXW", label: "EXW (со склада)" },
  { code: "DAP", label: "DAP (до места)" },
];

const DEFAULT_SETTINGS = {
  fullName: "Семакин Константин Фёдорович",
  position: "Founder & Export Director",
  signatureName: "K. Semakin",
  companyName: "ИП Семакин Константин Фёдорович",
  companyNameEn: "IE Semakin Konstantin",
  inn: "771617956514",
  ogrnip: "326774600405782",
  taxSystem: "USN-6",
  legalAddress: "127081, г. Москва, ул. Заповедная 18, корпус 4, кв. 69",
  bankName: "ПАО Сбербанк",
  bankNameEn: "SBERBANK",
  bankBIK: "044525225",
  bankAccountRUB: "40802 810 1 3872 0087910",
  bankAccountUSD: "40802 840 3 3872 0000026",
  bankCorrAccount: "30101810400000000225",
  bankSWIFT: "SABRRUMM",
  bankCorrespondentUSD: "SABRRUMM012",
  phone: "+7 915 349 00 07",
  whatsapp: "+7 915 349 00 07",
  email: "ksemakin@icloud.com",
  telegram: "@rutimber",
  website: "ru-timber.com",
  officeAddress: "127081, г. Москва, ул. Заповедная 18, кор4",
  warehouseAddress: "Вологодская обл., г. Вологда",
  warehouseAddressEn: "Vologda region, Vologda, Russia",
  defaultPort: "Novorossiysk (NVS)",
  defaultLine: "FESCO",
  defaultTransitDays: 28,
  defaultIncoterm: "CIF",
  defaultCurrency: "USD",
  fallbackRate: 91.5,
  vatRate: 0,
  paymentTerms: "30% advance + 70% against B/L copy",
  paymentTermsRu: "30% предоплата + 70% против копии коносамента",
  stampCompanyName: "RU-TIMBER EXPORT",
  stampType: "ИП",
  stampCity: "MOSCOW",
};

const REQUIRED_FIELDS = Object.keys(DEFAULT_SETTINGS).filter(
  (k) => !k.startsWith("stamp")
);

// 🎯 ПРОСТОЙ ХУК БЕЗ Context API — работает без Provider
export function useBusinessSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (err) {
      console.error("Failed to load business settings:", err);
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (updates) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (err) {
        console.error("Failed to save business settings:", err);
      }
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const filledCount = REQUIRED_FIELDS.filter(
    (k) =>
      settings[k] !== "" &&
      settings[k] !== null &&
      settings[k] !== undefined
  ).length;
  const totalCount = REQUIRED_FIELDS.length;
  const progress = Math.round((filledCount / totalCount) * 100);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `ru-timber-settings-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const merged = { ...DEFAULT_SETTINGS, ...data };
          setSettings(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          resolve(merged);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return {
    ...settings,
    isLoaded,
    updateSettings,
    resetSettings,
    exportJSON,
    importJSON,
    filledCount,
    totalCount,
    progress,
  };
}

export function getCurrencySymbol(code) {
  const cur = CURRENCIES.find((c) => c.code === code);
  return cur ? cur.symbol : code;
}

// Заглушка для совместимости (если где-то импортируется)
export function BusinessProvider({ children }) {
  return children;
}