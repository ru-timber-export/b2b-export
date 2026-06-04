"use client";

// 📜 RU-TIMBER EXPORT — Official Company Stamp
// Точное соответствие реальной печати ИП
// Автоматически берёт данные из BusinessSettings

import { useBusinessSettings } from "../context/BusinessContext";

export function CompanyStamp({
  size = 200,
  rotation = 0,
  opacity = 1,
  color = "#1e3a8a", // navy blue
}) {
  const settings = useBusinessSettings();

  // Данные с печати
  const companyName = settings.stampCompanyName || "RU-TIMBER EXPORT";
  const companyType = settings.stampType || "ИП";
  const city = settings.stampCity || "MOSCOW";
  const inn = settings.inn || "771617956514";
  const ogrnip = settings.ogrnip || "326774600405782";

  // Геометрия (в долях от size)
  const center = size / 2;
  const outerRadius = size * 0.48; // внешний круг
  const innerRadius = size * 0.40; // внутренний круг
  const arcRadius = size * 0.42; // радиус дуг для текста

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        display: "inline-block",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          {/* Верхняя дуга для текста — слева направо по верху */}
          <path
            id="topArc"
            d={`M ${center - arcRadius},${center} 
                A ${arcRadius},${arcRadius} 0 0,1 ${center + arcRadius},${center}`}
            fill="none"
          />
          {/* Нижняя дуга для текста — слева направо по низу */}
          <path
            id="bottomArc"
            d={`M ${center - arcRadius},${center} 
                A ${arcRadius},${arcRadius} 0 0,0 ${center + arcRadius},${center}`}
            fill="none"
          />
        </defs>

        {/* === ВНЕШНИЙ КРУГ === */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.012}
        />

        {/* === ВНУТРЕННИЙ КРУГ === */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.008}
        />

        {/* === ВЕРХНЯЯ НАДПИСЬ ПО ДУГЕ === */}
        <text
          fill={color}
          fontSize={size * 0.082}
          fontWeight="bold"
          fontFamily="'Times New Roman', Times, serif"
          letterSpacing={size * 0.008}
        >
          <textPath
            href="#topArc"
            startOffset="50%"
            textAnchor="middle"
          >
            · {companyName} ·
          </textPath>
        </text>

        {/* === ЗВЕЗДА СВЕРХУ === */}
        <text
          x={center}
          y={center - size * 0.20}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.10}
          dominantBaseline="middle"
        >
          ★
        </text>

        {/* === ЦЕНТР: "ИП" БОЛЬШИМИ БУКВАМИ === */}
        <text
          x={center}
          y={center - size * 0.02}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.22}
          fontWeight="900"
          fontFamily="'Times New Roman', Times, serif"
          letterSpacing={size * 0.005}
          dominantBaseline="middle"
        >
          {companyType}
        </text>

        {/* === ОГРНИП === */}
        <text
          x={center}
          y={center + size * 0.10}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.052}
          fontWeight="600"
          fontFamily="'Times New Roman', Times, serif"
          letterSpacing={size * 0.002}
        >
          ОГРНИП {ogrnip}
        </text>

        {/* === ЛИНИЯ ПОД ОГРНИП === */}
        <line
          x1={center - size * 0.18}
          y1={center + size * 0.135}
          x2={center + size * 0.18}
          y2={center + size * 0.135}
          stroke={color}
          strokeWidth={size * 0.005}
        />

        {/* === * EXPORT * === */}
        <text
          x={center}
          y={center + size * 0.185}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.058}
          fontWeight="bold"
          fontFamily="'Times New Roman', Times, serif"
          letterSpacing={size * 0.008}
        >
          ★ EXPORT ★
        </text>

        {/* === НИЖНЯЯ НАДПИСЬ ПО ДУГЕ === */}
        <text
          fill={color}
          fontSize={size * 0.072}
          fontWeight="bold"
          fontFamily="'Times New Roman', Times, serif"
          letterSpacing={size * 0.006}
        >
          <textPath
            href="#bottomArc"
            startOffset="50%"
            textAnchor="middle"
          >
            {city} · ИНН {inn}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

// === КОМПОНЕНТ С ПОДПИСЬЮ И ПЕЧАТЬЮ === //
// Для использования в контракте
export function SignatureBlock({
  showStamp = true,
  stampSize = 180,
  stampRotation = -8,
}) {
  const settings = useBusinessSettings();

  return (
    <div className="relative inline-block" style={{ minHeight: stampSize }}>
      {/* Подпись (SVG-роспись) */}
      <div className="relative z-10">
        <svg
          width="200"
          height="60"
          viewBox="0 0 200 60"
          style={{ display: "block" }}
        >
          <path
            d="M 15,40 Q 35,10 55,35 T 95,30 Q 115,12 135,35 T 180,25"
            stroke="#1e3a8a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div className="border-b-2 border-slate-700 w-64 -mt-3 mb-2"></div>
        <div className="text-sm font-bold text-slate-800">
          {settings.signatureName || "K. Semakin"}
        </div>
        <div className="text-xs text-slate-600">
          {settings.position || "Founder & Export Director"}
        </div>
        <div className="text-xs text-slate-600 mt-1">
          {settings.companyNameEn || "IE Semakin Konstantin"}
        </div>
      </div>

      {/* Печать поверх (со смещением и наклоном) */}
      {showStamp && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-20px",
            left: "160px",
          }}
        >
          <CompanyStamp size={stampSize} rotation={stampRotation} />
        </div>
      )}
    </div>
  );
}
// === АЛИАС ДЛЯ СОВМЕСТИМОСТИ ===
// Старое имя — чтобы не ломать существующий код в contract/page.js
export const SignatureWithStamp = SignatureBlock;