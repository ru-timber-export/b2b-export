"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">

      {/* SVG паттерн для фонов */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <pattern id="halal-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L37.5 22.5 L60 30 L37.5 37.5 L30 60 L22.5 37.5 L0 30 L22.5 22.5 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.2"/>
          </pattern>
        </defs>
      </svg>

      {/* НАВИГАЦИЯ */}
      <nav className="bg-emerald-950 text-white sticky top-0 z-50 shadow-2xl border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-lg flex items-center justify-center shadow-lg border border-amber-500/40">
              <span className="font-black text-xl sm:text-2xl text-amber-400">R</span>
              <svg className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7 2 3 6 3 12s4 10 9 10c-3-2-5-5.5-5-10s2-8 5-10z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-xl tracking-widest text-white">RU-TIMBER</span>
              <span className="text-[8px] sm:text-[10px] tracking-[0.25em] text-amber-400 -mt-1">HALAL CERTIFIED</span>
            </div>
          </div>

          <div className="hidden lg:flex gap-6 text-sm font-semibold tracking-wider text-stone-300">
            <a href="#why" className="hover:text-amber-400 transition-colors">WHY HALAL</a>
            <a href="#products" className="hover:text-amber-400 transition-colors">PRODUCTS</a>
            <a href="#logistics" className="hover:text-amber-400 transition-colors">LOGISTICS</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">ABOUT</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">CONTACT</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://wa.me/79153490007"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-all shadow-lg border border-amber-500/30"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="hidden sm:inline">Contact</span>
            </a>
            <Link href="/captain" className="text-stone-600 hover:text-amber-400 transition-colors text-xs" title="Captain Mode">⚓</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-700/30 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 text-amber-400 opacity-10">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#halal-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 md:py-32 relative z-10">
          <div className="mb-4 sm:mb-6 text-amber-400/80 text-xl sm:text-2xl md:text-3xl" dir="rtl" lang="ar">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-400 px-3 sm:px-4 py-1.5 rounded-sm text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] mb-4 sm:mb-6">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7 2 3 6 3 12s4 10 9 10c-3-2-5-5.5-5-10s2-8 5-10z"/>
            </svg>
            100% HALAL · PREMIUM RUSSIAN TIMBER
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Premium Russian<br/>
            <span className="text-amber-400 italic">Sawn Timber</span>
            <br/>
            <span className="text-lg sm:text-2xl md:text-3xl text-stone-300 font-normal not-italic">
              for the Muslim World
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-stone-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
            Direct from our sawmills in <span className="text-amber-400 font-semibold">European Russia</span> (Vologda region).
            Premium Pine (REDWOOD), Spruce & Larch — GOST 8486-86, Kiln Dried 10-12%, ISPM-15.
            <br className="hidden sm:block"/>
            <span className="text-stone-400 text-sm sm:text-base">FOB / CIF delivery to UAE, Saudi Arabia, Qatar, Egypt, Turkey.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href="https://wa.me/79153490007" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 px-6 sm:px-8 py-3 sm:py-4 rounded-sm font-bold text-base sm:text-lg text-center transition-all shadow-2xl tracking-wide">
              REQUEST A QUOTATION
            </a>
            <a href="#products" className="bg-emerald-900/60 hover:bg-emerald-900 border border-amber-500/40 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-sm font-bold text-base sm:text-lg text-center transition-all tracking-wide">
              VIEW PRODUCTS
            </a>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-wrap gap-3 sm:gap-6 text-[10px] sm:text-xs tracking-widest text-stone-400">
            <span>✓ GOST 8486-86</span>
            <span>✓ ISPM-15</span>
            <span>✓ LesEGAIS</span>
            <span>✓ ICC ARBITRATION</span>
            <span>✓ CISG 1980</span>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4">

        {/* 3 КАРТОЧКИ */}
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 -mt-12 sm:-mt-16 mb-16 sm:mb-24 relative z-20">
          <div className="bg-white p-6 sm:p-8 rounded-sm shadow-xl border-t-4 border-amber-500">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-700 rounded-sm flex items-center justify-center mb-4 sm:mb-6 border border-emerald-200">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-emerald-950">GOST 8486-86</h3>
            <p className="text-stone-600 leading-relaxed text-sm">Strict Russian state quality control. Grade 1-3, perfectly sawn, no wane, no rot. Ideal for halal construction.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-sm shadow-xl border-t-4 border-emerald-700">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 text-amber-700 rounded-sm flex items-center justify-center mb-4 sm:mb-6 border border-amber-200">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-emerald-950">Kiln Dried 10-12%</h3>
            <p className="text-stone-600 leading-relaxed text-sm">Professional chamber drying prevents deformation during 30+ days ocean transit to the Gulf. No mold, no fungal stains.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-sm shadow-xl border-t-4 border-amber-500">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-700 rounded-sm flex items-center justify-center mb-4 sm:mb-6 border border-emerald-200">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-emerald-950">Full Export Docs</h3>
            <p className="text-stone-600 leading-relaxed text-sm">Phytosanitary, Origin Form A/CT-1, ISPM-15 fumigation, Telex B/L. Customs-ready for UAE & GCC markets.</p>
          </div>
        </div>

        {/* WHY HALAL */}
        <section id="why" className="mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-amber-600 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-3">— OUR ADVANTAGE —</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-950 mb-3 sm:mb-4">Why Russian Halal Timber</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">Five reasons why buyers in UAE, Saudi Arabia & Qatar choose RU-TIMBER.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-4 sm:p-6 rounded-sm border border-amber-500/30">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌲</div>
              <h3 className="font-bold text-amber-400 mb-1 sm:mb-2 tracking-wider text-xs sm:text-sm">SLOW-GROWN</h3>
              <p className="text-stone-300 text-[10px] sm:text-xs leading-relaxed">Northern Russia. 2-4mm rings. Dense, strong.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-4 sm:p-6 rounded-sm border border-amber-500/30">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">❄️</div>
              <h3 className="font-bold text-amber-400 mb-1 sm:mb-2 tracking-wider text-xs sm:text-sm">COLD CLIMATE</h3>
              <p className="text-stone-300 text-[10px] sm:text-xs leading-relaxed">Vologda forests. 2x stronger than tropical.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-4 sm:p-6 rounded-sm border border-amber-500/30">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📜</div>
              <h3 className="font-bold text-amber-400 mb-1 sm:mb-2 tracking-wider text-xs sm:text-sm">GOST QUALITY</h3>
              <p className="text-stone-300 text-[10px] sm:text-xs leading-relaxed">State Standard 8486-86. Grade 1-3 export.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-4 sm:p-6 rounded-sm border border-amber-500/30">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌙</div>
              <h3 className="font-bold text-amber-400 mb-1 sm:mb-2 tracking-wider text-xs sm:text-sm">HALAL SOURCED</h3>
              <p className="text-stone-300 text-[10px] sm:text-xs leading-relaxed">LesEGAIS verified. Ethical supply chain.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-4 sm:p-6 rounded-sm border border-amber-500/30 col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🚢</div>
              <h3 className="font-bold text-amber-400 mb-1 sm:mb-2 tracking-wider text-xs sm:text-sm">DIRECT EXPORT</h3>
              <p className="text-stone-300 text-[10px] sm:text-xs leading-relaxed">Novorossiysk & SPb ports. Jebel Ali 21 days.</p>
            </div>
          </div>
        </section>

        {/* PRODUCT RANGE */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-amber-600 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-3">— OUR RANGE —</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-950 mb-3 sm:mb-4">Sawn Timber Catalog</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">Three premium species from European Russia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-stone-200">
              <div className="bg-gradient-to-br from-amber-700 to-amber-900 h-2"></div>
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-950">Pine</h3>
                    <p className="text-xs text-stone-500 italic">Pinus sylvestris · REDWOOD</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-sm">FLAGSHIP</span>
                </div>
                <p className="text-stone-600 text-sm mb-4">Our flagship for UAE. 100% pure REDWOOD, no Spruce admixture. Perfect for construction.</p>
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div><span className="font-semibold">HS Code:</span> 4407.11</div>
                  <div><span className="font-semibold">Standard:</span> GOST 8486-86</div>
                  <div><span className="font-semibold">Moisture:</span> KD 10-12%</div>
                  <div><span className="font-semibold">Grades:</span> 1, 2, 3</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-stone-200">
              <div className="bg-gradient-to-br from-stone-300 to-stone-500 h-2"></div>
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-950">Spruce</h3>
                    <p className="text-xs text-stone-500 italic">Picea abies · WHITEWOOD</p>
                  </div>
                  <span className="bg-stone-100 text-stone-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-sm">AVAILABLE</span>
                </div>
                <p className="text-stone-600 text-sm mb-4">Light, soft, easy to work. Available for Central Asia (Uzbekistan, Kazakhstan).</p>
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div><span className="font-semibold">HS Code:</span> 4407.12</div>
                  <div><span className="font-semibold">Standard:</span> GOST 8486-86</div>
                  <div><span className="font-semibold">Moisture:</span> KD 10-12%</div>
                  <div><span className="font-semibold">Grades:</span> 1, 2, 3</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-stone-200">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 h-2"></div>
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-950">Larch</h3>
                    <p className="text-xs text-stone-500 italic">Larix sibirica · PREMIUM</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-sm">PREMIUM</span>
                </div>
                <p className="text-stone-600 text-sm mb-4">The most durable Russian softwood. Natural resin. Ideal for terraces and exterior.</p>
                <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs text-stone-600">
                  <div><span className="font-semibold">HS Code:</span> 4407.19</div>
                  <div><span className="font-semibold">Standard:</span> GOST 8486-86</div>
                  <div><span className="font-semibold">Moisture:</span> KD 10-12%</div>
                  <div><span className="font-semibold">Grades:</span> Select, 1, 2</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 bg-emerald-950 text-white rounded-sm p-6 sm:p-8 border border-amber-500/30">
            <h3 className="text-amber-400 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-4">— STANDARD DIMENSIONS (MM) —</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <div className="text-[10px] sm:text-xs text-stone-400 mb-1 sm:mb-2 tracking-wider">THICKNESS</div>
                <div className="text-base sm:text-xl font-bold text-amber-400">22·25·32·44·50</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-stone-400 mb-1 sm:mb-2 tracking-wider">WIDTH</div>
                <div className="text-base sm:text-xl font-bold text-amber-400">100·150·200</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-stone-400 mb-1 sm:mb-2 tracking-wider">LENGTH</div>
                <div className="text-base sm:text-xl font-bold text-amber-400">3000—6000</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-stone-400 mb-1 sm:mb-2 tracking-wider">CONTAINER</div>
                <div className="text-base sm:text-xl font-bold text-amber-400">40HC · ~62 m³</div>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-stone-400 mt-4 sm:mt-6">Custom dimensions available. Packaging: strapped bundles, AST treated, polypropylene wrapped.</p>
          </div>
        </section>

        {/* LOGISTICS */}
        <section id="logistics" className="mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-amber-600 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-3">— SUPPLY CHAIN —</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-950 mb-3 sm:mb-4">From Forest to Your Port</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">Full export cycle in-house. Transparent, documented, halal.</p>
          </div>

          <div className="bg-white rounded-sm shadow-xl p-6 sm:p-10 border border-stone-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-amber-500 via-emerald-700 to-amber-500"></div>

              <div className="text-center relative bg-white">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 border-2 shadow-lg bg-amber-50 border-amber-500 text-amber-700">
                  <span className="font-black text-base sm:text-lg">01</span>
                </div>
                <h4 className="font-bold text-emerald-950 mb-1 sm:mb-2 tracking-wider uppercase text-xs sm:text-sm">Sourcing</h4>
                <p className="text-[10px] sm:text-xs text-stone-600 leading-relaxed">Vologda sawmills. LesEGAIS verified. KD drying.</p>
              </div>

              <div className="text-center relative bg-white">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 border-2 shadow-lg bg-emerald-50 border-emerald-700 text-emerald-700">
                  <span className="font-black text-base sm:text-lg">02</span>
                </div>
                <h4 className="font-bold text-emerald-950 mb-1 sm:mb-2 tracking-wider uppercase text-xs sm:text-sm">Transport</h4>
                <p className="text-[10px] sm:text-xs text-stone-600 leading-relaxed">Truck/rail to Novorossiysk or St. Petersburg.</p>
              </div>

              <div className="text-center relative bg-white">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 border-2 shadow-lg bg-emerald-50 border-emerald-700 text-emerald-700">
                  <span className="font-black text-base sm:text-lg">03</span>
                </div>
                <h4 className="font-bold text-emerald-950 mb-1 sm:mb-2 tracking-wider uppercase text-xs sm:text-sm">Export</h4>
                <p className="text-[10px] sm:text-xs text-stone-600 leading-relaxed">Phyto, Origin, ISPM-15, Telex B/L.</p>
              </div>

              <div className="text-center relative bg-white">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 border-2 shadow-lg bg-amber-50 border-amber-500 text-amber-700">
                  <span className="font-black text-base sm:text-lg">04</span>
                </div>
                <h4 className="font-bold text-emerald-950 mb-1 sm:mb-2 tracking-wider uppercase text-xs sm:text-sm">Delivery</h4>
                <p className="text-[10px] sm:text-xs text-stone-600 leading-relaxed">Jebel Ali, Dammam, Doha, Alexandria.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="bg-emerald-950 text-white p-4 sm:p-5 rounded-sm border border-amber-500/30">
              <div className="text-amber-400 text-[10px] sm:text-xs mb-1 tracking-widest">🇦🇪 UAE</div>
              <div className="font-bold text-sm sm:text-base">Novorossiysk → Jebel Ali</div>
              <div className="text-stone-400 text-[10px] sm:text-xs mt-1">21 days · 40HC · CIF</div>
            </div>
            <div className="bg-emerald-950 text-white p-4 sm:p-5 rounded-sm border border-amber-500/30">
              <div className="text-amber-400 text-[10px] sm:text-xs mb-1 tracking-widest">🇸🇦 SAUDI ARABIA</div>
              <div className="font-bold text-sm sm:text-base">Novorossiysk → Dammam</div>
              <div className="text-stone-400 text-[10px] sm:text-xs mt-1">25 days · 40HC · CIF</div>
            </div>
            <div className="bg-emerald-950 text-white p-4 sm:p-5 rounded-sm border border-amber-500/30">
              <div className="text-amber-400 text-[10px] sm:text-xs mb-1 tracking-widest">🇪🇬 EGYPT</div>
              <div className="font-bold text-sm sm:text-base">Novorossiysk → Alexandria</div>
              <div className="text-stone-400 text-[10px] sm:text-xs mt-1">14 days · 40HC · CIF</div>
            </div>
          </div>
        </section>

        {/* CERTIFICATES */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-amber-600 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-3">— TRUST & COMPLIANCE —</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-950 mb-3 sm:mb-4">Quality Certificates</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">Every shipment is documented and verified at every stage.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-white to-stone-50 p-4 sm:p-6 rounded-sm border-t-4 border-amber-500 text-center shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-emerald-950 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2 border-amber-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="font-bold text-emerald-950 text-xs sm:text-sm mb-1">GOST 8486-86</div>
              <div className="text-[10px] sm:text-xs text-stone-500">State Standard</div>
            </div>

            <div className="bg-gradient-to-br from-white to-stone-50 p-4 sm:p-6 rounded-sm border-t-4 border-amber-500 text-center shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-emerald-950 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2 border-amber-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="font-bold text-emerald-950 text-xs sm:text-sm mb-1">Phytosanitary</div>
              <div className="text-[10px] sm:text-xs text-stone-500">Rosselkhoznadzor</div>
            </div>

            <div className="bg-gradient-to-br from-white to-stone-50 p-4 sm:p-6 rounded-sm border-t-4 border-amber-500 text-center shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-emerald-950 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2 border-amber-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="font-bold text-emerald-950 text-xs sm:text-sm mb-1">ISPM-15</div>
              <div className="text-[10px] sm:text-xs text-stone-500">IPPC stamped</div>
            </div>

            <div className="bg-gradient-to-br from-white to-stone-50 p-4 sm:p-6 rounded-sm border-t-4 border-amber-500 text-center shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-emerald-950 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2 border-amber-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="font-bold text-emerald-950 text-xs sm:text-sm mb-1">Origin</div>
              <div className="text-[10px] sm:text-xs text-stone-500">Form A / CT-1</div>
            </div>

            <div className="bg-gradient-to-br from-white to-stone-50 p-4 sm:p-6 rounded-sm border-t-4 border-amber-500 text-center shadow-md col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-emerald-950 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2 border-amber-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="font-bold text-emerald-950 text-xs sm:text-sm mb-1">LesEGAIS</div>
              <div className="text-[10px] sm:text-xs text-stone-500">Halal sourcing</div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mb-16 sm:mb-24">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-sm p-6 sm:p-10 md:p-16 text-white relative overflow-hidden border border-amber-500/30">
            <div className="absolute inset-0 text-amber-400 opacity-5">
              <svg width="100%" height="100%">
                <rect width="100%" height="100%" fill="url(#halal-pattern)" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <div className="text-amber-400 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-3">— ABOUT RU-TIMBER —</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  Russian Roots,<br/>
                  <span className="text-amber-400 italic">Halal Values</span>
                </h2>
                <p className="text-stone-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                  RU-TIMBER Export is a Moscow-based trading company specializing in premium Russian sawn timber for halal markets — UAE, Saudi Arabia, Qatar, Egypt, Turkey.
                </p>
                <p className="text-stone-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                  We connect verified Vologda sawmills with buyers in the Muslim world — handling the full export cycle: sourcing, quality control, logistics, customs, delivery.
                </p>
                <p className="text-stone-400 leading-relaxed text-xs sm:text-sm italic">
                  Every order is personally handled by the founder. No middlemen. Direct WhatsApp communication, fast quotations, full transparency.
                </p>
              </div>

              <div className="bg-emerald-950/50 rounded-sm p-5 sm:p-8 border border-amber-500/20">
                <h3 className="text-amber-400 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-6">— COMPANY DETAILS —</h3>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-emerald-800 pb-2 sm:pb-3">
                    <span className="text-stone-400">Founder</span>
                    <span className="text-white font-semibold">Konstantin Semakin</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-2 sm:pb-3">
                    <span className="text-stone-400">Legal Form</span>
                    <span className="text-white font-semibold">Individual Entrepreneur</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-2 sm:pb-3">
                    <span className="text-stone-400">INN</span>
                    <span className="text-white font-mono">771617956514</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-2 sm:pb-3">
                    <span className="text-stone-400">OGRNIP</span>
                    <span className="text-white font-mono">322774600408727</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-2 sm:pb-3">
                    <span className="text-stone-400">Since</span>
                    <span className="text-white font-semibold">2022</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-2 sm:pb-3">
                    <span className="text-stone-400">Address</span>
                    <span className="text-white text-right text-[10px] sm:text-xs">Zapovednaya 18/4<br/>Moscow, 127081</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800 pb-2 sm:pb-3">
                    <span className="text-stone-400">Bank</span>
                    <span className="text-white font-semibold">Sberbank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Capacity</span>
                    <span className="text-amber-400 font-semibold">1+ x 40HC / month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer id="contact" className="bg-emerald-950 text-stone-400 pt-12 sm:pt-16 pb-6 sm:pb-8 border-t-2 border-amber-500/30 relative overflow-hidden">
        <div className="absolute inset-0 text-amber-400 opacity-5">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#halal-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-amber-400 text-xl sm:text-2xl mb-2 sm:mb-3" dir="rtl" lang="ar">الحمد لله</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wider mb-2 sm:mb-3">
              RU-TIMBER <span className="text-amber-400 italic">EXPORT</span>
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto text-sm sm:text-base">Premium Russian Sawn Timber · Halal Certified · Worldwide Export</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 border-y border-emerald-800 py-8 sm:py-10">
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 mb-2 sm:mb-3">Phone / WhatsApp</div>
              <a href="https://wa.me/79153490007" className="text-white hover:text-amber-400 transition-colors text-base sm:text-lg font-semibold">+7 915 349 00 07</a>
              <div className="text-[10px] sm:text-xs text-stone-500 mt-1">24/7 · EN · RU</div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 mb-2 sm:mb-3">Email</div>
              <a href="mailto:ksemakin@icloud.com" className="text-white hover:text-amber-400 transition-colors break-all text-sm sm:text-base">ksemakin@icloud.com</a>
              <div className="text-[10px] sm:text-xs text-stone-500 mt-1">Direct to founder</div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 mb-2 sm:mb-3">Office</div>
              <div className="text-white text-sm sm:text-base">
                Zapovednaya Street 18/4<br/>
                Moscow, 127081<br/>
                Russian Federation
              </div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-400 mb-2 sm:mb-3">Markets</div>
              <div className="text-white text-xs sm:text-sm leading-relaxed">
                🇦🇪 UAE · 🇸🇦 Saudi Arabia<br/>
                🇶🇦 Qatar · 🇪🇬 Egypt<br/>
                🇹🇷 Turkey · 🇺🇿 Uzbekistan
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] sm:text-xs text-stone-500 space-y-1 sm:space-y-2">
            <p>© {new Date().getFullYear()} RU-TIMBER EXPORT · Individual Entrepreneur Semakin K.F.</p>
            <p>INN: 771617956514 · OGRNIP: 322774600408727 · Moscow, Russia</p>
            <p className="text-stone-600 italic pt-1 sm:pt-2">Russian Roots · Halal Excellence · Premium Quality</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/79153490007" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center border-2 border-amber-500/50">
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}