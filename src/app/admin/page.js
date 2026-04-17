"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

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

  // Читаем данные из облака в реальном времени
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "erp", "calculator"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  // Сохраняем данные в облако при любом изменении
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: Number(value) || 0 };
    setData(newData);
    setDoc(doc(db, "erp", "calculator"), newData);
  };

  // Формулы
  const totalCostRUB = data.purchasePrice + data.logistics + data.customs + data.misc;
  const sellPriceRUB = data.sellPriceUSD * data.exchangeRate;
  const profitPerCube = sellPriceRUB - totalCostRUB;
  const totalProfit = profitPerCube * data.volume;

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <h1 className="text-xl font-bold">ERP: Калькулятор ВЭД</h1>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
            Cloud Sync
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
              <div>
                <label className="block text-xs text-slate-500 mb-1">Курс ($/₽)</label>
                <input type="number" name="exchangeRate" value={data.exchangeRate || ""} onChange={handleChange} className="w-full border-b-2 border-slate-200 focus:border-slate-500 outline-none py-1 text-lg font-bold bg-transparent"/>
              </div>
            </div>
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