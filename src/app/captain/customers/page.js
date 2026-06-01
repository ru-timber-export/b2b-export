"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CaptainGate from "../CaptainGate";

const STORAGE_KEY = "ru-timber-customers";

// Шаблон нового клиента
const EMPTY_CUSTOMER = {
  id: "",
  // Базовое
  companyName: "",
  contactPerson: "",
  position: "",
  country: "",
  city: "",
  // Контакты
  phone: "",
  whatsapp: "",
  email: "",
  telegram: "",
  website: "",
  // Бизнес
  status: "lead",          // lead | negotiation | active | won | lost
  temperature: "cold",     // hot | warm | cold
  source: "",              // откуда узнал (Dubai WoodShow, Instagram, etc)
  interest: "",            // что интересует (Pine 50x150, Birch, Plywood)
  expectedVolume: "",      // 1 контейнер / 5 контейнеров в месяц
  budget: "",              // примерный бюджет
  // Заметки
  notes: "",
  // Мета
  createdAt: "",
  updatedAt: "",
  lastContact: "",
};

const STATUSES = [
  { value: "lead", label: "🆕 Lead", color: "bg-blue-100 text-blue-800" },
  { value: "negotiation", label: "💬 Negotiation", color: "bg-amber-100 text-amber-800" },
  { value: "active", label: "🤝 Active", color: "bg-emerald-100 text-emerald-800" },
  { value: "won", label: "✅ Won", color: "bg-emerald-500 text-white" },
  { value: "lost", label: "❌ Lost", color: "bg-slate-200 text-slate-600" },
];

const TEMPERATURES = [
  { value: "hot", label: "🔥 Hot", color: "bg-rose-500 text-white" },
  { value: "warm", label: "🟡 Warm", color: "bg-amber-400 text-amber-900" },
  { value: "cold", label: "🧊 Cold", color: "bg-blue-200 text-blue-900" },
];

const COUNTRIES = [
  "🇦🇪 UAE", "🇸🇦 Saudi Arabia", "🇪🇬 Egypt", "🇮🇳 India", "🇨🇳 China",
  "🇹🇷 Turkey", "🇮🇷 Iran", "🇶🇦 Qatar", "🇰🇼 Kuwait", "🇴🇲 Oman",
  "🇯🇴 Jordan", "🇮🇶 Iraq", "🇱🇧 Lebanon", "🇸🇾 Syria", "🇾🇪 Yemen",
  "🇲🇦 Morocco", "🇩🇿 Algeria", "🇹🇳 Tunisia", "🇱🇾 Libya", "🇸🇩 Sudan",
  "🇦🇫 Afghanistan", "🇵🇰 Pakistan", "🇧🇩 Bangladesh", "🇲🇾 Malaysia", "🇮🇩 Indonesia",
  "🇷🇺 Russia", "🇰🇿 Kazakhstan", "🇰🇬 Kyrgyzstan", "🇺🇿 Uzbekistan", "🇦🇿 Azerbaijan",
  "🇦🇲 Armenia", "🇬🇪 Georgia", "🇧🇾 Belarus", "🌍 Other",
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editing, setEditing] = useState(null); // null | "new" | customer.id
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTemp, setFilterTemp] = useState("all");

  // Загрузка
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCustomers(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load customers:", e);
    }
    setIsLoaded(true);
  }, []);

  // Сохранение
  const saveToStorage = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  // CRUD
  const addCustomer = (customer) => {
    const newCustomer = {
      ...customer,
      id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    saveToStorage(updated);
    setEditing(null);
  };

  const updateCustomer = (id, updates) => {
    const updated = customers.map(c =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );
    setCustomers(updated);
    saveToStorage(updated);
    setEditing(null);
  };

  const deleteCustomer = (id) => {
    if (!confirm("Удалить клиента? Это действие нельзя отменить.")) return;
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    saveToStorage(updated);
  };

  // Экспорт
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(customers, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ru-timber-customers-${new Date().toISOString().split("T")[0]}.json`;
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
        if (Array.isArray(parsed)) {
          setCustomers(parsed);
          saveToStorage(parsed);
          alert("✅ Клиенты импортированы!");
        }
      } catch (err) {
        alert("❌ Ошибка чтения файла");
      }
    };
    reader.readAsText(file);
  };

  // Фильтрация
  const filtered = customers.filter(c => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterTemp !== "all" && c.temperature !== filterTemp) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = `${c.companyName} ${c.contactPerson} ${c.country} ${c.city} ${c.email} ${c.phone} ${c.notes}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  // Статистика
  const stats = {
    total: customers.length,
    leads: customers.filter(c => c.status === "lead").length,
    negotiation: customers.filter(c => c.status === "negotiation").length,
    active: customers.filter(c => c.status === "active").length,
    won: customers.filter(c => c.status === "won").length,
    hot: customers.filter(c => c.temperature === "hot").length,
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <CaptainGate>
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/captain" className="text-sm">← Captain</Link>
          <div className="text-xs font-mono">👥 CRM</div>
          <button
            onClick={() => setEditing("new")}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95"
          >
            + New Customer
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-5">
        {/* Title + Stats */}
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-white rounded-xl p-5 shadow-lg">
          <h1 className="text-2xl font-black">👥 Customers CRM</h1>
          <p className="text-sm opacity-90 mt-1">
            Твоя база клиентов: лиды, переговоры, активные сделки.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
            <Stat label="Total" value={stats.total} />
            <Stat label="🆕 Leads" value={stats.leads} />
            <Stat label="💬 Talk" value={stats.negotiation} />
            <Stat label="🤝 Active" value={stats.active} />
            <Stat label="✅ Won" value={stats.won} />
            <Stat label="🔥 Hot" value={stats.hot} highlight />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={exportJSON}
              className="bg-white/10 hover:bg-white/20 text-xs px-3 py-2 rounded-lg active:scale-95"
            >
              📥 Export
            </button>
            <label className="bg-white/10 hover:bg-white/20 text-xs px-3 py-2 rounded-lg active:scale-95 cursor-pointer">
              📤 Import
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search: company, name, country, email..."
            className="w-full p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none"
          />
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs p-1.5 border-2 border-slate-300 rounded-lg focus:border-purple-500 outline-none"
            >
              <option value="all">All statuses</option>
              {STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            
            <select
              value={filterTemp}
              onChange={(e) => setFilterTemp(e.target.value)}
              className="text-xs p-1.5 border-2 border-slate-300 rounded-lg focus:border-purple-500 outline-none"
            >
              <option value="all">All temperatures</option>
              {TEMPERATURES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {(filterStatus !== "all" || filterTemp !== "all" || search) && (
              <button
                onClick={() => { setFilterStatus("all"); setFilterTemp("all"); setSearch(""); }}
                className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                ✕ Clear filters
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500">
            Showing {filtered.length} of {customers.length}
          </div>
        </div>

        {/* Form (new or edit) */}
        {editing && (
          <CustomerForm
            customer={editing === "new" ? EMPTY_CUSTOMER : customers.find(c => c.id === editing)}
            onSave={(data) => {
              if (editing === "new") addCustomer(data);
              else updateCustomer(editing, data);
            }}
            onCancel={() => setEditing(null)}
            isNew={editing === "new"}
          />
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-3">👥</div>
            <div className="font-bold text-slate-700 text-lg">
              {customers.length === 0 ? "Пока нет клиентов" : "Никого не найдено"}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {customers.length === 0
                ? "Добавь первого клиента — нажми + New Customer вверху"
                : "Попробуй изменить фильтры"}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(c => (
              <CustomerCard
                key={c.id}
                customer={c}
                onEdit={() => setEditing(c.id)}
                onDelete={() => deleteCustomer(c.id)}
              />
            ))}
          </div>
        )}

        <div className="text-center text-xs text-slate-400 pt-4">
          💾 Все данные хранятся локально в браузере · Регулярно делай Export!
        </div>
      </div>
    </main>
    </CaptainGate>
  );
}

// ============ COMPONENTS ============

function Stat({ label, value, highlight }) {
  return (
    <div className={`rounded-lg p-2 text-center ${highlight ? "bg-amber-400 text-amber-900" : "bg-white/10"}`}>
      <div className="text-[10px] opacity-75 uppercase tracking-wider">{label}</div>
      <div className="text-xl font-black mt-0.5">{value}</div>
    </div>
  );
}

function CustomerCard({ customer, onEdit, onDelete }) {
  const status = STATUSES.find(s => s.value === customer.status) || STATUSES[0];
  const temp = TEMPERATURES.find(t => t.value === customer.temperature) || TEMPERATURES[2];

  const cleanPhone = customer.whatsapp?.replace(/[^\d]/g, "") || customer.phone?.replace(/[^\d]/g, "");
  const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  const emailLink = customer.email ? `mailto:${customer.email}` : null;
  const phoneLink = customer.phone ? `tel:${customer.phone.replace(/[^\d+]/g, "")}` : null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-black text-slate-900 truncate">{customer.companyName || "Без названия"}</div>
          {customer.contactPerson && (
            <div className="text-xs text-slate-600">
              {customer.contactPerson}
              {customer.position && <span className="text-slate-400"> · {customer.position}</span>}
            </div>
          )}
          {customer.country && (
            <div className="text-xs text-slate-500 mt-0.5">{customer.country} {customer.city && `· ${customer.city}`}</div>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
            {status.label}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-center ${temp.color}`}>
            {temp.label}
          </span>
        </div>
      </div>

      {/* Interest */}
      {customer.interest && (
        <div className="bg-slate-50 rounded p-2 my-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Interest</div>
          <div className="text-xs text-slate-800 mt-0.5">{customer.interest}</div>
          {customer.expectedVolume && (
            <div className="text-[10px] text-slate-500 mt-0.5">Volume: {customer.expectedVolume}</div>
          )}
        </div>
      )}

      {/* Notes preview */}
      {customer.notes && (
        <div className="text-xs text-slate-600 italic line-clamp-2 my-2">
          📝 {customer.notes}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-1 mt-3">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded active:scale-95"
            title="WhatsApp"
          >
            💬 WA
          </a>
        )}
        {emailLink && (
          <a
            href={emailLink}
            className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded active:scale-95"
            title="Email"
          >
            📧 Email
          </a>
        )}
        {phoneLink && (
          <a
            href={phoneLink}
            className="bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded active:scale-95"
            title="Call"
          >
            📞 Call
          </a>
        )}
        {customer.telegram && (
          <a
            href={`https://t.me/${customer.telegram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded active:scale-95"
            title="Telegram"
          >
            ✈ TG
          </a>
        )}
        <div className="ml-auto flex gap-1">
          <button
            onClick={onEdit}
            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100"
          >
            ✏ Edit
          </button>
          <button
            onClick={onDelete}
            className="text-[10px] font-bold text-rose-600 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerForm({ customer, onSave, onCancel, isNew }) {
  const [form, setForm] = useState(customer);

  const update = (field, value) => setForm({ ...form, [field]: value });

  const handleSave = () => {
    if (!form.companyName?.trim()) {
      alert("Введи хотя бы название компании!");
      return;
    }
    onSave(form);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-purple-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-purple-900">
          {isNew ? "+ Новый клиент" : "✏ Редактирование"}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
      </div>

      <div className="space-y-4">
        {/* Базовое */}
        <FormSection title="🏢 Компания">
          <Input label="Название компании *" value={form.companyName} onChange={(v) => update("companyName", v)} placeholder="Al-Habib Trading LLC" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Контактное лицо" value={form.contactPerson} onChange={(v) => update("contactPerson", v)} placeholder="Mohammed Al-Hassan" />
            <Input label="Должность" value={form.position} onChange={(v) => update("position", v)} placeholder="Purchasing Manager" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select label="Страна" value={form.country} onChange={(v) => update("country", v)} options={["", ...COUNTRIES]} />
            <Input label="Город" value={form.city} onChange={(v) => update("city", v)} placeholder="Dubai" />
          </div>
        </FormSection>

        {/* Контакты */}
        <FormSection title="📞 Контакты">
          <div className="grid grid-cols-2 gap-2">
            <Input label="Телефон" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+971 50 123 4567" />
            <Input label="WhatsApp" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} placeholder="+971 50 123 4567" />
          </div>
          <Input label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="mohammed@alhabib.ae" type="email" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Telegram" value={form.telegram} onChange={(v) => update("telegram", v)} placeholder="@username" />
            <Input label="Сайт" value={form.website} onChange={(v) => update("website", v)} placeholder="alhabib.ae" />
          </div>
        </FormSection>

        {/* Статус */}
        <FormSection title="📊 Статус и температура">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Статус</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none"
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Температура</label>
              <select
                value={form.temperature}
                onChange={(e) => update("temperature", e.target.value)}
                className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none"
              >
                {TEMPERATURES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Input label="Источник" value={form.source} onChange={(v) => update("source", v)} placeholder="Dubai WoodShow, Instagram, рекомендация..." />
        </FormSection>

        {/* Бизнес */}
        <FormSection title="💼 Бизнес-интерес">
          <Input label="Что интересует" value={form.interest} onChange={(v) => update("interest", v)} placeholder="Pine 50x150x6000, KD 12%, GOST 8486-86" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Объём" value={form.expectedVolume} onChange={(v) => update("expectedVolume", v)} placeholder="2 × 40HC / месяц" />
            <Input label="Бюджет" value={form.budget} onChange={(v) => update("budget", v)} placeholder="до $50K за контейнер" />
          </div>
        </FormSection>

        {/* Заметки */}
        <FormSection title="📝 Заметки">
          <Textarea
            value={form.notes}
            onChange={(v) => update("notes", v)}
            placeholder="История переговоров, договорённости, важные детали..."
            rows={4}
          />
        </FormSection>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg active:scale-95"
          >
            💾 {isNew ? "Добавить клиента" : "Сохранить"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg active:scale-95"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 space-y-2">
      <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none"
      />
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none resize-none"
    />
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt || "—"}</option>
        ))}
      </select>
    </div>
  );
}

// END OF FILE