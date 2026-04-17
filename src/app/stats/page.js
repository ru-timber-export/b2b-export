"use client";
import Link from 'next/link';

export default function CommandCenter() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-blue-500/30">
      
      {/* СТРОГОЕ БОКОВОЕ МЕНЮ */}
      <aside className="w-64 bg-[#111] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-black text-white tracking-widest">RU-TIMBER</h1>
          <p className="text-[10px] text-blue-500 mt-1 uppercase tracking-widest font-mono">Strategic Command</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/" className="block px-4 py-2 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-xs uppercase tracking-wider font-bold">
            Витрина (Public)
          </Link>
          <Link href="/admin" className="block px-4 py-2 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-xs uppercase tracking-wider font-bold">
            ERP Калькулятор
          </Link>
          <Link href="/stats" className="block px-4 py-2 rounded bg-blue-900/20 text-blue-400 border border-blue-900/50 text-xs uppercase tracking-wider font-bold">
            Сводка (Dashboard)
          </Link>
        </nav>
        <div className="p-4 bg-[#0a0a0a] border-t border-gray-800 text-[10px] text-gray-600 font-mono flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          SECURE CONNECTION
        </div>
      </aside>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Глобальная сводка ВЭД</h2>
            <p className="text-gray-500 mt-1 text-xs uppercase tracking-widest font-mono">Мониторинг сделок и логистики</p>
          </div>
          <div className="text-right font-mono text-xs text-gray-500">
            <p>SYSTEM TIME: {new Date().toLocaleTimeString()}</p>
            <p>STATUS: <span className="text-green-500">ONLINE</span></p>
          </div>
        </header>

        {/* ГЛАВНЫЕ МЕТРИКИ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Активные сделки</h3>
            <div className="text-3xl font-light text-white">1</div>
            <p className="text-blue-400 text-xs mt-2 font-mono">Индия (Tuticorin)</p>
          </div>
          <div className="bg-[#111] p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Объем в работе</h3>
            <div className="text-3xl font-light text-white">40 <span className="text-lg text-gray-600">м³</span></div>
            <p className="text-gray-400 text-xs mt-2 font-mono">1 Контейнер 40HC</p>
          </div>
          <div className="bg-[#111] p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Ожидаемая выручка</h3>
            <div className="text-3xl font-light text-green-500">$8,800</div>
            <p className="text-gray-400 text-xs mt-2 font-mono">По ставке $220/м³</p>
          </div>
          <div className="bg-[#111] p-5 border border-gray-800 rounded-lg">
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Статус логистики</h3>
            <div className="text-xl font-bold text-orange-400 mt-2">ОЖИДАНИЕ СТАВКИ</div>
            <p className="text-gray-400 text-xs mt-2 font-mono">Запрос в РУСКОН</p>
          </div>
        </div>

        {/* ОПЕРАТИВНАЯ ОБСТАНОВКА */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ЛОГИСТИЧЕСКИЕ УЗЛЫ */}
          <div className="bg-[#111] p-6 border border-gray-800 rounded-lg">
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Логистические узлы</h3>
            <div className="relative pl-6 border-l-2 border-gray-800 space-y-6 font-mono text-sm">
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-[#111] border-2 border-gray-500 rounded-full"></div>
                <p className="text-white font-bold">Братск / Анзеби (РФ)</p>
                <p className="text-gray-500 text-xs">Подача контейнера, погрузка</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-[#111] border-2 border-gray-500 rounded-full"></div>
                <p className="text-white font-bold">Новороссийск (РФ)</p>
                <p className="text-gray-500 text-xs">Таможня, перевалка на судно</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-[#111] border-2 border-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <p className="text-blue-400 font-bold">Tuticorin (Индия)</p>
                <p className="text-gray-500 text-xs">Порт назначения (CIF)</p>
              </div>
            </div>
          </div>

          {/* ЖУРНАЛ ОПЕРАЦИЙ */}
          <div className="bg-[#111] p-6 border border-gray-800 rounded-lg flex flex-col">
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Журнал операций (Log)</h3>
            <div className="flex-1 bg-[#0a0a0a] border border-gray-800 p-4 font-mono text-xs text-gray-400 space-y-2 overflow-y-auto">
              <p><span className="text-gray-600">[17.04 15:19]</span> <span className="text-blue-400">СИСТЕМА:</span> Запрос цен отправлен на заводы.</p>
              <p><span className="text-gray-600">[17.04 16:30]</span> <span className="text-green-500">ВХОДЯЩЕЕ:</span> Ответ от ООО "Ангарская сосна". Станции: Братск, Анзеби.</p>
              <p><span className="text-gray-600">[17.04 17:00]</span> <span className="text-blue-400">СИСТЕМА:</span> Запрос фрахта отправлен в РУСКОН.</p>
              <p><span className="text-gray-600">[17.04 18:45]</span> <span className="text-blue-400">СИСТЕМА:</span> Оффер (3 варианта цены) отправлен брокеру (Nandha).</p>
              <p><span className="text-gray-600">[17.04 19:10]</span> <span className="text-orange-400">ОЖИДАНИЕ:</span> Запрос фото с производства.</p>
              <p className="animate-pulse mt-4 text-gray-600">_</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}