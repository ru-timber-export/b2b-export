export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative">
      
      {/* Шапка сайта */}
      <header className="bg-slate-900 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-500 tracking-wider">RU-TIMBER EXPORT</h1>
            <p className="text-sm text-slate-400 mt-1">Direct from Siberian Sawmills to the World</p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-sm text-slate-300">Fast reply 24/7:</p>
            <a href="https://wa.me/79153490007" target="_blank" rel="noopener noreferrer" className="font-bold text-green-400 hover:text-green-300 transition-colors flex items-center justify-center md:justify-end gap-2 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp: +7 915 349 00 07
            </a>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto p-6 py-12 pb-32">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Premium Russian Pine Sawn Timber</h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            We supply high-quality Pinus Sylvestris (GOST 8486-86) and Siberian Spruce directly from the Russian Federation. 
            Perfect for furniture, construction, and packaging.
          </p>
        </div>

        {/* ГАЛЕРЕЯ ФОТОГРАФИЙ */}
        <h3 className="text-2xl font-bold mb-6 border-b-2 border-orange-500 pb-2 inline-block">Product Gallery & Packaging</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img src="https://images.unsplash.com/photo-1597423498219-04418210827d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Timber packages" className="rounded-lg h-56 w-full object-cover"/>
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Export Standard Packaging</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Pine wood texture" className="rounded-lg h-56 w-full object-cover"/>
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Clean Surface, No Stain</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img src="https://images.unsplash.com/photo-1611078813455-83e3ce87e22b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Timber warehouse" className="rounded-lg h-56 w-full object-cover"/>
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Large Volume Capacity</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img src="https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Wood rings" className="rounded-lg h-56 w-full object-cover"/>
            <p className="text-center text-sm font-bold text-slate-500 mt-3">High Density Pine</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356f12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sawmill" className="rounded-lg h-56 w-full object-cover"/>
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Direct from Sawmill</p>
          </div>
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img src="https://images.unsplash.com/photo-1493925410384-84f842e616fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Container loading" className="rounded-lg h-56 w-full object-cover"/>
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Ready for Container Loading</p>
          </div>
        </div>

        {/* Спецификация */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-orange-500">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><span className="text-green-500">✔</span> <span><strong>Standard:</strong> GOST 8486-86 (Grades 1-3)</span></li>
              <li className="flex items-center gap-3"><span className="text-green-500">✔</span> <span><strong>Moisture:</strong> Kiln Dried (KD) 10-12%</span></li>
              <li className="flex items-center gap-3"><span className="text-green-500">✔</span> <span><strong>Treatment:</strong> AST (Anti-stain treated)</span></li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><span className="text-green-500">✔</span> <span><strong>Thickness:</strong> 44 mm / 50 mm</span></li>
              <li className="flex items-center gap-3"><span className="text-green-500">✔</span> <span><strong>Width:</strong> 100 / 150 / 200 mm</span></li>
              <li className="flex items-center gap-3"><span className="text-green-500">✔</span> <span><strong>Length:</strong> 5980 mm (Tolerance -0/+2mm)</span></li>
            </ul>
          </div>
        </div>
      </main>

      {/* ПЛАВАЮЩАЯ КНОПКА WHATSAPP */}
      <a 
        href="https://wa.me/79153490007" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:bg-green-600 hover:scale-110 transition-all z-50 flex items-center gap-3 group"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        <span className="font-bold hidden group-hover:block pr-2">Chat with CEO</span>
      </a>

    </div>
  );
}