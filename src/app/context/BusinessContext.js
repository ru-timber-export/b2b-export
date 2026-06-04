"use client";
import { createContext, useContext, useState, useEffect } from "react";

const BusinessContext = createContext(null);

const STORAGE_KEY = "ru-timber-business-settings";

// Дефолтные данные (с твоей реальной печати)
const DEFAULT_SETTINGS = {
  // Компания
  companyName: "RU-TIMBER EXPORT",
  companyType: "ИП",
  legalForm: "Индивидуальный предприниматель",
  inn: "7716179565514",
  ogrn: "326774600405782",
  city: "MOSCOW",
  legalAddress: "",
  
  // Директор
  director: "",
  directorPosition: "Индивидуальный предприниматель",
  
  // Контакты
  email: "",
  phone: "",
  website: "ru-timber.com",
  
  // Банк (USD счёт)
  bankName: "",
  bankSwift: "",
  bankAccountUSD: "",
  bankAccountRUB: "",
  correspondentBank: "",
  
  // Печать (опционально — кастомизация)
  stampPrimaryColor: "#1e3a8a",
  
  // Подпись (URL картинки если есть)
  signatureUrl: "",
};

export function BusinessProvider({ children }) {
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

  // Сохранение в localStorage
  const updateSettings = (updates) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.error("Failed to save business settings:", err);
    }
  };

  // Сброс к дефолтным
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <BusinessContext.Provider
      value={{ ...settings, updateSettings, resetSettings, isLoaded }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessSettings() {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    // Не выбрасываем ошибку — возвращаем дефолт
    return DEFAULT_SETTINGS;
  }
  return ctx;
}