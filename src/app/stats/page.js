"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function CommandCenter() {
  // Моковые данные для трекинга (потом заменим на реальный API)
  const [trackingData, setTrackingData] = useState({
    containerId: "MSKU 1928374",
    line: "Maersk",
    status: "IN TRANSIT",
    vessel: "MSC ALINA (Voyage 042W)",
    departure: "Novorossiysk, RU (May 01)",
    arrival: "Tuticorin, IND (May 22)",
    progress: 45 // процент пути
  });

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
      
      {/* МЕНЮ */}
      <aside className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center md:block">
          <div><h1 className="text-lg md:text-xl font-black text-white tracking-widest">RU-TIMBER</h1><p className="text-[10px] text-blue-500 mt-1 uppercase tracking-widest font-mono hidden md:block">Strategic Command</p></div>
        </div>
        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-visible">
          <Link href="/" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">Витрина</Link>
          <Link href="/admin" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">ERP Калькулятор</Link>
          <Link href="/crm" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">CRM (Сделки)</Link>
          <Link href="/stats" className="whitespace-nowrap px-4 py-2 md:py-3 rounded bg-blue-900/20 text-blue-400 border border-blue-900/50 text-[10px] md:text-xs uppercase tracking-wider font-bold">Сводка</Link>
        </nav>
      </aside>

      {/* СВОДКА */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">Глобальная сводка</h2></div>
        </header>

        {/* МЕТРИКИ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-[#111] p-4 border border-gray-800 rounded-lg"><h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Активные сделки</h3><div className="text-2xl md:text-3xl font-light text-white">1</div></div>
          <div className="bg-[#111] p-4 border border-gray-800 rounded-lg"><h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Объем в работе</h3><div className="text-2xl md:text-3xl font-light text-white">40 м³</div></div>
          <div className="bg-[#111] p-4 border border-gray-800 rounded-lg"><h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Выручка (Ожид.)</h3><div className="text-2xl md:text-3xl font-light text-green-500">$8.8k</div></div>
          <div className="bg-[#111] p-4 border border-gray-800 rounded-lg"><h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Логистика</h3><div className="text-sm md:text-xl font-bold text-orange-400 mt-2">ОЖИДАНИЕ</div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* LIVE TRACKING (НОВЫЙ БЛОК) */}
          <div className="bg-[#111] p-4 md:p-6 border border-gray-800 rounded-lg flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
              <h3 className="text-white text-xs md:text-sm font-bold uppercase tracking-widest">Live Tracking</h3>
              <span className="flex items-center gap-2 text-[10px] font-mono text-blue-500 bg-blue-900/20 px-2 py-1 rounded">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
                GPS ACTIVE
              </span>
            </div>
            
            <div className="flex-1 bg-[#0a0a0a] border border-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-gray-500 text-[10px] font-mono uppercase">Контейнер</p>
                  <p className="text-white font-bold text-lg">{trackingData.containerId}</p>
                  <p className="text-blue-400 text-xs font-mono mt-1">{trackingData.line} • {trackingData.vessel}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px] font-mono uppercase">Статус</p>
                  <p className="text-green-500 font-bold uppercase tracking-wider">{trackingData.status}</p>
                </div>
              </div>

              {/* Шкала пути */}
              <div className="relative pt-6 pb-2">
                <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-2">
                  <span>{trackingData.departure}</span>
                  <span>{trackingData.arrival}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 relative">
                  <div className="bg-blue-500 h-2 rounded-full relative" style={{ width: `${trackingData.progress}%` }}>
                    {/* Иконка корабля */}
                    <div className="absolute -right-3 -top-3 bg-[#111] border border-blue-500 rounded-full p-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M2 12h20v2H2v-2zm18-2H4l2-6h12l2 6z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ЖУРНАЛ ОПЕРАЦИЙ */}
          <div className="bg-[#111] p-4 md:p-6 border border-gray-800 rounded-lg flex flex-col h-[300px] md:h-auto">
            <h3 className="text-white text-xs md:text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Журнал операций</h3>
            <div className="flex-1 bg-[#0a0a0a] border border-gray-800 p-3 font-mono text-[10px] text-gray-400 space-y-3 overflow-y-auto">
              <p><span className="text-gray-600">[17.04 15:19]</span> <span className="text-blue-400">СИСТЕМА:</span> Запрос цен на заводы.</p>
              <p><span className="text-gray-600">[17.04 16:30]</span> <span className="text-green-500">ВХОДЯЩЕЕ:</span> Ответ "Ангарская сосна".</p>
              <p><span className="text-gray-600">[18.04 09:15]</span> <span className="text-blue-400">СИСТЕМА:</span> Фото с завода пересланы брокеру (Nandha).</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}