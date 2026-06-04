"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  useBusinessSettings,
  CURRENCIES,
  TAX_SYSTEMS,
  INCOTERMS,
} from "../../context/BusinessContext";

export default function BusinessSettingsPage() {
  const settings = useBusinessSettings();
  const [saved, setSaved] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (key, value) => {
    settings.updateSettings({ [key]: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      await settings.importJSON(file);
      alert("✅ Настройки успешно импортированы!");
    } catch (err) {
      setImportError("Ошибка импорта: проверь формат файла");
    }
    e.target.value = "";
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
            <span className="text-slate-300 hover:text-orange-500 text-sm">
              ← Captain
            </span>
          </Link>
          <span className="font-bold text-sm">⚙️ SETTINGS</span>
          {saved && (
            <span className="text-green-400 font-bold animate-pulse text-sm">
              ✅ Saved
            </span>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* HEADER + PROGRESS */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-xl p-6 mb-6 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            ⚙️ Business Settings
          </h1>
          <p className="text-sm text-emerald-100 mb-4">
            Настройки бизнеса. Заполняешь один раз — подставляются везде:
            Quotation, Contract, PDF, Email.
          </p>

          {/* Progress bar */}
          <div className="flex items-center justify-between text-sm font-bold mb-2">
            <span>Заполнено</span>
            <span>
              {settings.filledCount} / {settings.totalCount} ({settings.progress}%)
            </span>
          </div>
          <div className="w-full bg-emerald-900/40 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${settings.progress}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={settings.exportJSON}
              className="bg-emerald-900/50 hover:bg-emerald-900/70 text-white text-xs font-bold px-3 py-2 rounded-lg active:scale-95"
            >
              📤 Export JSON
            </button>
            <button
              onClick={handleImportClick}
              className="bg-emerald-900/50 hover:bg-emerald-900/70 text-white text-xs font-bold px-3 py-2 rounded-lg active:scale-95"
            >
              📥 Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => {
                if (confirm("Сбросить ВСЕ настройки к дефолтным?")) {
                  settings.resetSettings();
                  alert("Сброшено");
                  window.location.reload();
                }
              }}
              className="bg-red-900/50 hover:bg-red-900/70 text-white text-xs font-bold px-3 py-2 rounded-lg active:scale-95 ml-auto"
            >
              🔄 Reset All
            </button>
          </div>

          {importError && (
            <div className="mt-3 text-red-200 text-xs">{importError}</div>
          )}
        </div>

        {/* === SECTIONS === */}
        <div className="space-y-5">
          {/* 1. PERSONAL */}
          <Section title="👤 Личные данные">
            <Field
              label="Полное ФИО"
              required
              value={settings.fullName}
              onChange={(v) => handleChange("fullName", v)}
              hint="Семакин Иван Иванович"
              wide
            />
            <Field
              label="Должность"
              value={settings.position}
              onChange={(v) => handleChange("position", v)}
              hint="Founder & Export Director"
            />
            <Field
              label="Имя для подписи в PDF"
              value={settings.signatureName}
              onChange={(v) => handleChange("signatureName", v)}
              hint="Как будешь подписываться в Quotation и Contract (например, K. Semakin)"
            />
          </Section>

          {/* 2. COMPANY */}
          <Section title="🏢 Реквизиты ИП">
            <Field
              label="Название (RU)"
              required
              value={settings.companyName}
              onChange={(v) => handleChange("companyName", v)}
              hint="ИП Семакин Константин Фёдорович"
              wide
            />
            <Field
              label="Название (EN)"
              value={settings.companyNameEn}
              onChange={(v) => handleChange("companyNameEn", v)}
              hint="Для иностранных контрактов и инвойсов · IE Semakin Konstantin"
              wide
            />
            <Field
              label="ИНН"
              required
              value={settings.inn}
              onChange={(v) => handleChange("inn", v)}
              hint="12 цифр"
            />
            <Field
              label="ОГРНИП"
              value={settings.ogrnip}
              onChange={(v) => handleChange("ogrnip", v)}
              hint="15 цифр"
            />
            <SelectField
              label="Система налогообложения"
              value={settings.taxSystem}
              onChange={(v) => handleChange("taxSystem", v)}
              options={TAX_SYSTEMS.map((t) => ({ value: t.code, label: t.label }))}
              wide
            />
            <Field
              label="Юридический адрес"
              value={settings.legalAddress}
              onChange={(v) => handleChange("legalAddress", v)}
              wide
            />
          </Section>

          {/* 3. BANK */}
          <Section
            title="🏦 Банковские реквизиты (для ВЭД)"
            hint="💡 Совет: для экспорта нужен валютный счёт в USD. Лучшие банки для ВЭД ИП: Альфа-Банк, Точка, Тинькофф Бизнес, Райффайзен."
          >
            <Field
              label="Название банка (RU)"
              value={settings.bankName}
              onChange={(v) => handleChange("bankName", v)}
            />
            <Field
              label="Название банка (EN)"
              value={settings.bankNameEn}
              onChange={(v) => handleChange("bankNameEn", v)}
              hint="Для SWIFT-переводов"
            />
            <Field
              label="БИК"
              value={settings.bankBIK}
              onChange={(v) => handleChange("bankBIK", v)}
            />
            <Field
              label="SWIFT"
              value={settings.bankSWIFT}
              onChange={(v) => handleChange("bankSWIFT", v)}
            />
            <Field
              label="Расчётный счёт (RUB)"
              value={settings.bankAccountRUB}
              onChange={(v) => handleChange("bankAccountRUB", v)}
              hint="20 цифр"
            />
            <Field
              label="Валютный счёт (USD)"
              value={settings.bankAccountUSD}
              onChange={(v) => handleChange("bankAccountUSD", v)}
              hint="20 цифр — для приёма USD от иностранных клиентов"
            />
            <Field
              label="Корреспондентский счёт"
              value={settings.bankCorrAccount}
              onChange={(v) => handleChange("bankCorrAccount", v)}
            />
            <Field
              label="Банк-корреспондент USD (intermediary)"
              value={settings.bankCorrespondentUSD}
              onChange={(v) => handleChange("bankCorrespondentUSD", v)}
              hint="Иностранный банк через который идут USD-платежи"
            />
          </Section>

          {/* 4. CONTACTS */}
          <Section title="📞 Контакты">
            <Field
              label="Телефон"
              value={settings.phone}
              onChange={(v) => handleChange("phone", v)}
            />
            <Field
              label="WhatsApp"
              value={settings.whatsapp}
              onChange={(v) => handleChange("whatsapp", v)}
            />
            <Field
              label="Email"
              type="email"
              value={settings.email}
              onChange={(v) => handleChange("email", v)}
            />
            <Field
              label="Telegram"
              value={settings.telegram}
              onChange={(v) => handleChange("telegram", v)}
              hint="@rutimber"
            />
            <Field
              label="Сайт"
              value={settings.website}
              onChange={(v) => handleChange("website", v)}
              hint="ru-timber.com"
              wide
            />
          </Section>

          {/* 5. ADDRESSES */}
          <Section title="📍 Адреса">
            <Field
              label="Адрес офиса"
              value={settings.officeAddress}
              onChange={(v) => handleChange("officeAddress", v)}
              wide
            />
            <Field
              label="Адрес склада (RU)"
              value={settings.warehouseAddress}
              onChange={(v) => handleChange("warehouseAddress", v)}
            />
            <Field
              label="Адрес склада (EN)"
              value={settings.warehouseAddressEn}
              onChange={(v) => handleChange("warehouseAddressEn", v)}
              hint="Для иностранных контрактов"
            />
          </Section>

          {/* 6. LOGISTICS */}
          <Section title="⚓ Логистика по умолчанию">
            <Field
              label="Порт отгрузки"
              value={settings.defaultPort}
              onChange={(v) => handleChange("defaultPort", v)}
              hint="Основной порт. Можно изменить в каждой сделке"
              wide
            />
            <Field
              label="Судоходная линия по умолчанию"
              value={settings.defaultLine}
              onChange={(v) => handleChange("defaultLine", v)}
              wide
            />
            <Field
              label="Транзитное время (дней)"
              type="number"
              value={settings.defaultTransitDays}
              onChange={(v) =>
                handleChange("defaultTransitDays", parseInt(v) || 0)
              }
            />
            <SelectField
              label="Базис поставки"
              value={settings.defaultIncoterm}
              onChange={(v) => handleChange("defaultIncoterm", v)}
              options={INCOTERMS.map((i) => ({ value: i.code, label: i.label }))}
            />
          </Section>

          {/* 7. FINANCE */}
          <Section title="💰 Финансы">
            <SelectField
              label="Валюта по умолчанию"
              value={settings.defaultCurrency}
              onChange={(v) => handleChange("defaultCurrency", v)}
              options={CURRENCIES.map((c) => ({
                value: c.code,
                label: `${c.flag} ${c.code} (${c.symbol}) — ${c.name}`,
              }))}
            />
            <Field
              label="Fallback курс USD/RUB"
              type="number"
              step="0.01"
              value={settings.fallbackRate}
              onChange={(v) =>
                handleChange("fallbackRate", parseFloat(v) || 0)
              }
              hint="Используется если ЦБ не отвечает"
            />
            <Field
              label="НДС (для экспорта)"
              type="number"
              value={settings.vatRate}
              onChange={(v) => handleChange("vatRate", parseFloat(v) || 0)}
              hint="Для экспорта пиломатериала НДС = 0%"
              wide
            />
            <Field
              label="Условия оплаты (EN)"
              value={settings.paymentTerms}
              onChange={(v) => handleChange("paymentTerms", v)}
              hint="Подставляется в Quotation и Contract"
              wide
            />
            <Field
              label="Условия оплаты (RU)"
              value={settings.paymentTermsRu}
              onChange={(v) => handleChange("paymentTermsRu", v)}
              wide
            />
          </Section>

          {/* 8. PREVIEW */}
          <Section title="📋 Preview — как это будет в Quotation">
            <div className="sm:col-span-2 bg-slate-900 text-white rounded-lg p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              <div className="text-yellow-400 font-bold mb-2">SELLER:</div>
              {settings.companyNameEn}
              {"\n"}
              {settings.warehouseAddressEn}
              {"\n"}
              TIN: {settings.inn}
              {"\n"}
              Phone: {settings.phone}
              {"\n"}
              Email: {settings.email}
              {"\n"}
              Website: {settings.website}
              {"\n\n"}
              <div className="text-yellow-400 font-bold mb-2">BANK DETAILS:</div>
              Bank: {settings.bankNameEn}
              {"\n"}
              SWIFT: {settings.bankSWIFT}
              {"\n"}
              Account USD: {settings.bankAccountUSD}
              {"\n"}
              Correspondent: {settings.bankCorrespondentUSD}
              {"\n\n"}
              <div className="text-yellow-400 font-bold mb-2">TERMS:</div>
              Delivery: {settings.defaultIncoterm} {settings.defaultPort}
              {"\n"}
              Payment: {settings.paymentTerms}
              {"\n"}
              Transit: {settings.defaultTransitDays} days
              {"\n\n"}
              Best regards,
              {"\n"}
              {settings.signatureName}
              {"\n"}
              {settings.position}
            </div>
          </Section>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center text-xs text-slate-500">
          💾 Автосохранение в браузере · Данные не передаются на сервер
        </div>
      </div>
    </div>
  );
}

// === COMPONENTS ===
function Section({ title, hint, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-base font-black text-slate-900 mb-2 pb-2 border-b border-slate-200">
        {title}
      </h2>
      {hint && (
        <p className="text-xs text-slate-500 mb-4 italic bg-blue-50 p-2 rounded">
          {hint}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  type = "text",
  step,
  wide = false,
  required = false,
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, wide = false, required }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}