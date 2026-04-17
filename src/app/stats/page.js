"use client";
import Link from 'next/link';

export default function CommandCenter() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
      
      {/* СТРОГОЕ МЕНЮ (Сбоку на ПК, сверху на телефоне) */}
      <aside className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center md:block">
          <div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-widest">RU-TIMBER</h1>
            <p className="text-[10px] text-blue-500 mt-1 uppercase tracking-widest font-mono hidden md:block">Strategic Command</p>
          </div>
          {/* Индикатор для мобилки */}
          <div className="md:hidden flex items-center gap-2 text-[10px] font-mono text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            ONLINE
          </div>
        </div>
        
        {/* Навигация */}
        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-visible">
          <Link href="/" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">
            Витрина
          </Link>
          <Link href="/admin" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">
            ERP Калькулятор
          </Link>
          <Link href="/stats" className="whitespace-nowrap px-4 py-2 md:py-3 rounded bg-blue-900/20 text-blue-400 border border-blue-900/50 text-[10px] md:text-xs uppercase tracking-wider font-bold">
            Сводка
          </Link>
        </nav>
        
        <div className="hidden md:flex p-4 mt-auto bg-[#0a0a0a] border-t border-gray-800 text-[10px] text-gray-600 font-mono items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          SECURE CONNECTION
        </div>
      </aside>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">Глобальная сводка</h2>
            <p className="text-gray-500 mt-1 text-[10px] md:text-xs uppercase tracking-widest font-mono">Мониторинг сделок и логистики</p>
          </div>
          <div className="hidden md:block text-right font-mono text-xs text-gray-500">
            <p>SYSTEM TIME: {new Date().toLocaleTimeString()}</p>
            <p>STATUS: <span className="text-green-500">ONLINE</span></p>
          </div>
        </header>

        {/* ГЛАВНЫЕ МЕТРИКИ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-[#111] p-4 md:p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Активные сделки</h3>
            <div className="text-2xl md:text-3xl font-light text-white">1</div>
            <p className="text-blue-400 text-[10px] md:text-xs mt-1 md:mt-2 font-mono truncate">Индия (Tuticorin)</p>
          </div>
          <div className="bg-[#111] p-4 md:p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Объем в работе</h3>
            <div className="text-2xl md:text-3xl font-light text-white">40 <span className="text-sm md:text-lg text-gray-600">м³</span></div>
            <p className="text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2 font-mono truncate">1 Контейнер 40HC</p>
          </div>
          <div className="bg-[#111] p-4 md:p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Выручка (Ожид.)</h3>
            <div className="text-2xl md:text-3xl font-light text-green-500">$8.8k</div>
            <p className="text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2 font-mono truncate">По $220/м³</p>
          </div>
          <div className="bg-[#111] p-4 md:p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Логистика</h3>
            <div className="text-sm md:text-xl font-bold text-orange-400 mt-1 md:mt-2">ОЖИДАНИЕ</div>
            <p className="text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2 font-mono truncate">Запрос в РУСКОН</p>
          </div>
        </div>

        {/* ОПЕРАТИВНАЯ ОБСТАНОВКА */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* ЛОГИСТИЧЕСКИЕ УЗЛЫ */}
          <div className="bg-[#111] p-4 md:p-6 border border-gray-800 rounded-lg">
            <h3 className="text-white text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 border-b border-gray-800 pb-2">Логистические узлы</h3>
            <div className="relative pl-6 border-l-2 border-gray-800 space-y-4 md:space-y-6 font-mono text-xs md:text-sm">
              <div className="relative">
                <div className="absolute -left-[27px] md:-left-[31px] top-1 w-3 h-3 md:w-4 md:h-4 bg-[#111] border-2 border-gray-500 rounded-full"></div>
                <p className="text-white font-bold">Братск / Анзеби</p>
                <p className="text-gray-500 text-[10px] md:text-xs mt-1">Подача контейнера, погрузка</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] md:-left-[31px] top-1 w-3 h-3 md:w-4 md:h-4 bg-[#111] border-2 border-gray-500 rounded-full"></div>
                <p className="text-white font-bold">Новороссийск</p>
                <p className="text-gray-500 text-[10px] md:text-xs mt-1">Таможня, перевалка на судно</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] md:-left-[31px] top-1 w-3 h-3 md:w-4 md:h-4 bg-[#111] border-2 border-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <p className="text-blue-400 font-bold">Tuticorin (IND)</p>
                <p className="text-gray-500 text-[10px] md:text-xs mt-1">Порт назначения (CIF)</p>
              </div>
            </div>
          </div>

          {/* ЖУРНАЛ ОПЕРАЦИЙ */}
          <div className="bg-[#111] p-4 md:p-6 border border-gray-800 rounded-lg flex flex-col h-[300px] md:h-auto">
            <h3 className="text-white text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 border-b border-gray-800 pb-2">Журнал операций</h3>
            <div className="flex-1 bg-[#0a0a0a] border border-gray-800 p-3 md:p-4 font-mono text-[10px] md:text-xs text-gray-400 space-y-3 overflow-y-auto">
              <p><span className="text-gray-600 block md:inline">[17.04 15:19]</span> <span className="text-blue-400">СИСТЕМА:</span> Запрос цен на заводы.</p>
              <p><span className="text-gray-600 block md:inline">[17.04 16:30]</span> <span className="text-green-500">ВХОДЯЩЕЕ:</span> Ответ "Ангарская сосна". Станции: Братск, Анзеби.</p>
              <p><span className="text-gray-600 block md:inline">[17.04 17:00]</span> <span className="text-blue-400">СИСТЕМА:</span> Запрос фрахта в РУСКОН.</p>
              <p><span className="text-gray-600 block md:inline">[17.04 18:45]</span> <span className="text-blue-400">СИСТЕМА:</span> Оффер отправлен брокеру (Nandha).</p>
              <p><span className="text-gray-600 block md:inline">[17.04 19:10]</span> <span className="text-orange-400">ОЖИДАНИЕ:</span> Запрос фото с производства.</p>
              <p className="animate-pulse mt-4 text-gray-600">_</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}