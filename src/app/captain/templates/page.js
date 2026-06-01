"use client";
import { useState } from "react";
import Link from "next/link";
import CaptainGate from "../CaptainGate";
import { useCustomers } from "../../hooks/useCustomers";
import { useBusinessSettings } from "../../hooks/useBusinessSettings";

// ============ ШАБЛОНЫ ============
const TEMPLATES = [
  // ===== 1. COLD OUTREACH =====
  {
    id: "cold-outreach",
    category: "first-touch",
    icon: "🎯",
    title: "Cold Outreach (First Touch)",
    description: "Первое касание потенциального покупателя",
    channel: "email",
    languages: {
      en: {
        subject: "Premium Russian Pine Timber — Direct from Vologda Mills",
        body: `Dear {NAME},

I hope this message finds you well.

My name is {SENDER_NAME}, founder of {COMPANY_EN} — a Russian timber exporter specializing in premium pine (Pinus sylvestris) from Vologda region.

I'm reaching out because {COMPANY} could benefit from our direct mill-to-port supply chain:

✓ Premium Pine, GOST 8486-86, Grade 1-3
✓ KD 10-12% moisture, AST treatment
✓ Direct from Vologda mills — no intermediaries
✓ {DEFAULT_PORT} → your port (transit ~{TRANSIT_DAYS} days)
✓ 40HC containers, ~58 m³ per container
✓ {PAYMENT_TERMS}

We can offer competitive CIF prices for {COUNTRY} market.

Would you be open to a brief WhatsApp call this week to discuss your specifications and pricing?

Best regards,
{SENDER_NAME}
{POSITION}
{COMPANY_EN}
📞 {PHONE}
📧 {EMAIL}
🌐 {WEBSITE}`
      },
      ru: {
        subject: "Премиум сосна из Вологды — прямые поставки",
        body: `Уважаемый {NAME},

Меня зовут {SENDER_NAME}, я основатель {COMPANY} — экспортёра премиального пиломатериала из Вологодской области.

Связываюсь с вами потому что {COMPANY} может быть интересна наша прямая цепочка поставок от лесопилки до порта:

✓ Сосна премиум, ГОСТ 8486-86, сорт 1-3
✓ Камерная сушка 10-12%, антисептическая обработка
✓ Прямо с лесопилок Вологды — без посредников
✓ {DEFAULT_PORT} → ваш порт (транзит ~{TRANSIT_DAYS} дней)
✓ Контейнеры 40HC, ~58 м³ каждый
✓ {PAYMENT_TERMS_RU}

Готовы предложить конкурентные цены CIF для рынка {COUNTRY}.

Удобно ли вам обсудить детали в WhatsApp на этой неделе?

С уважением,
{SENDER_NAME}
{POSITION}
{COMPANY}
📞 {PHONE}
📧 {EMAIL}`
      },
      ar: {
        subject: "خشب الصنوبر الروسي الفاخر — مباشرة من مصانع فولوغدا",
        body: `السيد {NAME} المحترم،

السلام عليكم ورحمة الله وبركاته،

اسمي {SENDER_NAME}، مؤسس شركة {COMPANY_EN} — مُصدِّر روسي متخصص في خشب الصنوبر الفاخر (Pinus sylvestris) من منطقة فولوغدا.

أتواصل معكم لأن شركة {COMPANY} قد تستفيد من سلسلة التوريد المباشرة من المصنع إلى الميناء:

✓ صنوبر فاخر، معيار GOST 8486-86، درجة 1-3
✓ رطوبة 10-12%، معالجة AST
✓ مباشرة من مصانع فولوغدا — بدون وسطاء
✓ {DEFAULT_PORT} ← ميناءكم (المدة ~{TRANSIT_DAYS} يوم)
✓ حاويات 40HC، حوالي 58 م³ لكل حاوية
✓ {PAYMENT_TERMS}

نقدم أسعار CIF تنافسية لسوق {COUNTRY}.

هل يمكن ترتيب مكالمة قصيرة عبر واتساب هذا الأسبوع لمناقشة المواصفات والأسعار؟

مع أطيب التحيات،
{SENDER_NAME}
{POSITION}
{COMPANY_EN}
📞 {PHONE}
📧 {EMAIL}
🌐 {WEBSITE}`
      },
    },
  },

  // ===== 2. FOLLOW-UP #1 =====
  {
    id: "followup-1",
    category: "followup",
    icon: "🔁",
    title: "Follow-up #1 (after 3 days)",
    description: "Через 3 дня после первого письма",
    channel: "email",
    languages: {
      en: {
        subject: "Re: Premium Russian Pine — Quick Question",
        body: `Hi {NAME},

Just following up on my previous message about Russian pine timber supply.

I understand you're busy — would a quick 5-minute WhatsApp call be easier to discuss your needs?

Or if you prefer email, please share:
• Required dimensions (e.g., 50×150×6000mm)
• Approximate monthly volume
• Destination port

I'll send you a detailed quotation within 24 hours.

Best regards,
{SENDER_NAME}
📞 WhatsApp: {WHATSAPP}`
      },
      ru: {
        subject: "Re: Премиум сосна — короткий вопрос",
        body: `Здравствуйте, {NAME}!

Возвращаюсь к моему предыдущему сообщению о поставках пиломатериала из России.

Понимаю, что вы заняты — возможно проще обсудить в коротком звонке WhatsApp (5 минут)?

Или если предпочитаете email, поделитесь:
• Нужные размеры (например, 50×150×6000мм)
• Примерный месячный объём
• Порт назначения

Подготовлю детальную квотацию в течение 24 часов.

С уважением,
{SENDER_NAME}
📞 WhatsApp: {WHATSAPP}`
      },
      ar: {
        subject: "Re: الصنوبر الروسي الفاخر — سؤال سريع",
        body: `السلام عليكم، {NAME}،

أتابع رسالتي السابقة بخصوص توريد خشب الصنوبر الروسي.

أتفهم انشغالكم — هل تفضلون مكالمة قصيرة (5 دقائق) عبر واتساب؟

أو إذا كنتم تفضلون البريد الإلكتروني، يرجى مشاركة:
• المقاسات المطلوبة (مثلاً 50×150×6000 مم)
• الكمية الشهرية التقريبية
• ميناء الوصول

سأرسل عرض سعر مفصل خلال 24 ساعة.

مع التحية،
{SENDER_NAME}
📞 واتساب: {WHATSAPP}`
      },
    },
  },

  // ===== 3. FOLLOW-UP #2 =====
  {
    id: "followup-2",
    category: "followup",
    icon: "📌",
    title: "Follow-up #2 (after 7 days)",
    description: "Через неделю — последняя попытка",
    channel: "email",
    languages: {
      en: {
        subject: "Last Follow-up — Russian Pine Timber",
        body: `Hi {NAME},

This will be my last follow-up so I don't fill your inbox.

If timber import isn't a priority right now — no problem, I understand.

If your needs change in the future, here's my direct WhatsApp: {WHATSAPP}

You can also visit our website: {WEBSITE}

Wishing you all the best,
{SENDER_NAME}
{COMPANY_EN}`
      },
      ru: {
        subject: "Последнее напоминание — сосна из России",
        body: `Здравствуйте, {NAME}!

Это моё последнее напоминание — не хочу засорять ваш inbox.

Если пиломатериал сейчас не в приоритете — это нормально, понимаю.

Если в будущем появится потребность, мой прямой WhatsApp: {WHATSAPP}

Также можно посмотреть наш сайт: {WEBSITE}

Желаю всего наилучшего,
{SENDER_NAME}
{COMPANY}`
      },
      ar: {
        subject: "آخر متابعة — خشب الصنوبر الروسي",
        body: `السلام عليكم، {NAME}،

هذه آخر متابعة مني حتى لا أزعجكم.

إذا لم يكن استيراد الخشب من أولوياتكم حالياً — لا مشكلة، أتفهم ذلك.

إذا تغيرت احتياجاتكم مستقبلاً، رقم واتسابي المباشر: {WHATSAPP}

يمكنكم أيضاً زيارة موقعنا: {WEBSITE}

مع أطيب الأمنيات،
{SENDER_NAME}
{COMPANY_EN}`
      },
    },
  },

  // ===== 4. QUOTATION COVER LETTER =====
  {
    id: "quotation-cover",
    category: "quotation",
    icon: "📄",
    title: "Quotation Cover Letter",
    description: "Сопроводительное письмо к квотации",
    channel: "email",
    languages: {
      en: {
        subject: "Quotation {QT_NUMBER} — Russian Pine Timber for {COMPANY}",
        body: `Dear {NAME},

Thank you for your interest in our Russian pine timber.

Please find attached our official Quotation {QT_NUMBER} with full specifications, pricing, and delivery terms.

Key highlights:
✓ {INCOTERM} {DEFAULT_PORT} → your destination
✓ Transit time: ~{TRANSIT_DAYS} days
✓ Payment: {PAYMENT_TERMS}
✓ Full documentation included (CO, Phyto, ISPM-15)

The quotation is valid for 14 days.

Next steps:
1. Review the quotation
2. Confirm specifications
3. We sign the Contract
4. You make 30% advance
5. Production starts immediately

Any questions — WhatsApp me anytime: {WHATSAPP}

Looking forward to your feedback.

Best regards,
{SENDER_NAME}
{POSITION}
{COMPANY_EN}`
      },
      ru: {
        subject: "Квотация {QT_NUMBER} — Пиломатериал для {COMPANY}",
        body: `Уважаемый {NAME},

Благодарю за интерес к нашему пиломатериалу.

Во вложении официальная квотация {QT_NUMBER} с полными спецификациями, ценами и условиями поставки.

Ключевые моменты:
✓ {INCOTERM} {DEFAULT_PORT} → ваш порт
✓ Транзит: ~{TRANSIT_DAYS} дней
✓ Оплата: {PAYMENT_TERMS_RU}
✓ Полный пакет документов (СТ-1, Фито, ISPM-15)

Квотация действительна 14 дней.

Следующие шаги:
1. Проверка квотации
2. Подтверждение спецификаций
3. Подписание контракта
4. Предоплата 30%
5. Запуск производства

Вопросы — пишите в WhatsApp: {WHATSAPP}

Жду обратной связи.

С уважением,
{SENDER_NAME}
{POSITION}
{COMPANY}`
      },
      ar: {
        subject: "عرض السعر {QT_NUMBER} — خشب الصنوبر الروسي لـ {COMPANY}",
        body: `السيد {NAME} المحترم،

شكراً لاهتمامكم بخشب الصنوبر الروسي.

تجدون في المرفقات عرض السعر الرسمي رقم {QT_NUMBER} مع المواصفات الكاملة والأسعار وشروط التسليم.

النقاط الرئيسية:
✓ {INCOTERM} {DEFAULT_PORT} ← ميناء الوصول
✓ مدة النقل: ~{TRANSIT_DAYS} يوم
✓ الدفع: {PAYMENT_TERMS}
✓ المستندات الكاملة (شهادة المنشأ، الصحة النباتية، ISPM-15)

عرض السعر صالح لمدة 14 يوماً.

الخطوات التالية:
1. مراجعة عرض السعر
2. تأكيد المواصفات
3. توقيع العقد
4. دفع 30% مقدماً
5. بدء الإنتاج فوراً

أي استفسارات — واتساب في أي وقت: {WHATSAPP}

أنتظر ردكم.

مع أطيب التحيات،
{SENDER_NAME}
{POSITION}
{COMPANY_EN}`
      },
    },
  },

  // ===== 5. NEGOTIATION REPLY =====
  {
    id: "negotiation-price",
    category: "negotiation",
    icon: "💰",
    title: "Price Negotiation Reply",
    description: "Ответ на просьбу снизить цену",
    channel: "email",
    languages: {
      en: {
        subject: "Re: Quotation {QT_NUMBER} — Pricing Discussion",
        body: `Dear {NAME},

Thank you for your detailed feedback on Quotation {QT_NUMBER}.

I understand price is important. Let me be transparent:

Our quoted price reflects:
• Premium GOST 8486-86 quality (not commercial grade)
• KD 10-12% (not air-dried)
• Direct mill — no intermediaries
• Full documentation included
• Marine insurance included
• Telex Release (no DHL fees)

However, I can offer some flexibility:

OPTION A: Volume discount
   2+ containers/month → -3%
   5+ containers/month → -5%

OPTION B: Faster payment
   50% advance + 50% before loading → -2%
   100% advance → -4%

OPTION C: Long-term contract
   12-month commitment → -5% locked in

Which option works best for {COMPANY}?

I'm flexible — let's find a win-win.

Best regards,
{SENDER_NAME}`
      },
      ru: {
        subject: "Re: Квотация {QT_NUMBER} — обсуждение цены",
        body: `Уважаемый {NAME},

Спасибо за обратную связь по квотации {QT_NUMBER}.

Понимаю что цена важна. Будьте откровенными:

Наша цена отражает:
• Премиум качество ГОСТ 8486-86 (не коммерческий сорт)
• Камерная сушка 10-12% (не атмосферная)
• Прямо с лесопилки — без посредников
• Полный пакет документов
• Страхование груза включено
• Telex Release (без курьерских расходов DHL)

Но я готов к гибкости:

ВАРИАНТ A: Скидка за объём
   2+ контейнера/месяц → -3%
   5+ контейнеров/месяц → -5%

ВАРИАНТ B: Быстрая оплата
   50% предоплата + 50% перед погрузкой → -2%
   100% предоплата → -4%

ВАРИАНТ C: Долгосрочный контракт
   12 месяцев → -5% фиксированно

Какой вариант больше подходит {COMPANY}?

Я гибок — найдём win-win.

С уважением,
{SENDER_NAME}`
      },
      ar: {
        subject: "Re: عرض السعر {QT_NUMBER} — مناقشة الأسعار",
        body: `السيد {NAME} المحترم،

شكراً على ملاحظاتكم التفصيلية حول عرض السعر {QT_NUMBER}.

أتفهم أهمية السعر. دعوني أكون صريحاً:

سعرنا يعكس:
• جودة GOST 8486-86 الفاخرة (ليست تجارية)
• تجفيف KD 10-12% (ليس هواء)
• مباشرة من المصنع — بدون وسطاء
• كامل المستندات
• تأمين الشحن مشمول
• Telex Release (بدون رسوم DHL)

ولكني مرن:

الخيار A: خصم الكمية
   2+ حاوية/شهر → -3%
   5+ حاويات/شهر → -5%

الخيار B: دفع أسرع
   50% مقدم + 50% قبل التحميل → -2%
   100% مقدم → -4%

الخيار C: عقد طويل المدى
   التزام 12 شهراً → -5% ثابت

أي خيار يناسب {COMPANY} أكثر؟

أنا مرن — لنجد حلاً يربح فيه الطرفان.

مع التحية،
{SENDER_NAME}`
      },
    },
  },

  // ===== 6. SAMPLE REQUEST =====
  {
    id: "sample-request",
    category: "negotiation",
    icon: "📦",
    title: "Sample Request Response",
    description: "Ответ на запрос образцов",
    channel: "email",
    languages: {
      en: {
        subject: "Re: Sample Request — Russian Pine",
        body: `Dear {NAME},

Thank you for considering us seriously enough to request samples.

Sample policy:
• Small samples (1-2 boards): FREE — we cover product cost
• Buyer covers shipping (~$80-150 DHL to {COUNTRY})
• Delivery: 5-7 business days

Alternative — HD photo/video review:
• Detailed 4K video of actual stock
• Multiple angles, moisture meter reading on camera
• Free, ready in 24 hours

Many international buyers accept video review for first orders, especially given our GOST certification + Phyto + ISPM-15 documentation.

Which would you prefer?

Best regards,
{SENDER_NAME}`
      },
      ru: {
        subject: "Re: Запрос образцов — сосна из России",
        body: `Уважаемый {NAME},

Спасибо что серьёзно рассматриваете нас.

Политика по образцам:
• Маленькие образцы (1-2 доски): БЕСПЛАТНО — покрываем стоимость
• Покупатель оплачивает доставку (~$80-150 DHL до {COUNTRY})
• Срок: 5-7 рабочих дней

Альтернатива — HD фото/видео:
• Детальное видео 4K реального склада
• Множество ракурсов, замер влажности на камеру
• Бесплатно, готово за 24 часа

Многие международные покупатели принимают видео-обзор для первых заказов, особенно с нашими сертификатами ГОСТ + Фито + ISPM-15.

Что предпочитаете?

С уважением,
{SENDER_NAME}`
      },
      ar: {
        subject: "Re: طلب عينات — الصنوبر الروسي",
        body: `السيد {NAME} المحترم،

شكراً لاهتمامكم الجاد بطلب العينات.

سياسة العينات:
• عينات صغيرة (1-2 لوح): مجاناً — نتحمل تكلفة المنتج
• المشتري يتحمل الشحن (~80-150 دولار DHL إلى {COUNTRY})
• التسليم: 5-7 أيام عمل

البديل — فيديو HD:
• فيديو 4K تفصيلي للمخزون الفعلي
• زوايا متعددة، قياس الرطوبة على الكاميرا
• مجاناً، جاهز خلال 24 ساعة

كثير من المشترين الدوليين يقبلون مراجعة الفيديو للطلبات الأولى، خاصة مع شهادات GOST + الصحة النباتية + ISPM-15.

ماذا تفضلون؟

مع التحية،
{SENDER_NAME}`
      },
    },
  },

  // ===== 7. CONTRACT SENDING =====
  {
    id: "contract-sending",
    category: "closing",
    icon: "📜",
    title: "Contract Sending",
    description: "Отправка контракта",
    channel: "email",
    languages: {
      en: {
        subject: "Sales Contract — {COMPANY} & {COMPANY_EN}",
        body: `Dear {NAME},

Thank you for confirming our Quotation {QT_NUMBER}.

Please find attached:
1. International Sales Contract (EN + RU bilingual)
2. Banking details for advance payment
3. Production timeline

Please review carefully and return signed scan within 3 business days.

After signing:
• Day 1: You send 30% advance via SWIFT
• Day 2-3: Funds arrive at our bank
• Day 4: Production starts
• Day {TRANSIT_DAYS_PROD}: Container ready at port
• Day {TRANSIT_DAYS_TOTAL}: Arrival at your port

If you have any questions about contract terms — let's discuss before signing.

Best regards,
{SENDER_NAME}
{POSITION}
{COMPANY_EN}`
      },
      ru: {
        subject: "Контракт купли-продажи — {COMPANY} и {COMPANY_EN}",
        body: `Уважаемый {NAME},

Спасибо за подтверждение квотации {QT_NUMBER}.

Во вложении:
1. Международный контракт купли-продажи (EN + RU двуязычный)
2. Банковские реквизиты для предоплаты
3. График производства

Прошу внимательно изучить и вернуть подписанный скан в течение 3 рабочих дней.

После подписания:
• День 1: Вы отправляете 30% предоплаты SWIFT
• День 2-3: Поступление средств на наш счёт
• День 4: Запуск производства
• День {TRANSIT_DAYS_PROD}: Контейнер готов в порту
• День {TRANSIT_DAYS_TOTAL}: Прибытие в ваш порт

Вопросы по условиям контракта — обсудим до подписания.

С уважением,
{SENDER_NAME}
{POSITION}
{COMPANY}`
      },
      ar: {
        subject: "عقد البيع — {COMPANY} و {COMPANY_EN}",
        body: `السيد {NAME} المحترم،

شكراً لتأكيد عرض السعر {QT_NUMBER}.

تجدون في المرفقات:
1. عقد البيع الدولي (ثنائي اللغة EN + RU)
2. التفاصيل المصرفية للدفعة المقدمة
3. الجدول الزمني للإنتاج

يرجى المراجعة بعناية وإعادة النسخة الموقعة خلال 3 أيام عمل.

بعد التوقيع:
• اليوم 1: ترسلون 30% مقدماً عبر SWIFT
• اليوم 2-3: وصول الأموال إلى بنكنا
• اليوم 4: بدء الإنتاج
• اليوم {TRANSIT_DAYS_PROD}: الحاوية جاهزة في الميناء
• اليوم {TRANSIT_DAYS_TOTAL}: الوصول إلى ميناءكم

أي أسئلة حول بنود العقد — لنناقشها قبل التوقيع.

مع التحية،
{SENDER_NAME}
{POSITION}
{COMPANY_EN}`
      },
    },
  },

  // ===== 8. PAYMENT REMINDER =====
  {
    id: "payment-reminder",
    category: "closing",
    icon: "💸",
    title: "Payment Confirmation Request",
    description: "Запрос подтверждения оплаты",
    channel: "whatsapp",
    languages: {
      en: {
        subject: "",
        body: `Hi {NAME},

Quick check — has the 30% advance for Contract been sent?

Please share SWIFT confirmation (MT103 or screenshot) so we can track and start production immediately.

Production timeline depends on payment arrival, so the sooner the better.

Thanks!
{SENDER_NAME}`
      },
      ru: {
        subject: "",
        body: `Здравствуйте, {NAME}!

Короткий вопрос — была ли отправлена предоплата 30% по контракту?

Прошу скинуть подтверждение SWIFT (MT103 или скриншот), чтобы мы могли отследить и сразу запустить производство.

Сроки производства зависят от поступления — чем быстрее, тем лучше.

Спасибо!
{SENDER_NAME}`
      },
      ar: {
        subject: "",
        body: `السلام عليكم، {NAME}،

استفسار سريع — هل تم إرسال الدفعة المقدمة 30% للعقد؟

يرجى مشاركة تأكيد SWIFT (MT103 أو لقطة شاشة) لنتمكن من المتابعة وبدء الإنتاج فوراً.

الجدول الزمني للإنتاج يعتمد على وصول الدفعة، فكلما أسرع كان أفضل.

شكراً!
{SENDER_NAME}`
      },
    },
  },

  // ===== 9. SHIPMENT NOTIFICATION =====
  {
    id: "shipment-notification",
    category: "logistics",
    icon: "🚢",
    title: "Shipment Notification",
    description: "Уведомление об отправке",
    channel: "email",
    languages: {
      en: {
        subject: "Container Shipped — {COMPANY} order",
        body: `Dear {NAME},

Great news — your container has been shipped! 🚢

Shipment details:
• Vessel: [VESSEL_NAME]
• Container №: [CONTAINER_NUMBER]
• Booking №: [BOOKING_REF]
• ETD {DEFAULT_PORT}: [DATE]
• ETA your port: [DATE]
• Transit time: ~{TRANSIT_DAYS} days

Documents attached:
✓ Commercial Invoice
✓ Packing List
✓ Bill of Lading (Telex Release)
✓ Certificate of Origin
✓ Phytosanitary Certificate
✓ ISPM-15 Fumigation Certificate
✓ Marine Insurance Policy
✓ Pre-shipment Photos

After 70% payment arrives, we'll release the Telex — no DHL needed.

Track your container: https://www.searates.com/container/tracking/

Any questions — WhatsApp me anytime.

Best regards,
{SENDER_NAME}`
      },
      ru: {
        subject: "Контейнер отправлен — заказ {COMPANY}",
        body: `Уважаемый {NAME},

Отличные новости — ваш контейнер отправлен! 🚢

Детали отгрузки:
• Судно: [НАЗВАНИЕ]
• Контейнер №: [НОМЕР]
• Букинг №: [НОМЕР]
• ETD {DEFAULT_PORT}: [ДАТА]
• ETA ваш порт: [ДАТА]
• Транзит: ~{TRANSIT_DAYS} дней

Документы во вложении:
✓ Commercial Invoice
✓ Packing List
✓ Bill of Lading (Telex Release)
✓ Сертификат происхождения
✓ Фитосанитарный сертификат
✓ Сертификат фумигации ISPM-15
✓ Полис страхования
✓ Фото до отгрузки

После получения 70% оплаты — открываем Telex Release, без DHL.

Отслеживание: https://www.searates.com/container/tracking/

Вопросы — пишите в WhatsApp.

С уважением,
{SENDER_NAME}`
      },
      ar: {
        subject: "تم شحن الحاوية — طلب {COMPANY}",
        body: `السيد {NAME} المحترم،

أخبار رائعة — تم شحن حاويتكم! 🚢

تفاصيل الشحنة:
• السفينة: [اسم السفينة]
• رقم الحاوية: [الرقم]
• رقم الحجز: [المرجع]
• المغادرة من {DEFAULT_PORT}: [التاريخ]
• الوصول إلى ميناءكم: [التاريخ]
• المدة: ~{TRANSIT_DAYS} يوم

المستندات في المرفقات:
✓ فاتورة تجارية
✓ قائمة التعبئة
✓ بوليصة الشحن (Telex Release)
✓ شهادة المنشأ
✓ شهادة الصحة النباتية
✓ شهادة التبخير ISPM-15
✓ بوليصة التأمين البحري
✓ صور ما قبل الشحن

بعد وصول 70% من الدفعة، نُفعل Telex Release — بدون DHL.

التتبع: https://www.searates.com/container/tracking/

أي أسئلة — واتساب في أي وقت.

مع التحية،
{SENDER_NAME}`
      },
    },
  },

  // ===== 10. AFTER-SALE =====
  {
    id: "after-sale",
    category: "loyalty",
    icon: "🤝",
    title: "After-Sale Follow-up",
    description: "Через неделю после получения",
    channel: "whatsapp",
    languages: {
      en: {
        subject: "",
        body: `Hi {NAME},

Hope the container arrived in good condition. ✅

Quick questions for our quality records:
• Was packaging intact?
• Moisture & dimensions as expected?
• Any issues we should know about?

Your honest feedback helps us improve.

Also — if everything was good, would you consider:
• Repeat order for next month?
• Locking in price for 3-month contract (-3%)?
• Referring partners in {COUNTRY}?

Thanks again for trusting us with your first order!

{SENDER_NAME}
{COMPANY_EN}`
      },
      ru: {
        subject: "",
        body: `Здравствуйте, {NAME}!

Надеюсь контейнер пришёл в хорошем состоянии. ✅

Короткие вопросы для наших записей качества:
• Целая ли упаковка?
• Влажность и размеры как ожидалось?
• Есть ли проблемы?

Ваш честный отзыв помогает нам улучшаться.

И — если всё было хорошо, рассмотрите:
• Повторный заказ на следующий месяц?
• Фиксированная цена на 3 месяца (-3%)?
• Рекомендация партнёрам в {COUNTRY}?

Ещё раз спасибо за доверие первому заказу!

{SENDER_NAME}
{COMPANY}`
      },
      ar: {
        subject: "",
        body: `السلام عليكم، {NAME}،

أتمنى أن تكون الحاوية وصلت بحالة جيدة. ✅

أسئلة سريعة لسجلات الجودة لدينا:
• هل التغليف سليم؟
• الرطوبة والأبعاد كما هو متوقع؟
• أي مشاكل يجب أن نعرفها؟

ملاحظاتكم الصادقة تساعدنا على التحسن.

وأيضاً — إذا كان كل شيء جيداً، هل تفكرون في:
• طلب متكرر للشهر القادم؟
• تثبيت السعر لعقد 3 أشهر (-3%)؟
• ترشيح شركاء في {COUNTRY}؟

شكراً مرة أخرى على ثقتكم في أول طلب!

{SENDER_NAME}
{COMPANY_EN}`
      },
    },
  },
];

const CATEGORIES = [
  { id: "all", label: "Все", icon: "📋" },
  { id: "first-touch", label: "Первое касание", icon: "🎯" },
  { id: "followup", label: "Follow-up", icon: "🔁" },
  { id: "quotation", label: "Квотация", icon: "📄" },
  { id: "negotiation", label: "Переговоры", icon: "💰" },
  { id: "closing", label: "Закрытие", icon: "📜" },
  { id: "logistics", label: "Логистика", icon: "🚢" },
  { id: "loyalty", label: "Лояльность", icon: "🤝" },
];

const LANGUAGES = [
  { id: "en", label: "🇬🇧 English", short: "EN" },
  { id: "ru", label: "🇷🇺 Русский", short: "RU" },
  { id: "ar", label: "🕌 العربية", short: "AR" },
];

// ============ MAIN COMPONENT ============

export default function TemplatesPage() {
  const { customers, isLoaded: customersLoaded } = useCustomers();
  const { settings, isLoaded: settingsLoaded } = useBusinessSettings();
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  if (!customersLoaded || !settingsLoaded) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  // Подстановка переменных
  const renderTemplate = (text) => {
    if (!text) return "";
    return text
      .replace(/{NAME}/g, selectedCustomer?.contactPerson || "[Buyer Name]")
      .replace(/{COMPANY}/g, selectedCustomer?.companyName || "[Buyer Company]")
      .replace(/{COUNTRY}/g, selectedCustomer?.country?.replace(/^[^\s]+\s/, "") || "[Country]")
      .replace(/{SENDER_NAME}/g, settings.signatureName || settings.fullName || "K. Semakin")
      .replace(/{POSITION}/g, settings.position || "Export Director")
      .replace(/{COMPANY_EN}/g, settings.companyNameEn || "RU-TIMBER Export")
      .replace(/{PHONE}/g, settings.phone || "")
      .replace(/{WHATSAPP}/g, settings.whatsapp || settings.phone || "")
      .replace(/{EMAIL}/g, settings.email || "")
      .replace(/{WEBSITE}/g, settings.website || "ru-timber.com")
      .replace(/{DEFAULT_PORT}/g, settings.defaultPort || "Novorossiysk")
      .replace(/{TRANSIT_DAYS}/g, settings.defaultTransitDays || 28)
      .replace(/{TRANSIT_DAYS_PROD}/g, "14")
      .replace(/{TRANSIT_DAYS_TOTAL}/g, (14 + (settings.defaultTransitDays || 28)))
      .replace(/{INCOTERM}/g, settings.defaultIncoterm || "CIF")
      .replace(/{PAYMENT_TERMS}/g, settings.paymentTerms || "30% advance + 70% B/L copy")
      .replace(/{PAYMENT_TERMS_RU}/g, settings.paymentTermsRu || "30% предоплата + 70% против копии B/L")
      .replace(/{QT_NUMBER}/g, "QT-2026-XXX");
  };

  // Фильтрация
  const filteredTemplates = TEMPLATES.filter(t => {
    if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = `${t.title} ${t.description} ${t.languages[selectedLanguage]?.body || ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  // Копирование
  const copyToClipboard = (templateId, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(templateId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Отправка в WhatsApp
  const sendWhatsApp = (text) => {
    const phone = selectedCustomer?.whatsapp?.replace(/[^\d]/g, "") 
                || selectedCustomer?.phone?.replace(/[^\d]/g, "")
                || "";
    const encoded = encodeURIComponent(text);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };

  // Отправка по Email (используем encodeURIComponent — пробелы → %20, не "+")
  const sendEmail = (subject, body) => {
    const to = selectedCustomer?.email || "";
    const encodedSubject = encodeURIComponent(subject || "");
    const encodedBody = encodeURIComponent(body || "");
    window.location.href = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  return (
    <CaptainGate>
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/captain" className="text-sm">← Captain</Link>
          <div className="text-xs font-mono">📧 TEMPLATES</div>
          <div className="text-xs text-slate-400">{filteredTemplates.length} / {TEMPLATES.length}</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Title */}
        <div className="bg-gradient-to-br from-cyan-700 to-blue-900 text-white rounded-xl p-5 shadow-lg">
          <h1 className="text-2xl font-black">📧 Sales Templates</h1>
          <p className="text-sm opacity-90 mt-1">
            Готовые шаблоны для холодных продаж · EN / RU / AR · Auto-fill из CRM
          </p>
        </div>

        {/* Customer Selector */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600">👥 Для клиента:</span>
            {selectedCustomer ? (
              <>
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg px-3 py-1.5 text-xs">
                  <span className="font-bold text-purple-900">{selectedCustomer.companyName}</span>
                  {selectedCustomer.contactPerson && (
                    <span className="text-purple-600"> · {selectedCustomer.contactPerson}</span>
                  )}
                </div>
                <button
                  onClick={() => setShowCustomerPicker(true)}
                  className="text-xs text-purple-600 hover:text-purple-800 underline"
                >
                  Change
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-rose-500 hover:text-rose-700 underline"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowCustomerPicker(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95"
                >
                  👥 Select Customer
                </button>
                <span className="text-xs text-slate-400">или будут placeholders {`{NAME}`}, {`{COMPANY}`}</span>
              </>
            )}
          </div>
        </div>

        {/* Language tabs */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
                  selectedLanguage === lang.id
                    ? "bg-cyan-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Categories */}
        <div className="bg-white rounded-xl p-3 shadow-sm space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Поиск по шаблонам..."
            className="w-full p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-cyan-500 outline-none"
          />
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all active:scale-95 ${
                  selectedCategory === cat.id
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates list */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-5xl mb-2">🔍</div>
            <div className="font-bold text-slate-700">Шаблонов не найдено</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map(t => {
              const lang = t.languages[selectedLanguage] || t.languages.en;
              const subject = renderTemplate(lang.subject);
              const body = renderTemplate(lang.body);
              const fullText = subject ? `${subject}\n\n${body}` : body;
              const isCopied = copiedId === t.id;
              const isRTL = selectedLanguage === "ar";

              return (
                <div key={t.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Card Header */}
                  <div className="p-4 border-b bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="text-3xl">{t.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-slate-900">{t.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                          <div className="flex gap-1 mt-1.5">
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                              {t.channel === "email" ? "📧 Email" : "💬 WhatsApp"}
                            </span>
                            <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded font-bold">
                              {LANGUAGES.find(l => l.id === selectedLanguage)?.short}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject (if email) */}
                  {subject && (
                    <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                      <div className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">Subject:</div>
                      <div className={`text-sm text-slate-900 font-semibold ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                        {subject}
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-4">
                    <pre 
                      className={`text-xs sm:text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed ${isRTL ? "text-right" : ""}`}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {body}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-slate-50 border-t flex flex-wrap gap-2">
                    <button
                      onClick={() => copyToClipboard(t.id, fullText)}
                      className={`flex-1 sm:flex-none text-xs font-bold px-3 py-2 rounded-lg active:scale-95 transition-all ${
                        isCopied
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {isCopied ? "✓ Copied!" : "📋 Copy Full"}
                    </button>
                    
                    {subject && (
                      <button
                        onClick={() => copyToClipboard(`${t.id}-subj`, subject)}
                        className={`text-xs font-bold px-3 py-2 rounded-lg active:scale-95 transition-all ${
                          copiedId === `${t.id}-subj`
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white hover:bg-amber-600"
                        }`}
                      >
                        {copiedId === `${t.id}-subj` ? "✓" : "📋 Subject"}
                      </button>
                    )}

                    <button
                      onClick={() => sendWhatsApp(fullText)}
                      className="text-xs font-bold px-3 py-2 rounded-lg active:scale-95 bg-emerald-500 hover:bg-emerald-600 text-white"
                      title={selectedCustomer?.whatsapp ? `→ ${selectedCustomer.whatsapp}` : "Open WhatsApp"}
                    >
                      💬 WhatsApp
                    </button>

                    {t.channel === "email" && (
                      <button
                        onClick={() => sendEmail(subject, body)}
                        className="text-xs font-bold px-3 py-2 rounded-lg active:scale-95 bg-blue-500 hover:bg-blue-600 text-white"
                        title={selectedCustomer?.email || "Open mail client"}
                      >
                        📧 Email
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center text-xs text-slate-400 pt-4">
          💡 Совет: выбери клиента сверху → переменные {`{NAME}`}, {`{COMPANY}`} заполнятся автоматически
        </div>
      </div>

      {/* Customer Picker Modal */}
      {showCustomerPicker && (
        <CustomerPickerModal
          customers={customers}
          onSelect={(c) => { setSelectedCustomer(c); setShowCustomerPicker(false); }}
          onClose={() => setShowCustomerPicker(false)}
        />
      )}
    </main>
    </CaptainGate>
  );
}

// ============ MODAL ============
function CustomerPickerModal({ customers, onSelect, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${c.companyName} ${c.contactPerson} ${c.country} ${c.email}`.toLowerCase().includes(q);
  });

  const tempOrder = { hot: 0, warm: 1, cold: 2 };
  const sorted = [...filtered].sort((a, b) => {
    return (tempOrder[a.temperature] ?? 3) - (tempOrder[b.temperature] ?? 3);
  });

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col rounded-t-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-black text-lg">👥 Select Customer</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl">✕</button>
        </div>
        <div className="p-3 border-b">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search..."
            autoFocus
            className="w-full p-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-2">👥</div>
              <div className="font-bold text-slate-700">Нет клиентов в CRM</div>
              <Link href="/captain/customers" className="inline-block mt-3 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded">
                ⚓ Open CRM →
              </Link>
            </div>
          ) : (
            sorted.map(c => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className="w-full text-left bg-slate-50 hover:bg-purple-50 border-2 border-transparent hover:border-purple-300 rounded-lg p-3 active:scale-[0.98]"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{c.companyName}</div>
                    {c.contactPerson && <div className="text-xs text-slate-600 truncate">{c.contactPerson}</div>}
                    {c.country && <div className="text-xs text-slate-500">{c.country}</div>}
                  </div>
                  {c.temperature === "hot" && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">🔥</span>}
                  {c.temperature === "warm" && <span className="text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold">🟡</span>}
                  {c.temperature === "cold" && <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">🧊</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// END OF FILE