"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DealContext = createContext();

const STORAGE_KEY = "ru-timber-current-deal-v3";

// 💰 Таблица цен по породам (апрель 2026)
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

// 💧 Надбавка за сушку
export const DRYING_SURCHARGE = {
  fresh: 0,
  ad: 15,
  kd: 35,
};

// 📦 Надбавка за упаковку
export const PACKAGING_SURCHARGE = {
  none: 0,
  crate: 8,
  shrink: 18,
};

// 🚢 Пресеты фрахта (Vladivostok как приоритет)
export const FREIGHT_PRESETS = {
  "vlv-chennai": { label: "Vladivostok → Chennai (India)", rate: 2500, port: "Vladivostok" },
  "vlv-shanghai": { label: "Vladivostok → Shanghai (China)", rate: 1000, port: "Vladivostok" },
  "nvr-mumbai": { label: "Novorossiysk → Mumbai (India)", rate: 2000, port: "Novorossiysk" },
  "nvr-dubai": { label: "Novorossiysk → Dubai (UAE)", rate: 1700, port: "Novorossiysk" },
  "nvr-alexandria": { label: "Novorossiysk → Alexandria (Egypt)", rate: 1600, port: "Novorossiysk" },
  "nvr-istanbul": { label: "Novorossiysk → Istanbul (Turkey)", rate: 1400, port: "Novorossiysk" },
};

// 💼 Рекомендуемая маржа по странам
export const COUNTRY_MARGINS = {
  india: 18,
  china: 15,
  uae: 25,
  egypt: 20,
  turkey: 17,
};

const DEAL_DEFAULTS = {
  // Volume
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

  // Per-container costs (fallback, если не берём из пресета)
  mill_logistics: 1500,
  port_fees: 400,
  freight_insurance: 2500,

  // Обработка для 0% пошлины
  profileProcessing: false,

  // Last update
  lastUpdate: null,
};

export function DealProvider({ children }) {
  const [deal, setDeal] = useState(DEAL_DEFAULTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDeal({ ...DEAL_DEFAULTS, ...parsed });
      }
    } catch (e) {
      console.error("LocalStorage read error:", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deal));
    } catch (e) {
      console.error("LocalStorage write error:", e);
    }
  }, [deal, isLoaded]);

  const updateDeal = (updates) => {
    setDeal((prev) => ({ ...prev, ...updates, lastUpdate: Date.now() }));
  };

  const resetDeal = () => {
    setDeal(DEAL_DEFAULTS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <DealContext.Provider value={{ deal, updateDeal, resetDeal, isLoaded }}>
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const ctx = useContext(DealContext);
  if (!ctx) throw new Error("useDeal must be used inside DealProvider");
  return ctx;
}