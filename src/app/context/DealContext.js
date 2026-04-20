"use client";
import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "ru-timber-current-deal-v2";

const DEAL_DEFAULTS = {
  // === Step 3.8: Volume Calculator ===
  thickness: 44,
  width: 150,
  length: 5980,
  inputMode: "volume",
  quantity: 100,
  volumeInput: 40,
  species: "PINE",
  moisture: "KD",
  pinePercent: 50,
  endUse: null,

  // === Step 3.9: Pricing Calculator ===
  // Raw material: $/m³ (цена пилорамы за кубометр)
  costRawMaterial_per_m3: 180,
  // Остальное: $/контейнер (реалистичная логика!)
  costLogisticsRU_per_container: 1500,
  costFOB_per_container: 400,
  costCIF_per_container: 2500,

  incoterms: "CIF",
  marginPercent: 25,
  usdRub: 95,
};

const DealContext = createContext(null);

export function DealProvider({ children }) {
  const [deal, setDeal] = useState(DEAL_DEFAULTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);

  // LOAD from LocalStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          setDeal((prev) => ({ ...prev, ...data }));
          setHasMemory(true);
        }
      }
    } catch (e) {
      console.warn("Failed to load deal:", e);
    }
    setIsLoaded(true);
  }, []);

  // SAVE to LocalStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...deal,
          savedAt: new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn("Failed to save deal:", e);
    }
  }, [deal, isLoaded]);

  // Обновить одно поле
  const updateField = (key, value) => {
    setDeal((prev) => ({ ...prev, [key]: value }));
  };

  // Обновить несколько полей (для пресетов)
  const updateFields = (patch) => {
    setDeal((prev) => ({ ...prev, ...patch }));
  };

  // Сброс
  const resetDeal = () => {
    setDeal(DEAL_DEFAULTS);
    setHasMemory(false);
  };

  // Полная очистка памяти
  const clearMemory = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      setDeal(DEAL_DEFAULTS);
      setHasMemory(false);
    } catch (e) {
      console.warn("Failed to clear:", e);
    }
  };

  return (
    <DealContext.Provider
      value={{
        deal,
        updateField,
        updateFields,
        resetDeal,
        clearMemory,
        isLoaded,
        hasMemory,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const ctx = useContext(DealContext);
  if (!ctx) {
    throw new Error("useDeal must be used within DealProvider");
  }
  return ctx;
}