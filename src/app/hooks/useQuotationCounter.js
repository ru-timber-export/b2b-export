"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "ru-timber-quotation-counter";

/**
 * Хук для автонумерации квотаций
 * QT-2026-001, QT-2026-002, QT-2026-003...
 * Счётчик сбрасывается каждый год
 */
export function useQuotationCounter() {
  const [counter, setCounter] = useState({ year: 0, number: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const currentYear = new Date().getFullYear();
      
      if (saved) {
        const parsed = JSON.parse(saved);
        // Если год сменился — сброс
        if (parsed.year !== currentYear) {
          setCounter({ year: currentYear, number: 0 });
        } else {
          setCounter(parsed);
        }
      } else {
        setCounter({ year: currentYear, number: 0 });
      }
    } catch (e) {
      console.error("Failed to load counter:", e);
    }
    setIsLoaded(true);
  }, []);

  /**
   * Получить СЛЕДУЮЩИЙ номер БЕЗ сохранения
   * (для предпросмотра в Quotation)
   */
  const getNextNumber = () => {
    const year = new Date().getFullYear();
    const number = counter.year === year ? counter.number + 1 : 1;
    return `QT-${year}-${String(number).padStart(3, "0")}`;
  };

  /**
   * Зафиксировать номер (когда квотация реально отправлена)
   * Увеличивает счётчик и сохраняет
   */
  const commitNumber = () => {
    const year = new Date().getFullYear();
    const number = counter.year === year ? counter.number + 1 : 1;
    const newCounter = { year, number };
    setCounter(newCounter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCounter));
    return `QT-${year}-${String(number).padStart(3, "0")}`;
  };

  /**
   * Сброс счётчика (для тестов или ручной коррекции)
   */
  const resetCounter = (newNumber = 0) => {
    const year = new Date().getFullYear();
    const newCounter = { year, number: newNumber };
    setCounter(newCounter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCounter));
  };

  return {
    currentNumber: counter.number,
    currentYear: counter.year,
    nextNumber: getNextNumber(),
    commitNumber,
    resetCounter,
    isLoaded,
  };
}