"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* НАВИГАЦИЯ */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-black text-xl">R</div>
            <span className="font-black text-xl tracking-widest">RU-TIMBER</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-bold tracking-wider text-slate-300">
            <Link href="/admin" className="hover:text-orange-500 transition-colors">ERP КАЛЬКУЛЯТОР</Link>
            <Link href="/crm" className="hover:text-orange-500 transition-colors">CRM</Link>
            <Link href="/stats" className="hover:text-orange-500 transition-colors">СВОДКА</Link>
          </div>
          <a href="https://wa.me/79153490007" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Contact Sales
          </a>
        </div>
      </nav>

      {/* ГЛАВНЫЙ ЭКРАН */}
      <header className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          {/* ИИ сам подтянул картинку леса с мирового сервера */}
          <img src="https://images.unsplash.com/photo-1520114878144-6123749968dd?q=80&w=2000&auto=format&fit=crop" alt="Timber Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold tracking-widest mb-6">EXPORT WORLDWIDE</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">Premium Russian<br/><span className="text-orange-500">Sawn Timber</span></h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">Direct from Siberian Sawmills. High-quality Pine (GOST 8486-86), Kiln Dried 10-12%, AST treated. Ready for CIF delivery to India, China, and MENA.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://wa.me/79153490007" target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded font-bold text-lg text-center transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]">Get a Quote (CIF)</a>
            <a href="#gallery" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-8 py-4 rounded font-bold text-lg text-center transition-all">View Products</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        
        {/* ХАРАКТЕРИСТИКИ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 -mt-24 relative z-20">
          <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">GOST 8486-86 Standard</h3>
            <p className="text-slate-500">Strict quality control. Grade 1-3, perfectly sawn, no wane, no rot. Ideal for construction and furniture.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Kiln Dried (KD 10-12%)</h3>
            <p className="text-slate-500">Professional chamber drying prevents deformation and cracking during ocean transit.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">AST Treated & Phyto</h3>
            <p className="text-slate-500">Anti-stain treatment applied. Full export documentation including Phytosanitary certificate provided.</p>
          </div>
        </div>

        {/* ГАЛЕРЕЯ (ИИ подтянул 3 крутые картинки) */}
        <div id="gallery" className="mb-20">
          <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-wider">Product Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg h-64 relative group">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" alt="Warehouse" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold tracking-wider">Warehouse Storage</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg h-64 relative group">
              <img src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop" alt="Sawmill" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold tracking-wider">Production Line</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg h-64 relative group">
              <img src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop" alt="Wood Texture" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold tracking-wider">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* БЛОК ЛОГИСТИКИ (Тот самый, красивый) */}
        <div className="mb-16">
          <h3 className="text-3xl font-black mb-10 text-center uppercase tracking-wider">Global Logistics</h3>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4 border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">1. Production</h4>
                <p className="text-xs text-slate-500">Siberian Sawmill (Bratsk). Kiln drying and AST treatment.</p>
                <div className="hidden md:block absolute top-8 -right-6 text-slate-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>

              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 border-2 border-slate-300">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">2. Rail Transit</h4>
                <p className="text-xs text-slate-500">Fast block trains to Novorossiysk or Vladivostok ports.</p>
                <div className="hidden md:block absolute top-8 -right-6 text-slate-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>

              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 border-2 border-slate-300">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">3. Customs & Port</h4>
                <p className="text-xs text-slate-500">Full export documentation (Phyto, Origin, BL) and loading.</p>
                <div className="hidden md:block absolute top-8 -right-6 text-slate-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">4. Destination (CIF)</h4>
                <p className="text-xs text-slate-500">Ocean freight to India, China, MENA. Safe and insured.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* ФУТЕР */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white tracking-widest mb-4">RU-TIMBER EXPORT</h2>
          <p className="mb-6">Reliable supplier of Russian Sawn Timber.</p>
          <p className="text-sm">© {new Date().getFullYear()} RU-TIMBER. All rights reserved.</p>
        </div>
      </footer>

      {/* ПЛАВАЮЩАЯ КНОПКА WHATSAPP */}
      <a href="https://wa.me/79153490007" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:bg-green-400 hover:scale-110 transition-all z-50 flex items-center justify-center">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
}