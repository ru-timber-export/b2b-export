"use client";

import { useState } from "react";
import { GLOSSARY } from "../captain/contract/contractData";

/**
 * Tooltip Component
 * Показывает подсказку из глоссария при наведении/клике
 * 
 * Usage:
 *   <Tooltip term="CIF">CIF</Tooltip>
 *   <Tooltip term="ICAC Moscow">арбитраж в Москве</Tooltip>
 * 
 * На desktop — hover, на mobile — click
 */
export default function Tooltip({ term, children, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const glossaryItem = GLOSSARY[term];

  if (!glossaryItem) {
    // Если термина нет в глоссарии — просто показать текст без тултипа
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
    >
      {/* Подчёркнутый текст */}
      <span className="border-b-2 border-dotted border-orange-400 cursor-help font-semibold text-orange-700 hover:text-orange-900 transition-colors">
        {children}
        <sup className="ml-0.5 text-[10px] text-orange-500">ⓘ</sup>
      </span>

      {/* Всплывающая подсказка */}
      {isOpen && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 bg-slate-900 text-white text-xs rounded-lg shadow-2xl p-3 border border-orange-500/30 print:hidden">
          {/* Стрелка вниз */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></span>

          {/* Заголовок */}
          <div className="font-bold text-orange-400 mb-1 text-sm">
            📖 {term}
          </div>

          {/* Короткое описание */}
          <div className="text-cyan-300 font-semibold mb-2">
            {glossaryItem.short}
          </div>

          {/* Длинное описание */}
          <div className="text-slate-300 leading-relaxed">
            {glossaryItem.long}
          </div>

          {/* Подсказка для mobile */}
          <div className="mt-2 pt-2 border-t border-slate-700 text-[10px] text-slate-500 text-center">
            Tap anywhere to close · Нажми мимо чтобы закрыть
          </div>
        </span>
      )}
    </span>
  );
}

/**
 * GlossaryFooter — выводит весь глоссарий в подвале контракта
 * Полезно при печати — клиент видит расшифровку терминов
 */
export function GlossaryFooter() {
  return (
    <div className="mt-12 pt-8 border-t-4 border-orange-500">
      <h3 className="text-lg font-black text-slate-900 mb-4">
        📚 GLOSSARY OF TERMS / ГЛОССАРИЙ ТЕРМИНОВ
      </h3>
      <p className="text-xs text-slate-500 mb-4 italic">
        For convenience of both Parties / Для удобства обеих Сторон
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {Object.entries(GLOSSARY).map(([term, data]) => (
          <div key={term} className="border-l-4 border-orange-400 pl-3 py-1 bg-orange-50/40">
            <div className="font-bold text-slate-900">{term}</div>
            <div className="text-slate-700 italic">{data.short}</div>
            <div className="text-slate-600 mt-1 text-[11px] leading-relaxed">{data.long}</div>
          </div>
        ))}
      </div>
    </div>
  );
}