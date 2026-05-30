"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>

      {/* ═══════════════════════════════════════════ */}
      {/*           ИСЛАМСКИЙ ГЕОМЕТРИЧЕСКИЙ ПАТТЕРН   */}
      {/* ═══════════════════════════════════════════ */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L37.5 22.5 L60 30 L37.5 37.5 L30 60 L22.5 37.5 L0 30 L22.5 22.5 Z" 
                  fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.2"/>
          </pattern>
        </defs>
      </svg>

      {/* ═══════════════════════════════════════════ */}
      {/*                     НАВИГАЦИЯ                */}
      {/* ═══════════════════════════════════════════ */}
      <nav className="bg-emerald-950 text-white sticky top-0 z-50 shadow-2xl border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Логотип с полумесяцем */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-lg flex items-center justify-center shadow-lg border border-amber-500/40">
              <span className="font-black text-2xl text-amber-400" style={{ fontFamily: 'var(--font-playfair), serif' }}>R</span>
              {/* Полумесяц в углу */}
              <svg className="absolute -top-1 -right-1 w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7 2 3 6 3 12s4 10 9 10c-3-2-5-5.5-5-10s2-8 5-10z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-widest text-white" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                RU-TIMBER
              </span>
              <span className="text-[10px] tracking-[0.3em] text-amber-400 -mt-1">HALAL CERTIFIED</span>
            </div>
          </div>

          {/* Меню */}
          <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wider text-stone-300">
            <a href="#products" className="hover:text-amber-400 transition-colors">PRODUCTS</a>
            <a href="#why" className="hover:text-amber-400 transition-colors">WHY HALAL</a>
            <a href="#logistics" className="hover:text-amber-400 transition-colors">LOGISTICS</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">ABOUT</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">CONTACT</a>
          </div>

          {/* Контакт + Captain */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/79153490007"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-5 py-2.5 rounded font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/50 border border-amber-500/30"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contact
            </a>
            
            {/* ⚓ Скрытая ссылка в Captain Mode */}
            <Link
              href="/captain"
              className="text-stone-600 hover:text-amber-400 transition-colors text-xs"
              title="Captain Mode"
            >
              ⚓
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════ */}
      {/*                  HERO ЭКРАН                  */}
      {/* ═══════════════════════════════════════════ */}
      <header className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden">
        
        {/* Декоративный градиент вместо фото */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/60 to-emerald-800/40"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-radial from-amber-500/10 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-radial from-emerald-700/20 via-transparent to-transparent"></div>
        </div>

        {/* Геометрический паттерн поверх */}
        <div className="absolute inset-0 text-amber-400 opacity-10">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-24 md:py-36 relative z-10">
          
          {/* Bismillah */}
          <div className="mb-6 text-amber-400/80 text-2xl md:text-3xl" 
               style={{ fontFamily: 'var(--font-amiri), serif', direction: 'rtl' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Бейдж */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-400 px-4 py-1.5 rounded-sm text-xs font-bold tracking-[0.25em] mb-6">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7 2 3 6 3 12s4 10 9 10c-3-2-5-5.5-5-10s2-8 5-10z"/>
            </svg>
            100% HALAL · PREMIUM RUSSIAN TIMBER
          </div>

          {/* Заголовок */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" 
              style={{ fontFamily: 'var(--font-playfair), serif' }}>
            Premium Russian<br/>
            <span className="text-amber-400 italic">Sawn Timber</span>
            <br/>
            <span className="text-2xl md:text-3xl text-stone-300 font-normal not-italic">
              for the Muslim World
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl leading-relaxed">
            Direct from our sawmills in <span className="text-amber-400 font-semibold">European Russia</span> (Vologda region). 
            Premium Pine (REDWOOD), Spruce & Larch — GOST 8486-86, Kiln Dried 10-12%, ISPM-15. 
            <br/>
            <span className="text-stone-400">FOB / CIF delivery from Novorossiysk & St. Petersburg to UAE, Saudi Arabia, Qatar, Egypt, Turkey.</span>
          </p>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://wa.me/79153490007" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 px-8 py-4 rounded-sm font-bold text-lg text-center transition-all shadow-[0_0_30px_rgba(217,169,79,0.4)] tracking-wide"
            >
              REQUEST A QUOTATION
            </a>
            <a 
              href="#products" 
              className="bg-emerald-900/60 hover:bg-emerald-900 border border-amber-500/40 text-white px-8 py-4 rounded-sm font-bold text-lg text-center transition-all tracking-wide backdrop-blur-sm"
            >
              VIEW PRODUCTS
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex flex-wrap gap-6 text-xs tracking-widest text-stone-400">
            <span>✓ GOST 8486-86</span>
            <span>✓ ISPM-15 CERTIFIED</span>
            <span>✓ ЛесЕГАИС VERIFIED</span>
            <span>✓ ICC ARBITRATION</span>
            <span>✓ CISG 1980</span>
          </div>
        </div>

        {/* Декоративная золотая полоса */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4">

        {/* ═══════════════════════════════════════════ */}
        {/*           3 КАРТОЧКИ — ХАРАКТЕРИСТИКИ        */}
        {/* ═══════════════════════════════════════════ */}
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 mb-24 relative z-20">
          
          <div className="bg-white p-8 rounded-sm shadow-xl border-t-4 border-amber-500 hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-sm flex items-center justify-center mb-6 border border-emerald-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-emerald-950" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              GOST 8486-86 Standard
            </h3>
            <p className="text-stone-600 leading-relaxed text-sm">Strict Russian state quality control. Grade 1-3, perfectly sawn, no wane, no rot. Ideal for halal construction, mosques, and premium furniture.</p>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-xl border-t-4 border-emerald-700 hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-sm flex items-center justify-center mb-6 border border-amber-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-emerald-950" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Kiln Dried 10-12%
            </h3>
            <p className="text-stone-600 leading-relaxed text-sm">Professional chamber drying prevents deformation and cracking during 30+ days ocean transit to the Gulf. No mold, no fungal stains.</p>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-xl border-t-4 border-amber-500 hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-sm flex items-center justify-center mb-6 border border-emerald-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-emerald-950" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              ISPM-15 & Full Docs
            </h3>
            <p className="text-stone-600 leading-relaxed text-sm">Phytosanitary cert, Certificate of Origin (Form A/CT-1), ISPM-15 fumigation, Bill of Lading (Telex Release). Customs-ready for UAE & GCC.</p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/*              WHY RUSSIAN HALAL TIMBER        */}
        {/* ═══════════════════════════════════════════ */}
        <section id="why" className="mb-24">
          <div className="text-center mb-12">
            <div className="text-amber-600 text-xs tracking-[0.4em] mb-3">— OUR ADVANTAGE —</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Why Russian Halal Timber
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">Five reasons why buyers in UAE, Saudi Arabia & Qatar choose RU-TIMBER for their premium projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {[
              { 
                icon: "🌲", 
                title: "SLOW-GROWN", 
                text: "Northern European Russia. 2-4mm annual rings. Slow growth = density."
              },
              { 
                icon: "❄️", 
                title: "COLD CLIMATE", 
                text: "Vologda forests. 2× stronger than tropical timber. Naturally durable."
              },
              { 
                icon: "📜", 
                title: "GOST QUALITY", 
                text: "State Standard 8486-86. Grade 1-3 export selection. Guaranteed."
              },
              { 
                icon: "🌙", 
                title: "HALAL SOURCED", 
                text: "ЛесЕГАИС verified. Ethical, transparent supply chain. Pure REDWOOD."
              },
              { 
                icon: "🚢", 
                title: "DIRECT EXPORT", 
                text: "Novorossiysk & St. Petersburg ports. To Jebel Ali in 21 days."
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-6 rounded-sm border border-amber-500/30 hover:border-amber-500 transition-colors">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-amber-400 mb-2 tracking-wider text-sm">{item.title}</h3>
                <p className="text-stone-300 text-xs leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/*               PRODUCT RANGE                  */}
        {/* ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <div className="text-amber-600 text-xs tracking-[0.4em] mb-3">— OUR PRODUCT RANGE —</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Sawn Timber Catalog
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">Three premium species from European Russia. All Kiln Dried, GOST certified, halal-sourced.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PINE */}
            <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-stone-200 hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-amber-700 to-amber-900 h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-950" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                      Pine
                    </h3>
                    <p className="text-xs text-stone-500 italic">Pinus sylvestris · REDWOOD</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-sm">FLAGSHIP</span>
                </div>
                <p className="text-stone-600 text-sm mb-4">Our flagship product for UAE market. 100% pure REDWOOD, no Spruce admixture. Perfect for construction and joinery.</p>
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div><span className="font-semibold">HS Code:</span> 4407.11</div>
                  <div><span className="font-semibold">Standard:</span> GOST 8486-86</div>
                  <div><span className="font-semibold">Moisture:</span> KD 10-12%</div>
                  <div><span className="font-semibold">Grades:</span> 1, 2, 3</div>
                </div>
              </div>
            </div>

            {/* SPRUCE */}
            <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-stone-200 hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-stone-300 to-stone-500 h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-950" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                      Spruce
                    </h3>
                    <p className="text-xs text-stone-500 italic">Picea abies · WHITEWOOD</p>
                  </div>
                  <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1 rounded-sm">AVAILABLE</span>
                </div>
                <p className="text-stone-600 text-sm mb-4">Light, soft, easy to work. Available for Central Asian markets (Uzbekistan, Kazakhstan). Cost-effective option.</p>
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div><span className="font-semibold">HS Code:</span> 4407.12</div>
                  <div><span className="font-semibold">Standard:</span> GOST 8486-86</div>
                  <div><span className="font-semibold">Moisture:</span> KD 10-12%</div>
                  <div><span className="font-semibold">Grades:</span> 1, 2, 3</div>
                </div>
              </div>
            </div>

            {/* LARCH */}
            <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-stone-200 hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 h-2"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-950" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                      Larch
                    </h3>
                    <p className="text-xs text-stone-500 italic">Larix sibirica · PREMIUM</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-sm">PREMIUM</span>
                </div>
                <p className="text-stone-600 text-sm mb-4">The most durable Russian softwood. Natural resin protects from moisture. Ideal for terraces, exterior, marine applications.</p>
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div><span className="font-semibold">HS Code:</span> 4407.19</div>
                  <div><span className="font-semibold">Standard:</span> GOST 8486-86</div>
                  <div><span className="font-semibold">Moisture:</span> KD 10-12%</div>
                  <div><span className="font-semibold">Grades:</span> Select, 1, 2</div>
                </div>
              </div>
            </div>
          </div>

          {/* Размеры */}
          <div className="mt-8 bg-emerald-950 text-white rounded-sm p-8 border border-amber-500/30">
            <h3 className="text-amber-400 text-xs tracking-[0.4em] mb-4">— STANDARD DIMENSIONS (MM) —</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs text-stone-400 mb-2 tracking-wider">THICKNESS</div>
                <div className="text-xl font-bold text-amber-400" style={{ fontFamily: 'var(--font-playfair), serif' }}>22 · 25 · 32 · 44 · 50</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-2 tracking-wider">WIDTH</div>
                <div className="text-xl font-bold text-amber-400" style={{ fontFamily: 'var(--font-playfair), serif' }}>100 · 150 · 200</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-2 tracking-wider">LENGTH</div>
                <div className="text-xl font-bold text-amber-400" style={{ fontFamily: 'var(--font-playfair), serif' }}>3000 — 6000</div>
              </div>
              <div>
                <div className="text-xs text-stone-400 mb-2 tracking-wider">CONTAINER</div>
                <div className="text-xl font-bold text-amber-400" style={{ fontFamily: 'var(--font-playfair), serif' }}>40HC · ~62 m³</div>
              </div>
            </div>
            <p className="text-xs text-stone-400 mt-6">Custom dimensions available upon request. Packaging: strapped bundles, anti-stain treated, polypropylene wrapped.</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/*                  LOGISTICS                   */}
        {/* ═══════════════════════════════════════════ */}
        <section id="logistics" className="mb-24">
          <div className="text-center mb-12">
            <div className="text-amber-600 text-xs tracking-[0.4em] mb-3">— SUPPLY CHAIN —</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              From Forest to Your Port
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">Full export cycle handled in-house. Transparent, documented, halal.</p>
          </div>

          <div className="bg-white rounded-sm shadow-xl p-10 border border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              
              {/* Соединительные линии */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-amber-500 via-emerald-700 to-amber-500"></div>
              
              {[
                { 
                  num: "01", 
                  title: "Sourcing", 
                  text: "Direct from our Vologda sawmills. ЛесЕГАИС verified. KD chamber drying.",
                  color: "amber"
                },
                { 
                  num: "02", 
                  title: "Transport", 
                  text: "Truck/rail to Novorossiysk or St. Petersburg port. 5-7 days.",
                  color: "emerald"
                },
                { 
                  num: "03", 
                  title: "Export", 
                  text: "Phytosanitary, Origin Form A/CT-1, ISPM-15, Telex B/L.",
                  color: "emerald"
                },
                { 
                  num: "04", 
                  title: "Delivery", 
                  text: "Ocean freight to Jebel Ali, Dammam, Doha, Alexandria. FOB/CIF.",
                  color: "amber"
                },
              ].map((step, idx) => (
                <div key={idx} className="text-center relative bg-white">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border-2 shadow-lg ${
                    step.color === 'amber' 
                      ? 'bg-amber-50 border-amber-500 text-amber-700' 
                      : 'bg-emerald-50 border-emerald-700 text-emerald-700'
                  }`}>
                    <span className="font-black text-lg" style={{ fontFamily: 'var(--font-playfair), serif' }}>{step.num}</span>
                  </div>
                  <h4 className="font-bold text-emerald-950 mb-2 tracking-wider uppercase text-sm">{step.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Маршруты */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-emerald-950 text-white p-5 rounded-sm border border-amber-500/30">
              <div className="text-amber-400 text-xs mb-1 tracking-widest">🇦🇪 UAE</div>
              <div className="font-bold">Novorossiysk → Jebel Ali</div>
              <div className="text-stone-400 text-xs mt-1">21 days · 40HC · CIF</div>
            </div>
            <div className="bg-emerald-950 text-white p-5 rounded-sm border border-amber-500/30">
              <div className="text-amber-400 text-xs mb-1 tracking-widest">🇸🇦 SAUDI ARABIA</div>
              <div className="font-bold">Novorossiysk → Dammam</div>
              <div className="text-stone-400 text-xs mt-1">25 days · 40HC · CIF</div>
            </div>
            <div className="bg-emerald-950 text-white p-5 rounded-sm border border-amber-500/30">
              <div className="text-amber-400 text-xs mb-1 tracking-widest">🇪🇬 EGYPT</div>
              <div className="font-bold">Novorossiysk → Alexandria</div>
              <div className="text-stone-400 text-xs mt-1">14 days · 40HC · CIF</div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/*                CERTIFICATES                  */}
        {/* ═══════════════════════════════════════════ */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <div className="text-amber-600 text-xs tracking-[0.4em] mb-3">— TRUST & COMPLIANCE —</div>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Quality Certificates
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">Every shipment is fully documented and verified at every stage.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "GOST 8486-86", desc: "Russian State Standard" },
              { name: "Phytosanitary", desc: "Rosselkhoznadzor" },
              { name: "ISPM-15", desc: "IPPC stamped" },
              { name: "Origin", desc: "Form A / CT-1" },
              { name: "ЛесЕГАИС", desc: "Halal sourcing" },
            ].map((cert, idx) => (
              <div key={idx} className="bg-gradient-to-br from-white to-stone-50 p-6 rounded-sm border-t-4 border-amber-500 text-center shadow-md">
                <div className="w-12 h-12 mx-auto bg-emerald-950 rounded-full flex items-center justify-center mb-3 border-2 border-amber-500">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="font-bold text-emerald-950 text-sm mb-1">{cert.name}</div>
                <div className="text-xs text-stone-500">{cert.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/*                  ABOUT US                    */}
        {/* ═══════════════════════════════════════════ */}
        <section id="about" className="mb-24">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-sm p-10 md:p-16 text-white relative overflow-hidden border border-amber-500/30">
            
            {/* Узор фоном */}
            <div className="absolute inset-0 text-amber-400 opacity-5">
              <svg width="100%" height="100%">
                <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="text-amber-400 text-xs tracking-[0.4em] mb-3">— ABOUT RU-TIMBER —</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                  Russian Roots,<br/>
                  <span className="text-amber-400 italic">Halal Values</span>
                </h2>
                <p className="text-stone-300 leading-relaxed mb-4">
                  RU-TIMBER Export is a Moscow-based trading company specializing in premium Russian sawn timber for halal markets — UAE, Saudi Arabia, Qatar, Egypt, Turkey.
                </p>
                <p className="text-stone-300 leading-relaxed mb-4">
                  We connect verified Vologda sawmills (European Russia) with buyers in the Muslim world — handling the full export cycle: sourcing, quality control, logistics, customs, and delivery.
                </p>
                <p className="text-stone-400 leading-relaxed text-sm italic">
                  Every order is personally handled by the founder. No middlemen, no corporate bureaucracy. Direct WhatsApp communication, fast quotations, full transparency.
                </p>
              </div>

              <div className="bg-emerald-950/50 backdrop-blur-sm rounded-sm p-8 border border-amber-500/20">
                <h3 className="text-amber-400 text-xs tracking-[0.4em] mb-6">— COMPANY DETAILS —</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-emerald-800 pb-3">
                    <span className="text-stone-400">Founder</span>
                    <span className="text-white font-semibold">Konstantin Semakin</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-3">
                    <span className="text-stone-400">Legal Form</span>
                    <span className="text-white font-semibold">Individual Entrepreneur (ИП)</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-3">
                    <span className="text-stone-400">INN</span>
                    <span className="text-white font-mono">771617956514</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-3">
                    <span className="text-stone-400">OGRNIP</span>
                    <span className="text-white font-mono">322774600408727</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-3">
                    <span className="text-stone-400">Operating since</span>
                    <span className="text-white font-semibold">2022</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-3">
                    <span className="text-stone-400">Address</span>
                    <span className="text-white text-right text-xs">Zapovednaya St. 18/4<br/>Moscow, 127081, Russia</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-3">
                    <span className="text-stone-400">Bank</span>
                    <span className="text-white font-semibold">Sberbank (multi-currency)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Capacity</span>
                    <span className="text-amber-400 font-semibold">1+ × 40HC / month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════ */}
      {/*                    ФУТЕР                     */}
      {/* ═══════════════════════════════════════════ */}
      <footer id="contact" className="bg-emerald-950 text-stone-400 pt-16 pb-8 border-t-2 border-amber-500/30 relative overflow-hidden">
        
        {/* Геометрический узор */}
        <div className="absolute inset-0 text-amber-400 opacity-5">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          {/* Top section */}
          <div className="text-center mb-12">
            <div className="text-amber-400 text-2xl mb-3" style={{ fontFamily: 'var(--font-amiri), serif', direction: 'rtl' }}>
              الحمد لله
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider mb-3" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              RU-TIMBER <span className="text-amber-400 italic">EXPORT</span>
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto">Premium Russian Sawn Timber · Direct from our Sawmills · Halal Certified · Worldwide Export</p>
          </div>

          {/* Contact grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-y border-emerald-800 py-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">Phone / WhatsApp</div>
              <a href="https://wa.me/79153490007" className="text-white hover:text-amber-400 transition-colors text-lg font-semibold">
                +7 915 349 00 07
              </a>
              <div className="text-xs text-stone-500 mt-1">24/7 · English · Russian</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">Email</div>
              <a href="mailto:ksemakin@icloud.com" className="text-white hover:text-amber-400 transition-colors break-all">
                ksemakin@icloud.com
              </a>
              <div className="text-xs text-stone-500 mt-1">Direct to founder</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">Office</div>
              <div className="text-white">
                Zapovednaya Street 18/4<br/>
                Moscow, 127081<br/>
                Russian Federation
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">Markets</div>
              <div className="text-white text-sm leading-relaxed">
                🇦🇪 UAE · 🇸🇦 Saudi Arabia<br/>
                🇶🇦 Qatar · 🇪🇬 Egypt<br/>
                🇹🇷 Turkey · 🇺🇿 Uzbekistan
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="text-center text-xs text-stone-500 space-y-2">
            <p>© {new Date().getFullYear()} RU-TIMBER EXPORT · Individual Entrepreneur Semakin K.F.</p>
            <p>INN: 771617956514 · OGRNIP: 322774600408727 · Moscow, Russian Federation</p>
            <p className="text-stone-600 italic pt-2">Russian Roots · Halal Excellence · Premium Quality</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════ */}
      {/*           ПЛАВАЮЩАЯ КНОПКА WHATSAPP          */}
      {/* ═══════════════════════════════════════════ */}
      <a 
        href="https://wa.me/79153490007" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-110 transition-all z-50 flex items-center justify-center border-2 border-amber-500/50"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}