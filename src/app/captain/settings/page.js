"use client";
import Link from "next/link";
import { useState } from "react";
import { useBusinessSettings } from "../../context/BusinessContext";
import { CompanyStamp } from "../../components/CompanyStamp";

export default function BusinessSettingsPage() {
  const settings = useBusinessSettings();
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    settings.updateSettings({ [key]: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings.isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading business settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* NAV */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/captain" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">
              R
            </div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
            <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30 font-bold">
              ⚙️ SETTINGS
            </span>
          </Link>
          <div className="flex gap-3 text-sm">
            <Link href="/captain" className="text-slate-300 hover:text-orange-500">
              ← Captain
            </Link>
            {saved && (
              <span className="text-green-400 font-bold animate-pulse">
                ✅ Saved
              </span>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900">⚙️ Business Settings</h1>
          <p className="text-sm text-slate-600 mt-1">
            Реквизиты компании · автоподстановка в контракты, инвойсы, packing list
          </p>
        </div>

        {/* PREVIEW: STAMP */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 text-center">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            📜 Live Preview: Your Stamp
          </h2>
          <div className="flex justify-center">
            <CompanyStamp size={220} />
          </div>
          <p className="text-xs text-slate-500 mt-3 italic">
            ↑ Эта печать будет автоматически вставляться в контракты
          </p>
        </div>

        {/* === FORM SECTIONS === */}
        <div className="space-y-6">
          {/* 1. COMPANY */}
          <Section title="🏢 Компания">
            <Field
              label="Название компании (для печати)"
              value={settings.companyName}
              onChange={(v) => handleChange("companyName", v)}
              hint="Например: RU-TIMBER EXPORT"
            />
            <Field
              label="Тип организации (центр печати)"
              value={settings.companyType}
              onChange={(v) => handleChange("companyType", v)}
              hint="ИП / ООО / ЗАО"
            />
            <Field
              label="Полная организационная форма"
              value={settings.legalForm}
              onChange={(v) => handleChange("legalForm", v)}
              hint="Индивидуальный предприниматель"
            />
            <Field
              label="ИНН"
              value={settings.inn}
              onChange={(v) => handleChange("inn", v)}
              hint="Налоговый номер"
            />
            <Field
              label="ОГРН / ОГРНИП"
              value={settings.ogrn}
              onChange={(v) => handleChange("ogrn", v)}
              hint="Регистрационный номер"
            />
            <Field
              label="Город (на печати)"
              value={settings.city}
              onChange={(v) => handleChange("city", v)}
              hint="MOSCOW / SAINT PETERSBURG"
            />
            <Field
              label="Юридический адрес"
              value={settings.legalAddress}
              onChange={(v) => handleChange("legalAddress", v)}
              hint="Полный адрес для контрактов"
              wide
            />
          </Section>

          {/* 2. DIRECTOR */}
          <Section title="👔 Директор / Представитель">
            <Field
              label="ФИО директора"
              value={settings.director}
              onChange={(v) => handleChange("director", v)}
              hint="Иванов Иван Иванович"
            />
            <Field
              label="Должность"
              value={settings.directorPosition}
              onChange={(v) => handleChange("directorPosition", v)}
              hint="Индивидуальный предприниматель / Генеральный директор"
            />
          </Section>

          {/* 3. CONTACTS */}
          <Section title="📞 Контакты">
            <Field
              label="Email"
              value={settings.email}
              onChange={(v) => handleChange("email", v)}
              type="email"
              hint="info@ru-timber.com"
            />
            <Field
              label="Телефон"
              value={settings.phone}
              onChange={(v) => handleChange("phone", v)}
              hint="+7 (XXX) XXX-XX-XX"
            />
            <Field
              label="Сайт"
              value={settings.website}
              onChange={(v) => handleChange("website", v)}
              hint="ru-timber.com"
            />
          </Section>

          {/* 4. BANK */}
          <Section title="🏦 Банковские реквизиты (для контрактов)">
            <Field
              label="Название банка"
              value={settings.bankName}
              onChange={(v) => handleChange("bankName", v)}
              hint="Tinkoff Bank / Sberbank / VTB"
            />
            <Field
              label="SWIFT код"
              value={settings.bankSwift}
              onChange={(v) => handleChange("bankSwift", v)}
              hint="TICSRUMM / SABRRUMM"
            />
            <Field
              label="Счёт USD"
              value={settings.bankAccountUSD}
              onChange={(v) => handleChange("bankAccountUSD", v)}
              hint="40802840..."
            />
            <Field
              label="Счёт RUB"
              value={settings.bankAccountRUB}
              onChange={(v) => handleChange("bankAccountRUB", v)}
              hint="40802810..."
            />
            <Field
              label="Банк-корреспондент"
              value={settings.correspondentBank}
              onChange={(v) => handleChange("correspondentBank", v)}
              hint="JPMorgan Chase Bank N.A., New York"
              wide
            />
          </Section>

          {/* 5. RESET */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <h3 className="font-bold text-rose-900 mb-2">⚠️ Опасная зона</h3>
            <p className="text-xs text-rose-700 mb-3">
              Сброс всех настроек к значениям по умолчанию. Это действие нельзя отменить.
            </p>
            <button
              onClick={() => {
                if (confirm("Точно сбросить все настройки?")) {
                  settings.resetSettings();
                  alert("Настройки сброшены");
                  window.location.reload();
                }
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold px-4 py-2 rounded-lg active:scale-95"
            >
              🗑 Сбросить настройки
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 bg-slate-900 text-white rounded-xl p-6 text-center">
          <h3 className="text-lg font-black mb-2">💡 Как это работает?</h3>
          <p className="text-sm text-slate-300 mb-4">
            Данные сохраняются автоматически при изменении.
            Используются в /captain/contract, /calculator/invoice, /captain/packing-list.
          </p>
          <Link
            href="/captain/contract"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold active:scale-95"
          >
            📜 Открыть контракт
          </Link>
        </div>
      </div>
    </div>
  );
}

// === COMPONENTS ===
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-200">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, hint, type = "text", wide = false }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        placeholder={hint}
      />
      {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
    </div>
  );
}