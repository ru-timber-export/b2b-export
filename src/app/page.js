export default function Home() {
  const whatsappNumber = "79000000000"; // Ваш номер
  const whatsappMessage = "Hello! I am interested in Russian Pine Sawn Timber (CIF India). Please share the current prices.";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* Шапка */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-extrabold text-2xl text-blue-900 tracking-tight flex items-center">
          <span className="text-3xl mr-2">🌲</span>
          RU-TIMBER <span className="text-orange-500 ml-1">EXPORT</span>
        </div>
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center text-sm md:text-base"
        >
          <span className="mr-2">💬</span> WhatsApp
        </a>
      </header>

      {/* Главный экран */}
      <section className="bg-slate-900 text-white px-6 py-16 text-center relative overflow-hidden">
        {/* Фоновый узор (имитация текстуры) */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        
        <div className="relative z-10">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            B2B Trading Company
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Premium Russian Pine <br/> <span className="text-orange-400">Direct to India</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-light">
            We contract volumes directly from Siberian sawmills and provide seamless logistics to CIF Chennai, Tuticorin & Nhava Sheva.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg shadow-orange-500/30 transition-all inline-block hover:scale-105"
          >
            Request CIF Price
          </a>
        </div>
      </section>

      {/* Галерея товара (Заглушки) */}
      <section className="p-6 md:p-12 max-w-6xl mx-auto -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
            <div className="h-48 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1590080826078-41712a1f26f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Pine Timber" className="w-full h-full object-cover" />
            </div>
            <p className="text-center font-semibold mt-3 text-slate-700">Premium Pine (GOST 8486-86)</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
            <div className="h-48 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1516224498413-84ecf3a1e7fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Timber Packages" className="w-full h-full object-cover" />
            </div>
            <p className="text-center font-semibold mt-3 text-slate-700">Export Packaging (AST Treated)</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
            <div className="h-48 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Container Loading" className="w-full h-full object-cover" />
            </div>
            <p className="text-center font-semibold mt-3 text-slate-700">40HC Container Loading</p>
          </div>
        </div>
      </section>

      {/* Спецификация */}
      <section className="p-6 md:p-12 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-slate-800">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl mt-1">✔</span>
                <div>
                  <b className="block text-slate-800">Wood Species</b>
                  <span className="text-slate-600">Siberian Pine / Spruce</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl mt-1">✔</span>
                <div>
                  <b className="block text-slate-800">Quality Grade</b>
                  <span className="text-slate-600">GOST 8486-86 (Grades 1-4)</span>
                </div>
              </li>
            </ul>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl mt-1">✔</span>
                <div>
                  <b className="block text-slate-800">Moisture Content</b>
                  <span className="text-slate-600">KD 18-22% (Anti-stain treated)</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 text-xl mt-1">✔</span>
                <div>
                  <b className="block text-slate-800">Dimensions</b>
                  <span className="text-slate-600">Length: 5.9m. Custom width/thickness available.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Подвал */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 px-6 mt-12">
        <p>© 2026 RU-TIMBER EXPORT. All rights reserved.</p>
        <p className="text-sm mt-2">Fully compliant with international phytosanitary standards.</p>
      </footer>

    </main>
  );
}