import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Шапка сайта */}
      <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="text-2xl font-bold tracking-wider text-orange-500">RU-TIMBER<span className="text-white">EXPORT</span></div>
        <nav className="hidden md:flex space-x-6 text-sm font-semibold">
          <a href="#about" className="hover:text-orange-400 transition-colors">ABOUT US</a>
          <a href="#products" className="hover:text-orange-400 transition-colors">PRODUCTS</a>
          <a href="#logistics" className="hover:text-orange-400 transition-colors">LOGISTICS</a>
          <a href="#contact" className="hover:text-orange-400 transition-colors">CONTACT</a>
        </nav>
        <a href="mailto:export@ru-timber.com" className="bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded font-bold transition-colors">
          GET A QUOTE
        </a>
      </header>

      {/* Главный экран (Hero) */}
      <section className="relative h-[600px] flex items-center justify-center text-center">
        {/* Промышленное фото штабелей досок */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=2070&auto=format&fit=crop" 
            alt="Industrial Timber" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Premium Russian Pine <br/><span className="text-orange-500">Direct to India</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 font-light">
            FCA / CIF Tuticorin. High-quality sawn timber (KD 10-12%) for construction and furniture. Reliable logistics via Novorossiysk.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#products" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/30">
              View Specifications
            </a>
            <a href="#contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Блок преимуществ */}
      <section id="products" className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Timber?</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Карточка 1: Качество */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <div className="h-48 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop" alt="Pine Wood" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Siberian Pine (GOST 8486-86)</h3>
              <p className="text-gray-600">Strictly graded, KD 10-12%. Perfect dimensions for the Indian market. Anti-stain treated for sea transit.</p>
            </div>
          </div>

          {/* Карточка 2: Логистика */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <div className="h-48 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=2070&auto=format&fit=crop" alt="Logistics" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Seamless Logistics</h3>
              <p className="text-gray-600">Direct railway to Novorossiysk port, then sea freight to Tuticorin/Mundra. Full tracking provided.</p>
            </div>
          </div>

          {/* Карточка 3: Документы */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <div className="h-48 overflow-hidden bg-slate-800 flex items-center justify-center">
              <div className="text-6xl">📄</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Full Export Documentation</h3>
              <p className="text-gray-600">Phytosanitary certificates, Certificate of Origin, Custom Declarations. We handle all the paperwork.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Форма контактов */}
      <section id="contact" className="bg-slate-900 text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Order?</h2>
          <p className="text-xl text-slate-400 mb-10">Get current CIF prices for 40HC containers to your port.</p>
          
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-md mx-auto">
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-orange-500 outline-none" placeholder="e.g. India Timber Pvt Ltd" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email / WhatsApp</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-orange-500 outline-none" placeholder="+91..." />
              </div>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded mt-4 transition-colors">
                Request Price List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Подвал */}
      <footer className="bg-black py-6 text-center text-slate-500 text-sm">
        <p>© 2024 RU-TIMBER EXPORT. All rights reserved.</p>
      </footer>
    </div>
  );
}