import Link from 'next/link';

export default function StatsDashboard() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
      
      {/* БОКОВОЕ МЕНЮ (Sidebar) */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-orange-500 tracking-wider">RU-TIMBER</h1>
          <p className="text-xs text-slate-500 mt-1">CEO Dashboard</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            🌐 Главная (Витрина)
          </Link>
          {/* Сюда потом добавим ссылку на ваш калькулятор */}
          <Link href="/stats" className="block px-4 py-3 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
            📊 Статистика (Live)
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Secure Connection
        </div>
      </aside>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Traffic Analytics</h2>
            <p className="text-slate-400 mt-1">Мониторинг активности покупателей</p>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold">Система активна</span>
          </div>
        </header>

        {/* ВЕРХНИЕ КАРТОЧКИ (Главные метрики) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-bold mb-2">СЕЙЧАС НА САЙТЕ</h3>
            <div className="text-5xl font-black text-white">2</div>
            <p className="text-green-400 text-sm mt-2">↑ Активный просмотр</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-bold mb-2">ВИЗИТЫ ЗА СЕГОДНЯ</h3>
            <div className="text-5xl font-black text-white">14</div>
            <p className="text-orange-400 text-sm mt-2">+3 за последний час</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-bold mb-2">ГЛАВНЫЙ ИСТОЧНИК</h3>
            <div className="text-4xl font-black text-white mt-1">WhatsApp</div>
            <p className="text-slate-400 text-sm mt-2">Direct Link</p>
          </div>
        </div>

        {/* НИЖНИЙ БЛОК (География и Устройства) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* География */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2">География визитов</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="flex items-center gap-3"><span className="text-2xl">🇮🇳</span> India</span>
                <span className="font-bold text-orange-500">65%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center gap-3"><span className="text-2xl">🇰🇪</span> Kenya</span>
                <span className="font-bold text-orange-500">20%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center gap-3"><span className="text-2xl">🇷🇺</span> Russia</span>
                <span className="font-bold text-orange-500">15%</span>
              </li>
            </ul>
          </div>

          {/* Устройства */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2">Устройства</h3>
            <div className="flex items-center justify-center h-32 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-slate-500 text-sm">Mobile</div>
              </div>
              <div className="text-center opacity-50">
                <div className="text-4xl mb-2">💻</div>
                <div className="text-2xl font-bold text-white">15%</div>
                <div className="text-slate-500 text-sm">Desktop</div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}