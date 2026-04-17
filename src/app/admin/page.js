"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState({
    purchasePrice: 10000,
    logistics: 4000,
    customs: 1500,
    misc: 500,
    sellPriceUSD: 220,
    exchangeRate: 93.5,
    volume: 40
  });

  const [isFetchingRate, setIsFetchingRate] = useState(false);

  // Читаем данные из Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "erp", "calculator"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  // Сохраняем в Firebase
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: Number(value) || 0 };
    setData(newData);
    setDoc(doc(db, "erp", "calculator"), newData);
  };

  // ФУНКЦИЯ: Получение реального курса ЦБ РФ (через открытый API)
  const fetchLiveExchangeRate = async () => {
    setIsFetchingRate(true);
    try {
      // Используем надежный открытый API для курсов валют
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const result = await response.json();
      
      if (result && result.rates && result.rates.RUB) {
        const liveRate = Number(result.rates.RUB.toFixed(2));
        
        // Обновляем состояние и сохраняем в базу
        const newData = { ...data, exchangeRate: liveRate };
        setData(newData);
        setDoc(doc(db, "erp", "calculator"), newData);
      }
    } catch (error) {
      console.error("Ошибка при получении курса:", error);
      alert("Не удалось обновить курс. Проверьте интернет.");
    } finally {
      setIsFetchingRate(false);
    }
  };

  // Формулы
  const totalCostRUB = data.purchasePrice + data.logistics + data.customs + data.misc;
  const sellPriceRUB = data.sellPriceUSD * data.exchangeRate;
  const profitPerCube = sellPriceRUB - totalCostRUB;
  const totalProfit = profitPerCube * data.volume;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-10">
      
      {/* НАВИГАЦИЯ (Верхняя панель) */}
      <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-center gap-2 md:gap-6 overflow-x-auto">
        <Link href="/" className="whitespace-nowrap px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider transition-colors">
          🌐 Витрина
        </Link>
        <Link href="/admin" className="whitespace-nowrap px-4 py-2 rounded bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(249,115,22,0.3)]">
          🧮 Калькулятор
        </Link>
        <Link href="/stats" className="whitespace-nowrap px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider transition-colors">
          📊 Сводка
        </Link>
      </nav>

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">Расчет экономики</h1>
          <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
            SYNCED
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Закупка (₽/м³)</label>
              <input type="number" name="purchasePrice" value={data.purchasePrice || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-orange-500 outline-none py-1 text-lg font-bold"/>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Логистика (₽/м³)</label>
              <input type="number" name="logistics" value={data.logistics || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-orange-500 outline-none py-1 text-lg font-bold"/>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Таможня (₽/м³)</label>
              <input type="number" name="customs" value={data.customs || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-orange-500 outline-none py-1 text-lg font-bold"/>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Прочее (₽/м³)</label>
              <input type="number" name="misc" value={data.misc || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-orange-500 outline-none py-1 text-lg font-bold"/>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Цена продажи ($)</label>
                <input type="number" name="sellPriceUSD" value={data.sellPriceUSD || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-green-500 outline-none py-1 text-xl font-black text-green-600 bg-transparent"/>
              </div>
              <div className="relative">
                <label className="block text-xs text-slate-500 mb-1">Курс ($/₽)</label>
                <input type="number" name="exchangeRate" value={data.exchangeRate || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-slate-500 outline-none py-1 text-lg font-bold bg-transparent pr-8"/>
                
                {/* КНОПКА ОБНОВЛЕНИЯ КУРСА ПО API */}
                <button 
                  onClick={fetchLiveExchangeRate}
                  disabled={isFetchingRate}
                  className="absolute right-0 bottom-2 text-slate-400 hover:text-orange-500 transition-colors"
                  title="Обновить курс по API"
                >
                  <svg className={`w-5 h-5 ${isFetchingRate ? 'animate-spin text-orange-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">Нажмите на иконку для загрузки live-курса</p>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1 mt-4">Объем партии (м³)</label>
            <input type="number" name="volume" value={data.volume || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-orange-500 outline-none py-1 text-xl font-bold"/>
          </div>

          <div className="mt-8 bg-slate-900 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Себестоимость:</span>
              <span className="font-bold">{totalCostRUB.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
              <span className="text-slate-400">Цена продажи (в ₽):</span>
              <span className="font-bold">{sellPriceRUB.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Чистая прибыль:</span>
              <span className={`text-3xl font-black ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalProfit.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}