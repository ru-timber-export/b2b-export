"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState({ purchasePrice: 10000, logistics: 4000, customs: 1500, misc: 500, sellPriceUSD: 220, exchangeRate: 93.5, volume: 40 });
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "erp", "calculator"), (docSnap) => { if (docSnap.exists()) setData(docSnap.data()); });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const newData = { ...data, [e.target.name]: Number(e.target.value) || 0 };
    setData(newData);
    setDoc(doc(db, "erp", "calculator"), newData);
  };

  const fetchLiveExchangeRate = async () => {
    setIsFetchingRate(true);
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const result = await response.json();
      if (result?.rates?.RUB) {
        const newData = { ...data, exchangeRate: Number(result.rates.RUB.toFixed(2)) };
        setData(newData);
        setDoc(doc(db, "erp", "calculator"), newData);
      }
    } catch (error) { alert("Ошибка обновления курса."); } finally { setIsFetchingRate(false); }
  };

  const totalCostRUB = data.purchasePrice + data.logistics + data.customs + data.misc;
  const sellPriceRUB = data.sellPriceUSD * data.exchangeRate;
  const totalProfit = (sellPriceRUB - totalCostRUB) * data.volume;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-orange-500/30">
      
      {/* МЕНЮ */}
      <aside className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center md:block">
          <div><h1 className="text-lg md:text-xl font-black text-white tracking-widest">RU-TIMBER</h1><p className="text-[10px] text-orange-500 mt-1 uppercase tracking-widest font-mono hidden md:block">Financial Core</p></div>
        </div>
        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-visible">
          <Link href="/" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">Витрина</Link>
          <Link href="/admin" className="whitespace-nowrap px-4 py-2 md:py-3 rounded bg-orange-900/20 text-orange-400 border border-orange-900/50 text-[10px] md:text-xs uppercase tracking-wider font-bold">ERP Калькулятор</Link>
          <Link href="/crm" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">CRM Доска</Link>
          <Link href="/stats" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">Сводка</Link>
        </nav>
      </aside>

      {/* КАЛЬКУЛЯТОР */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">Расчет экономики</h2></div>
        </header>
        <div className="max-w-2xl bg-[#111] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Закупка (₽/м³)</label><input type="number" name="purchasePrice" value={data.purchasePrice || ""} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-orange-500 rounded p-2 text-white font-mono outline-none"/></div>
              <div><label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Логистика (₽/м³)</label><input type="number" name="logistics" value={data.logistics || ""} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-orange-500 rounded p-2 text-white font-mono outline-none"/></div>
              <div><label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Таможня (₽/м³)</label><input type="number" name="customs" value={data.customs || ""} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-orange-500 rounded p-2 text-white font-mono outline-none"/></div>
              <div><label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Прочее (₽/м³)</label><input type="number" name="misc" value={data.misc || ""} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-orange-500 rounded p-2 text-white font-mono outline-none"/></div>
            </div>
            <div className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Цена продажи ($)</label><input type="number" name="sellPriceUSD" value={data.sellPriceUSD || ""} onChange={handleChange} className="w-full bg-transparent border-b-2 border-gray-700 focus:border-green-500 text-2xl font-black text-green-500 outline-none py-1"/></div>
                <div className="relative"><label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Курс ($/₽) <span className="text-blue-500">LIVE</span></label><input type="number" name="exchangeRate" value={data.exchangeRate || ""} onChange={handleChange} className="w-full bg-transparent border-b-2 border-gray-700 focus:border-blue-500 text-xl font-bold text-white outline-none py-1 pr-8"/><button onClick={fetchLiveExchangeRate} disabled={isFetchingRate} className="absolute right-0 bottom-2 text-gray-500 hover:text-blue-500"><svg className={`w-5 h-5 ${isFetchingRate ? 'animate-spin text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button></div>
              </div>
            </div>
            <div><label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">Объем партии (м³)</label><input type="number" name="volume" value={data.volume || ""} onChange={handleChange} className="w-1/2 bg-[#0a0a0a] border border-gray-700 focus:border-orange-500 rounded p-2 text-white font-bold text-lg outline-none"/></div>
            <div className="mt-6 bg-[#050505] border border-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-3"><span className="text-gray-500 font-mono text-xs uppercase">Себестоимость:</span><span className="font-mono text-white">{totalCostRUB.toLocaleString("ru-RU")} ₽</span></div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800"><span className="text-gray-500 font-mono text-xs uppercase">Выручка (в ₽):</span><span className="font-mono text-white">{sellPriceRUB.toLocaleString("ru-RU")} ₽</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase tracking-wider">Чистая прибыль:</span><span className={`text-3xl font-black tracking-tighter ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>{totalProfit > 0 ? "+" : ""}{totalProfit.toLocaleString("ru-RU")} ₽</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}