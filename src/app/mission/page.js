"use client";
import { useState } from "react";
import Link from "next/link";
import { useDeal } from "../context/DealContext";

export default function MissionPage() {
  const { mission, updateMission, missionStats, isLoaded } = useDeal();
  const [editMode, setEditMode] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-white font-mono">Loading mission...</div>
      </div>
    );
  }

  const fmtShort = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)} тыс`;
    return Math.round(n).toString();
  };

  const targetDateStr = missionStats.targetDate.toLocaleDateString("ru-RU", {
    year: "numeric", month: "long",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 font-sans text-white">
      <header className="bg-slate-900/80 backdrop-blur sticky top-0 z-50 border-b border-blue-800/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <Link href="/" className="text-slate-300 hover:text-orange-500 text-sm">← Home</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Title */}
        <section className="text-center py-6">
          <div className="text-6xl mb-3">🌊⛵</div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-r from-cyan-300 to-orange-400 bg-clip-text text-transparent">
            Ocean Mission
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Корабль · Дом · Семья · Свобода
          </p>
          <div className="text-xs text-slate-400 mt-2 italic">
            «Каждый контейнер — шаг к Тихому океану»
          </div>
        </section>

        {/* Overall progress */}
        <section className="bg-gradient-to-br from-blue-900/50 to-slate-800/50 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur">
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="font-bold text-lg text-cyan-300">📊 Общий прогресс</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded active:scale-95"
            >
              {editMode ? "✓ Готово" : "✏ Изменить"}
            </button>
          </div>

          <div className="text-3xl md:text-5xl font-black font-mono mb-2">
            {missionStats.overallProgress.toFixed(1)}%
          </div>

          <div className="w-full bg-slate-900/80 rounded-full h-4 overflow-hidden mb-4 border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-orange-400 transition-all duration-1000"
              style={{ width: `${missionStats.overallProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <Stat label="Накоплено" value={`${fmtShort(mission.currentCapital)} ₽`} color="emerald" />
            <Stat label="Осталось" value={`${fmtShort(missionStats.remaining)} ₽`} color="amber" />
            <Stat label="Контейнеров" value={missionStats.containersNeeded} color="orange" />
            <Stat label="Месяцев" value={missionStats.monthsNeeded} color="cyan" />
          </div>
        </section>

        {/* Edit panel */}
        {editMode && (
          <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4 backdrop-blur">
            <h3 className="font-bold text-orange-400">⚙ Настройки миссии</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Текущий капитал (₽)"
                value={mission.currentCapital}
                onChange={(v) => updateMission({ currentCapital: Number(v) || 0 })}
                hint="Сколько уже накопил"
              />
              <InputField
                label="Профит с контейнера ($)"
                value={mission.avgProfitPerContainer_usd}
                onChange={(v) => updateMission({ avgProfitPerContainer_usd: Number(v) || 0 })}
                hint="Средняя прибыль USD"
              />
              <InputField
                label="Контейнеров в месяц"
                value={mission.containersPerMonth}
                onChange={(v) => updateMission({ containersPerMonth: Number(v) || 1 })}
                hint="План на месяц"
                step="0.5"
              />
              <InputField
                label="Курс USD/RUB (план)"
                value={mission.targetUsdRubRate}
                onChange={(v) => updateMission({ targetUsdRubRate: Number(v) || 85 })}
                hint="Среднегодовой курс"
              />
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h4 className="text-sm font-bold text-slate-300 mb-3">🎯 Цели (₽):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="🚢 Корабль" value={mission.goal_ship} onChange={(v) => updateMission({ goal_ship: Number(v) || 0 })} />
                <InputField label="🏠 Дом" value={mission.goal_house} onChange={(v) => updateMission({ goal_house: Number(v) || 0 })} />
                <InputField label="💍 Свадьба" value={mission.goal_wedding} onChange={(v) => updateMission({ goal_wedding: Number(v) || 0 })} />
                <InputField label="💰 Резерв" value={mission.goal_reserve} onChange={(v) => updateMission({ goal_reserve: Number(v) || 0 })} />
              </div>
            </div>
          </section>
        )}

        {/* 4 цели */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard
            emoji="🚢"
            title="Исследовательское судно"
            subtitle="Дайвинг · Кораллы · Тихий океан"
            current={Math.min(mission.currentCapital * (mission.goal_ship / Math.max(missionStats.totalGoal, 1)), mission.goal_ship)}
            goal={mission.goal_ship}
            color="from-cyan-500 to-blue-600"
          />
          <GoalCard
            emoji="🏠"
            title="Дом"
            subtitle="Тихая гавань на берегу"
            current={Math.min(mission.currentCapital * (mission.goal_house / Math.max(missionStats.totalGoal, 1)), mission.goal_house)}
            goal={mission.goal_house}
            color="from-emerald-500 to-teal-600"
          />
          <GoalCard
            emoji="💍"
            title="Свадьба"
            subtitle="Жениться и быть счастливым"
            current={Math.min(mission.currentCapital * (mission.goal_wedding / Math.max(missionStats.totalGoal, 1)), mission.goal_wedding)}
            goal={mission.goal_wedding}
            color="from-rose-500 to-pink-600"
          />
          <GoalCard
            emoji="💰"
            title="Финансовая подушка"
            subtitle="5 лет × 5 млн ₽ = свобода"
            current={Math.min(mission.currentCapital * (mission.goal_reserve / Math.max(missionStats.totalGoal, 1)), mission.goal_reserve)}
            goal={mission.goal_reserve}
            color="from-amber-500 to-orange-600"
          />
        </section>

        {/* Прогноз */}
        <section className="bg-gradient-to-br from-orange-900/30 to-amber-900/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur">
          <h2 className="font-bold text-lg text-orange-300 mb-4">🗓 Прогноз выхода в океан</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-900/60 rounded-lg p-4 border border-orange-500/20">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Целевая дата</div>
              <div className="text-2xl font-black text-orange-300 mt-1">{targetDateStr}</div>
              <div className="text-xs text-slate-500 mt-1">≈ {missionStats.yearsNeeded.toFixed(1)} лет</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 border border-emerald-500/20">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Прибыль/мес</div>
              <div className="text-2xl font-black text-emerald-300 mt-1">{fmtShort(missionStats.profitPerMonthRub)} ₽</div>
              <div className="text-xs text-slate-500 mt-1">{mission.containersPerMonth} конт × ${mission.avgProfitPerContainer_usd}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 border border-cyan-500/20">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Прибыль/год</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">{fmtShort(missionStats.profitPerYearRub)} ₽</div>
              <div className="text-xs text-slate-500 mt-1">При текущем темпе</div>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-lg p-4 text-sm text-slate-300 border-l-4 border-orange-500">
            💡 <strong>Совет:</strong> увеличишь темп до <strong>3 контейнеров/мес</strong> — выйдешь в океан в <strong>{
              (() => {
                const fasterMonths = Math.ceil(missionStats.containersNeeded / 3);
                const d = new Date();
                d.setMonth(d.getMonth() + fasterMonths);
                return d.toLocaleDateString("ru-RU", { year: "numeric", month: "long" });
              })()
            }</strong>. Это {Math.max(missionStats.monthsNeeded - Math.ceil(missionStats.containersNeeded / 3), 0)} мес. раньше.
          </div>
        </section>

        {/* Цитата */}
        <section className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-500/20 rounded-2xl p-6 text-center backdrop-blur">
          <div className="text-4xl mb-3">🌅</div>
          <blockquote className="text-lg md:text-xl italic text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            «Океан не спрашивает, готов ли ты. <br/>
            Он просто ждёт, пока ты сам решишь.»
          </blockquote>
          <div className="text-xs text-slate-400 mt-4 font-mono">
            Капитан Константин · {new Date().getFullYear()}
          </div>
        </section>

        {/* CTA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/calculator"
            className="block bg-orange-500 hover:bg-orange-600 text-white text-center font-bold py-3 px-4 rounded-lg transition-all active:scale-95">
            🌲 Сделать ещё контейнер →
          </Link>
          <Link href="/"
            className="block bg-slate-700 hover:bg-slate-600 text-white text-center font-bold py-3 px-4 rounded-lg transition-all active:scale-95">
            ← На главную
          </Link>
        </section>
      </main>

      <footer className="bg-slate-900/80 text-slate-500 text-center py-6 text-xs mt-8 border-t border-blue-800/20">
        Powered by RU-TIMBER Export · +7 915 349 00 07
      </footer>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colors = {
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    orange: "text-orange-300",
    cyan: "text-cyan-300",
  };
  return (
    <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/50">
      <div className="text-slate-400 uppercase tracking-wider text-[10px]">{label}</div>
      <div className={`font-black font-mono text-lg mt-1 ${colors[color] || "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function GoalCard({ emoji, title, subtitle, current, goal, color }) {
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const fmtShort = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)} тыс`;
    return Math.round(n).toString();
  };
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 backdrop-blur hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-3xl mb-1">{emoji}</div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="text-2xl font-black font-mono text-white">{percent.toFixed(0)}%</div>
      </div>
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-2">
        <div className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`} style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between text-xs font-mono">
        <span className="text-slate-400">{fmtShort(current)} ₽</span>
        <span className="text-slate-300">{fmtShort(goal)} ₽</span>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, hint, step = "1" }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-300 font-semibold block mb-1">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:border-orange-500 focus:outline-none"
      />
      {hint && <span className="text-[10px] text-slate-500 mt-1 block">{hint}</span>}
    </label>
  );
}