"use client";

import { useState } from "react";
import Link from "next/link";

// Префикс всех данных приложения в браузере
const PREFIX = "ru-timber";

export default function BackupPage() {
  const [message, setMessage] = useState(null);

  // 💾 СКАЧАТЬ БЭКАП
  const downloadBackup = () => {
    try {
      const data = {};
      let count = 0;

      // Собираем все данные приложения
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX)) {
          data[key] = localStorage.getItem(key);
          count++;
        }
      }

      if (count === 0) {
        setMessage({ type: "error", text: "Данных для бэкапа не найдено. Поработай в калькуляторе и попробуй снова." });
        return;
      }

      const backup = {
        app: "RU-TIMBER",
        version: 1,
        createdAt: new Date().toISOString(),
        itemsCount: count,
        data,
      };

      // Создаём файл и скачиваем
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `ru-timber-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: `✅ Бэкап скачан! Сохранено разделов: ${count}. Файл в папке «Загрузки».` });
    } catch (e) {
      setMessage({ type: "error", text: "Не получилось скачать бэкап: " + e.message });
    }
  };

  // ♻️ ВОССТАНОВИТЬ ИЗ БЭКАПА
  const restoreBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        // Проверяем что это наш файл
        if (backup.app !== "RU-TIMBER" || !backup.data) {
          setMessage({ type: "error", text: "Это не файл бэкапа RU-TIMBER. Выбери правильный файл." });
          return;
        }

        const backupDate = backup.createdAt
          ? new Date(backup.createdAt).toLocaleDateString("ru-RU")
          : "неизвестно";

        const ok = confirm(
          `Восстановить данные из бэкапа от ${backupDate}?\n\n` +
          `⚠️ Текущие данные будут заменены данными из файла.`
        );
        if (!ok) return;

        let restored = 0;
        Object.entries(backup.data).forEach(([key, value]) => {
          if (key.startsWith(PREFIX) && typeof value === "string") {
            localStorage.setItem(key, value);
            restored++;
          }
        });

        setMessage({ type: "success", text: `✅ Восстановлено разделов: ${restored}. Сейчас страница перезагрузится...` });
        setTimeout(() => { window.location.href = "/"; }, 2000);
      } catch (err) {
        setMessage({ type: "error", text: "Файл повреждён или не читается: " + err.message });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm">← Home</Link>
          <div className="text-xs font-mono">💾 BACKUP</div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">💾 Бэкап данных</h1>
          <p className="text-sm text-slate-500 mt-2">
            Все твои цены, клиенты и расчёты хранятся в браузере на этом устройстве.
            Если почистить историю браузера — всё пропадёт. Скачивай бэкап раз в неделю!
          </p>
        </div>

        {message && (
          <div className={`rounded-xl p-4 text-sm font-bold border-2 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}>
            {message.text}
          </div>
        )}

        {/* СКАЧАТЬ */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-2">📥 Скачать копию</h2>
          <p className="text-xs text-slate-500 mb-4">
            Сохранит файл на компьютер: цены пород, поставщики, маршруты,
            настройки компании, текущие расчёты и корзину.
          </p>
          <button onClick={downloadBackup}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-lg text-lg active:scale-95">
            💾 Скачать бэкап
          </button>
        </section>

        {/* ВОССТАНОВИТЬ */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-2">📤 Восстановить из копии</h2>
          <p className="text-xs text-slate-500 mb-4">
            Выбери скачанный ранее файл <span className="font-mono">ru-timber-backup-*.json</span> —
            данные вернутся как были на момент бэкапа.
          </p>
          <label className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-lg text-lg text-center cursor-pointer active:scale-95">
            ♻️ Выбрать файл бэкапа
            <input type="file" accept=".json,application/json" onChange={restoreBackup} className="hidden" />
          </label>
        </section>

        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-xs text-amber-800">
          <div className="font-bold mb-1">💡 Советы:</div>
          <ul className="space-y-1">
            <li>• Скачивай бэкап <strong>раз в неделю</strong> и после крупных изменений цен</li>
            <li>• Храни файлы не только на компьютере — кидай себе в Telegram «Избранное»</li>
            <li>• Бэкап работает и для переезда на новый компьютер: скачал тут → восстановил там</li>
          </ul>
        </div>

        <div className="text-center text-xs text-slate-400">
          Powered by RU-TIMBER · +7 915 349 00 07
        </div>
      </div>
    </main>
  );
}