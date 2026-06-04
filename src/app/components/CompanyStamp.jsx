"use client";

// 🎨 RU-TIMBER EXPORT — Official Stamp Component
// Точное соответствие реальной печати ИП

import { useBusinessSettings } from "../context/BusinessContext";

export function CompanyStamp({ size = 180, opacity = 0.85 }) {
  // Попробуем взять из контекста (если будет настроен)
  let settings;
  try {
    settings = useBusinessSettings();
  } catch {
    settings = null;
  }

  // Fallback — реальные данные с печати
  const data = settings || {
    companyName: "RU-TIMBER EXPORT",
    companyType: "ИП",
    inn: "7716179565514",
    ogrn: "326774600405782",
    city: "MOSCOW",
  };

  const radius = size / 2;
  const center = radius;

  return (
    <div
      className="relative inline-block select-none print:opacity-100"
      style={{ width: size, height: size, opacity }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 1px 2px rgba(30, 64, 175, 0.15))",
        }}
      >
        <defs>
          {/* Верхняя дуга: компания */}
          <path
            id="topArc"
            d={`M ${center - (radius - 15)},${center} A ${radius - 15},${radius - 15} 0 0,1 ${center + (radius - 15)},${center}`}
            fill="none"
          />
          {/* Нижняя дуга: город + ИНН */}
          <path
            id="bottomArc"
            d={`M ${center - (radius - 15)},${center} A ${radius - 15},${radius - 15} 0 0,0 ${center + (radius - 15)},${center}`}
            fill="none"
          />
        </defs>

        {/* === ВНЕШНЯЯ ГРАНИЦА === */}
        <circle
          cx={center}
          cy={center}
          r={radius - 4}
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="2.5"
        />

        {/* === ВНУТРЕННЯЯ ГРАНИЦА === */}
        <circle
          cx={center}
          cy={center}
          r={radius - 20}
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="1.5"
        />

        {/* === ВЕРХНЯЯ НАДПИСЬ (по дуге) === */}
        <text
          fill="#1e3a8a"
          fontSize={size * 0.085}
          fontWeight="bold"
          fontFamily="'Times New Roman', serif"
          letterSpacing="1.5"
        >
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            · {data.companyName} ·
          </textPath>
        </text>

        {/* === ЗВЕЗДА СВЕРХУ === */}
        <text
          x={center}
          y={center - radius * 0.42}
          textAnchor="middle"
          fill="#1e3a8a"
          fontSize={size * 0.09}
        >
          ★
        </text>

        {/* === ЦЕНТР: ИП === */}
        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          fill="#1e3a8a"
          fontSize={size * 0.22}
          fontWeight="900"
          fontFamily="'Times New Roman', serif"
          letterSpacing="2"
        >
          {data.companyType || "ИП"}
        </text>

        {/* === ОГРНИП === */}
        <text
          x={center}
          y={center + size * 0.13}
          textAnchor="middle"
          fill="#1e3a8a"
          fontSize={size * 0.052}
          fontWeight="600"
          fontFamily="'Times New Roman', serif"
        >
          ОГРНИП {data.ogrn}
        </text>

        {/* === ЛИНИЯ ПОД ОГРН === */}
        <line
          x1={center - radius * 0.35}
          y1={center + size * 0.17}
          x2={center + radius * 0.35}
          y2={center + size * 0.17}
          stroke="#1e3a8a"
          strokeWidth="1"
        />

        {/* === EXPORT СО ЗВЁЗДАМИ === */}
        <text
          x={center}
          y={center + size * 0.23}
          textAnchor="middle"
          fill="#1e3a8a"
          fontSize={size * 0.055}
          fontWeight="bold"
          fontFamily="'Times New Roman', serif"
          letterSpacing="2"
        >
          ★ EXPORT ★
        </text>

        {/* === НИЖНЯЯ НАДПИСЬ (по дуге) === */}
        <text
          fill="#1e3a8a"
          fontSize={size * 0.07}
          fontWeight="bold"
          fontFamily="'Times New Roman', serif"
          letterSpacing="1.2"
        >
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            {data.city} · ИНН {data.inn}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

// === КОМПОНЕНТ С ПОДПИСЬЮ ===
export function SignatureWithStamp({
  name,
  role,
  companyName,
  inn,
  ogrn,
  city = "MOSCOW",
}) {
  return (
    <div className="relative inline-block">
      {/* Подпись */}
      <div className="relative z-10">
        <div className="font-serif italic text-2xl text-blue-900 mb-1">
          {/* Можно вставить SVG-роспись если есть */}
          <svg width="180" height="50" viewBox="0 0 180 50">
            <path
              d="M 10,30 Q 30,5 50,30 T 90,25 Q 110,10 130,30 T 170,20"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="border-b-2 border-slate-700 w-64 -mt-3 mb-2"></div>
        <div className="text-xs font-bold text-slate-700">{name}</div>
        {role && <div className="text-xs text-slate-600">{role}</div>}
      </div>

      {/* Печать поверх подписи (со смещением) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10px",
          left: "140px",
          transform: "rotate(-8deg)",
        }}
      >
        <CompanyStamp
          size={160}
          opacity={0.7}
        />
      </div>
    </div>
  );
}