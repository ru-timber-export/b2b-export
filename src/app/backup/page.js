"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Все "ящики" с данными системы
const BACKUP_PREFIX = "ru-timber";
const LAST_BACKUP_KEY = "ru-timber-last-backup-date";

export default function BackupPage() {
  const [lastBackup, setLastBackup] = useState(null);
  const [dataSize, setDataSize] = useState(0);
  const [keysFound, setKeysFound] = useState([]);
  const [restoreStatus, setRestoreStatus] = useState(null);

  useEffect(() => {
    refreshInfo();
  }, []);

  const refreshInfo = () => {
    try {
      const saved = localStorage.getItem(LAST_BACKUP_KEY);
      setLastBackup(saved || null);

      const keys = [];
      let size = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(BACKUP_PREFIX) && key !== LAST_BACKUP_KEY) {
          keys.push(key);
          size += (localStorage.getItem(key) || "").length;
        }
      }
      setKeysFound(keys);
      setDataSize(size);
    } catch (e) {
      console.error("Read failed:", e);
    }
  };

  const daysSinceBackup = lastBackup
    ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // ═══════════ СКАЧАТЬ БЭКАП ═══════════
  const downloadBackup = () => {
    try {
      const backup = {
        _meta: {
          app: "RU-TIMBER Export System",
          version: 1,
          createdAt: new Date().toISOString(),
        },
        data: {},
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(BACKUP_PREFIX) && key !== LAST_BACKUP_KEY) {
          backup.data[key] = localStorage.getItem(key);
        }
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `ru-timber-backup-${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);

      const now = new Date().toISOString();
      localStorage.setItem(LAST_BACKUP_KEY, now);
      setLastBackup(now);
    } catch (e) {
      alert("Ошибка при создании бэкапа: " + e.message);
    }
  };

  // ═══════════ ВОССТАНОВИТЬ ═══════════
  const handleRestore = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.data || !backup._meta || backup._meta.app !== "RU-TIMBER Export System") {
          setRestoreStatus({ ok: false, msg: "Это не файл бэкапа RU-TIMBER. Проверь, что выбрал правильный файл." });
          return;
        }

        const count = Object.keys(backup.data).length;
        const backupDate = new Date(backup._meta.createdAt).toLocaleString("ru-RU");

        if (!confirm(
          `⚠️ ВНИМАНИЕ!\n\nБэкап от: ${backupDate}\nРазделов данных: ${count}\n\n` +
          `Текущие данные в системе будут ПОЛНОСТЬЮ ЗАМЕНЕНЫ данными из файла.\n\nПродолжить?`
        )) {
          setRestoreStatus({ ok: false, msg: "Восстановление отменено." });
          return;
        }

        Object.entries(backup.data).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });

        setRestoreStatus({ ok: true, msg: `✅ Восстановлено ${count} разделов из бэкапа от ${backupDate}. Сейчас страница перезагрузится...` });
        setTimeout(() => window.location.reload(), 2500);
      } catch (err) {
        setRestoreStatus({ ok: false, msg: "Файл повреждён или имеет неверный формат: " + err.message });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const KEY_LABELS = {
    "ru-timber-deal": "📋 Текущая сделка + корзина квотаций",
    "ru-timber-custom-routes": "🚢 Кастомные маршруты",
    "ru-timber-species-prices": "🌲 Цены пород (твои правки)",
    "ru-timber-price-history": "📈 История изменения цен",
    "ru-timber-suppliers": "🏭 Поставщики",
    "ru-timber-pricing-costs-v2": "💰 Настройки расходов",
    "ru-timber-cashflow-settings": "💵 Настройки cashflow",
    "ru-timber-custom-freight": "✏️ Override фрахта",
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/calculator/pricing" className="text-sm">← Pricing</Link>
          <div className="text-xs font-mono">💾 BACKUP & RESTORE</div>
          <Link href="/calculator" className="text-sm">Calculator →</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">💾 Backup & Restore</h1>
          <p className="text-sm text-slate-500 mt-1">
            Все данные системы живут в памяти браузера. Очистил кэш — потерял всё.
            Скачивай бэкап минимум раз в неделю.
          </p>
        </div>

        {/* Статус последнего бэкапа */}
        <div className={`rounded-xl p-5 border-2 ${
          daysSinceBackup === null ? "bg-rose-50 border-rose-300" :
          daysSinceBackup > 7 ? "bg-amber-50 border-amber-300" :
          "bg-emerald-50 border-emerald-300"
        }`}>
          <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Последний бэкап</div>
          <div className="text-xl font-black">
            {daysSinceBackup === null && "❌ Ещё ни разу не делался!"}
            {daysSinceBackup === 0 && "✅ Сегодня"}
            {daysSinceBackup > 0 && `${daysSinceBackup > 7 ? "⚠️" : "✅"} ${daysSinceBackup} дн. назад`}
          </div>
          {lastBackup && (
            <div className="text-xs text-slate-500 mt-1">{new Date(lastBackup).toLocaleString("ru-RU")}</div>
          )}
        </div>

        {/* СКАЧАТЬ */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-2">⬇️ Скачать бэкап</h2>
          <p className="text-xs text-slate-500 mb-3">
            Файл сохранится в «Загрузки». Храни копии в облаке (iCloud / Google Drive).
          </p>
          <div className="bg-slate-50 rounded-lg p-3 mb-4 text-xs space-y-1">
            <div className="font-bold text-slate-600 mb-2">Что попадёт в бэкап ({keysFound.length} разделов, ~{(dataSize / 1024).toFixed(1)} KB):</div>
            {keysFound.map(key => (
              <div key={key} className="text-slate-600">• {KEY_LABELS[key] || key}</div>
            ))}
            {keysFound.length === 0 && <div className="text-rose-500">Данных пока нет</div>}
          </div>
          <button onClick={downloadBackup}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-lg text-lg active:scale-95">
            💾 СКАЧАТЬ БЭКАП
          </button>
        </section>

        {/* ВОССТАНОВИТЬ */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-2">⬆️ Восстановить из файла</h2>
          <p className="text-xs text-slate-500 mb-3">
            ⚠️ Текущие данные будут заменены данными из файла. Система спросит подтверждение.
          </p>
          <label className="block w-full bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-400 text-slate-700 font-bold py-6 rounded-lg text-center cursor-pointer active:scale-95">
            📂 Выбрать файл бэкапа (.json)
            <input type="file" accept=".json,application/json" onChange={handleRestore} className="hidden" />
          </label>
          {restoreStatus && (
            <div className={`mt-3 p-3 rounded-lg text-sm font-bold ${
              restoreStatus.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-300" : "bg-rose-50 text-rose-700 border border-rose-300"
            }`}>
              {restoreStatus.msg}
            </div>
          )}
        </section>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-xs text-blue-800">
          💡 <strong>Совет Капитану:</strong> делай бэкап после каждого обновления цен и каждой
          новой квотации. Файл можно переслать самому себе в WhatsApp — будет копия и на телефоне.
        </div>

        <div className="text-center text-xs text-slate-400">
          Powered by RU-TIMBER · +7 915 349 00 07
        </div>
      </div>
    </main>
  );
}