"use client";

import { useState } from "react";

/**
 * Universal Reminder component (defense against forgetting!)
 * 
 * Usage:
 *   <Reminder
 *     priority="critical"      // critical | high | medium | low
 *     icon="🚨"
 *     title="ЛесЕГАИС: запросить выписку"
 *     description="Без выписки = риск ст. 191.1 УК РФ"
 *     dismissKey="lesegais-2026-01"  // optional: для запоминания "скрыто"
 *     actionLabel="Понятно"           // optional
 *     onAction={() => {}}             // optional
 *   />
 */

const PRIORITY_STYLES = {
  critical: {
    bg: "bg-rose-50",
    border: "border-rose-500",
    title: "text-rose-900",
    text: "text-rose-800",
    button: "bg-rose-500 hover:bg-rose-600",
  },
  high: {
    bg: "bg-amber-50",
    border: "border-amber-500",
    title: "text-amber-900",
    text: "text-amber-800",
    button: "bg-amber-500 hover:bg-amber-600",
  },
  medium: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    title: "text-blue-900",
    text: "text-blue-800",
    button: "bg-blue-500 hover:bg-blue-600",
  },
  low: {
    bg: "bg-slate-50",
    border: "border-slate-400",
    title: "text-slate-900",
    text: "text-slate-700",
    button: "bg-slate-500 hover:bg-slate-600",
  },
};

export default function Reminder({
  priority = "medium",
  icon = "ℹ️",
  title,
  description,
  dismissKey,
  actionLabel,
  onAction,
  children,
}) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined" || !dismissKey) return false;
    return localStorage.getItem(`reminder-dismissed-${dismissKey}`) === "true";
  });

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined" && dismissKey) {
      localStorage.setItem(`reminder-dismissed-${dismissKey}`, "true");
    }
  };

  if (dismissed) return null;

  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;

  return (
    <div
      className={`${style.bg} border-l-4 ${style.border} rounded-r-lg p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden="true">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-bold text-sm ${style.title} mb-1`}>
              {title}
            </h3>
          )}
          {description && (
            <p className={`text-xs ${style.text} leading-relaxed`}>
              {description}
            </p>
          )}
          {children && <div className={`text-xs ${style.text} mt-2`}>{children}</div>}

          {(actionLabel || dismissKey) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {actionLabel && onAction && (
                <button
                  onClick={onAction}
                  className={`${style.button} text-white text-xs font-bold px-3 py-1.5 rounded active:scale-95 transition-all`}
                >
                  {actionLabel}
                </button>
              )}
              {dismissKey && (
                <button
                  onClick={handleDismiss}
                  className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 active:scale-95 transition-all"
                >
                  Скрыть
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}