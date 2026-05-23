"use client";

import { useState } from "react";
import Link from "next/link";
import { useDeal } from "../context/DealContext";

// 📋 17 пунктов готовности к экспорту — структурированы по группам
const CHECKLIST_GROUPS = [
  {
    id: "legal",
    title: "⚖️ Юридическая база",
    color: "blue",
    description: "Без этого ты вообще не можешь принимать платежи из-за рубежа",
    items: [
      {
        key: "ip_registered",
        title: "ИП с ВЭД-кодами зарегистрирован",
        priority: "critical",
        timeEstimate: "3 дня",
        cost: "800₽ госпошлина",
        howTo: `
          1. Подать заявление в ФНС онлайн (Госуслуги) или офлайн
          2. Указать ОКВЭД: 16.10 (распиловка древесины), 46.73 (оптовая торговля лесом), 46.90 (неспециализированная торговля)
          3. УСН 6% (доходы) — оптимально для экспорта
          4. После регистрации — заказать ЭЦП (электронная подпись) для ФТС
        `,
      },
      {
        key: "lawyer_consulted",
        title: "Юрист-международник проконсультирован",
        priority: "high",
        timeEstimate: "1-2 дня",
        cost: "5,000-10,000₽",
        howTo: `
          1. Найти юриста через РЭЦ (бесплатные консультации до 2 часов!)
          2. Подготовить список вопросов (см. наш мини-курс)
          3. Дать на проверку шаблон международного контракта
          4. Обсудить схему оплаты через Киргизию (Тбанк)
        `,
      },
      {
        key: "international_contract_reviewed",
        title: "Контракт International Sales проверен юристом",
        priority: "critical",
        timeEstimate: "3-5 дней",
        cost: "5,000-15,000₽",
        howTo: `
          1. Сгенерировать черновик в нашей системе (этап C1)
          2. Передать юристу с чек-листом вопросов
          3. Внести правки (Force Majeure под санкции, ICAC Moscow)
          4. Сохранить как шаблон для всех будущих сделок
        `,
      },
      {
        key: "supply_contract_reviewed",
        title: "Контракт с поставщиком (Supply) подписан",
        priority: "high",
        timeEstimate: "1-2 дня",
        cost: "0₽ (или 5,000₽ юристу)",
        howTo: `
          1. Найти поставщика-лесопилку (Братск, Иркутск, Красноярск)
          2. Запросить ценник + спецификации (ГОСТ 8486-86)
          3. Подписать рамочный договор поставки
          4. Согласовать отсрочку платежа 30-60 дней (стандарт отрасли)
        `,
      },
    ],
  },
  {
    id: "finance",
    title: "💰 Финансы и государство",
    color: "emerald",
    description: "Деньги, валютный контроль, субсидии",
    items: [
      {
        key: "ved_account_opened",
        title: "Валютный счёт в банке открыт (Тбанк)",
        priority: "critical",
        timeEstimate: "1-3 дня",
        cost: "0₽",
        howTo: `
          1. Открыть в том же банке где ИП (Тбанк рекомендован)
          2. Запросить ТРАНЗИТНЫЙ счёт (для зачисления валюты)
          3. Запросить ТЕКУЩИЙ валютный счёт (для использования)
          4. Уточнить схему через Киргизию (см. наш разбор)
          5. Получить инструкции по валютному контролю (179-И)
        `,
      },
      {
        key: "lesegais_registered",
        title: "ЛесЕГАИС регистрация (для леса!)",
        priority: "critical",
        timeEstimate: "1 день",
        cost: "0₽",
        howTo: `
          1. Зайти на lesegais.ru через ЭЦП
          2. Подать декларацию о сделке (за 5 дней ДО отгрузки)
          3. Получить номер декларации (нужен для таможни)
          4. ВАЖНО: без декларации ЛесЕГАИС — лес НЕ выпустят за границу!
        `,
      },
      {
        key: "customs_account",
        title: "Личный кабинет на customs.gov.ru",
        priority: "high",
        timeEstimate: "1 день",
        cost: "0₽ (или 2,500₽ ЭЦП)",
        howTo: `
          1. Зарегистрироваться через ЭЦП на customs.gov.ru
          2. Подключить услугу подачи ДТ (декларация на товары)
          3. Найти брокера (или подавать сам — экономия 5-10 тыс ₽ за сделку)
          4. Изучить процедуру ЭК-10 (экспорт)
        `,
      },
      {
        key: "exiar_applied",
        title: "Заявка в ЭКСАР (страхование сделки)",
        priority: "medium",
        timeEstimate: "2 недели",
        cost: "0.5-1.5% от суммы контракта",
        howTo: `
          1. Подать заявку на exiar.ru
          2. Предоставить контракт + информацию о покупателе
          3. ЭКСАР проверит покупателя (бесплатный KYC!)
          4. Получить полис страхования экспортного кредита
          5. БОНУС: ЭКСАР даёт скидку 30-50% малым экспортёрам
        `,
      },
      {
        key: "rec_subsidy_applied",
        title: "Заявка в РЭЦ на субсидии",
        priority: "medium",
        timeEstimate: "1-2 месяца",
        cost: "0₽",
        howTo: `
          1. Зарегистрироваться на exportcenter.ru
          2. Подать на компенсацию:
             • Транспортных расходов (до 80%!)
             • Сертификации (до 100%)
             • Участия в выставках (до 80%)
          3. Пройти бесплатное обучение «Школа экспорта РЭЦ»
          4. Получить ID экспортёра — повышает доверие банков
        `,
      },
    ],
  },
  {
    id: "partners",
    title: "🤝 Партнёры и сертификация",
    color: "orange",
    description: "Кто будет грузить, везти, страховать",
    items: [
      {
        key: "pefc_certificate",
        title: "PEFC/FSC сертификация (для Европы)",
        priority: "medium",
        timeEstimate: "2-3 месяца",
        cost: "50,000-150,000₽/год",
        howTo: `
          1. Только если планируешь экспорт в ЕС/UK
          2. Для Индии/Китая/ОАЭ — НЕ обязательно
          3. Подать заявку через сертификационный орган (NEPCon, SGS)
          4. Аудит цепочки поставок (Chain of Custody)
          5. Получить право использовать логотип PEFC/FSC
        `,
      },
      {
        key: "iso_certificate",
        title: "ISO 9001 (опционально, престиж)",
        priority: "low",
        timeEstimate: "3-6 месяцев",
        cost: "80,000-200,000₽",
        howTo: `
          1. НЕ обязательно для старта, но повышает доверие
          2. Особенно важно для премиум-покупателей (ОАЭ, ЕС)
          3. Можно получить через ТПП РФ со скидкой
          4. Используется в маркетинге и тендерах
        `,
      },
    ],
  },
  {
    id: "marketing",
    title: "📢 Маркетинг и онлайн-присутствие",
    color: "purple",
    description: "Без этого тебя просто не найдут",
    items: [
      {
        key: "domain_purchased",
        title: "Домен куплен (.com предпочтительно)",
        priority: "high",
        timeEstimate: "10 минут",
        cost: "1,500₽/год",
        howTo: `
          1. Купить ru-timber.com (или альтернативу) на reg.ru / namecheap.com
          2. NS-записи направить на Vercel
          3. Подключить к проекту через Vercel Dashboard
          4. SSL сертификат — автоматически от Vercel (Let's Encrypt)
        `,
      },
      {
        key: "email_corporate_setup",
        title: "Корпоративная почта @ru-timber.com",
        priority: "high",
        timeEstimate: "1 час",
        cost: "300-500₽/мес (Яндекс 360)",
        howTo: `
          1. Подключить Яндекс 360 для бизнеса (или Google Workspace)
          2. Создать ящики: director@, sales@, info@
          3. Настроить MX-записи в DNS
          4. Включить 2FA для безопасности
          5. ВАЖНО: gmail/mail.ru = непрофессионально для B2B!
        `,
      },
      {
        key: "whatsapp_business",
        title: "WhatsApp Business подключен",
        priority: "high",
        timeEstimate: "30 минут",
        cost: "0₽",
        howTo: `
          1. Скачать WhatsApp Business на телефон
          2. Зарегистрировать на номер +7 915 349 00 07
          3. Заполнить профиль (логотип, описание, сайт, адрес)
          4. Настроить автоответ для нерабочих часов
          5. Создать каталог продукции с фото
          6. ВАЖНО: WhatsApp — главный канал B2B в Индии/ОАЭ!
        `,
      },
      {
        key: "google_drive_organized",
        title: "Google Drive: папки сделок",
        priority: "medium",
        timeEstimate: "1 час",
        cost: "0₽",
        howTo: `
          1. Создать структуру:
             📁 RU-TIMBER
             ├── 📁 01_Templates (контракты, инвойсы)
             ├── 📁 02_Active_Deals
             │   └── 📁 [Customer_Name]_[YYYY-MM]
             ├── 📁 03_Closed_Deals
             ├── 📁 04_Suppliers
             └── 📁 05_Legal
          2. Каждая сделка = своя папка с фото, контрактами, B/L
          3. Включить версионирование (история изменений)
        `,
      },
    ],
  },
  {
    id: "tools",
    title: "🛠️ Технические инструменты",
    color: "slate",
    description: "VPN, аккредитация, доступы",
    items: [
      {
        key: "it_accreditation",
        title: "IT-аккредитация Минцифры (опционально)",
        priority: "low",
        timeEstimate: "1-2 месяца",
        cost: "0₽",
        howTo: `
          1. Только если развиваешь IT-продукт (наш ERP/CRM подходит!)
          2. Льготы: 0% налог на прибыль, льготная ипотека для сотрудников
          3. Подать через gosuslugi.ru → Минцифры
          4. Требования: ОКВЭД 62/63, доход от IT > 30%
        `,
      },
      {
        key: "vpn_setup",
        title: "VPN/прокси для работы с зарубежными сервисами",
        priority: "medium",
        timeEstimate: "1 час",
        cost: "300-1000₽/мес",
        howTo: `
          1. Купить надёжный VPN (AmneziaVPN, ExpressVPN)
          2. Нужен для: Stripe, Dun & Bradstreet, LinkedIn Sales Navigator
          3. Также для проверки своего сайта из-за рубежа
          4. ВАЖНО: для платежей через DigitalOcean/AWS — обязательно
        `,
      },
    ],
  },
];

const PRIORITY_LABELS = {
  critical: { label: "🔴 Критично", color: "bg-rose-100 text-rose-700 border-rose-300" },
  high: { label: "🟠 Важно", color: "bg-orange-100 text-orange-700 border-orange-300" },
  medium: { label: "🟡 Желательно", color: "bg-amber-100 text-amber-700 border-amber-300" },
  low: { label: "🟢 Опционально", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

const GROUP_COLORS = {
  blue: "border-blue-400 bg-blue-50",
  emerald: "border-emerald-400 bg-emerald-50",
  orange: "border-orange-400 bg-orange-50",
  purple: "border-purple-400 bg-purple-50",
  slate: "border-slate-400 bg-slate-50",
};

export default function ChecklistPage() {
  const { checklist, toggleChecklistItem, isLoaded } = useDeal();
  const [expandedItem, setExpandedItem] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // 📊 Подсчёт прогресса
  const allItems = CHECKLIST_GROUPS.flatMap((g) => g.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((item) => checklist?.[item.key]).length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const criticalDone = allItems.filter((i) => i.priority === "critical" && checklist?.[i.key]).length;
  const criticalTotal = allItems.filter((i) => i.priority === "critical").length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Nav */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </Link>
          <div className="flex gap-3 text-sm">
            <Link href="/" className="text-slate-300 hover:text-orange-500">← Home</Link>
            <Link href="/mission" className="text-cyan-400 hover:text-orange-500">🌊 Mission</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Header */}
        <header className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="text-5xl">📋</div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900">Pre-Flight Checklist</h1>
              <p className="text-slate-600 mt-1">17 пунктов до первой международной сделки</p>
              <p className="text-xs text-slate-500 mt-2">
                💡 Это твоя карта подготовки. Когда выполнишь все <strong>критичные</strong> пункты — можно стартовать сделку.
              </p>
            </div>
          </div>
        </header>

        {/* Progress */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-baseline mb-3">
            <div>
              <h2 className="font-bold text-slate-900">Общий прогресс</h2>
              <p className="text-xs text-slate-500">
                {completedItems} из {totalItems} пунктов выполнено
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-orange-500">{progress}%</div>
              <div className="text-xs text-slate-500">готовности</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Critical status */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2 rounded-lg border-2 ${criticalDone === criticalTotal ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"}`}>
              <div className="font-bold">🔴 Критичные</div>
              <div className="font-mono">{criticalDone}/{criticalTotal}</div>
            </div>
            <div className="p-2 rounded-lg border-2 bg-orange-50 border-orange-300">
              <div className="font-bold">🟠 Важные</div>
              <div className="font-mono">
                {allItems.filter((i) => i.priority === "high" && checklist?.[i.key]).length}/
                {allItems.filter((i) => i.priority === "high").length}
              </div>
            </div>
            <div className="p-2 rounded-lg border-2 bg-amber-50 border-amber-300">
              <div className="font-bold">🟡 Желательные</div>
              <div className="font-mono">
                {allItems.filter((i) => i.priority === "medium" && checklist?.[i.key]).length}/
                {allItems.filter((i) => i.priority === "medium").length}
              </div>
            </div>
            <div className="p-2 rounded-lg border-2 bg-emerald-50 border-emerald-300">
              <div className="font-bold">🟢 Опциональные</div>
              <div className="font-mono">
                {allItems.filter((i) => i.priority === "low" && checklist?.[i.key]).length}/
                {allItems.filter((i) => i.priority === "low").length}
              </div>
            </div>
          </div>

          {/* Mission status */}
          {criticalDone === criticalTotal && criticalTotal > 0 && (
            <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-lg">
              <div className="font-black text-emerald-800">🎉 Все критичные пункты выполнены!</div>
              <div className="text-xs text-emerald-700 mt-1">
                Ты технически готов к первой сделке. Остальные пункты — для роста и масштабирования.
              </div>
            </div>
          )}

          {progress < 30 && (
            <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
              <div className="font-black text-amber-800">🌱 Начало пути</div>
              <div className="text-xs text-amber-700 mt-1">
                Фокусируйся на <strong>🔴 критичных</strong> пунктах. Не пытайся делать всё сразу!
              </div>
            </div>
          )}
        </section>

        {/* Filter */}
        <section className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-slate-700">Фильтр:</span>
            {["all", "critical", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  filterPriority === p
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p === "all" ? "Все" : PRIORITY_LABELS[p].label}
              </button>
            ))}
          </div>
        </section>

        {/* Groups */}
        {CHECKLIST_GROUPS.map((group) => {
          const filteredItems =
            filterPriority === "all"
              ? group.items
              : group.items.filter((i) => i.priority === filterPriority);

          if (filteredItems.length === 0) return null;

          const groupDone = group.items.filter((i) => checklist?.[i.key]).length;
          const groupTotal = group.items.length;
          const groupProgress = groupTotal > 0 ? Math.round((groupDone / groupTotal) * 100) : 0;

          return (
            <section
              key={group.id}
              className={`rounded-xl p-5 shadow-sm border-2 ${GROUP_COLORS[group.color]}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{group.title}</h2>
                  <p className="text-xs text-slate-600 mt-1">{group.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-700">
                    {groupDone}/{groupTotal}
                  </div>
                  <div className="text-xs text-slate-500">{groupProgress}%</div>
                </div>
              </div>

              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const isDone = !!checklist?.[item.key];
                  const isExpanded = expandedItem === item.key;
                  const priorityStyle = PRIORITY_LABELS[item.priority];

                  return (
                    <div
                      key={item.key}
                      className={`bg-white rounded-lg border-2 transition-all ${
                        isDone ? "border-emerald-300 opacity-60" : "border-slate-200"
                      }`}
                    >
                      <div className="p-3 flex items-start gap-3">
                        <button
                          onClick={() => toggleChecklistItem(item.key)}
                          className={`mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center transition-all active:scale-90 shrink-0 ${
                            isDone
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-300 hover:border-orange-400"
                          }`}
                        >
                          {isDone && "✓"}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div
                            onClick={() => setExpandedItem(isExpanded ? null : item.key)}
                            className="cursor-pointer"
                          >
                            <div className={`font-bold text-sm ${isDone ? "line-through text-slate-500" : "text-slate-900"}`}>
                              {item.title}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded border ${priorityStyle.color}`}>
                                {priorityStyle.label}
                              </span>
                              <span className="text-xs text-slate-500">⏱ {item.timeEstimate}</span>
                              <span className="text-xs text-slate-500">💰 {item.cost}</span>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 p-3 bg-slate-50 rounded text-xs text-slate-700 whitespace-pre-line">
                              <div className="font-bold mb-2">📖 Как сделать:</div>
                              {item.howTo}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : item.key)}
                          className="text-slate-400 hover:text-slate-700 shrink-0"
                        >
                          {isExpanded ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="bg-slate-900 text-white rounded-xl p-6 text-center">
          <h3 className="text-xl font-black mb-2">🌊 Следующий этап</h3>
          <p className="text-sm text-slate-300 mb-4">
            Когда выполнишь все <strong className="text-orange-400">🔴 критичные</strong> пункты —
            сгенерируй международный контракт и стартуй первую сделку!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/mission"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-lg font-bold active:scale-95"
            >
              🌊 Mission Dashboard
            </Link>
            <Link
              href="/calculator"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-bold active:scale-95"
            >
              📐 Калькулятор
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs mt-8">
        Powered by RU-TIMBER Export | Contact: +7 915 349 00 07
      </footer>
    </div>
  );
}

// END OF FILE