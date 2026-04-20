"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const PRESETS_SIZES = [
  { label: "44 × 150 × 5980", t: 44, w: 150, l: 5980 },
  { label: "50 × 150 × 5980", t: 50, w: 150, l: 5980 },
  { label: "25 × 100 × 5980", t: 25, w: 100, l: 5980 },
  { label: "32 × 100 × 5980", t: 32, w: 100, l: 5980 },
  { label: "50 × 200 × 5980", t: 50, w: 200, l: 5980 },
];

const END_USE_PRESETS = [
  { id: "CONSTRUCTION", label: "Construction", ru: "Строительство", icon: "🏗️",
    recommendedSizes: "50×150, 50×200, 100×100", recommendedSpecies: "PINE",
    recommendedSpeciesLabel: "Pine or Pine+Spruce mix", allowedMoisture: ["KD","AD"],
    defaultMoisture: "AD", grade: "2-3 grade (structural)",
    disclaimer: "INTENDED USE: CONSTRUCTION / STRUCTURAL. Not suitable for visible interior finish, furniture, or direct ground contact without treatment." },
  { id: "FURNITURE", label: "Furniture", ru: "Мебель", icon: "🪑",
    recommendedSizes: "25×100, 32×150, 50×200", recommendedSpecies: "PINE",
    recommendedSpeciesLabel: "Pine, Birch, Oak", allowedMoisture: ["KD"],
    defaultMoisture: "KD", grade: "1st (Select)",
    disclaimer: "INTENDED USE: FURNITURE PRODUCTION. Grade: 1st (Select). Moisture: KD 8-12%. Not suitable for construction or outdoor exposure." },
  { id: "PACKAGING", label: "Packaging", ru: "Упаковка", icon: "📦",
    recommendedSizes: "22×100, 25×75", recommendedSpecies: "PINE_SPRUCE_50",
    recommendedSpeciesLabel: "Pine+Spruce mix, SPF", allowedMoisture: ["AD"],
    defaultMoisture: "AD", grade: "3-4 grade",
    disclaimer: "INTENDED USE: PACKAGING / PALLETS. Grade: 3-4. Moisture: AD 18-22%. ISPM-15 heat treatment on request." },
  { id: "INTERIOR", label: "Interior", ru: "Отделка", icon: "🏠",
    recommendedSizes: "14×96, 20×96", recommendedSpecies: "PINE",
    recommendedSpeciesLabel: "Pine, Cedar, Aspen", allowedMoisture: ["KD"],
    defaultMoisture: "KD", grade: "1-2 grade",
    disclaimer: "INTENDED USE: INTERIOR LINING. Moisture: KD. Not for outdoor exposure or load-bearing." },
  { id: "SAUNA", label: "Sauna", ru: "Баня", icon: "🛁",
    recommendedSizes: "15×90, 20×90", recommendedSpecies: "ASPEN",
    recommendedSpeciesLabel: "Aspen, Cedar, Lime", allowedMoisture: ["KD"],
    defaultMoisture: "KD", grade: "1st (Select)",
    disclaimer: "INTENDED USE: SAUNA INTERIOR. Grade: 1st. No resin-releasing species. Moisture: KD." },
  { id: "DECKING", label: "Decking", ru: "Террасы", icon: "🪵",
    recommendedSizes: "28×145, 45×145", recommendedSpecies: "LARCH",
    recommendedSpeciesLabel: "Larch, Oak (naturally durable)", allowedMoisture: ["AD"],
    defaultMoisture: "AD", grade: "Select",
    disclaimer: "INTENDED USE: OUTDOOR DECKING. Moisture: AD. Natural durability required. Regular maintenance needed." },
  { id: "INDUSTRIAL", label: "Industrial", ru: "Опалубка", icon: "🏭",
    recommendedSizes: "25×150, 50×200", recommendedSpecies: "PINE",
    recommendedSpeciesLabel: "Pine, Spruce", allowedMoisture: ["AD"],
    defaultMoisture: "AD", grade: "4 grade / technical",
    disclaimer: "INTENDED USE: INDUSTRIAL / FORMWORK. Moisture: AD 18-22% minimum (fresh-sawn not exported due to mold risk). Grade: technical." },
];

const SPECIES = [
  { id: "PINE", label: "Pine", ru: "Сосна", icon: "🌲", isMix: false,
    densities: { KD: 500, AD: 600, FRESH: 750 }, desc: "Most popular export. Redwood." },
  { id: "SPRUCE", label: "Spruce", ru: "Ель", icon: "🌲", isMix: false,
    densities: { KD: 450, AD: 550, FRESH: 700 }, desc: "Lightest softwood. Whitewood." },
  { id: "PINE_SPRUCE_50", label: "Pine+Spruce 50/50", ru: "Сосна+Ель 50/50", icon: "🌲🌲", isMix: true,
    densities: { KD: 475, AD: 575, FRESH: 725 }, desc: "GOST 8486 mixed softwood." },
  { id: "PINE_SPRUCE_70", label: "Pine+Spruce 70/30", ru: "Сосна+Ель 70/30", icon: "🌲🌲", isMix: true,
    densities: { KD: 485, AD: 585, FRESH: 735 }, desc: "Pine-dominant mix." },
  { id: "SPF", label: "SPF / Whitewood", ru: "Ель+Пихта", icon: "🌲🌲", isMix: true,
    densities: { KD: 440, AD: 540, FRESH: 690 }, desc: "Spruce+Fir. Export staple." },
  { id: "LARCH", label: "Larch", ru: "Лиственница", icon: "🌳", isMix: false,
    densities: { KD: 650, AD: 750, FRESH: 900 }, desc: "Heavy & strong!" },
  { id: "CEDAR", label: "Cedar", ru: "Кедр", icon: "🌲", isMix: false,
    densities: { KD: 435, AD: 520, FRESH: 670 }, desc: "Aromatic, premium." },
  { id: "BIRCH", label: "Birch", ru: "Берёза", icon: "🌿", isMix: false,
    densities: { KD: 640, AD: 720, FRESH: 880 }, desc: "Hardwood. Heavy." },
  { id: "OAK", label: "Oak", ru: "Дуб", icon: "🌳", isMix: false,
    densities: { KD: 700, AD: 790, FRESH: 950 }, desc: "Heaviest! Premium." },
  { id: "ASPEN", label: "Aspen", ru: "Осина", icon: "🌿", isMix: false,
    densities: { KD: 450, AD: 530, FRESH: 680 }, desc: "Light, sauna lining." },
  { id: "CUSTOM", label: "Custom Mix", ru: "Свой микс", icon: "🎛️", isMix: true, isCustom: true,
    desc: "Set your own Pine/Spruce ratio." },
];

const MOISTURE_OPTIONS = [
  { id: "KD", label: "KD", fullName: "Kiln Dried", range: "10-12%", desc: "Chamber-dried. Premium." },
  { id: "AD", label: "AD", fullName: "Air Dried", range: "18-22%", desc: "Standard for shipping." },
  { id: "FRESH", label: "Fresh", fullName: "Fresh Sawn", range: "22-30%", desc: "⚠️ NOT for export!" },
];

const PINE_DENSITIES = { KD: 500, AD: 600, FRESH: 750 };
const SPRUCE_DENSITIES = { KD: 450, AD: 550, FRESH: 700 };

// Лимиты 40ft HC контейнера
const CONTAINER_40HC = {
  maxVolume_m3: 76,       // физический объём
  maxWeight_kg: 26580,    // полезная нагрузка (брутто 30480 - тара 3900)
};

// Ключ для LocalStorage
  const STORAGE_KEY = "ru-timber-calculator-v1";

  // Дефолтные значения
  const DEFAULTS = {
    thickness: 44, width: 150, length: 5980,
    inputMode: "volume", quantity: 100, volumeInput: 40,
    species: "PINE", moisture: "KD", pinePercent: 50, endUse: null,
  };

  // Инициализация состояний (сначала дефолты, потом загрузим из памяти)
  const [thickness, setThickness] = useState(DEFAULTS.thickness);
  const [width, setWidth] = useState(DEFAULTS.width);
  const [length, setLength] = useState(DEFAULTS.length);
  const [inputMode, setInputMode] = useState(DEFAULTS.inputMode);
  const [quantity, setQuantity] = useState(DEFAULTS.quantity);
  const [volumeInput, setVolumeInput] = useState(DEFAULTS.volumeInput);
  const [species, setSpecies] = useState(DEFAULTS.species);
  const [moisture, setMoisture] = useState(DEFAULTS.moisture);
  const [pinePercent, setPinePercent] = useState(DEFAULTS.pinePercent);
  const [endUse, setEndUse] = useState(DEFAULTS.endUse);
  
  // Флаг: данные загружены из памяти
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);

  // ЗАГРУЗКА из LocalStorage при первом открытии страницы
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setThickness(data.thickness ?? DEFAULTS.thickness);
        setWidth(data.width ?? DEFAULTS.width);
        setLength(data.length ?? DEFAULTS.length);
        setInputMode(data.inputMode ?? DEFAULTS.inputMode);
        setQuantity(data.quantity ?? DEFAULTS.quantity);
        setVolumeInput(data.volumeInput ?? DEFAULTS.volumeInput);
        setSpecies(data.species ?? DEFAULTS.species);
        setMoisture(data.moisture ?? DEFAULTS.moisture);
        setPinePercent(data.pinePercent ?? DEFAULTS.pinePercent);
        setEndUse(data.endUse ?? DEFAULTS.endUse);
        setHasMemory(true);
      }
    } catch (e) {
      console.warn("Failed to load calculator state:", e);
    }
    setIsLoaded(true);
  }, []);

  // СОХРАНЕНИЕ в LocalStorage при каждом изменении
  useEffect(() => {
    if (!isLoaded) return; // не сохраняем до первой загрузки
    try {
      const data = {
        thickness, width, length,
        inputMode, quantity, volumeInput,
        species, moisture, pinePercent, endUse,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to save calculator state:", e);
    }
  }, [thickness, width, length, inputMode, quantity, volumeInput, 
      species, moisture, pinePercent, endUse, isLoaded]);

  const volumePerBoard_m3 = (thickness * width * length) / 1_000_000_000;

  // Расчёт в зависимости от режима
  let actualQuantity, totalVolume_m3;
  if (inputMode === "volume") {
    totalVolume_m3 = Number(volumeInput) || 0;
    actualQuantity = volumePerBoard_m3 > 0 ? Math.round(totalVolume_m3 / volumePerBoard_m3) : 0;
  } else {
    actualQuantity = Number(quantity) || 0;
    totalVolume_m3 = volumePerBoard_m3 * actualQuantity;
  }
  
  const totalVolume_cft = totalVolume_m3 * 35.3147;

  const selectedSpecies = SPECIES.find((s) => s.id === species);
  const selectedMoisture = MOISTURE_OPTIONS.find((m) => m.id === moisture);
  const selectedEndUse = END_USE_PRESETS.find((p) => p.id === endUse);

  let density;
  if (selectedSpecies.isCustom) {
    const pineD = PINE_DENSITIES[moisture];
    const spruceD = SPRUCE_DENSITIES[moisture];
    density = Math.round((pineD * pinePercent + spruceD * (100 - pinePercent)) / 100);
  } else {
    density = selectedSpecies.densities[moisture];
  }

  const totalWeight_kg = totalVolume_m3 * density;
  const totalWeight_t = totalWeight_kg / 1000;
  const safeLoad_m3 = 26580 / density;

  // ПРОВЕРКИ ПЕРЕВЕСА
  const volumeOverload = totalVolume_m3 > CONTAINER_40HC.maxVolume_m3;
  const weightOverload = totalWeight_kg > CONTAINER_40HC.maxWeight_kg;
  const hasOverload = volumeOverload || weightOverload;
  
  const volumeOverBy = volumeOverload ? (totalVolume_m3 - CONTAINER_40HC.maxVolume_m3) : 0;
  const weightOverBy = weightOverload ? (totalWeight_kg - CONTAINER_40HC.maxWeight_kg) : 0;
  
  const volumePercent = Math.min((totalVolume_m3 / CONTAINER_40HC.maxVolume_m3) * 100, 100);
  const weightPercent = Math.min((totalWeight_kg / CONTAINER_40HC.maxWeight_kg) * 100, 100);

  const applyEndUse = (preset) => {
    setEndUse(preset.id);
    setSpecies(preset.recommendedSpecies);
    setMoisture(preset.defaultMoisture);
  };

  const moistureWarning = selectedEndUse && !selectedEndUse.allowedMoisture.includes(moisture);

  const applyPreset = (preset) => {
    setThickness(preset.t);
    setWidth(preset.w);
    setLength(preset.l);
  };

  const reset = () => {
    setThickness(DEFAULTS.thickness);
    setWidth(DEFAULTS.width);
    setLength(DEFAULTS.length);
    setQuantity(DEFAULTS.quantity);
    setVolumeInput(DEFAULTS.volumeInput);
    setInputMode(DEFAULTS.inputMode);
    setSpecies(DEFAULTS.species);
    setMoisture(DEFAULTS.moisture);
    setPinePercent(DEFAULTS.pinePercent);
    setEndUse(DEFAULTS.endUse);
    setHasMemory(false);
  };
  
  const clearMemory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      reset();
      alert("Memory cleared! Calculator reset to defaults.");
    } catch (e) {
      console.warn("Failed to clear:", e);
    }
  };

  const densityLabel = selectedSpecies.isCustom
    ? `Pine ${pinePercent}% + Spruce ${100 - pinePercent}%`
    : selectedSpecies.label;

  // Обработчик для полей ввода (фикс "нуля")
  const handleNumberInput = (setter) => (e) => {
    const val = e.target.value;
    if (val === "") {
      setter("");
    } else {
      setter(Number(val));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <Link href="/" className="text-sm text-slate-300 hover:text-orange-500">← Back</Link>
        </div>
      </nav>

      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-3">
            FREE TOOL
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Container Loading <span className="text-orange-500">Calculator</span>
          </h1>
          <p className="text-slate-300 text-sm">
            Step 3.8: Memory enabled 💾 (auto-saves in browser)
          </p>
          {hasMemory && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full text-xs">
              ✅ Previous calculation restored from memory
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* END-USE PRESETS */}
        <section className="bg-white rounded-lg p-5 shadow-sm border-2 border-orange-200">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">🎯</span> What is it for? (End-Use)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Auto-suggests species, moisture, grade. Adds legal disclaimer to invoice.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {END_USE_PRESETS.map((p) => {
              const isActive = endUse === p.id;
              return (
                <button key={p.id} onClick={() => applyEndUse(p)}
                  className={`text-left p-3 rounded-lg border-2 transition ${
                    isActive ? "border-orange-500 bg-orange-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm">{p.icon} {p.label}</div>
                    {isActive && <span className="text-orange-500">✓</span>}
                  </div>
                  <div className="text-xs text-slate-500">{p.ru}</div>
                  <div className="text-xs text-slate-400 mt-1">Grade: {p.grade}</div>
                </button>
              );
            })}
          </div>

          {selectedEndUse && (
            <div className="mt-4 space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-xs text-slate-700">
                ℹ️ <strong>Recommended for {selectedEndUse.label}:</strong><br/>
                • Sizes: {selectedEndUse.recommendedSizes}<br/>
                • Species: {selectedEndUse.recommendedSpeciesLabel}<br/>
                • Moisture: {selectedEndUse.allowedMoisture.join(" or ")} only<br/>
                • Grade: {selectedEndUse.grade}
              </div>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-xs text-slate-700">
                🛡️ <strong>Legal Protection Enabled</strong><br/>
                <em className="text-slate-600 block mt-2 pl-2 border-l-2 border-emerald-300">
                  "{selectedEndUse.disclaimer}"
                </em>
              </div>
              {moistureWarning && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-slate-700">
                  ⚠️ <strong>Moisture mismatch!</strong> For {selectedEndUse.label} use{" "}
                  {selectedEndUse.allowedMoisture.join(" or ")}, not {moisture}.
                </div>
              )}
              <button onClick={() => setEndUse(null)} className="text-xs text-slate-500 hover:text-orange-500 underline">
                ✕ Clear end-use selection
              </button>
            </div>
          )}
        </section>

        {/* SIZE PRESETS */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-orange-500">⚡</span> Quick Size Presets
          </h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS_SIZES.map((p) => {
              const isActive = thickness === p.t && width === p.w && length === p.l;
              return (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className={`px-3 py-2 text-sm rounded font-mono transition-all active:scale-95 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md ring-2 ring-orange-300"
                      : "bg-slate-100 text-slate-700 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {isActive && "✓ "}{p.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ℹ️ Standard export sizes for 40ft HC container (length 5980mm optimal)
          </p>
        </section>

        {/* DIMENSIONS + INPUT MODE */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-orange-500">📐</span> Board Dimensions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Thickness (mm)</label>
              <input type="number" value={thickness} 
                onChange={handleNumberInput(setThickness)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
              <p className="text-xs text-slate-500 mt-1">{(thickness / 25.4).toFixed(2)}"</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Width (mm)</label>
              <input type="number" value={width}
                onChange={handleNumberInput(setWidth)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
              <p className="text-xs text-slate-500 mt-1">{(width / 25.4).toFixed(2)}"</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Length (mm)</label>
              <input type="number" value={length}
                onChange={handleNumberInput(setLength)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
              <p className="text-xs text-slate-500 mt-1">{(length / 304.8).toFixed(2)} ft</p>
            </div>
          </div>

          {/* ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМА ВВОДА */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Input mode:</label>
            <div className="inline-flex rounded-lg border-2 border-slate-200 p-1 bg-slate-50">
              <button
                onClick={() => setInputMode("volume")}
                className={`px-4 py-2 rounded text-sm font-semibold transition ${
                  inputMode === "volume" ? "bg-orange-500 text-white shadow" : "text-slate-600 hover:bg-slate-100"
                }`}>
                📦 Volume (m³)
              </button>
              <button
                onClick={() => setInputMode("pieces")}
                className={`px-4 py-2 rounded text-sm font-semibold transition ${
                  inputMode === "pieces" ? "bg-orange-500 text-white shadow" : "text-slate-600 hover:bg-slate-100"
                }`}>
                🔢 Pieces
              </button>
            </div>
          </div>

          {inputMode === "volume" ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Total Volume (m³)</label>
              <input type="number" value={volumeInput} step="0.1"
                onChange={handleNumberInput(setVolumeInput)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
              <p className="text-xs text-slate-500 mt-1">
                ≈ {actualQuantity.toLocaleString()} pcs · {(totalVolume_m3 * 35.3147).toFixed(0)} CFT
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity (pcs)</label>
              <input type="number" value={quantity}
                onChange={handleNumberInput(setQuantity)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-3 border-2 border-slate-200 rounded text-lg font-mono focus:border-orange-500 focus:outline-none" />
              <p className="text-xs text-slate-500 mt-1">
                = {totalVolume_m3.toFixed(2)} m³ · {(totalVolume_m3 * 35.3147).toFixed(0)} CFT
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4">
            <button onClick={reset} className="text-sm text-slate-500 hover:text-orange-500 underline">
              ↻ Reset all
            </button>
            <button onClick={clearMemory} className="text-sm text-rose-500 hover:text-rose-700 underline">
              🗑️ Clear saved memory
            </button>
          </div>
        </section>

        {/* SPECIES */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">🌲</span> Wood Species
          </h2>
          <p className="text-xs text-slate-500 mb-4">GOST 8486: Pine+Spruce can be mixed. Larch/Cedar — separate.</p>
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pure species</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {SPECIES.filter(s => !s.isMix).map((s) => {
              const isActive = species === s.id;
              return (
                <button key={s.id} onClick={() => setSpecies(s.id)}
                  className={`text-left p-3 rounded-lg border-2 transition ${
                    isActive ? "border-orange-500 bg-orange-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm">{s.icon} {s.label}</div>
                    {isActive && <span className="text-orange-500">✓</span>}
                  </div>
                  <div className="text-xs text-slate-500">{s.ru}</div>
                  <div className="text-xs font-mono mt-1 text-slate-700">{s.densities[moisture]} kg/m³</div>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">🌲🌲 Mixed bundles</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SPECIES.filter(s => s.isMix).map((s) => {
              const isActive = species === s.id;
              const d = s.isCustom
                ? Math.round((PINE_DENSITIES[moisture] * pinePercent + SPRUCE_DENSITIES[moisture] * (100 - pinePercent)) / 100)
                : s.densities[moisture];
              return (
                <button key={s.id} onClick={() => setSpecies(s.id)}
                  className={`text-left p-3 rounded-lg border-2 transition ${
                    isActive ? "border-orange-500 bg-orange-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm">{s.icon} {s.label}</div>
                    {isActive && <span className="text-orange-500">✓</span>}
                  </div>
                  <div className="text-xs text-slate-500">{s.ru}</div>
                  <div className="text-xs font-mono mt-1 text-slate-700">{d} kg/m³</div>
                  <div className="text-xs text-slate-600 mt-1 italic">{s.desc}</div>
                </button>
              );
            })}
          </div>

          {selectedSpecies.isCustom && (
            <div className="mt-4 bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Pine / Spruce ratio</label>
              <div className="flex items-center gap-4 mb-2">
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-500">{pinePercent}%</div>
                  <div className="text-xs text-slate-500">Pine</div>
                </div>
                <input type="range" min="0" max="100" step="5" value={pinePercent}
                  onChange={(e) => setPinePercent(Number(e.target.value))} className="flex-1 accent-orange-500" />
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-500">{100 - pinePercent}%</div>
                  <div className="text-xs text-slate-500">Spruce</div>
                </div>
              </div>
              <div className="text-xs text-slate-600 text-center">Weighted density: <strong>{density} kg/m³</strong></div>
            </div>
          )}

          {species === "LARCH" && (
            <div className="mt-4 bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-slate-700">
              ⚠️ <strong>GOST 8486:</strong> Larch must NOT be mixed with Pine/Spruce. Package separately!
            </div>
          )}
        </section>

        {/* MOISTURE */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="text-orange-500">💧</span> Moisture Content
          </h2>
          <p className="text-xs text-slate-500 mb-4">Fresh-sawn NOT recommended for export — mold risk.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOISTURE_OPTIONS.map((m) => {
              const isActive = moisture === m.id;
              const blocked = selectedEndUse && !selectedEndUse.allowedMoisture.includes(m.id);
              let mDensity;
              if (selectedSpecies.isCustom) {
                mDensity = Math.round((PINE_DENSITIES[m.id] * pinePercent + SPRUCE_DENSITIES[m.id] * (100 - pinePercent)) / 100);
              } else {
                mDensity = selectedSpecies.densities[m.id];
              }
              return (
                <button key={m.id} onClick={() => setMoisture(m.id)}
                  className={`text-left p-4 rounded-lg border-2 transition relative ${
                    isActive ? "border-orange-500 bg-orange-50 shadow-md"
                    : blocked ? "border-rose-200 bg-rose-50/50 opacity-60"
                    : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-black text-lg">{m.label}</div>
                    {isActive && <span className="text-orange-500 text-xl">✓</span>}
                    {blocked && !isActive && <span className="text-rose-500">🚫</span>}
                  </div>
                  <div className="text-sm font-semibold text-slate-700">{m.fullName}</div>
                  <div className="text-xs text-slate-500 mb-2">Moisture: {m.range}</div>
                  <div className="text-xs font-mono bg-slate-100 inline-block px-2 py-1 rounded">{mDensity} kg/m³</div>
                  <p className="text-xs text-slate-600 mt-2">{m.desc}</p>
                </button>
              );
            })}
          </div>

          {moisture === "FRESH" && (
            <div className="mt-4 bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-slate-700">
              ⚠️ <strong>Fresh-sawn is NOT recommended for export!</strong> Mold develops in containers during 25-35 day shipping.
            </div>
          )}

          <div className={`mt-4 border-l-4 p-3 rounded text-xs text-slate-700 ${
            safeLoad_m3 >= 45 ? "bg-emerald-50 border-emerald-500" :
            safeLoad_m3 >= 38 ? "bg-amber-50 border-amber-500" :
            "bg-rose-50 border-rose-500"
          }`}>
            {safeLoad_m3 >= 45 ? "✅" : safeLoad_m3 >= 38 ? "ℹ️" : "⚠️"}
            {" "}<strong>40ft HC safe load for {densityLabel} {selectedMoisture.label}:</strong>
            {" "}~{safeLoad_m3.toFixed(1)} m³
          </div>
        </section>

        {/* 🚨 НОВОЕ: OVERLOAD ALERT */}
        {hasOverload && (
          <section className="bg-rose-600 text-white rounded-lg p-5 shadow-lg border-4 border-rose-700 animate-pulse">
            <h2 className="font-black text-xl mb-3 flex items-center gap-2">
              🚨 CONTAINER OVERLOAD!
            </h2>
            <p className="text-sm mb-4 text-rose-100">
              Your cargo EXCEEDS 40ft HC limits. Split into multiple containers or reduce quantity!
            </p>
            <div className="space-y-2">
              {weightOverload && (
                <div className="bg-rose-700 rounded p-3">
                  <div className="text-xs uppercase tracking-wider text-rose-200">⚖️ Weight overload</div>
                  <div className="font-mono text-lg">
                    {totalWeight_kg.toLocaleString("en-US", {maximumFractionDigits: 0})} kg / {CONTAINER_40HC.maxWeight_kg.toLocaleString()} kg max
                  </div>
                  <div className="text-sm font-bold text-amber-300">
                    ⚠️ OVER BY +{weightOverBy.toLocaleString("en-US", {maximumFractionDigits: 0})} kg
                  </div>
                </div>
              )}
              {volumeOverload && (
                <div className="bg-rose-700 rounded p-3">
                  <div className="text-xs uppercase tracking-wider text-rose-200">📦 Volume overload</div>
                  <div className="font-mono text-lg">
                    {totalVolume_m3.toFixed(2)} m³ / {CONTAINER_40HC.maxVolume_m3} m³ max
                  </div>
                  <div className="text-sm font-bold text-amber-300">
                    ⚠️ OVER BY +{volumeOverBy.toFixed(2)} m³
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-rose-100">
              💡 <strong>Tip:</strong> Russian customs fines for overweight = $500–$2 000. 
              Split the order: you'll need {Math.ceil(Math.max(totalWeight_kg/CONTAINER_40HC.maxWeight_kg, totalVolume_m3/CONTAINER_40HC.maxVolume_m3))} containers.
            </div>
          </section>
        )}

        {/* RESULT */}
        <section className="bg-slate-900 text-white rounded-lg p-6 shadow-lg">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-500">📊</span> Calculation Result
          </h2>
          <div className="mb-3 text-xs text-slate-400">
            {selectedEndUse && <>🎯 {selectedEndUse.label} · </>}
            {selectedSpecies.icon} {densityLabel} · {selectedMoisture.label} · {density} kg/m³
          </div>

          <div className="mb-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Total Volume</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono text-orange-500">{totalVolume_m3.toFixed(2)}</div>
                <div className="text-sm text-slate-400">m³ (CBM)</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono">{totalVolume_cft.toFixed(0)}</div>
                <div className="text-sm text-slate-400">CFT</div>
              </div>
            </div>
            {/* Шкала объёма */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>40ft HC capacity</span>
                <span className={volumeOverload ? "text-rose-400 font-bold" : ""}>{volumePercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${
                  volumeOverload ? "bg-rose-500" : volumePercent > 90 ? "bg-amber-500" : "bg-emerald-500"
                }`} style={{width: `${volumePercent}%`}}></div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-5">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Total Weight</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono text-orange-500">
                  {totalWeight_kg.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-slate-400">kg</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black font-mono">{totalWeight_t.toFixed(2)}</div>
                <div className="text-sm text-slate-400">tonnes</div>
              </div>
            </div>
            {/* Шкала веса */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Weight limit</span>
                <span className={weightOverload ? "text-rose-400 font-bold" : ""}>{weightPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${
                  weightOverload ? "bg-rose-500" : weightPercent > 90 ? "bg-amber-500" : "bg-emerald-500"
                }`} style={{width: `${weightPercent}%`}}></div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-700 grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-slate-400 uppercase">Per board vol.</div><div className="font-mono">{volumePerBoard_m3.toFixed(4)} m³</div></div>
            <div><div className="text-xs text-slate-400 uppercase">Per board weight</div><div className="font-mono">{(volumePerBoard_m3 * density).toFixed(2)} kg</div></div>
            <div><div className="text-xs text-slate-400 uppercase">Quantity</div><div className="font-mono">{actualQuantity.toLocaleString()} pcs</div></div>
            <div><div className="text-xs text-slate-400 uppercase">Density</div><div className="font-mono">{density} kg/m³</div></div>
          </div>

          {selectedEndUse && (
            <div className="mt-5 pt-5 border-t border-slate-700">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">🛡️ Legal disclaimer (to invoice)</div>
              <div className="text-xs text-slate-300 italic leading-relaxed">{selectedEndUse.disclaimer}</div>
            </div>
          )}
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-slate-700">
          ℹ️ <strong>Next (3.8):</strong> memory (LocalStorage) — remember last calc after reload
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}