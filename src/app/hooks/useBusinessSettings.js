"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "ru-timber-business-settings";

// Дефолтные значения (если Settings не заполнены)
export const DEFAULT_BUSINESS_SETTINGS = {
  // 👤 Личные
  fullName: "Семакин Константин Константинович",
  position: "Founder & Export Director",
  signatureName: "K. Semakin",
  
  // 🏢 ИП
  companyName: "ИП Семакин Константин Константинович",
  companyNameEn: "IE Semakin Konstantin",
  inn: "",
  ogrnip: "",
  taxSystem: "USN-6",
  legalAddress: "",
  
  // 🏦 Банк
  bankName: "",
  bankNameEn: "",
  bankBIK: "",
  bankAccountRUB: "",
  bankAccountUSD: "",
  bankCorrAccount: "",
  bankSWIFT: "",
  bankCorrespondentUSD: "",
  
  // 📞 Контакты
  phone: "+7 915 349 00 07",
  whatsapp: "+7 915 349 00 07",
  email: "ksemakin@icloud.com",
  telegram: "",
  website: "ru-timber.com",
  
  // 📍 Адреса
  officeAddress: "",
  warehouseAddress: "Вологодская обл., г. Вологда",
  warehouseAddressEn: "Vologda region, Vologda, Russia",
  
  // ⚓ Логистика
  defaultPort: "Novorossiysk (NVS)",
  defaultLine: "",
  defaultTransitDays: 28,
  defaultIncoterm: "CIF",
  
  // 💰 Финансы
  defaultCurrency: "USD",
  fallbackRate: 76.25,
  vatRate: 0,
  paymentTerms: "30% advance + 70% against B/L copy",
  paymentTermsRu: "30% предоплата + 70% против копии коносамента",
};

/**
 * Хук для чтения бизнес-настроек из localStorage
 * Используется в Quotation, Contract, Email и др.
 * 
 * @returns {object} { settings, isLoaded }
 */
export function useBusinessSettings() {
  const [settings, setSettings] = useState(DEFAULT_BUSINESS_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge: используем сохранённое, если поле пустое — берём дефолт
        const merged = { ...DEFAULT_BUSINESS_SETTINGS };
        Object.keys(parsed).forEach(key => {
          if (parsed[key] !== "" && parsed[key] !== null && parsed[key] !== undefined) {
            merged[key] = parsed[key];
          }
        });
        setSettings(merged);
      }
    } catch (e) {
      console.error("Failed to load business settings:", e);
    }
    setIsLoaded(true);
  }, []);

  return { settings, isLoaded };
}