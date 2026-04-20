"use client";
import Link from "next/link";
import { useDeal } from "../../context/DealContext";

// === Константы контейнера 40HC ===
const CONTAINER = {
  length_m: 12.0,
  width_m: 2.35,
  height_m: 2.69,
  maxVolume_m3: 76,
  maxWeight_kg: 26580,
};

// Стандартная пачка (bundle) — упрощённая
const BUNDLE = {
  length_m: 5.98,  // длина одной доски
  width_m: 1.10,   // стандартная ширина пачки
  height_m: 1.15,  // стандартная высота пачки
  // Объём одной условной пачки
  volume_m3: 5.98 * 1.10 * 1.15, // ~7.56 м³
};

// Пород для расчёта плотности
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
  CUSTOM: { KD: 475, AD: 575, FRESH: 725 }, // fallback
};

export default function ContainerPage() {
  const { deal, hasMemory } = useDeal();
  const { species, moisture, computedVolume_m3, computedWeight_kg, thickness, width, length } = deal;

  const volumeM3 = Number(computedVolume_m3) || 0;
  const weightKg = Number(computedWeight_kg) || 0;
  const hasVolume = volumeM3 > 0;

  const speciesData = DENSITIES[species] || DENSITIES.PINE;
  const density = speciesData[moisture] || 500;

  // === РАСЧЁТ ЗАГРУЗКИ ===

  // Сколько пачек нужно по объёму
  const bundlesNeeded = volumeM3 > 0 ? Math.ceil(volumeM3 / BUNDLE.volume_m3) : 0;

  // Контейнер вмещает: 2 штабеля по длине × 2 в ширину × N в высоту
  const stacksByLength = 2;  // 5.98 × 2 = 11.96 м (почти 12 м)
  const stacksByWidth = Math.floor(CONTAINER.width_m / BUNDLE.width_m);  // = 2
  const stacksByHeight = Math.floor(CONTAINER.height_m / BUNDLE.height_m); // = 2

  const maxBundlesByGeometry = stacksByLength * stacksByWidth * stacksByHeight; // обычно 8

  // Сколько реально загрузим (лимит по объёму ИЛИ по геометрии)
  const bundlesLoaded = Math.min(bundlesNeeded, maxBundlesByGeometry);

  // Проверки
  const volumeOverload = volumeM3 > CONTAINER.maxVolume_m3;
  const weightOverload = weightKg > CONTAINER.maxWeight_kg;

  // Процент заполнения
  const fillPercent = Math.min((volumeM3 / CONTAINER.maxVolume_m3) * 100, 100);

  // Количество "видимых" рядов в визуализации (для примера — max 4 в ширину, max 2 в высоту)
  // Мы будем отображать реальное количество пачек, но упрощённо
  const visibleRowsByHeight = Math.min(stacksByHeight, 2);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <div className="flex gap-3 text-sm flex-wrap">
            <Link href="/calculator" className="text-slate-300 hover:text-orange-500">📦 Volume</Link>
            <Link href="/calculator/pricing" className="text-slate-300 hover:text-orange-500">💰 Pricing</Link>
            <Link href="/" className="text-slate-300 hover:text-orange-500">← Home</Link>
          </div>
        </div>
      </nav>

      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-3">
            STEP 4A · 3D VISUALIZER
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Container <span className="text-orange-500">Visualizer</span>
          </h1>
          <p className="text-slate-300 text-sm">
            🚢 See how your cargo fits in a 40ft High Cube container
          </p>
          {hasMemory && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full text-xs">
              ✅ Deal loaded from memory
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Warning if no volume */}
        {!hasVolume && (
          <section className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="font-bold text-slate-900 mb-1">No volume calculated yet</h2>
                <p className="text-sm text-slate-700 mb-3">
                  Visit the Volume Calculator first to set dimensions and quantity.
                </p>
                <Link href="/calculator"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-all active:scale-95">
                  📦 Go to Volume Calculator
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 3D ISOMETRIC CONTAINER */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">🚢</span> 40ft High Cube · Cargo Layout
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Isometric view · {CONTAINER.length_m}m × {CONTAINER.width_m}m × {CONTAINER.height_m}m
          </p>

          {/* Сцена изометрии */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-6 md:p-10 overflow-hidden">
            <div className="relative mx-auto" style={{
              width: "min(100%, 600px)",
              height: "320px",
              perspective: "1200px",
            }}>
              {/* Контейнер */}
              <div className="absolute inset-0 flex items-center justify-center" style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(20deg) rotateY(-25deg)",
              }}>
                {/* Пол контейнера */}
                <div className="absolute" style={{
                  width: "480px",
                  height: "160px",
                  background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
                  transform: "rotateX(90deg) translateZ(-80px)",
                  border: "2px solid #1e293b",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
                }} />

                {/* Задняя стенка (прозрачная) */}
                <div className="absolute" style={{
                  width: "480px",
                  height: "220px",
                  background: "rgba(71, 85, 105, 0.15)",
                  transform: "translateZ(-80px)",
                  border: "2px solid rgba(71, 85, 105, 0.4)",
                }} />

                {/* Левая стенка */}
                <div className="absolute" style={{
                  width: "160px",
                  height: "220px",
                  background: "linear-gradient(90deg, rgba(71, 85, 105, 0.3), rgba(71, 85, 105, 0.1))",
                  transform: "rotateY(90deg) translateZ(-240px)",
                  border: "2px solid rgba(71, 85, 105, 0.5)",
                }} />

                {/* ПАЧКИ ДОСКИ */}
                {hasVolume && (
                  <>
                    {/* Нижний ряд, 2 штабеля по длине × 2 в ширину = 4 пачки */}
                    {/* Пачка 1 (передняя левая, низ) */}
                    <BundleBox
                      x={-120} y={50} z={-30}
                      label="1"
                      visible={bundlesLoaded >= 1}
                    />
                    {/* Пачка 2 (передняя правая, низ) */}
                    <BundleBox
                      x={120} y={50} z={-30}
                      label="2"
                      visible={bundlesLoaded >= 2}
                    />
                    {/* Пачка 3 (задняя левая, низ) */}
                    <BundleBox
                      x={-120} y={50} z={-130}
                      label="3"
                      visible={bundlesLoaded >= 3}
                    />
                    {/* Пачка 4 (задняя правая, низ) */}
                    <BundleBox
                      x={120} y={50} z={-130}
                      label="4"
                      visible={bundlesLoaded >= 4}
                    />

                    {/* Верхний ряд */}
                    <BundleBox
                      x={-120} y={-30} z={-30}
                      label="5"
                      visible={bundlesLoaded >= 5}
                    />
                    <BundleBox
                      x={120} y={-30} z={-30}
                      label="6"
                      visible={bundlesLoaded >= 6}
                    />
                    <BundleBox
                      x={-120} y={-30} z={-130}
                      label="7"
                      visible={bundlesLoaded >= 7}
                    />
                    <BundleBox
                      x={120} y={-30} z={-130}
                      label="8"
                      visible={bundlesLoaded >= 8}
                    />
                  </>
                )}

                {/* Передняя "рамка" контейнера (открытые двери) */}
                <div className="absolute pointer-events-none" style={{
                  width: "480px",
                  height: "220px",
                  border: "3px solid #ea580c",
                  transform: "translateZ(80px)",
                  boxShadow: "0 0 30px rgba(234, 88, 12, 0.3)",
                }} />

                {/* Label "40HC" */}
                <div className="absolute text-orange-500 font-black text-xs tracking-wider" style={{
                  top: "-30px",
                  left: "50%",
                  transform: "translateX(-50%) translateZ(100px)",
                }}>
                  40ft HC · OPEN VIEW
                </div>
              </div>
            </div>

            {!hasVolume && (
              <div className="text-center text-slate-500 text-sm mt-4">
                Empty container · Set volume in step 3.8 to visualize
              </div>
            )}
          </div>

          {/* Loading stats */}
          {hasVolume && (
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Bundles needed" value={bundlesNeeded} unit="pcs" color="orange" />
              <StatCard label="Bundles loaded" value={bundlesLoaded} unit={`of ${maxBundlesByGeometry}`} color="emerald" />
              <StatCard label="Stacks (length)" value={stacksByLength} unit="× 5.98m" color="slate" />
              <StatCard label="Fill rate" value={`${fillPercent.toFixed(0)}%`} unit="volume" color={fillPercent > 95 ? "rose" : "emerald"} />
            </div>
          )}
        </section>

        {/* INFO PANEL */}
        <section className="bg-slate-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-500">📋</span> Loading Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cargo */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Cargo Details</div>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Board size</span><span>{thickness}×{width}×{length} mm</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Species</span><span>{species}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Moisture</span><span>{moisture}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Density</span><span>{density} kg/m³</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-700">
                  <span className="text-slate-400">Total volume</span>
                  <span className="text-orange-500 font-black">{volumeM3.toFixed(2)} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total weight</span>
                  <span className="text-orange-500 font-black">{weightKg.toLocaleString("en-US", {maximumFractionDigits:0})} kg</span>
                </div>
              </div>
            </div>

            {/* Container */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Container 40ft HC</div>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Length</span><span>{CONTAINER.length_m} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Width</span><span>{CONTAINER.width_m} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Height</span><span>{CONTAINER.height_m} m</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-700">
                  <span className="text-slate-400">Max volume</span>
                  <span>{CONTAINER.maxVolume_m3} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max weight</span>
                  <span>{CONTAINER.maxWeight_kg.toLocaleString()} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(volumeOverload || weightOverload) && (
            <div className="mt-5 bg-rose-600 text-white rounded p-3 text-sm">
              🚨 <strong>OVERLOAD!</strong> Cargo exceeds container limits. Split into {Math.ceil(Math.max(volumeM3/CONTAINER.maxVolume_m3, weightKg/CONTAINER.maxWeight_kg))} containers.
            </div>
          )}

          {/* Layout description */}
          {hasVolume && !volumeOverload && !weightOverload && (
            <div className="mt-5 bg-slate-800 rounded p-4 text-sm">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">📐 Loading Plan</div>
              <ul className="space-y-1 text-slate-300">
                <li>✓ <strong>{stacksByLength} stacks</strong> by length (5.98m × 2 = 11.96m, fits in 12m)</li>
                <li>✓ <strong>{stacksByWidth} bundles</strong> across width (2.35m wide)</li>
                <li>✓ <strong>Up to {stacksByHeight} layers</strong> in height (2.69m tall)</li>
                <li>✓ <strong>{bundlesLoaded} bundles total</strong> ({BUNDLE.volume_m3.toFixed(2)} m³ each)</li>
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="mt-5 pt-5 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/calculator"
              className="block bg-slate-700 hover:bg-slate-600 text-white text-center font-bold py-3 px-4 rounded-lg transition-all active:scale-95">
              ← 📦 Edit Volume
            </Link>
            <Link href="/calculator/pricing"
              className="block bg-orange-500 hover:bg-orange-600 text-white text-center font-bold py-3 px-4 rounded-lg transition-all active:scale-95">
              💰 Adjust Pricing →
            </Link>
          </div>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-slate-700">
          ℹ️ <strong>Next (Step 4B):</strong> Commercial Quotation PDF export
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}

// === Вспомогательный компонент: одна пачка ===
function BundleBox({ x, y, z, label, visible }) {
  if (!visible) return null;
  return (
    <div
      className="absolute"
      style={{
        width: "140px",
        height: "70px",
        background: "linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #92400e 100%)",
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        transformStyle: "preserve-3d",
        border: "1px solid #78350f",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.2)",
        borderRadius: "2px",
      }}
    >
      {/* Полоски имитируют доски */}
      <div style={{
        position: "absolute", inset: "4px",
        background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 8px)",
        pointerEvents: "none",
      }} />
      {/* Этикетка */}
      <div className="absolute top-1 left-1 bg-slate-900 text-orange-400 text-xs font-black px-1.5 py-0.5 rounded-sm font-mono">
        #{label}
      </div>
    </div>
  );
}

// === Вспомогательный компонент: карточка статистики ===
function StatCard({ label, value, unit, color }) {
  const colors = {
    orange: "bg-orange-50 border-orange-300 text-orange-700",
    emerald: "bg-emerald-50 border-emerald-300 text-emerald-700",
    rose: "bg-rose-50 border-rose-300 text-rose-700",
    slate: "bg-slate-50 border-slate-300 text-slate-700",
  };
  return (
    <div className={`border-2 rounded-lg p-3 ${colors[color] || colors.slate}`}>
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-2xl font-black font-mono">{value}</div>
      <div className="text-xs opacity-60">{unit}</div>
    </div>
  );
}