// 📜 INTERNATIONAL SALES CONTRACT — TEMPLATE DATA
// 2-language structure: { en: "...", ru: "..." }
// Used by /captain/contract page
// ⚖️ v2.0 — Reviewed by International Trade Lawyer (2026)
// Critical updates: Title transfer, Currency control, Quality at port, Volume tolerance

// === 🌐 ГЛОССАРИЙ ЮРИДИЧЕСКИХ ТЕРМИНОВ ===
export const GLOSSARY = {
  "Incoterms": {
    short: "Международные правила доставки",
    long: "Incoterms (International Commercial Terms) — правила ICC, определяющие кто платит за доставку, страховку и где переходит риск. Сейчас актуальна редакция 2020 года.",
  },
  "CIF": {
    short: "Cost, Insurance, Freight",
    long: "CIF — продавец доставляет груз в порт покупателя, платит фрахт и страховку. Риск переходит на покупателя при пересечении борта судна в порту отгрузки.",
  },
  "FOB": {
    short: "Free On Board",
    long: "FOB — продавец доставляет груз до порта отгрузки и загружает на судно. Дальше — риск и расходы покупателя.",
  },
  "EXW": {
    short: "Ex Works",
    long: "EXW — самые минимальные обязательства продавца: товар забирается со склада, дальше все расходы и риски — на покупателе.",
  },
  "B/L": {
    short: "Bill of Lading — коносамент",
    long: "B/L (Bill of Lading) — главный документ морской перевозки. Кто держит оригинал B/L — тот владелец груза. Без B/L покупатель НЕ сможет забрать контейнер в своём порту.",
  },
  "L/C": {
    short: "Letter of Credit — аккредитив",
    long: "L/C (Letter of Credit) — банковская гарантия оплаты. Банк покупателя обязуется заплатить, если продавец предоставит правильные документы. Самая безопасная схема, но стоит ~1% от суммы.",
  },
  "T/T": {
    short: "Telegraphic Transfer",
    long: "T/T — обычный международный банковский перевод через SWIFT. Самый распространённый способ оплаты в B2B.",
  },
  "Force Majeure": {
    short: "Форс-мажор — чрезвычайные обстоятельства",
    long: "Force Majeure — обстоятельства непреодолимой силы (война, санкции, эпидемии, стихийные бедствия), освобождающие стороны от ответственности. КРИТИЧНО включить санкции и блокировку SWIFT для контрактов 2024-2026.",
  },
  "Arbitration": {
    short: "Арбитраж — частный суд",
    long: "Arbitration — рассмотрение споров в частном суде вместо государственного. ICAC Moscow в 10-30 раз дешевле западных арбитражей, решения признаются в 168 странах.",
  },
  "ICAC Moscow": {
    short: "Международный коммерческий арбитраж в Москве",
    long: "ICAC (International Commercial Arbitration Court при ТПП РФ) — российский арбитраж для международных споров. Стоимость ~$3000-5000, срок 3-6 месяцев. Решения признаются в Индии, Китае, ОАЭ, ЕС по Нью-Йоркской конвенции 1958.",
  },
  "Governing Law": {
    short: "Применимое право",
    long: "Governing Law — право какой страны применяется к контракту. Для тебя оптимально Russian Federation Law — твой юрист знает его наизусть.",
  },
  "HS Code": {
    short: "Код Гармонизированной Системы",
    long: "HS Code (Harmonized System) — международный 6-значный таможенный код товара. Для пиломатериалов: 4407.11 (сосна), 4407.12 (ель), 4407.19 (лиственница, кедр).",
  },
  "Phyto": {
    short: "Фитосанитарный сертификат",
    long: "Phytosanitary Certificate — документ Россельхознадзора, подтверждающий что древесина не заражена вредителями. Обязателен для экспорта в 99% стран.",
  },
  "ISPM-15": {
    short: "Фумигация деревянной упаковки",
    long: "ISPM-15 — международный стандарт обработки деревянной упаковки (поддоны, брус). Без клейма IPPC груз развернут в порту Индии/ЕС/Австралии.",
  },
  "GOST 8486-86": {
    short: "Российский стандарт пиломатериалов",
    long: "ГОСТ 8486-86 — советский стандарт качества пиломатериалов хвойных пород. Определяет сорта 1-4, допустимые дефекты, влажность. Признаётся во всём мире.",
  },
  "Advance Payment": {
    short: "Предоплата",
    long: "Advance Payment — авансовый платёж до начала производства/отгрузки. Стандарт для первой сделки: 30% advance + 70% против скана B/L.",
  },
  "Demurrage": {
    short: "Простой контейнера в порту",
    long: "Demurrage — штраф за простой контейнера в порту назначения сверх бесплатного периода (обычно 5-7 дней). $50-150/день. Платит грузополучатель.",
  },
  "Sanctions Clause": {
    short: "Пункт про санкции",
    long: "Sanctions Clause — отдельная оговорка о санкциях. КРИТИЧНО для российских экспортёров в 2024-2026: позволяет приостановить или расторгнуть контракт без штрафов при введении новых санкций.",
  },
  "Acceptance": {
    short: "Приёмка товара",
    long: "Acceptance — процедура принятия товара покупателем. Включает приёмку по количеству (в порту) и по качеству (срок 14 дней с фото и сюрвейерским отчётом).",
  },
  "Claims Period": {
    short: "Срок предъявления претензий",
    long: "Claims Period — период, в течение которого покупатель может предъявить претензии по качеству. Стандарт: 14 дней с момента выгрузки в порту назначения. Обязательно с фото + сюрвейерский отчёт SGS/Bureau Veritas.",
  },
  "Confidentiality": {
    short: "Конфиденциальность",
    long: "Confidentiality clause — обязательство сторон не разглашать условия контракта (цены, объёмы) третьим лицам. Защищает твои закупочные цены от утечки конкурентам.",
  },
  // ⭐ НОВЫЕ ТЕРМИНЫ от юриста
  "Title Transfer": {
    short: "Переход права собственности",
    long: "Title Transfer — момент перехода права собственности на товар от Продавца к Покупателю. КРИТИЧНО: должен быть привязан к 100% оплате, иначе Продавец теряет контроль над грузом в море до получения денег. Стандарт защиты: Title переходит вместе с оригиналами документов после полной оплаты.",
  },
  "Volume Tolerance": {
    short: "Технологический люфт по объёму",
    long: "Volume Tolerance — допустимое отклонение фактически погруженного объёма от заявленного (стандарт ±5%). Необходимо потому, что заранее точно рассчитать загрузку 40HC контейнера невозможно — разные пачки, разные размеры. Финальный инвойс выставляется на основании B/L.",
  },
  "Currency Repatriation": {
    short: "Репатриация валютной выручки",
    long: "Currency Repatriation — обязательство российских экспортёров вернуть валютную выручку на счёт в РФ в установленный срок (обычно 180 дней). Нарушение — штраф 75-100% от суммы. ЗАЩИТА: оплата считается выполненной только после зачисления на счёт ПРОДАВЦА В РФ, а не у агента в Киргизии/Узбекистане.",
  },
  "Pre-shipment Inspection": {
    short: "Предотгрузочная инспекция",
    long: "Pre-shipment Inspection — фиксация качества, размеров и влажности товара ПЕРЕД отправкой в порту погрузки. После этого момента Продавец НЕ отвечает за естественные изменения (нагон влажности древесины в океане).",
  },
};

// === 📜 15 ПУНКТОВ КОНТРАКТА ===
// Структура: { id, title_en, title_ru, body_en, body_ru, tooltipKey?, critical? }

export const CONTRACT_CLAUSES = [
  {
    id: 1,
    title_en: "1. PARTIES",
    title_ru: "1. СТОРОНЫ",
    body_en: (data) => `
This International Sales Contract (hereinafter — "Contract") No. ${data.contractNumber} is made on ${data.contractDate} between:

THE SELLER:
${data.sellerName}
Registered address: ${data.sellerAddress}
INN: ${data.sellerINN} | OGRN: ${data.sellerOGRN}
Represented by: ${data.sellerDirector}, acting on the basis of the Charter

— and —

THE BUYER:
${data.buyerName}
Registered address: ${data.buyerAddress}
Tax ID / Trade License: ${data.buyerTaxId || "[BUYER TAX ID]"}
Represented by: ${data.buyerDirector || "[BUYER REPRESENTATIVE]"}, acting on the basis of [Power of Attorney / Charter]

Hereinafter jointly referred to as "the Parties".`,
    body_ru: (data) => `
Настоящий международный контракт купли-продажи (далее — «Контракт») № ${data.contractNumber} заключён ${data.contractDate} между:

ПРОДАВЕЦ:
${data.sellerName}
Юридический адрес: ${data.sellerAddress}
ИНН: ${data.sellerINN} | ОГРН: ${data.sellerOGRN}
В лице: ${data.sellerDirector}, действующего на основании Устава

— и —

ПОКУПАТЕЛЬ:
${data.buyerName}
Юридический адрес: ${data.buyerAddress}
Налоговый ID / Торговая лицензия: ${data.buyerTaxId || "[ID ПОКУПАТЕЛЯ]"}
В лице: ${data.buyerDirector || "[ПРЕДСТАВИТЕЛЬ ПОКУПАТЕЛЯ]"}, действующего на основании [Доверенности / Устава]

Далее совместно именуемые «Стороны».`,
  },
  {
    id: 2,
    title_en: "2. SUBJECT OF THE CONTRACT",
    title_ru: "2. ПРЕДМЕТ КОНТРАКТА",
    // ⭐ ПРАВКА #1: Допуск ±5% по объёму
    body_en: (data) => `
2.1. The Seller undertakes to sell and deliver, and the Buyer undertakes to accept and pay for the following goods (hereinafter — "Goods"):

• Description: ${data.productDescription}
• Standard: GOST 8486-86 (Russian Federation State Standard)
• Grade: 1-3 (selected grades)
• Moisture: ${data.moisture}
• Dimensions: ${data.dimensions} mm
• Quantity: ${data.quantity} m³ (a volume tolerance of ±5% is allowed; the final commercial invoice shall be issued based on the actual volume loaded and specified in the Bill of Lading)
• Packaging: ${data.packaging}
• HS Code: ${data.hsCode}
• Country of Origin: Russian Federation`,
    body_ru: (data) => `
2.1. Продавец обязуется продать и поставить, а Покупатель обязуется принять и оплатить следующий товар (далее — «Товар»):

• Наименование: ${data.productDescription}
• Стандарт: ГОСТ 8486-86 (Российская Федерация)
• Сорт: 1-3 (отборные сорта)
• Влажность: ${data.moisture}
• Размеры: ${data.dimensions} мм
• Количество: ${data.quantity} м³ (допускается технологический люфт ±5% по объёму; финальный инвойс выставляется на основании фактически погруженного объёма, указанного в коносаменте)
• Упаковка: ${data.packaging}
• Код ТН ВЭД: ${data.hsCode}
• Страна происхождения: Российская Федерация`,
    tooltipKey: "Volume Tolerance",
    critical: true,
  },
  {
    id: 3,
    title_en: "3. QUALITY",
    title_ru: "3. КАЧЕСТВО",
    // ⭐ ПРАВКА #2: Фиксация качества в порту погрузки + риск нагона влажности на Покупателе
    body_en: () => `
3.1. The quality of the Goods shall correspond to GOST 8486-86 standard.

3.2. Tolerances:
• Thickness: ±2 mm
• Width: ±2 mm
• Length: ±5 mm
• Moisture: as specified in clause 2.1 (±2%)

3.3. The Seller shall provide pre-shipment photos of the Goods as an Annex to this Contract.

3.4. The Seller guarantees that the Goods are free from defects affecting their commercial value (rot, fungal stains, insect damage exceeding GOST tolerances).

3.5. ⚖️ DEFINITIVE QUALITY DETERMINATION AT PORT OF LOADING:
The compliance of the Goods with quality, dimensions, and moisture standards (clause 2.1) shall be definitively determined at the port of loading (${"Novorossiysk"}) prior to dispatch, as documented in the pre-shipment photos or a survey report. The Buyer assumes the risk of natural moisture variance during ocean transit.`,
    body_ru: () => `
3.1. Качество Товара должно соответствовать ГОСТ 8486-86.

3.2. Допуски:
• Толщина: ±2 мм
• Ширина: ±2 мм
• Длина: ±5 мм
• Влажность: согласно п.2.1 (±2%)

3.3. Продавец предоставляет фотографии Товара перед отгрузкой в качестве Приложения к Контракту.

3.4. Продавец гарантирует, что Товар свободен от дефектов, влияющих на его коммерческую ценность (гниль, грибные пятна, поражения насекомыми сверх допусков ГОСТ).

3.5. ⚖️ ОКОНЧАТЕЛЬНАЯ ФИКСАЦИЯ КАЧЕСТВА В ПОРТУ ПОГРУЗКИ:
Соответствие Товара стандартам качества, размеров и влажности (п. 2.1) окончательно определяется в порту погрузки (Новороссийск) перед отправкой, что фиксируется предотгрузочными фотографиями или сюрвейерским отчётом. Покупатель несёт риски естественного изменения влажности во время морского транзита.`,
    tooltipKey: "Pre-shipment Inspection",
    critical: true,
  },
  {
    id: 4,
    title_en: "4. PRICE AND TOTAL VALUE",
    title_ru: "4. ЦЕНА И ОБЩАЯ СТОИМОСТЬ",
    body_en: (data) => `
4.1. The unit price of the Goods: USD ${data.unitPrice} per m³ on ${data.incoterm} basis (Incoterms 2020).

4.2. Total Contract value: USD ${data.totalAmount} (${data.totalAmountWords}).

4.3. The price is firm and is not subject to any changes during the validity of this Contract.

4.4. The price includes: cost of Goods, packaging, marking, loading, all applicable Russian export duties (if any), and (for CIF) — international ocean freight and marine insurance up to the destination port.`,
    body_ru: (data) => `
4.1. Цена за единицу Товара: ${data.unitPrice} долларов США за м³ на условиях ${data.incoterm} (Инкотермс 2020).

4.2. Общая стоимость Контракта: ${data.totalAmount} долларов США (${data.totalAmountWords}).

4.3. Цена является твёрдой и не подлежит изменению в течение срока действия Контракта.

4.4. Цена включает: стоимость Товара, упаковку, маркировку, погрузку, все применимые российские экспортные пошлины (при наличии), и (для CIF) — международный морской фрахт и морское страхование до порта назначения.`,
    tooltipKey: "Incoterms",
  },
  {
    id: 5,
    title_en: "5. DELIVERY TERMS (INCOTERMS 2020)",
    title_ru: "5. УСЛОВИЯ ПОСТАВКИ (ИНКОТЕРМС 2020)",
    // ⭐ ПРАВКА #3: Экспортная очистка ПРОДАВЦА (новый п. 5.1)
    // ⭐ ПРАВКА #4: Title — после 100% оплаты + оригиналов (п. 5.7 ПЕРЕДЕЛАН)
    body_en: (data) => `
5.1. ⚖️ EXPORT CUSTOMS CLEARANCE:
The Seller shall, at its own expense, clear the Goods for export and perform all necessary export customs formalities in the Russian Federation.

5.2. Delivery basis: ${data.incoterm} ${data.destinationPort} (Incoterms 2020).

5.3. Port of loading: ${data.loadingPort}, Russian Federation.

5.4. Port of destination: ${data.destinationPort}.

5.5. Container type: 40' High Cube (40HC), 1 container per shipment.

5.6. Lead time: ${data.leadTime} days from the date of receipt of advance payment.

5.7. The Seller shall provide the Buyer with a copy of the Bill of Lading (B/L) within 3 working days after vessel departure.

5.8. ⚖️ TITLE TRANSFER (CRITICAL):
Title to the Goods passes from the Seller to the Buyer at the moment of transfer of the original shipping documents to the Buyer, provided that 100% payment for the respective batch of Goods has been received by the Seller.

5.9. Risk of loss or damage passes to the Buyer at the moment of crossing the ship's rail at the port of loading (for FOB/CIF).`,
    body_ru: (data) => `
5.1. ⚖️ ЭКСПОРТНОЕ ТАМОЖЕННОЕ ОФОРМЛЕНИЕ:
Продавец за свой счёт выполняет таможенные формальности, необходимые для экспорта Товара, и осуществляет экспортное таможенное оформление в Российской Федерации.

5.2. Условия поставки: ${data.incoterm} ${data.destinationPort} (Инкотермс 2020).

5.3. Порт отгрузки: ${data.loadingPort}, Российская Федерация.

5.4. Порт назначения: ${data.destinationPort}.

5.5. Тип контейнера: 40-футовый High Cube (40HC), 1 контейнер на отгрузку.

5.6. Срок поставки: ${data.leadTime} дней с даты получения авансового платежа.

5.7. Продавец обязан предоставить Покупателю копию коносамента (B/L) в течение 3 рабочих дней после отправки судна.

5.8. ⚖️ ПЕРЕХОД ПРАВА СОБСТВЕННОСТИ (КРИТИЧНО):
Право собственности на Товар переходит от Продавца к Покупателю в момент передачи оригиналов отгрузочных документов Покупателю, при условии получения Продавцом 100% оплаты за соответствующую партию Товара.

5.9. Риск утраты или повреждения Товара переходит к Покупателю в момент пересечения борта судна в порту отгрузки (для FOB/CIF).`,
    tooltipKey: "Title Transfer",
    critical: true,
  },
  {
    {
    id: 6,
    title_en: "6. PAYMENT TERMS",
    title_ru: "6. УСЛОВИЯ ОПЛАТЫ",
    // 🆕 ДИНАМИЧЕСКИЕ УСЛОВИЯ ОПЛАТЫ
    // Поддерживает разные схемы: prepay100, prepay50, prepay30, lc
    body_en: (data) => {
      const schema = data.paymentSchemaId || "prepay100";
      
      // Базовый блок — общий для всех схем
      const commonClauses = `

6.${schema === "lc" ? "3" : "4"}. Bank charges: charges of the Seller's bank — for the Seller's account, charges of the Buyer's bank — for the Buyer's account, intermediary bank charges — for the Buyer's account (OUR/OUR).

6.${schema === "lc" ? "4" : "5"}. The payment date is considered the date of crediting funds to the Seller's bank account in the Russian Federation.

6.${schema === "lc" ? "5" : "6"}. PAYMENT VIA AUTHORIZED AGENT (Kyrgyzstan / Uzbekistan):
Due to current international banking restrictions, the Buyer may pay through an authorized payment agent designated by the Seller (a licensed company in Kyrgyzstan or Uzbekistan). The Seller shall provide:
• Tripartite Agency Agreement (Seller — Agent — Buyer)
• Compliance letter from the Seller's bank
• Agent invoice for the same amount as per this Contract
This scheme is fully compliant with CIS, UAE, EU and US regulations as of 2026.

6.${schema === "lc" ? "6" : "7"}. ⚖️ FULFILLMENT OF PAYMENT OBLIGATION (CRITICAL — CB RF CURRENCY CONTROL):
Notwithstanding any payment routing through agents or intermediaries, the Buyer's payment obligation under this Contract is deemed fulfilled only from the moment the funds are credited in full to the Seller's bank account in the Russian Federation.

6.${schema === "lc" ? "7" : "8"}. PAYMENT DELAYS:
In case of payment delay for more than 10 (ten) banking days, the Seller reserves the right to:
(a) suspend the performance of the Contract;
(b) terminate the Contract unilaterally without compensation to the Buyer;
(c) revise the price and delivery terms;
(d) claim interest at the rate of 0.1% per day of delay.`;

      // ━━━━━━ 100% PREPAYMENT ━━━━━━
      if (schema === "prepay100") {
        return `
6.1. Payment is made in US Dollars (USD) by Telegraphic Transfer (T/T) or through an authorized payment agent (see clause 6.6).

6.2. Payment schedule:
• 100% (one hundred percent) advance payment of the total Contract amount within 5 (five) banking days from the date of signing this Contract.

6.3. Shipment of the Goods shall commence within 14 (fourteen) working days from the date of receipt of 100% advance payment to the Seller's bank account.${commonClauses}`;
      }
      
      // ━━━━━━ 50/50 ━━━━━━
      if (schema === "prepay50") {
        return `
6.1. Payment is made in US Dollars (USD) by Telegraphic Transfer (T/T) or through an authorized payment agent (see clause 6.6).

6.2. Payment schedule:
• 50% (fifty percent) advance payment within 5 (five) banking days from the date of signing this Contract.
• 50% (fifty percent) balance payment against scan copy of Bill of Lading (B/L), within 5 (five) banking days from the date of receipt of B/L copy.

6.3. Shipment of the Goods shall commence within 14 (fourteen) working days from the date of receipt of 50% advance payment to the Seller's bank account.${commonClauses}`;
      }
      
      // ━━━━━━ L/C (Letter of Credit) ━━━━━━
      if (schema === "lc") {
        return `
6.1. Payment is made in US Dollars (USD) by irrevocable confirmed Letter of Credit (L/C), opened by the Buyer in favor of the Seller.

6.2. Payment terms:
• 100% payment by irrevocable confirmed L/C, opened by the Buyer in a first-class international bank within 10 (ten) banking days from the date of signing this Contract.
• L/C shall be valid for at least 90 (ninety) days from the date of opening.
• L/C shall be advised through the Seller's bank: as per clause 14.

6.3. Payment against shipping documents:
• Commercial Invoice
• Bill of Lading (B/L)
• Packing List
• Certificate of Origin
• Phytosanitary Certificate
• Fumigation Certificate (ISPM-15)${commonClauses}`;
      }
      
      // ━━━━━━ 30/70 (DEFAULT) ━━━━━━
      return `
6.1. Payment is made in US Dollars (USD) by Telegraphic Transfer (T/T) or through an authorized payment agent (see clause 6.6).

6.2. Payment schedule:
• 30% (thirty percent) advance payment within 5 (five) banking days from the date of signing this Contract.
• 70% (seventy percent) balance payment against scan copy of Bill of Lading (B/L), within 5 (five) banking days from the date of receipt of B/L copy.

6.3. Shipment of the Goods shall commence within 14 (fourteen) working days from the date of receipt of 30% advance payment to the Seller's bank account.${commonClauses}`;
    },
    body_ru: (data) => {
      const schema = data.paymentSchemaId || "prepay100";
      
      const commonClausesRu = `

6.${schema === "lc" ? "3" : "4"}. Банковские расходы: расходы банка Продавца — за счёт Продавца, расходы банка Покупателя — за счёт Покупателя, расходы банков-корреспондентов — за счёт Покупателя (OUR/OUR).

6.${schema === "lc" ? "4" : "5"}. Датой оплаты считается дата зачисления денежных средств на расчётный счёт Продавца в Российской Федерации.

6.${schema === "lc" ? "5" : "6"}. ОПЛАТА ЧЕРЕЗ УПОЛНОМОЧЕННОГО АГЕНТА (Киргизия / Узбекистан):
В связи с текущими международными банковскими ограничениями, Покупатель может произвести оплату через уполномоченного платёжного агента, назначенного Продавцом (лицензированная компания в Киргизии или Узбекистане). Продавец предоставляет:
• Трёхсторонний агентский договор (Продавец — Агент — Покупатель)
• Письмо о комплаенсе от банка Продавца
• Инвойс агента на сумму согласно настоящему Контракту
Данная схема полностью соответствует требованиям регуляторов СНГ, ОАЭ, ЕС и США по состоянию на 2026 год.

6.${schema === "lc" ? "6" : "7"}. ⚖️ МОМЕНТ ИСПОЛНЕНИЯ ОБЯЗАТЕЛЬСТВА ПО ОПЛАТЕ (КРИТИЧНО — ВАЛЮТНЫЙ КОНТРОЛЬ ЦБ РФ):
Независимо от маршрутизации платежа через агентов или посредников, обязательства Покупателя по оплате считаются выполненными только с момента полного зачисления денежных средств на банковский счёт Продавца в Российской Федерации.

6.${schema === "lc" ? "7" : "8"}. ПРОСРОЧКА ОПЛАТЫ:
В случае задержки оплаты более чем на 10 (десять) банковских дней Продавец оставляет за собой право:
(а) приостановить выполнение Контракта;
(б) расторгнуть Контракт в одностороннем порядке без компенсации Покупателю;
(в) пересмотреть цену и сроки поставки;
(г) потребовать оплату процентов в размере 0.1% за каждый день просрочки.`;

      // ━━━━━━ 100% PREPAYMENT ━━━━━━
      if (schema === "prepay100") {
        return `
6.1. Оплата производится в долларах США (USD) телеграфным переводом (T/T) или через уполномоченного платёжного агента (см. п. 6.6).

6.2. График оплаты:
• 100% (сто процентов) предоплаты от общей суммы Контракта в течение 5 (пяти) банковских дней с даты подписания настоящего Контракта.

6.3. Отгрузка Товара начинается в течение 14 (четырнадцати) рабочих дней с даты получения 100% предоплаты на расчётный счёт Продавца.${commonClausesRu}`;
      }
      
      // ━━━━━━ 50/50 ━━━━━━
      if (schema === "prepay50") {
        return `
6.1. Оплата производится в долларах США (USD) телеграфным переводом (T/T) или через уполномоченного платёжного агента (см. п. 6.6).

6.2. График оплаты:
• 50% (пятьдесят процентов) авансовый платёж в течение 5 (пяти) банковских дней с даты подписания настоящего Контракта.
• 50% (пятьдесят процентов) окончательный платёж против скан-копии коносамента (B/L), в течение 5 (пяти) банковских дней с даты получения копии B/L.

6.3. Отгрузка Товара начинается в течение 14 (четырнадцати) рабочих дней с даты получения 50% авансового платежа на расчётный счёт Продавца.${commonClausesRu}`;
      }
      
      // ━━━━━━ L/C ━━━━━━
      if (schema === "lc") {
        return `
6.1. Оплата производится в долларах США (USD) безотзывным подтверждённым аккредитивом (L/C), открытым Покупателем в пользу Продавца.

6.2. Условия оплаты:
• 100% оплата безотзывным подтверждённым аккредитивом, открытым Покупателем в первоклассном международном банке в течение 10 (десяти) банковских дней с даты подписания настоящего Контракта.
• Срок действия L/C — не менее 90 (девяноста) дней с даты открытия.
• L/C должен быть авизован через банк Продавца: согласно п. 14.

6.3. Оплата против отгрузочных документов:
• Коммерческий инвойс
• Коносамент (B/L)
• Упаковочный лист
• Сертификат происхождения
• Фитосанитарный сертификат
• Сертификат фумигации (ISPM-15)${commonClausesRu}`;
      }
      
      // ━━━━━━ 30/70 (DEFAULT) ━━━━━━
      return `
6.1. Оплата производится в долларах США (USD) телеграфным переводом (T/T) или через уполномоченного платёжного агента (см. п. 6.6).

6.2. График оплаты:
• 30% (тридцать процентов) авансовый платёж в течение 5 (пяти) банковских дней с даты подписания настоящего Контракта.
• 70% (семьдесят процентов) окончательный платёж против скан-копии коносамента (B/L), в течение 5 (пяти) банковских дней с даты получения копии B/L.

6.3. Отгрузка Товара начинается в течение 14 (четырнадцати) рабочих дней с даты получения 30% авансового платежа на расчётный счёт Продавца.${commonClausesRu}`;
    },
    tooltipKey: "Advance Payment",
    critical: true,
  },
  {
    id: 7,
    title_en: "7. PACKING AND MARKING",
    title_ru: "7. УПАКОВКА И МАРКИРОВКА",
    body_en: (data) => `
7.1. Packaging: ${data.packaging}, suitable for ocean transit of ${data.transitDays} days.

7.2. All wooden packaging materials (dunnage, pallets, supports) must comply with ISPM-15 standard (IPPC stamp).

7.3. Marking on each bundle:
• Contract number: ${data.contractNumber}
• Bundle number
• Dimensions
• Quantity (m³)
• Quality grade
• Country of origin: RUSSIA
• Destination port: ${data.destinationPort}`,
    body_ru: (data) => `
7.1. Упаковка: ${data.packaging}, пригодная для морской перевозки в течение ${data.transitDays} дней.

7.2. Все деревянные упаковочные материалы (крепёжный брус, поддоны, опоры) должны соответствовать стандарту ISPM-15 (клеймо IPPC).

7.3. Маркировка на каждой пачке:
• Номер контракта: ${data.contractNumber}
• Номер пачки
• Размеры
• Количество (м³)
• Сорт качества
• Страна происхождения: RUSSIA
• Порт назначения: ${data.destinationPort}`,
    tooltipKey: "ISPM-15",
  },
  {
    id: 8,
    title_en: "8. SHIPPING DOCUMENTS",
    title_ru: "8. ОТГРУЗОЧНЫЕ ДОКУМЕНТЫ",
    body_en: () => `
8.1. The Seller shall provide the following documents:
(a) Commercial Invoice — 3 originals
(b) Packing List — 3 originals
(c) Bill of Lading (B/L) — 3 originals + 3 non-negotiable copies
(d) Certificate of Origin (Form A or CT-1) — 1 original
(e) Phytosanitary Certificate (Rosselkhoznadzor) — 1 original
(f) Fumigation Certificate (ISPM-15 / IPPC) — 1 original
(g) Pre-shipment photographs (digital, via email)
(h) Loading Survey Report (if requested by the Buyer, at the Buyer's expense)

8.2. Original documents shall be transferred to the Buyer in accordance with clause 5.8 (Title Transfer) — only after receipt by the Seller of 100% payment.`,
    body_ru: () => `
8.1. Продавец предоставляет следующие документы:
(а) Коммерческий инвойс — 3 оригинала
(б) Упаковочный лист — 3 оригинала
(в) Коносамент (B/L) — 3 оригинала + 3 необоротных копии
(г) Сертификат происхождения (Форма А или СТ-1) — 1 оригинал
(д) Фитосанитарный сертификат (Россельхознадзор) — 1 оригинал
(е) Сертификат фумигации (ISPM-15 / IPPC) — 1 оригинал
(ж) Фотографии товара перед отгрузкой (цифровые, по email)
(з) Сюрвейерский отчёт о погрузке (по запросу Покупателя, за его счёт)

8.2. Оригиналы документов передаются Покупателю в соответствии с п. 5.8 (Переход права собственности) — только после получения Продавцом 100% оплаты.`,
    tooltipKey: "B/L",
  },
  {
    id: 9,
    title_en: "9. ACCEPTANCE OF GOODS",
    title_ru: "9. ПРИЁМКА ТОВАРА",
    // ⭐ ПРАВКА #6: Убрано "unless gross negligence" — чёткие 5%
    body_en: () => `
9.1. Acceptance of the Goods by quantity is performed at the port of destination, at the moment of container unloading, in the presence of the Buyer's representative.

9.2. Acceptance by quality is performed within 14 (fourteen) calendar days from the date of unloading. Any claims regarding quality must be supported by:
(a) Photographic evidence
(b) Official report of an independent surveyor (SGS, Bureau Veritas, Cotecna or equivalent)
(c) Samples of the disputed Goods

9.3. Claims received after the 14-day period shall not be accepted.

9.4. ⚖️ LIABILITY CAP (CRITICAL):
The Seller's total liability under this Contract shall not exceed 5% (five percent) of the total Contract value. This limitation applies to all claims of any nature, without exception.`,
    body_ru: () => `
9.1. Приёмка Товара по количеству производится в порту назначения в момент разгрузки контейнера в присутствии представителя Покупателя.

9.2. Приёмка по качеству производится в течение 14 (четырнадцати) календарных дней с даты разгрузки. Претензии по качеству должны быть подкреплены:
(а) Фотодоказательствами
(б) Официальным отчётом независимого сюрвейера (SGS, Bureau Veritas, Cotecna или эквивалент)
(в) Образцами спорного Товара

9.3. Претензии, полученные после 14-дневного срока, не принимаются.

9.4. ⚖️ ПРЕДЕЛ ОТВЕТСТВЕННОСТИ (КРИТИЧНО):
Общая ответственность Продавца по настоящему Контракту не может превышать 5% (пяти процентов) от общей стоимости Контракта. Данное ограничение применяется ко всем претензиям любого характера, без исключений.`,
    tooltipKey: "Claims Period",
    critical: true,
  },
  {
    id: 10,
    title_en: "10. CLAIMS AND DISPUTES RESOLUTION",
    title_ru: "10. ПРЕТЕНЗИИ И РАЗРЕШЕНИЕ СПОРОВ",
    body_en: () => `
10.1. All claims must be submitted in writing (email is acceptable) within the period specified in clause 9.

10.2. The Parties shall attempt to resolve all disputes through good-faith negotiations within 30 (thirty) calendar days.

10.3. If amicable settlement is not reached, the dispute shall be referred to arbitration as per clause 12.

10.4. Acceptable claim resolutions: (a) replacement of defective Goods in next shipment, (b) partial refund / discount, (c) credit note for future orders.`,
    body_ru: () => `
10.1. Все претензии направляются в письменной форме (электронная почта допускается) в сроки, указанные в п.9.

10.2. Стороны прилагают усилия для разрешения всех споров путём добросовестных переговоров в течение 30 (тридцати) календарных дней.

10.3. Если мировое соглашение не достигнуто, спор передаётся в арбитраж согласно п.12.

10.4. Возможные способы урегулирования: (а) замена дефектного Товара в следующей отгрузке, (б) частичный возврат / скидка, (в) кредит-нота на будущие заказы.`,
  },
  {
    id: 11,
    title_en: "11. FORCE MAJEURE",
    title_ru: "11. ФОРС-МАЖОР",
    body_en: () => `
11.1. Neither Party shall be liable for failure or delay in performance of obligations due to circumstances beyond reasonable control ("Force Majeure"), including but not limited to:
(a) War, military operations, terrorism, civil unrest, revolution
(b) Natural disasters (earthquake, flood, hurricane, fire)
(c) Epidemics, pandemics, government quarantine measures
(d) Strikes, lockouts, port closures
(e) Acts or omissions of governmental authorities
(f) **International sanctions, embargoes, restrictions imposed by any country or international body (including but not limited to USA, EU, UK)**
(g) **Refusal of banks to process payments due to sanctions or compliance reasons**
(h) **SWIFT blockade or restrictions affecting Russian financial institutions**
(i) **Government-imposed export bans or restrictions**

11.2. The affected Party shall notify the other Party in writing within 10 (ten) calendar days of the Force Majeure event, with supporting evidence (Chamber of Commerce certificate or equivalent).

11.3. If Force Majeure continues for more than 60 (sixty) calendar days, either Party may terminate this Contract without liability, with full refund of advance payments received.

11.4. Force Majeure does not release Parties from obligations that arose before the event.`,
    body_ru: () => `
11.1. Ни одна из Сторон не несёт ответственности за неисполнение или задержку в исполнении обязательств вследствие обстоятельств непреодолимой силы («Форс-мажор»), включая, помимо прочего:
(а) Война, военные действия, терроризм, гражданские беспорядки, революция
(б) Стихийные бедствия (землетрясение, наводнение, ураган, пожар)
(в) Эпидемии, пандемии, государственные карантинные меры
(г) Забастовки, локауты, закрытие портов
(д) Действия или бездействие государственных органов
(е) **Международные санкции, эмбарго, ограничения, введённые любой страной или международной организацией (включая, помимо прочего, США, ЕС, Великобританию)**
(ж) **Отказ банков проводить платежи в связи с санкциями или комплаенсом**
(з) **Блокада SWIFT или ограничения, влияющие на российские финансовые институты**
(и) **Государственные запреты или ограничения на экспорт**

11.2. Пострадавшая Сторона уведомляет другую Сторону в письменной форме в течение 10 (десяти) календарных дней с момента наступления форс-мажора, с подтверждающими документами (сертификат Торгово-промышленной палаты или эквивалент).

11.3. Если форс-мажор продолжается более 60 (шестидесяти) календарных дней, любая Сторона вправе расторгнуть Контракт без ответственности с полным возвратом полученных авансовых платежей.

11.4. Форс-мажор не освобождает Стороны от обязательств, возникших до его наступления.`,
    tooltipKey: "Force Majeure",
    critical: true,
  },
  {
    id: 12,
    title_en: "12. ARBITRATION AND GOVERNING LAW",
    title_ru: "12. АРБИТРАЖ И ПРИМЕНИМОЕ ПРАВО",
    body_en: () => `
12.1. All disputes arising from or in connection with this Contract shall be finally settled by the International Commercial Arbitration Court at the Chamber of Commerce and Industry of the Russian Federation (ICAC Moscow) in accordance with its Rules.

12.2. Place of arbitration: Moscow, Russian Federation.

12.3. Number of arbitrators: one (1).

12.4. Language of arbitration: English (with Russian translation of evidence where applicable).

12.5. Governing Law: The substantive law of the Russian Federation, including the UN Convention on Contracts for the International Sale of Goods 1980 (CISG), shall apply to this Contract.

12.6. The arbitration award shall be final and binding on the Parties. The award shall be enforceable under the New York Convention 1958 in any signatory country, including but not limited to India, China, UAE, EU member states.`,
    body_ru: () => `
12.1. Все споры, возникающие из настоящего Контракта или в связи с ним, окончательно разрешаются Международным коммерческим арбитражным судом при Торгово-промышленной палате Российской Федерации (МКАС при ТПП РФ, г. Москва) в соответствии с его Регламентом.

12.2. Место арбитража: Москва, Российская Федерация.

12.3. Количество арбитров: один (1).

12.4. Язык арбитража: английский (с переводом доказательств на русский, где применимо).

12.5. Применимое право: К настоящему Контракту применяется материальное право Российской Федерации, включая Венскую конвенцию ООН о договорах международной купли-продажи товаров 1980 года (CISG).

12.6. Решение арбитража является окончательным и обязательным для Сторон. Решение подлежит исполнению согласно Нью-Йоркской конвенции 1958 года в любой стране-участнице, включая, помимо прочего, Индию, Китай, ОАЭ, страны-члены ЕС.`,
    tooltipKey: "ICAC Moscow",
    critical: true,
  },
  {
    id: 13,
    title_en: "13. CONFIDENTIALITY",
    title_ru: "13. КОНФИДЕНЦИАЛЬНОСТЬ",
    body_en: () => `
13.1. The Parties agree to keep the terms of this Contract, including prices, volumes, and any commercial information, strictly confidential.

13.2. Confidential information shall not be disclosed to third parties without prior written consent of the other Party, except as required by law or court order.

13.3. This obligation survives the termination of the Contract for a period of 3 (three) years.`,
    body_ru: () => `
13.1. Стороны обязуются сохранять условия настоящего Контракта, включая цены, объёмы и любую коммерческую информацию, в строгой конфиденциальности.

13.2. Конфиденциальная информация не может быть передана третьим лицам без предварительного письменного согласия другой Стороны, за исключением случаев, требуемых законом или судебным решением.

13.3. Данное обязательство сохраняет силу в течение 3 (трёх) лет после прекращения Контракта.`,
    tooltipKey: "Confidentiality",
  },
  {
    id: 14,
    title_en: "14. GENERAL PROVISIONS",
    title_ru: "14. ОБЩИЕ ПОЛОЖЕНИЯ",
    body_en: (data) => `
14.1. This Contract is executed in 2 (two) original copies in English and Russian languages, one for each Party. In case of discrepancy, the English version shall prevail.

14.2. Any amendments and additions to this Contract shall be valid only if made in writing and signed by both Parties.

14.3. This Contract supersedes all prior negotiations, agreements and understandings between the Parties.

14.4. Neither Party may assign rights or obligations under this Contract without written consent of the other Party.

14.5. This Contract enters into force on the date of signing by both Parties and remains valid until full performance of all obligations, but no later than ${data.contractExpiryDate}.

14.6. Notices: All notices shall be sent by email to the addresses specified in clause 1, and considered received on the next business day.`,
    body_ru: (data) => `
14.1. Контракт составлен в 2 (двух) оригинальных экземплярах на английском и русском языках, по одному для каждой Стороны. В случае расхождений преимущественную силу имеет английская версия.

14.2. Любые изменения и дополнения к Контракту действительны только при оформлении в письменной форме и подписании обеими Сторонами.

14.3. Настоящий Контракт заменяет все предыдущие переговоры, соглашения и договорённости между Сторонами.

14.4. Ни одна из Сторон не вправе уступать права или обязательства по Контракту без письменного согласия другой Стороны.

14.5. Контракт вступает в силу с даты подписания обеими Сторонами и действует до полного исполнения всех обязательств, но не позднее ${data.contractExpiryDate}.

14.6. Уведомления: Все уведомления направляются по электронной почте по адресам, указанным в п.1, и считаются полученными на следующий рабочий день.`,
  },
  {
    id: 15,
    title_en: "15. BANKING DETAILS AND SIGNATURES",
    title_ru: "15. БАНКОВСКИЕ РЕКВИЗИТЫ И ПОДПИСИ",
    body_en: (data) => `
SELLER'S BANKING DETAILS (Russian Federation):
Beneficiary: ${data.sellerName}
Bank: ${data.sellerBank}
SWIFT: ${data.sellerSwift}
Account (USD): ${data.sellerAccount}
Correspondent Bank: ${data.sellerCorrespondent}

⚖️ Note: Per clause 6.6, payment obligation is fulfilled only upon crediting of funds to this account in the Russian Federation.

BUYER'S BANKING DETAILS:
[To be provided by the Buyer]

SIGNED FOR AND ON BEHALF OF THE SELLER:

_______________________
${data.sellerDirector}
${data.sellerName}
Stamp & Signature
Date: _____________

SIGNED FOR AND ON BEHALF OF THE BUYER:

_______________________
${data.buyerDirector || "[Buyer Representative]"}
${data.buyerName}
Stamp & Signature
Date: _____________`,
    body_ru: (data) => `
БАНКОВСКИЕ РЕКВИЗИТЫ ПРОДАВЦА (Российская Федерация):
Бенефициар: ${data.sellerName}
Банк: ${data.sellerBank}
SWIFT: ${data.sellerSwift}
Счёт (USD): ${data.sellerAccount}
Банк-корреспондент: ${data.sellerCorrespondent}

⚖️ Примечание: Согласно п. 6.6, обязательство по оплате считается исполненным только с момента зачисления средств на данный счёт в Российской Федерации.

БАНКОВСКИЕ РЕКВИЗИТЫ ПОКУПАТЕЛЯ:
[Предоставляются Покупателем]

ПОДПИСАНО ОТ ИМЕНИ ПРОДАВЦА:

_______________________
${data.sellerDirector}
${data.sellerName}
Печать и подпись
Дата: _____________

ПОДПИСАНО ОТ ИМЕНИ ПОКУПАТЕЛЯ:

_______________________
${data.buyerDirector || "[Представитель Покупателя]"}
${data.buyerName}
Печать и подпись
Дата: _____________`,
  },
];

// END OF FILE