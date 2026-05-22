"use client";
import { useState } from "react";
import Link from "next/link";
import { useDeal } from "../../context/DealContext";
import Reminder from "../../components/Reminder";

const CONTAINER = {
  length_m: 12.0,
  width_m: 2.35,
  height_m: 2.69,
  maxVolume_m3: 76,
  maxWeight_kg: 26580,
};

const BUNDLE = {
  length_m: 5.98,
  width_m: 1.10,
  height_m: 1.15,
  volume_m3: 5.98 * 1.10 * 1.15,
};

const DENSITIES = {
  PINE: { KD: 500, AD: 600, FRESH: 750 },
  SPRUCE: { KD: 450, AD: 550, FRESH: 700 },
  PINE_SPRUCE_50: { KD: 475, AD: 575, FRESH: 725 },
  PINE_SPRUCE_70: { KD: 485, AD: 585, FRESH: 735 },
  SPF: { KD: 440, AD: 540, FRESH: 690 },
  LARCH: { KD: 650, AD: 750, FRESH: 900 },
  CEDAR: { KD: 435, AD: 520, FRESH: 670 },
  BIRCH: { KD: 640, AD: 720, FRESH: 880 },
  OAK: { KD: 700, AD: 790, FRESH: 950 },
  ASPEN: { KD: 450, AD: 530, FRESH: 680 },
  CUSTOM: { KD: 475, AD: 575, FRESH: 725 },
};

export default function ContainerPage() {
  const { deal, hasMemory } = useDeal();
  const { species, moisture, computedVolume_m3, computedWeight_kg, thickness, width, length } = deal;

  const volumeM3 = Number(computedVolume_m3) || 0;
  const weightKg = Number(computedWeight_kg) || 0;
  const hasVolume = volumeM3 > 0;

  const [viewMode, setViewMode] = useState("client");

  const speciesData = DENSITIES[species] || DENSITIES.PINE;
  const density = speciesData[moisture] || 500;

  const bundlesNeeded = volumeM3 > 0 ? Math.ceil(volumeM3 / BUNDLE.volume_m3) : 0;
  const stacksByLength = 2;
  const stacksByWidth = Math.floor(CONTAINER.width_m / BUNDLE.width_m);
  const stacksByHeight = Math.floor(CONTAINER.height_m / BUNDLE.height_m);
  const maxBundlesByGeometry = stacksByLength * stacksByWidth * stacksByHeight;
  const bundlesLoaded = Math.min(bundlesNeeded, maxBundlesByGeometry);

  const volumeOverload = volumeM3 > CONTAINER.maxVolume_m3;
  const weightOverload = weightKg > CONTAINER.maxWeight_kg;
  const volumePercent = Math.min((volumeM3 / CONTAINER.maxVolume_m3) * 100, 100);
  const weightPercent = Math.min((weightKg / CONTAINER.maxWeight_kg) * 100, 100);

  const isFresh = moisture === "FRESH";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <div className="flex gap-3 text-sm flex-wrap">
            <Link href="/calculator" className="text-slate-300 hover:text-orange-500">Volume</Link>
            <Link href="/calculator/pricing" className="text-slate-300 hover:text-orange-500">Pricing</Link>
            <Link href="/" className="text-slate-300 hover:text-orange-500">← Home</Link>
          </div>
        </div>
      </nav>

      <header className="bg-slate-900 text-white px-4 py-3 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm">← Home</Link>
          <div className="text-xs font-mono hidden sm:block">STEP 4A · LOADING</div>
          <div className="flex gap-1 text-xs">
            <Link href="/calculator" className="bg-slate-700 px-2 py-1 rounded active:scale-95">Volume</Link>
            <Link href="/calculator/pricing" className="bg-slate-700 px-2 py-1 rounded active:scale-95">Pricing</Link>
            <Link href="/calculator/quotation" className="bg-emerald-600 px-2 py-1 rounded active:scale-95">Quote</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* === КРИТИЧЕСКИЙ REMINDER: ФОТО ПЕРЕД ЗАКРЫТИЕМ === */}
        <Reminder
          id="container_photos"
          type="critical"
          title="📸 ОБЯЗАТЕЛЬНО: фото и видео перед закрытием контейнера"
          dismissible={false}
        >
          <p className="mb-2">
            <strong>Без фотофиксации ICAC Moscow арбитраж не выиграть!</strong> Если контейнер придёт с повреждениями — только твои снимки докажут, что ты сдал товар в порядке.
          </p>
          <p className="font-bold text-slate-900 mb-1">Что снимать (5 минут работы — спасёт сделку):</p>
          <ul className="list-disc ml-5 text-xs space-y-1">
            <li>Пустой контейнер изнутри (до загрузки) — проверка чистоты, отсутствие дыр</li>
            <li>Каждая пачка после загрузки — маркировка видна, штабель ровный</li>
            <li>Крепёж: airbags, деревянные распорки, разделители</li>
            <li>Финальный кадр изнутри (перед закрытием дверей)</li>
            <li>Номер контейнера и пломба (после закрытия) — крупным планом</li>
            <li>Видео 360° (1 минута) — обход вокруг закрытого контейнера</li>
          </ul>
          <p className="text-xs mt-2 italic text-slate-600">
            Сохрани всё в Google Drive в папке сделки. Это твоя страховка на ₽млн.
          </p>
        </Reminder>

        {/* === FRESH WARNING === */}
        {isFresh && (
          <Reminder
            id="fresh_no_export"
            type="critical"
            title="⛔ Сырая доска (FRESH) НЕ загружается в контейнер!"
            dismissible={false}
          >
            <p>
              Морской путь 25-35 дней + жара в трюме = <strong>плесень и почернение</strong> со 100% вероятностью. Покупатель откажется принять груз — а ты потеряешь $30,000.
            </p>
            <p className="mt-2 text-xs">
              <strong>Решение:</strong> вернись на Volume Calculator, поменяй на <strong>KD (Kiln-Dried)</strong> или <strong>AD (Air-Dried)</strong>.
            </p>
          </Reminder>
        )}

        {/* === ISPM-15 REMINDER === */}
        <Reminder
          id="ispm15_fumigation"
          type="warning"
          title="🌿 ISPM-15: фумигация крепёжного бруса"
          dismissible={true}
        >
          <p>
            Если в инвойсе укажешь «крепёжный материал — дерево» — <strong>весь брус и распорки</strong> внутри контейнера обязаны иметь клеймо <strong>ISPM-15</strong> (фумигация).
          </p>
          <p className="text-xs mt-2">
            Для <strong>Индии, ЕС, США, Австралии</strong> — без клейма груз развернут в порту. Для <strong>ОАЭ, Китая</strong> — менее строго, но лучше делать всегда. Стоимость фумигации одной партии бруса: ~₽3000-5000.
          </p>
        </Reminder>

        {/* === СЮРВЕЙЕР === */}
        <Reminder
          id="surveyor_invite"
          type="tip"
          title="🔍 Совет: пригласи сюрвейера на загрузку"
          dismissible={true}
        >
          <p>
            Независимый сюрвейер (SGS, Bureau Veritas, Cotecna) даст официальный <strong>Loading Report</strong> — это сильнейшее доказательство в любом споре.
          </p>
          <p className="text-xs mt-2">
            Стоимость: <strong>$150-300 за визит</strong>. Покупатели премиум-сегмента (ОАЭ, ЕС) часто сами требуют — это <strong>повышает доверие</strong> и позволяет ставить наценку +3-5%.
          </p>
        </Reminder>

        {!hasVolume && (
          <section className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠</span>
              <div>
                <h2 className="font-bold text-slate-900 mb-1">No volume calculated yet</h2>
                <p className="text-sm text-slate-700 mb-3">Visit the Volume Calculator first.</p>
                <Link href="/calculator" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-all active:scale-95">
                  Go to Volume Calculator
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* VIEW MODE TOGGLE */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-slate-700">View mode:</span>
            <div className="inline-flex rounded-lg border-2 border-slate-200 p-1 bg-slate-50">
              <button onClick={() => setViewMode("client")}
                className={`px-4 py-2 rounded text-sm font-semibold transition-all active:scale-95 ${
                  viewMode === "client" ? "bg-orange-500 text-white shadow" : "text-slate-600 hover:bg-slate-100"
                }`}>
                Client View (EN)
              </button>
              <button onClick={() => setViewMode("factory")}
                className={`px-4 py-2 rounded text-sm font-semibold transition-all active:scale-95 ${
                  viewMode === "factory" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-slate-100"
                }`}>
                Factory View (RU)
              </button>
            </div>
          </div>
        </section>

        {/* 2D TOP VIEW */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">▦</span>
            {viewMode === "client" ? "Top View (Plan)" : "Вид сверху (план)"}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {viewMode === "client" ? `Scale schematic · 40ft HC (${CONTAINER.length_m}m × ${CONTAINER.width_m}m)` :
              `Схема в масштабе · 40HC (${CONTAINER.length_m}м × ${CONTAINER.width_m}м)`}
          </p>
          <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 md:p-6 overflow-x-auto">
            <TopView hasVolume={hasVolume} bundlesLoaded={bundlesLoaded} viewMode={viewMode} />
          </div>
        </section>

        {/* 2D REAR VIEW */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">▤</span>
            {viewMode === "client" ? "Rear View (Cross-section)" : "Вид сзади (поперечное сечение)"}
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            {viewMode === "client" ? `Cross-section · ${CONTAINER.width_m}m × ${CONTAINER.height_m}m` :
              `Сечение · ${CONTAINER.width_m}м × ${CONTAINER.height_m}м`}
          </p>
          <div className="bg-slate-50 border-2 border-slate-300 rounded p-4 md:p-6 overflow-x-auto">
            <RearView hasVolume={hasVolume} bundlesLoaded={bundlesLoaded} viewMode={viewMode} />
          </div>
        </section>

        {/* METRICS GRID */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            title={viewMode === "client" ? "Total Volume" : "Объём"}
            value={`${volumeM3.toFixed(2)} m³`}
            subtitle={`${volumePercent.toFixed(0)}% of ${CONTAINER.maxVolume_m3}m³`}
            color={volumeOverload ? "rose" : volumePercent > 90 ? "amber" : "emerald"}
            icon="📦"
          />
          <MetricCard
            title={viewMode === "client" ? "Total Weight" : "Вес"}
            value={`${(weightKg/1000).toFixed(2)} t`}
            subtitle={`${weightPercent.toFixed(0)}% of ${(CONTAINER.maxWeight_kg/1000).toFixed(1)}t`}
            color={weightOverload ? "rose" : weightPercent > 90 ? "amber" : "emerald"}
            icon="⚖"
          />
          <MetricCard
            title={viewMode === "client" ? "Bundles" : "Пачки"}
            value={bundlesLoaded}
            subtitle={`max ${maxBundlesByGeometry} geom.`}
            color="orange"
            icon="🪵"
          />
          <MetricCard
            title={viewMode === "client" ? "Dunnage" : "Крепёж"}
            value="✓"
            subtitle={viewMode === "client" ? "Airbags + wood" : "Подушки + брус"}
            color="slate"
            icon="🔧"
          />
        </section>

        {/* FACTORY INSTRUCTIONS (RU) */}
        {viewMode === "factory" && (
          <section className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5 shadow-sm">
            <h2 className="font-black text-slate-900 mb-3 flex items-center gap-2">
              <span>🏭</span> Инструкция для бригады погрузчиков 40HC
            </h2>
            <ol className="space-y-3 text-sm text-slate-800">
              <li className="flex gap-2">
                <span className="font-black text-orange-600 shrink-0">1.</span>
                <div>
                  <strong>Размер пачки:</strong> длина 5.98 м, ширина ~1.10 м, высота ~1.15 м.<br/>
                  <span className="text-xs text-slate-600">
                    Доска {thickness}×{width}×{length} мм · {species} · {moisture} · плотность {density} кг/м³
                  </span>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-orange-600 shrink-0">2.</span>
                <div>
                  <strong>Схема укладки:</strong> 2 штабеля в длину (по 5.98 м = 11.96 м). Остаётся 4 см зазор — заполнить деревянным брусом для предотвращения сдвига.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-orange-600 shrink-0">3.</span>
                <div>
                  <strong>Ширина и высота:</strong> 2 пачки в ряд по ширине (2.20 м из 2.35 м), до 2 ярусов в высоту (2.30 м из 2.69 м). Итого до 8 пачек в контейнере.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-orange-600 shrink-0">4.</span>
                <div>
                  <strong>Крепёж (обязательно):</strong> надувные подушки (airbags) между пачками и стенками. В местах стыка досок — разделители из доски 50×100 мм (через каждые 3 ряда), чтобы доски не тёрлись друг о друга при качке.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-orange-600 shrink-0">5.</span>
                <div>
                  <strong>ISPM-15:</strong> если в инвойсе указано — все крепёжные деревянные элементы должны иметь клеймо фумигации.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-orange-600 shrink-0">6.</span>
                <div>
                  <strong>Проверка перед закрытием дверей:</strong>
                  <ul className="list-disc ml-5 mt-1 text-xs">
                    <li>Все пачки плотно зафиксированы (нет свободного хода)</li>
                    <li>Нет посторонних предметов, мусора, воды</li>
                    <li>Номер контейнера и пломбы сверены с B/L</li>
                    <li>Сделаны фото: изнутри (до закрытия) + номер/пломба после</li>
                  </ul>
                </div>
              </li>
            </ol>
            <div className="mt-4 bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-slate-700">
              ⚠ <strong>ВНИМАНИЕ:</strong> Сырая доска (FRESH) НЕ загружается — плесень через 25-35 дней в дороге. Только KD/AD.
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/calculator/pricing"
            className="block bg-slate-700 hover:bg-slate-600 text-white text-center font-bold py-3 px-4 rounded-lg transition-all active:scale-95">
            ← Edit Pricing
          </Link>
          <Link href="/calculator/quotation"
            className="block bg-orange-500 hover:bg-orange-600 text-white text-center font-bold py-3 px-4 rounded-lg transition-all active:scale-95">
            Generate Quotation →
          </Link>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-slate-700">
          ℹ <strong>Next (Step 4B):</strong> Commercial Quotation + PDF export
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}

// ============ TOP VIEW (2D) ============
function TopView({ hasVolume, bundlesLoaded, viewMode }) {
  const scale = 40;
  const cntLength = 12.0 * scale;
  const cntWidth = 2.35 * scale;
  const bundleLen = 5.98 * scale;
  const bundleWid = 1.10 * scale;
  const topLayerBundles = Math.min(bundlesLoaded, 4);

  return (
    <div className="flex flex-col items-center">
      <svg width={cntLength + 80} height={cntWidth + 80} style={{minWidth: cntLength + 80}}>
        <rect x="40" y="40" width={cntLength} height={cntWidth}
          fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4,2" />
        <line x1="40" y1="20" x2={40 + cntLength} y2="20" stroke="#334155" strokeWidth="0.5" />
        <line x1="40" y1="15" x2="40" y2="25" stroke="#334155" strokeWidth="0.5" />
        <line x1={40 + cntLength} y1="15" x2={40 + cntLength} y2="25" stroke="#334155" strokeWidth="0.5" />
        <text x={40 + cntLength/2} y="15" textAnchor="middle" fontSize="10" fill="#334155" fontFamily="monospace">
          12.00 m
        </text>
        <line x1="20" y1="40" x2="20" y2={40 + cntWidth} stroke="#334155" strokeWidth="0.5" />
        <line x1="15" y1="40" x2="25" y2="40" stroke="#334155" strokeWidth="0.5" />
        <line x1="15" y1={40 + cntWidth} x2="25" y2={40 + cntWidth} stroke="#334155" strokeWidth="0.5" />
        <text x="10" y={40 + cntWidth/2 + 3} textAnchor="middle" fontSize="10" fill="#334155" fontFamily="monospace"
          transform={`rotate(-90 10 ${40 + cntWidth/2 + 3})`}>
          2.35 m
        </text>
        {hasVolume && topLayerBundles >= 1 && (
          <BundleRect x={40 + 5} y={40 + 5} w={bundleLen} h={bundleWid} label="#1" />
        )}
        {hasVolume && topLayerBundles >= 2 && (
          <BundleRect x={40 + 5} y={40 + bundleWid + 10} w={bundleLen} h={bundleWid} label="#2" />
        )}
        {hasVolume && topLayerBundles >= 3 && (
          <BundleRect x={40 + bundleLen + 10} y={40 + 5} w={bundleLen} h={bundleWid} label="#3" />
        )}
        {hasVolume && topLayerBundles >= 4 && (
          <BundleRect x={40 + bundleLen + 10} y={40 + bundleWid + 10} w={bundleLen} h={bundleWid} label="#4" />
        )}
        {hasVolume && (
          <line x1={40 + bundleLen + 7} y1="40" x2={40 + bundleLen + 7} y2={40 + cntWidth}
            stroke="#ea580c" strokeWidth="1" strokeDasharray="2,2" />
        )}
        <text x={40 + cntLength - 20} y={40 + cntWidth + 20} fontSize="9" fill="#ea580c" fontFamily="monospace">
          ← DOORS
        </text>
      </svg>
      <div className="text-xs text-slate-500 mt-2 font-mono">
        {viewMode === "client" ? "2 stacks by length · 2 bundles across width · top layer" :
          "2 штабеля по длине · 2 в ширину · верхний ярус"}
      </div>
    </div>
  );
}

// ============ REAR VIEW (2D) ============
function RearView({ hasVolume, bundlesLoaded, viewMode }) {
  const scale = 80;
  const cntWidth = 2.35 * scale;
  const cntHeight = 2.69 * scale;
  const bundleWid = 1.10 * scale;
  const bundleHgt = 1.15 * scale;
  const bottomCount = Math.min(Math.min(bundlesLoaded, 4), 2);

  return (
    <div className="flex flex-col items-center">
      <svg width={cntWidth + 80} height={cntHeight + 80}>
        <rect x="40" y="40" width={cntWidth} height={cntHeight}
          fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4,2" />
        <line x1="40" y1="20" x2={40 + cntWidth} y2="20" stroke="#334155" strokeWidth="0.5" />
        <line x1="40" y1="15" x2="40" y2="25" stroke="#334155" strokeWidth="0.5" />
        <line x1={40 + cntWidth} y1="15" x2={40 + cntWidth} y2="25" stroke="#334155" strokeWidth="0.5" />
        <text x={40 + cntWidth/2} y="15" textAnchor="middle" fontSize="10" fill="#334155" fontFamily="monospace">
          2.35 m
        </text>
        <line x1="20" y1="40" x2="20" y2={40 + cntHeight} stroke="#334155" strokeWidth="0.5" />
        <text x="10" y={40 + cntHeight/2} textAnchor="middle" fontSize="10" fill="#334155" fontFamily="monospace"
          transform={`rotate(-90 10 ${40 + cntHeight/2})`}>
          2.69 m
        </text>
        {hasVolume && bottomCount >= 1 && (
          <BundleRect x={40 + 3} y={40 + cntHeight - bundleHgt - 3} w={bundleWid} h={bundleHgt} label="B1" />
        )}
        {hasVolume && bottomCount >= 2 && (
          <BundleRect x={40 + bundleWid + 6} y={40 + cntHeight - bundleHgt - 3} w={bundleWid} h={bundleHgt} label="B2" />
        )}
        {hasVolume && bundlesLoaded >= 5 && (
          <BundleRect x={40 + 3} y={40 + cntHeight - 2*bundleHgt - 6} w={bundleWid} h={bundleHgt} label="T1" />
        )}
        {hasVolume && bundlesLoaded >= 6 && (
          <BundleRect x={40 + bundleWid + 6} y={40 + cntHeight - 2*bundleHgt - 6} w={bundleWid} h={bundleHgt} label="T2" />
        )}
        {hasVolume && bottomCount === 2 && (
          <g>
            <line x1={40 + cntWidth} y1={40 + cntHeight - bundleHgt/2 - 3}
              x2={40 + 2*bundleWid + 6} y2={40 + cntHeight - bundleHgt/2 - 3}
              stroke="#ea580c" strokeWidth="0.5" />
            <text x={40 + cntWidth + 5} y={40 + cntHeight - bundleHgt/2 + 1} fontSize="8" fill="#ea580c" fontFamily="monospace">
              ← airbag
            </text>
          </g>
        )}
      </svg>
      <div className="text-xs text-slate-500 mt-2 font-mono">
        {viewMode === "client" ? "2 bundles wide × up to 2 high · cross-section" :
          "2 пачки в ширину × до 2 в высоту · поперечное сечение"}
      </div>
    </div>
  );
}

function BundleRect({ x, y, w, h, label }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h}
        fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      {[...Array(Math.floor(h/8))].map((_, i) => (
        <line key={i} x1={x+2} y1={y + 4 + i*8} x2={x+w-2} y2={y + 4 + i*8}
          stroke="#d97706" strokeWidth="0.3" opacity="0.5" />
      ))}
      <text x={x + w/2} y={y + h/2 + 3} textAnchor="middle"
        fontSize="10" fill="#92400e" fontFamily="monospace" fontWeight="bold">
        {label}
      </text>
    </g>
  );
}

function MetricCard({ title, value, subtitle, color, icon }) {
  const colors = {
    orange: "bg-orange-50 border-orange-300 text-orange-700",
    emerald: "bg-emerald-50 border-emerald-300 text-emerald-700",
    amber: "bg-amber-50 border-amber-300 text-amber-700",
    rose: "bg-rose-50 border-rose-300 text-rose-700",
    slate: "bg-slate-50 border-slate-300 text-slate-700",
  };
  return (
    <div className={`border-2 rounded-lg p-3 ${colors[color] || colors.slate}`}>
      <div className="text-xs uppercase tracking-wider opacity-70 flex items-center gap-1">
        <span>{icon}</span> {title}
      </div>
      <div className="text-xl md:text-2xl font-black font-mono mt-1">{value}</div>
      <div className="text-xs opacity-60 mt-1">{subtitle}</div>
    </div>
  );
}