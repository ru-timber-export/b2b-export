"use client";

import Link from "next/link";
import { useDeal } from "../context/DealContext";
import CaptainGate from "./CaptainGate"; 

export default function CaptainDashboard() {
  const { mission, missionStats, checklist, deals, customers, isLoaded } = useDeal();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-mono">
        Loading Captain Mode...
      </div>
    );
  }

  // 📊 Статистика
  const totalChecklist = Object.keys(checklist || {}).length;
  const doneChecklist = Object.values(checklist || {}).filter(Boolean).length;
  const checklistProgress = totalChecklist > 0 ? Math.round((doneChecklist / totalChecklist) * 100) : 0;

  const missionProgress = missionStats?.overallProgress || 0;
  const containersNeeded = missionStats?.containersNeeded || 0;

  const dealsCount = deals?.length || 0;
  const customersCount = customers?.length || 0;

  // 📅 Приветствие
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 6 ? "Доброй ночи" :
    hour < 12 ? "Доброе утро" :
    hour < 18 ? "Добрый день" :
    "Добрый вечер";

  const dateStr = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <CaptainGate>
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      {/* Header */}
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/captain" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
            <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30 font-bold">
              ⚓ CAPTAIN MODE
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-orange-500 transition-colors flex items-center gap-1"
          >
            🌐 Public Site →
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Greeting */}
        <header className="py-4">
          <div className="text-sm text-slate-400 mb-1 capitalize">{dateStr}</div>
          <h1 className="text-3xl sm:text-4xl font-black">
            {greeting}, <span className="text-orange-400">Капитан Константин!</span> ⚓
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Что будем делать сегодня? Океан ждёт.
          </p>
        </header>

        {/* Quick Stats Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Готовность"
            value={`${checklistProgress}%`}
            sub={`${doneChecklist}/${totalChecklist} пунктов`}
            color="orange"
            icon="📋"
          />
          <StatCard
            label="Океан"
            value={`${missionProgress.toFixed(1)}%`}
            sub={`${containersNeeded} контейнеров`}
            color="cyan"
            icon="🌊"
          />
          <StatCard
            label="Сделок"
            value={dealsCount}
            sub="в системе"
            color="emerald"
            icon="📊"
          />
          <StatCard
            label="Клиентов"
            value={customersCount}
            sub="в CRM"
            color="purple"
            icon="👥"
          />
        </section>

        {/* Main Grid — 6 Tiles */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* TILE 1: КАЛЬКУЛЯТОР */}
          <Tile
            href="/calculator"
            icon="🧮"
            title="Калькулятор сделки"
            subtitle="Volume → Pricing → Container → Quotation"
            description="Рассчитать новый контейнер от закупки до клиентской квотации"
            color="from-orange-600 to-orange-700"
            stat="4 шага"
            active
          />

          {/* TILE 2: CHECKLIST */}
          <Tile
            href="/checklist"
            icon="📋"
            title="Pre-Flight Checklist"
            subtitle="Подготовка к экспорту"
            description="17 пунктов до первой международной сделки"
            color="from-blue-600 to-blue-700"
            stat={`${checklistProgress}% готово`}
            active
          />

          {/* TILE 3: MISSION */}
          <Tile
            href="/mission"
            icon="🌊"
            title="Ocean Mission"
            subtitle="Корабль · Дом · Семья · Свобода"
            description="Твоя личная карта мечты — каждый контейнер шаг к океану"
            color="from-cyan-600 to-blue-700"
            stat={`${missionProgress.toFixed(1)}%`}
            active
          />

          {/* TILE 4: CONTRACT */}
<Tile
  href="/captain/contract"
  icon="📜"
  title="Contract Generator"
  subtitle="International Sales Contract"
  description="15 пунктов · EN+RU · ICAC Moscow · Force Majeure под санкции"
  color="from-rose-600 to-rose-700"
  stat="Ready"
  active
/>

          {/* TILE 5: СДЕЛКИ */}
          <Tile
            href="/captain/deals"
            icon="📊"
            title="Архив сделок"
            subtitle="История и аналитика"
            description="Все сделки с фильтрами, поиск, экспорт в Excel"
            color="from-emerald-600 to-emerald-700"
            stat="Coming soon"
            comingSoon
          />

          {/* TILE 6: НАСТРОЙКИ */}
          <Tile
            href="/captain/settings"
            icon="⚙"
            title="Настройки"
            subtitle="Профиль и реквизиты"
            description="Реквизиты компании, банк, налоги, печати"
            color="from-slate-600 to-slate-700"
            stat="Coming soon"
            comingSoon
          />
        </section>

        {/* Daily Focus */}
        <section className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-2 border-orange-500/30 rounded-xl p-5">
          <h2 className="text-xl font-black text-orange-400 mb-3">🎯 Фокус дня</h2>
          <div className="space-y-2 text-sm text-slate-300">
            {checklistProgress < 30 && (
              <div className="flex items-start gap-2">
                <span className="text-orange-400">▶</span>
                <div>
                  <strong className="text-white">Начни с Checklist.</strong> Сейчас готовность {checklistProgress}%. Сосредоточься на 🔴 критичных пунктах.
                </div>
              </div>
            )}
            {checklistProgress >= 30 && checklistProgress < 70 && (
              <div className="flex items-start gap-2">
                <span className="text-orange-400">▶</span>
                <div>
                  <strong className="text-white">Хороший прогресс!</strong> {checklistProgress}% готовности. Параллельно начни искать первого клиента.
                </div>
              </div>
            )}
            {checklistProgress >= 70 && (
              <div className="flex items-start gap-2">
                <span className="text-emerald-400">▶</span>
                <div>
                  <strong className="text-white">Готов к старту!</strong> {checklistProgress}% — можно заключать первую сделку.
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-orange-400">▶</span>
              <div>
                <strong className="text-white">Не забывай:</strong> работа с банком (Тбанк → Киргизия), консультация юриста, проверка покупателя (KYC).
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">▶</span>
              <div>
                <strong className="text-white">Помни цель:</strong> {containersNeeded > 0 ? `${containersNeeded} контейнеров до океана 🌊` : "корабль · дом · семья · свобода"}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">⚡ Быстрые действия</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <QuickAction href="/calculator" icon="📐" label="Новая сделка" />
            <QuickAction href="/calculator/quotation" icon="📄" label="Квотация" />
            <QuickAction href="/checklist" icon="✅" label="Прогресс" />
            <QuickAction href="/mission" icon="🌊" label="К океану" />
          </div>
        </section>

        {/* Footer info */}
        <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-slate-800">
          <div>RU-TIMBER Export · Captain Dashboard v1.0</div>
          <div className="mt-1">⚓ Только для внутреннего использования</div>
        </footer>
      </main>
    </div>
    </CaptainGate>
  );
}

// ============ COMPONENTS ============

function StatCard({ label, value, sub, color, icon }) {
  const colors = {
    orange: "border-orange-500/30 bg-orange-500/5",
    cyan: "border-cyan-500/30 bg-cyan-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
  };
  return (
    <div className={`border-2 rounded-lg p-3 ${colors[color] || colors.orange}`}>
      <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
        <span>{icon}</span> {label}
      </div>
      <div className="text-2xl font-black mt-1 font-mono">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

function Tile({ href, icon, title, subtitle, description, color, stat, active, comingSoon }) {
  const content = (
    <div className={`relative h-full rounded-xl p-5 bg-gradient-to-br ${color} hover:scale-[1.02] transition-all duration-300 ${comingSoon ? "opacity-50 cursor-not-allowed" : "shadow-lg hover:shadow-2xl"}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="text-4xl">{icon}</div>
        <div className={`text-xs font-bold px-2 py-1 rounded ${active ? "bg-white/20 text-white" : "bg-black/30 text-slate-300"}`}>
          {stat}
        </div>
      </div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="text-sm text-white/80 mt-1 font-semibold">{subtitle}</p>
      <p className="text-xs text-white/60 mt-2 leading-relaxed">{description}</p>

      {comingSoon ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-xl backdrop-blur-sm">
          <Link
  href="/captain/settings"
  className="block bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95 hover:scale-[1.02]"
>
  <div className="flex items-start justify-between mb-3">
    <div className="text-4xl">⚙</div>
    <div className="text-[10px] bg-amber-400 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
      NEW
    </div>
  </div>
  <h3 className="text-xl font-black">Business Settings</h3>
  <p className="text-sm opacity-90 mt-1">
    Реквизиты ИП, банк, контакты, логистика — всё в одном месте
  </p>
  <div className="text-xs opacity-75 mt-3 flex items-center gap-1">
    Open <span>→</span>
  </div>
</Link>
        </div>
      ) : (
        <div className="mt-4 text-xs font-bold text-white/90 flex items-center gap-1">
          Открыть <span className="ml-1">→</span>
        </div>
      )}
    </div>
  );

  if (comingSoon) {
    return <div>{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}

function QuickAction({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-3 text-center transition-all active:scale-95"
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-xs font-bold text-slate-300 mt-1">{label}</div>
    </Link>
  );
}

// END OF FILE