"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// 🆕 Дефолтные значения (пустые)
const DEFAULT_SETTINGS = {
  // 👤 Личные
  fullName: "",
  position: "Founder & Export Director",
  signatureName: "K. Semakin",
  
  // 🏢 ИП
  companyName: "ИП Семакин Константин Константинович",
  companyNameEn: "IE Semakin Konstantin",
  inn: "",
  ogrnip: "",
  taxSystem: "USN-6",
  legalAddress: "",
  
  // 🏦 Банк (USD счёт)
  bankName: "",
  bankNameEn: "",
  bankBIK: "",
  bankAccountRUB: "",
  bankAccountUSD: "",
  bankCorrAccount: "",
  bankSWIFT: "",
  bankCorrespondentUSD: "",  // банк-корреспондент в США
  
  // 📞 Контакты
  phone: "+7 915 349 00 07",
  whatsapp: "+7 915 349 00 07",
  email: "ksemakin@icloud.com",
  telegram: "",
  website: "ru-timber.com",
  
  // 📍 Адреса
  officeAddress: "",
  warehouseAddress: "Вологодская обл., г. Вологда",
  warehouseAddressEn: "Vologda region, Vologda, Russia",
  
  // ⚓ Логистика
  defaultPort: "Novorossiysk (NVS)",
  defaultLine: "",
  defaultTransitDays: 28,
  defaultIncoterm: "CIF",
  
  // 💰 Финансы
  defaultCurrency: "USD",
  fallbackRate: 76.25,
  vatRate: 0,
  paymentTerms: "30% advance + 70% against B/L copy",
  paymentTermsRu: "30% предоплата + 70% против копии коносамента",
};

const STORAGE_KEY = "ru-timber-business-settings";

// Компонент поля ввода
const Field = ({ label, value, onChange, type = "text", placeholder, hint, required }) => (
  <div>
    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={2}
        className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-emerald-500 outline-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={(e) => e.target.select()}
        className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-emerald-500 outline-none"
      />
    )}
    {hint && <div className="text-[10px] text-slate-400 mt-1">{hint}</div>}
  </div>
);

// Компонент секции
const Section = ({ icon, title, children }) => (
  <section className="bg-white rounded-xl p-5 shadow-sm">
    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export default function BusinessSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "" | "saving" | "saved"

  // Загрузка из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    setIsLoaded(true);
  }, []);

  // Автосохранение при изменении
  const updateField = (field, value) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    setSaveStatus("saving");
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setTimeout(() => setSaveStatus("saved"), 300);
      setTimeout(() => setSaveStatus(""), 1500);
    } catch (e) {
      console.error("Save failed:", e);
      setSaveStatus("");
    }
  };

  const resetAll = () => {
    if (confirm("Сбросить ВСЕ настройки? Это действие нельзя отменить.")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportJSON = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ru-timber-settings-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, ...parsed }));
        alert("✅ Настройки импортированы!");
      } catch (err) {
        alert("❌ Ошибка чтения файла");
      }
    };
    reader.readAsText(file);
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  // Подсчёт заполненности
  const totalFields = Object.keys(DEFAULT_SETTINGS).length;
  const filledFields = Object.values(settings).filter(v => v !== "" && v !== null && v !== undefined).length;
  const fillPercent = Math.round((filledFields / totalFields) * 100);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/captain" className="text-sm">← Captain</Link>
          <div className="text-xs font-mono">⚙ SETTINGS</div>
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && <span className="text-xs text-amber-400">💾 Saving...</span>}
            {saveStatus === "saved" && <span className="text-xs text-emerald-400">✅ Saved</span>}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-5">
        {/* Title + Progress */}
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-xl p-5 shadow-lg">
          <h1 className="text-2xl font-black">⚙ Business Settings</h1>
          <p className="text-sm opacity-90 mt-1">
            Настройки бизнеса. Заполняешь один раз — подставляются везде: Quotation, Contract, PDF, Email.
          </p>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="opacity-75">Заполнено</span>
              <span className="font-bold">{filledFields} / {totalFields} ({fillPercent}%)</span>
            </div>
            <div className="bg-emerald-950 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={exportJSON}
              className="bg-white/10 hover:bg-white/20 text-xs px-3 py-2 rounded-lg active:scale-95"
            >
              📥 Export JSON
            </button>
            <label className="bg-white/10 hover:bg-white/20 text-xs px-3 py-2 rounded-lg active:scale-95 cursor-pointer">
              📤 Import JSON
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>
            <button
              onClick={resetAll}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs px-3 py-2 rounded-lg active:scale-95 ml-auto"
            >
              🔄 Reset All
            </button>
          </div>
        </div>

        {/* 👤 БЛОК 1: Личные */}
        <Section icon="👤" title="Личные данные">
          <Field
            label="Полное ФИО"
            value={settings.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Семакин Константин Константинович"
            required
          />
          <Field
            label="Должность"
            value={settings.position}
            onChange={(e) => updateField("position", e.target.value)}
            placeholder="Founder & Export Director"
          />
          <Field
            label="Имя для подписи в PDF"
            value={settings.signatureName}
            onChange={(e) => updateField("signatureName", e.target.value)}
            placeholder="K. Semakin"
            hint="Как будешь подписываться в Quotation и Contract (например, K. Semakin)"
          />
        </Section>

        {/* 🏢 БЛОК 2: ИП */}
        <Section icon="🏢" title="Реквизиты ИП">
          <Field
            label="Название (RU)"
            value={settings.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="ИП Семакин Константин Константинович"
            required
          />
          <Field
            label="Название (EN)"
            value={settings.companyNameEn}
            onChange={(e) => updateField("companyNameEn", e.target.value)}
            placeholder="IE Semakin Konstantin"
            hint="Для иностранных контрактов и инвойсов"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="ИНН"
              value={settings.inn}
              onChange={(e) => updateField("inn", e.target.value)}
              placeholder="352501234567"
              required
            />
            <Field
              label="ОГРНИП"
              value={settings.ogrnip}
              onChange={(e) => updateField("ogrnip", e.target.value)}
              placeholder="318352500012345"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Система налогообложения</label>
            <select
              value={settings.taxSystem}
              onChange={(e) => updateField("taxSystem", e.target.value)}
              className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-emerald-500 outline-none"
            >
              <option value="USN-6">УСН 6% (доходы)</option>
              <option value="USN-15">УСН 15% (доходы-расходы)</option>
              <option value="PATENT">Патент (ПСН)</option>
              <option value="OSNO">ОСНО (общая)</option>
              <option value="NPD">НПД (самозанятый)</option>
            </select>
          </div>
          <Field
            label="Юридический адрес"
            value={settings.legalAddress}
            onChange={(e) => updateField("legalAddress", e.target.value)}
            placeholder="160000, г. Вологда, ул. Ленина, д. 1, кв. 1"
            type="textarea"
          />
        </Section>

        {/* 🏦 БЛОК 3: Банк */}
        <Section icon="🏦" title="Банковские реквизиты (для ВЭД)">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            💡 <strong>Совет:</strong> для экспорта нужен <strong>валютный счёт в USD</strong>. 
            Лучшие банки для ВЭД ИП: Альфа-Банк, Точка, Тинькофф Бизнес, Райффайзен.
          </div>
          
          <Field
            label="Название банка (RU)"
            value={settings.bankName}
            onChange={(e) => updateField("bankName", e.target.value)}
            placeholder="АО «Альфа-Банк»"
          />
          <Field
            label="Название банка (EN)"
            value={settings.bankNameEn}
            onChange={(e) => updateField("bankNameEn", e.target.value)}
            placeholder="ALFA-BANK JSC"
            hint="Для SWIFT-переводов"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="БИК"
              value={settings.bankBIK}
              onChange={(e) => updateField("bankBIK", e.target.value)}
              placeholder="044525593"
            />
            <Field
              label="SWIFT"
              value={settings.bankSWIFT}
              onChange={(e) => updateField("bankSWIFT", e.target.value)}
              placeholder="ALFARUMM"
            />
          </div>

          <Field
            label="Расчётный счёт (RUB)"
            value={settings.bankAccountRUB}
            onChange={(e) => updateField("bankAccountRUB", e.target.value)}
            placeholder="40802 810 1 0000 1234567"
            hint="20 цифр"
          />
          
          <Field
            label="Валютный счёт (USD)"
            value={settings.bankAccountUSD}
            onChange={(e) => updateField("bankAccountUSD", e.target.value)}
            placeholder="40802 840 5 0000 1234567"
            hint="20 цифр — для приёма USD от иностранных клиентов"
          />

          <Field
            label="Корреспондентский счёт"
            value={settings.bankCorrAccount}
            onChange={(e) => updateField("bankCorrAccount", e.target.value)}
            placeholder="30101 810 2 0000 0000593"
          />

          <Field
            label="Банк-корреспондент USD (intermediary)"
            value={settings.bankCorrespondentUSD}
            onChange={(e) => updateField("bankCorrespondentUSD", e.target.value)}
            placeholder="JPMORGAN CHASE BANK, N.A. (CHASUS33)"
            hint="Иностранный банк через который идут USD-платежи"
          />
        </Section>

        {/* 📞 БЛОК 4: Контакты */}
        <Section icon="📞" title="Контакты">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Телефон"
              value={settings.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+7 915 349 00 07"
            />
            <Field
              label="WhatsApp"
              value={settings.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              placeholder="+7 915 349 00 07"
            />
          </div>
          <Field
            label="Email"
            value={settings.email}
            onChange={(e) => updateField("email", e.target.value)}
            type="email"
            placeholder="ksemakin@icloud.com"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Telegram"
              value={settings.telegram}
              onChange={(e) => updateField("telegram", e.target.value)}
              placeholder="@ksemakin"
            />
            <Field
              label="Сайт"
              value={settings.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="ru-timber.com"
            />
          </div>
        </Section>

        {/* 📍 БЛОК 5: Адреса */}
        <Section icon="📍" title="Адреса">
          <Field
            label="Адрес офиса"
            value={settings.officeAddress}
            onChange={(e) => updateField("officeAddress", e.target.value)}
            placeholder="Можно совпадать с юридическим"
            type="textarea"
          />
          <Field
            label="Адрес склада (RU)"
            value={settings.warehouseAddress}
            onChange={(e) => updateField("warehouseAddress", e.target.value)}
            placeholder="Вологодская обл., г. Вологда, промзона"
            type="textarea"
          />
          <Field
            label="Адрес склада (EN)"
            value={settings.warehouseAddressEn}
            onChange={(e) => updateField("warehouseAddressEn", e.target.value)}
            placeholder="Vologda region, Vologda, industrial area, Russia"
            type="textarea"
            hint="Для иностранных контрактов"
          />
        </Section>

        {/* ⚓ БЛОК 6: Логистика */}
        <Section icon="⚓" title="Логистика по умолчанию">
          <Field
            label="Порт отгрузки"
            value={settings.defaultPort}
            onChange={(e) => updateField("defaultPort", e.target.value)}
            placeholder="Novorossiysk (NVS)"
            hint="Основной порт. Можно изменить в каждой сделке"
          />
          <Field
            label="Судоходная линия по умолчанию"
            value={settings.defaultLine}
            onChange={(e) => updateField("defaultLine", e.target.value)}
            placeholder="MSC, FESCO, ZIM..."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Транзитное время (дней)"
              value={settings.defaultTransitDays}
              onChange={(e) => updateField("defaultTransitDays", parseInt(e.target.value) || 0)}
              type="number"
              placeholder="28"
            />
            <div>
              <label className="text-xs font-semibold text-slate-700">Базис поставки</label>
              <select
                value={settings.defaultIncoterm}
                onChange={(e) => updateField("defaultIncoterm", e.target.value)}
                className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-emerald-500 outline-none"
              >
                <option value="EXW">EXW (самовывоз)</option>
                <option value="FCA">FCA (до фуры)</option>
                <option value="FOB">FOB (до судна)</option>
                <option value="CIF">CIF (с фрахтом+страховкой)</option>
                <option value="CFR">CFR (с фрахтом)</option>
                <option value="DAP">DAP (до места)</option>
              </select>
            </div>
          </div>
        </Section>

        {/* 💰 БЛОК 7: Финансы */}
        <Section icon="💰" title="Финансы">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Валюта по умолчанию</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => updateField("defaultCurrency", e.target.value)}
                className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-emerald-500 outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="RUB">RUB (₽)</option>
              </select>
            </div>
            <Field
              label="Fallback курс USD/RUB"
              value={settings.fallbackRate}
              onChange={(e) => updateField("fallbackRate", parseFloat(e.target.value) || 0)}
              type="number"
              placeholder="76.25"
              hint="Используется если ЦБ не отвечает"
            />
          </div>
          <Field
            label="НДС (для экспорта)"
            value={settings.vatRate}
            onChange={(e) => updateField("vatRate", parseFloat(e.target.value) || 0)}
            type="number"
            placeholder="0"
            hint="Для экспорта пиломатериала НДС = 0%"
          />
          <Field
            label="Условия оплаты (EN)"
            value={settings.paymentTerms}
            onChange={(e) => updateField("paymentTerms", e.target.value)}
            placeholder="30% advance + 70% against B/L copy"
            type="textarea"
            hint="Подставляется в Quotation и Contract"
          />
          <Field
            label="Условия оплаты (RU)"
            value={settings.paymentTermsRu}
            onChange={(e) => updateField("paymentTermsRu", e.target.value)}
            placeholder="30% предоплата + 70% против копии коносамента"
            type="textarea"
          />
        </Section>

        {/* Preview block */}
        <section className="bg-slate-900 text-white rounded-xl p-5 shadow-lg">
          <h2 className="font-bold mb-3">📋 Preview — как это будет в Quotation</h2>
          <div className="bg-slate-800 rounded-lg p-4 text-xs font-mono leading-relaxed">
            <div className="text-amber-400 font-bold mb-2">SELLER:</div>
            <div className="opacity-90">
              {settings.companyNameEn || "[Company Name EN]"}<br />
              {settings.warehouseAddressEn || "[Warehouse Address EN]"}<br />
              TIN: {settings.inn || "[INN]"}<br />
              Phone: {settings.phone}<br />
              Email: {settings.email}<br />
              Website: {settings.website}
            </div>
            
            <div className="text-amber-400 font-bold mt-4 mb-2">BANK DETAILS:</div>
            <div className="opacity-90">
              Bank: {settings.bankNameEn || "[Bank Name EN]"}<br />
              SWIFT: {settings.bankSWIFT || "[SWIFT]"}<br />
              Account USD: {settings.bankAccountUSD || "[USD Account]"}<br />
              Correspondent: {settings.bankCorrespondentUSD || "[Correspondent Bank]"}
            </div>
            
            <div className="text-amber-400 font-bold mt-4 mb-2">TERMS:</div>
            <div className="opacity-90">
              Delivery: {settings.defaultIncoterm} {settings.defaultPort}<br />
              Payment: {settings.paymentTerms}<br />
              Transit: {settings.defaultTransitDays} days
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-700 opacity-90">
              Best regards,<br />
              <span className="font-bold">{settings.signatureName || "[Signature Name]"}</span><br />
              {settings.position}
            </div>
          </div>
        </section>

        {/* Auto-save info */}
        <div className="text-center text-xs text-slate-400">
          💾 Автосохранение в браузере · Данные не передаются на сервер
        </div>
      </div>
    </main>
  );
}