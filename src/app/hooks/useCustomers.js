"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "ru-timber-customers";

/**
 * Хук для чтения клиентов из CRM
 * Используется в Quotation для выбора Buyer
 */
export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCustomers(parsed);
      }
    } catch (e) {
      console.error("Failed to load customers:", e);
    }
    setIsLoaded(true);
  }, []);

  return { customers, isLoaded };
}