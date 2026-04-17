"use client";
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [buyPrice, setBuyPrice] = useState("130");
  const [volume, setVolume] = useState("40");
  const [logistics, setLogistics] = useState("4200");
  const [sellPrice, setSellPrice] = useState("265");
  
  const [docs, setDocs] = useState({
    contract: false, invoice: false, customs: false, phyto: false, bl: false
  });

  useEffect(() => {
    const savedBuy = localStorage.getItem('erp_buyPrice');
    const savedVol = localStorage.getItem('erp_volume');
    const savedLog = localStorage.getItem('erp_logistics');
    const savedSell = localStorage.getItem('erp_sellPrice');
    const savedDocs = localStorage.getItem('erp_docs');

    if (savedBuy !== null) setBuyPrice(savedBuy);
    if (savedVol !== null) setVolume(savedVol);
    if (savedLog !== null) setLogistics(savedLog);
    if (savedSell !== null) setSellPrice(savedSell);
    if (savedDocs !== null) setDocs(JSON.parse(savedDocs));
  }, []);

  useEffect(() => {
    localStorage.setItem('erp_buyPrice', buyPrice);
    localStorage.setItem('erp_volume', volume);
    localStorage.setItem('erp_logistics', logistics);
    localStorage.setItem('erp_sellPrice', sellPrice);
    localStorage.setItem('erp_docs', JSON.stringify(docs));
  }, [buyPrice, volume, logistics, sellPrice, docs]);

  // Железобетонная функция ввода (только цифры, без нулей впереди, можно стирать до пустоты)
  const handleInput = (setter) => (e) => {
    let val = e.target.value.replace(/[^0-9]/g, ''); // Удаляем всё, кроме цифр
    if (val.length > 1 && val.startsWith('0')) {
      val = val.replace(/^0+/, ''); // Убираем нули в начале, если это не просто "0"
    }
    setter(val);
  };

  const numBuyPrice = Number(buyPrice) || 0;
  const numVolume = Number(volume) || 0;
  const numLogistics = Number(logistics) || 0;
  const numSellPrice = Number(sellPrice) || 0;

  const totalCost = (numBuyPrice * numVolume) + numLogistics;
  const revenue = numSellPrice * numVolume;
  const profit = revenue - totalCost;
  const recSubsidy = Math.min(numLogistics * 0.3, (numBuyPrice * numVolume) * 0.11);
  const profitWithRec = profit + recSubsidy;

  const isOverweight = numVolume > 41;
  const isLoss = profit < 0;

  const toggleDoc = (docName) => setDocs({ ...docs, [docName]: !docs[docName] });
  const isReadyToShip = docs.contract && docs.invoice && docs.customs && docs.phyto;
  const fillPercentage = Math.min((numVolume / 40) * 100, 100);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 md:p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-orange-500">ERP Система</h2>
            <p className="text-slate-400 text-xs md:text-sm">RU-TIMBER EXPORT</p>
          </div>
        </div>
        <nav className="hidden md:block flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Управление</div>
          <a href="#" className="block p-3 bg-blue-600 rounded-lg font-semibold shadow-md">🧮 Калькулятор сделки</a>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">📄 Активные сделки (1)</a>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Расчет экономики (1x40HC)</h1>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Автосохранение
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg md:text-xl font-bold mb-4 border-b pb-2 text-slate-800">Вводные данные</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Цена закупки (FCA) - $ за м³</label>
                  <input type="text" inputMode="numeric" value={buyPrice} onChange={handleInput(setBuyPrice)} placeholder="0" className="block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Объем загрузки - м³</label>
                  <input type="text" inputMode="numeric" value={volume} onChange={handleInput(setVolume)} placeholder="0" className={`block w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${isOverweight ? 'border-red-500 bg-red-50 text-red-700 focus:ring-red-500' : 'border-gray-300 bg-gray-50 focus:ring-blue-500'}`} />
                  {isOverweight && <p className="text-red-600 text-xs mt-1 font-bold">⚠️ Больше 41 куба - перегруз!</p>}
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Логистика (ЖД+Море) - $</label>
                  <input type="text" inputMode="numeric" value={logistics} onChange={handleInput(setLogistics)} placeholder="0" className="block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-xs md:text-sm font-bold text-blue-900 mb-1">Цена продажи (CIF) - $ за м³</label>
                  <input type="text" inputMode="numeric" value={sellPrice} onChange={handleInput(setSellPrice)} placeholder="0" className="block w-full p-3 border-2 border-blue-500 rounded-md bg-blue-50 font-bold text-lg md:text-xl text-blue-900 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2 mb-4 gap-2">
                <h2 className="text-lg md:text-xl font-bold text-slate-800">Пакет документов</h2>
                {isReadyToShip ? (
                  <span className="bg-green-100 text-green-800 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">ГОТОВО К ОТГРУЗКЕ</span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">СБОР ДОКУМЕНТОВ</span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.contract} onChange={() => toggleDoc('contract')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.contract ? "text-gray-400 line-through" : "text-gray-800"}>Контракт</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.invoice} onChange={() => toggleDoc('invoice')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.invoice ? "text-gray-400 line-through" : "text-gray-800"}>Инвойс</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.customs} onChange={() => toggleDoc('customs')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.customs ? "text-gray-400 line-through" : "text-gray-800"}>ДТ (Таможня)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.phyto} onChange={() => toggleDoc('phyto')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.phyto ? "text-gray-400 line-through" : "text-gray-800"}>Фитосанитарный</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded border-t mt-2 pt-2">
                  <input type="checkbox" checked={docs.bl} onChange={() => toggleDoc('bl')} className="w-5 h-5 text-orange-500 rounded" />
                  <span className={docs.bl ? "text-gray-400 line-through" : "text-orange-600 font-bold"}>Коносамент</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className={`p-5 md:p-6 rounded-xl shadow-lg ${isLoss ? 'bg-red-900' : 'bg-slate-800'} text-white transition-colors relative overflow-hidden`}>
              <h2 className="text-lg md:text-xl font-bold mb-4 border-b border-slate-600 pb-2 relative z-10">Финансовый результат</h2>
              <div className="space-y-2 md:space-y-3 text-base md:text-lg relative z-10">
                <div className="flex justify-between text-slate-300"><span>Себестоимость:</span><span className="font-mono">${totalCost.toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-300"><span>Выручка:</span><span className="font-mono">${revenue.toLocaleString()}</span></div>
                <div className="flex justify-between text-xl md:text-2xl font-bold mt-4 pt-4 border-t border-slate-600">
                  <span className={isLoss ? "text-red-400" : "text-orange-500"}>ПРИБЫЛЬ:</span>
                  <span className={`font-mono ${isLoss ? "text-red-400" : "text-orange-500"}`}>${profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm mt-4 pt-4 border-t border-slate-700 text-green-400">
                  <span>+ Субсидия РЭЦ:</span><span className="font-mono">+ ${Math.round(recSubsidy).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-800 border-b pb-2">Загрузка 40HC</h2>
              <div className="relative w-full h-24 md:h-32 bg-gray-200 border-4 border-blue-900 rounded-sm overflow-hidden mt-4 flex items-end">
                <div className="absolute right-0 top-0 bottom-0 w-6 border-l-2 border-blue-900 bg-blue-800 flex flex-col justify-evenly z-20">
                  <div className="h-1 bg-blue-900 w-full"></div>
                  <div className="h-1 bg-blue-900 w-full"></div>
                </div>
                <div 
                  className={`h-full transition-all duration-500 flex items-center justify-center text-white font-bold text-lg shadow-inner ${isOverweight ? 'bg-red-500' : 'bg-amber-600 bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")]'}`}
                  style={{ width: `${fillPercentage}%` }}
                >
                  {numVolume} м³
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}