"use client";

/**
 * 🏛️ Cyber-Stamp Component
 * Имитация чернильной печати российского ИП/ООО
 * 
 * Usage:
 *   <CompanyStamp size={150} rotation={-12} smudge={true} />
 * 
 * Props:
 *   size — диаметр в px (default 180)
 *   rotation — угол поворота (default -8°)
 *   smudge — добавить эффект смаза (default true)
 *   color — 'blue' | 'red' (default 'blue')
 *   companyName — название компании
 *   inn — ИНН
 *   ogrn — ОГРН
 */
export default function CompanyStamp({
  size = 180,
  rotation = -8,
  smudge = true,
  color = "blue",
  companyName = "RU-TIMBER EXPORT",
  inn = "1234567890",
  ogrn = "1234567890123",
  city = "MOSCOW",
}) {
  const strokeColor = color === "blue" ? "#1e3a8a" : "#991b1b";
  const fillColor = color === "blue" ? "#1e3a8a" : "#991b1b";

  // Уникальный ID для фильтров (если несколько печатей на странице)
  const uniqueId = `stamp-${Math.random().toString(36).substring(7)}`;

  return (
    <div
      className="inline-block relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        opacity: smudge ? 0.78 : 0.92,
        filter: smudge ? "blur(0.4px) contrast(1.1)" : "none",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          {/* 🎨 Фильтр "смаз чернил" */}
          {smudge && (
            <filter id={`${uniqueId}-smudge`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                seed="3"
              />
              <feDisplacementMap in="SourceGraphic" scale="2" />
              <feGaussianBlur stdDeviation="0.3" />
            </filter>
          )}

          {/* 🌀 Путь для текста по кругу — ВЕРХ */}
          <path
            id={`${uniqueId}-circle-top`}
            d="M 100,100 m -75,0 a 75,75 0 1,1 150,0"
            fill="none"
          />

          {/* 🌀 Путь для текста по кругу — НИЗ */}
          <path
            id={`${uniqueId}-circle-bottom`}
            d="M 100,100 m -75,0 a 75,75 0 1,0 150,0"
            fill="none"
          />
        </defs>

        <g
          stroke={strokeColor}
          fill={fillColor}
          filter={smudge ? `url(#${uniqueId}-smudge)` : undefined}
        >
          {/* Внешний круг */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            strokeWidth="2.5"
          />

          {/* Внутренний круг */}
          <circle
            cx="100"
            cy="100"
            r="78"
            fill="none"
            strokeWidth="1.2"
          />

          {/* Текст по кругу — ВЕРХ (название компании) */}
          <text
            fontSize="11"
            fontWeight="bold"
            letterSpacing="2.5"
            fontFamily="Arial, sans-serif"
          >
            <textPath
              href={`#${uniqueId}-circle-top`}
              startOffset="50%"
              textAnchor="middle"
            >
              • {companyName} •
            </textPath>
          </text>

          {/* Текст по кругу — НИЗ (город + ИНН) */}
          <text
            fontSize="8"
            fontWeight="bold"
            letterSpacing="1.5"
            fontFamily="Arial, sans-serif"
          >
            <textPath
              href={`#${uniqueId}-circle-bottom`}
              startOffset="50%"
              textAnchor="middle"
            >
              {city} • ИНН {inn}
            </textPath>
          </text>

          {/* Центральная звезда (как на советских печатях) */}
          <g transform="translate(100, 75)">
            <polygon
              points="0,-12 3.5,-3.7 12,-3.7 5.5,2.3 8,11.5 0,6 -8,11.5 -5.5,2.3 -12,-3.7 -3.5,-3.7"
              strokeWidth="0.8"
            />
          </g>

          {/* Текст в центре */}
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            ИП
          </text>

          <text
            x="100"
            y="120"
            textAnchor="middle"
            fontSize="6.5"
            fontFamily="Arial, sans-serif"
            letterSpacing="0.5"
          >
            ОГРН {ogrn}
          </text>

          {/* Подпись внизу */}
          <text
            x="100"
            y="135"
            textAnchor="middle"
            fontSize="5.5"
            fontFamily="Arial, sans-serif"
            fontStyle="italic"
            opacity="0.7"
          >
            * EXPORT *
          </text>
        </g>

        {/* 💧 Декоративные кляксы для реалистичности */}
        {smudge && (
          <g fill={fillColor} opacity="0.25">
            <ellipse cx="155" cy="60" rx="3" ry="1.5" transform="rotate(35 155 60)" />
            <ellipse cx="42" cy="145" rx="2" ry="1" transform="rotate(-20 42 145)" />
            <circle cx="170" cy="130" r="1.2" />
            <circle cx="30" cy="80" r="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * 📝 SignatureLine — линия для подписи + штамп
 */
export function SignatureWithStamp({ name, role, companyName, inn, ogrn, city }) {
  return (
    <div className="inline-block relative">
      {/* Линия подписи */}
      <div className="border-b-2 border-slate-700 w-64 mb-2 h-12 relative">
        {/* Сигнатура (фейковая) */}
        <svg
          viewBox="0 0 200 50"
          className="absolute bottom-1 left-4 w-32 h-10 opacity-70"
          style={{ transform: "rotate(-3deg)" }}
        >
          <path
            d="M 10,30 Q 25,5 40,25 T 70,20 Q 90,35 110,15 T 150,25"
            stroke="#1e3a8a"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="text-xs font-bold">{name}</div>
      <div className="text-xs text-slate-600">{role}</div>

      {/* Печать накладывается на подпись */}
      <div className="absolute -right-12 -top-4 pointer-events-none print:opacity-90">
        <CompanyStamp
          size={130}
          rotation={-10}
          smudge={true}
          companyName={companyName}
          inn={inn}
          ogrn={ogrn}
          city={city}
        />
      </div>
    </div>
  );
}