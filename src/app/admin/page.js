"use client";
import { useState } from 'react';

export default function AdminDashboard() {
  const [buyPrice, setBuyPrice] = useState(125);
  const [volume, setVolume] = useState(38);
  const [logistics, setLogistics] = useState(4200);
  const [sellPrice, setSellPrice] = useState(249);
  
  const [docs, setDocs] = useState({
    contract: false, invoice: false, customs: false, phyto: false, bl: false
  });

  const totalCost = (buyPrice * volume) + logistics;
  const revenue = sellPrice * volume;
  const profit = revenue - totalCost;
  const recSubsidy = Math.min(logistics * 0.3, (buyPrice * volume) * 0.11);
  const profitWithRec = profit + recSubsidy;

  const isOverweight = volume > 41;
  const isLoss = profit < 0;

  const toggleDoc = (docName) => setDocs({ ...docs, [docName]: !docs[docName] });
  const isReadyToShip = docs.contract && docs.invoice && docs.customs && docs.phyto;

  // Расчет заполненности контейнера (Максимум 40 кубов для визуала)
  const fillPercentage = Math.min((volume / 40) * 100, 100);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* Боковое меню */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-full flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-orange-500">ERP Система</h2>
          <p className="text-slate-400 text-sm">RU-TIMBER EXPORT</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Управление</div>
          <a href="#" className="block p-3 bg-blue-600 rounded-lg font-semibold shadow-md">🧮 Калькулятор сделки</a>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">📄 Активные сделки (1)</a>
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Справочники</div>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">🏭 База заводов (FCA)</a>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">🚢 Ставки логистов</a>
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6">Финансы</div>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">💰 Субсидии РЭЦ</a>
          <a href="#" className="block p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">🏦 Валютный контроль</a>
        </nav>
      </aside>

      {/* Основная рабочая зона */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Расчет экономики (1 Контейнер 40HC)</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Левая колонка: Ввод данных и Документы */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 text-slate-800">Вводные данные</h2>
              <div className="space-y-5">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                    Цена закупки на заводе (FCA) - $ за м³
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded cursor-help" title="Целевая цена в Сибири: $120-$130. Обязательно требуйте длину 5.9м!">?</span>
                  </label>
                  <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                    Объем загрузки в контейнер - м³
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded cursor-help" title="В 40HC влезает максимум 40-41 куб. Максимальный вес 28 тонн.">?</span>
                  </label>
                  <input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className={`block w-full p-2 border rounded-md ${isOverweight ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 bg-gray-50'}`} />
                  {isOverweight && <p className="text-red-600 text-sm mt-1 font-bold">⚠️ ОШИБКА: Больше 41 куба - перегруз!</p>}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                    Логистика (ЖД + Море + Порт) - $
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded cursor-help" title="Включает: подачу порожнего, ЖД тариф, перевалку и морской фрахт.">?</span>
                  </label>
                  <input type="number" value={logistics} onChange={(e) => setLogistics(Number(e.target.value))} className="block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500" />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-center text-sm font-bold text-blue-900 mb-1">
                    Цена продажи индусу (CIF) - $ за м³
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded cursor-help" title="Рыночная цена в Индии сейчас около $240-$260 за куб.">?</span>
                  </label>
                  <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="block w-full p-3 border-2 border-blue-500 rounded-md bg-blue-50 font-bold text-xl text-blue-900" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-xl font-bold text-slate-800">Пакет документов</h2>
                {isReadyToShip ? (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">ГОТОВО К ОТГРУЗКЕ</span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">СБОР ДОКУМЕНТОВ</span>
                )}
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.contract} onChange={() => toggleDoc('contract')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.contract ? "text-gray-400 line-through" : "text-gray-800 font-medium"}>Экспортный контракт (подписан)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.invoice} onChange={() => toggleDoc('invoice')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.invoice ? "text-gray-400 line-through" : "text-gray-800 font-medium"}>Инвойс (Proforma Invoice)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.customs} onChange={() => toggleDoc('customs')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.customs ? "text-gray-400 line-through" : "text-gray-800 font-medium"}>Таможенная декларация (ДТ)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input type="checkbox" checked={docs.phyto} onChange={() => toggleDoc('phyto')} className="w-5 h-5 text-blue-600 rounded" />
                  <span className={docs.phyto ? "text-gray-400 line-through" : "text-gray-800 font-medium"}>Фитосанитарный сертификат</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded border-t mt-2 pt-2">
                  <input type="checkbox" checked={docs.bl} onChange={() => toggleDoc('bl')} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500" />
                  <span className={docs.bl ? "text-gray-400 line-through" : "text-orange-600 font-bold"}>Коносамент (Bill of Lading) получен</span>
                </label>
              </div>
            </div>
          </div>

          {/* Правая колонка: Результаты и Визуал Контейнера */}
          <div className="space-y-8">
            
            <div className={`p-6 rounded-xl shadow-lg ${isLoss ? 'bg-red-900' : 'bg-slate-800'} text-white transition-colors relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
              <h2 className="text-xl font-bold mb-4 border-b border-slate-600 pb-2 relative z-10">Финансовый результат</h2>
              <div className="space-y-3 text-lg relative z-10">
                <div className="flex justify-between text-slate-300"><span>Себестоимость:</span><span className="font-mono">${totalCost.toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-300"><span>Выручка:</span><span className="font-mono">${revenue.toLocaleString()}</span></div>
                <div className="flex justify-between text-2xl font-bold mt-4 pt-4 border-t border-slate-600">
                  <span className={isLoss ? "text-red-400" : "text-orange-500"}>ЧИСТАЯ ПРИБЫЛЬ:</span>
                  <span className={`font-mono ${isLoss ? "text-red-400" : "text-orange-500"}`}>${profit.toLocaleString()}</span>
                </div>
                {isLoss && <p className="text-red-300 text-sm mt-2 font-bold text-center bg-red-950 p-2 rounded">⛔ ВНИМАНИЕ: Убыточная сделка!</p>}
                <div className="flex justify-between text-sm mt-4 pt-4 border-t border-slate-700 text-green-400">
                  <span>+ Прогноз субсидии РЭЦ:</span><span className="font-mono">+ ${Math.round(recSubsidy).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-green-400 mt-1">
                  <span>ИТОГО С УЧЕТОМ РЭЦ:</span><span className="font-mono">${Math.round(profitWithRec).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ВИЗУАЛИЗАЦИЯ КОНТЕЙНЕРА */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">Загрузка 40HC Контейнера</h2>
              
              <div className="relative w-full h-32 bg-gray-200 border-4 border-blue-900 rounded-sm overflow-hidden mt-6 flex items-end">
                {/* Двери контейнера (декор) */}
                <div className="absolute right-0 top-0 bottom-0 w-8 border-l-2 border-blue-900 bg-blue-800 flex flex-col justify-evenly z-20">
                  <div className="h-1 bg-blue-900 w-full"></div>
                  <div className="h-1 bg-blue-900 w-full"></div>
                  <div className="h-1 bg-blue-900 w-full"></div>
                </div>
                
                {/* Шкала загрузки (Древесина) */}
                <div 
                  className={`h-full transition-all duration-500 ease-in-out flex items-center justify-center text-white font-bold text-xl shadow-inner ${isOverweight ? 'bg-red-500' : 'bg-amber-600 bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")]'}`}
                  style={{ width: `${fillPercentage}%` }}
                >
                  {volume} м³
                </div>
              </div>
              
              <div className="flex justify-between text-sm font-bold text-gray-500 mt-2">
                <span>0 м³ (Пустой)</span>
                <span className={isOverweight ? "text-red-500" : "text-green-600"}>40 м³ (Оптимум)</span>
              </div>
              
              <p className="text-sm text-gray-600 mt-4 bg-blue-50 p-3 rounded border border-blue-100">
                💡 <b>Совет по укладке:</b> Требуйте от завода формировать пакеты строго под внутренние размеры 40HC (длина 12м, ширина 2.35м, высота 2.69м). Идеально встают 2 пакета по 5.9м в длину.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}