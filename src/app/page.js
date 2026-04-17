export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* Шапка сайта */}
      <header className="bg-slate-900 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-500 tracking-wider">RU-TIMBER EXPORT</h1>
            <p className="text-sm text-slate-400 mt-1">Direct from Siberian Sawmills to the World</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm text-slate-300">Contact us:</p>
            <a href="mailto:novostiizdrugihgalaktik@gmail.com" className="font-bold text-orange-400 hover:text-orange-300 transition-colors">novostiizdrugihgalaktik@gmail.com</a>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto p-6 py-12">
        
        {/* Заголовок */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Premium Russian Pine Sawn Timber</h2>
          <p className="text-lg text-slate-600 max-w-3xl">
            We supply high-quality Pinus Sylvestris (GOST 8486-86) and Siberian Spruce directly from the Russian Federation. 
            Perfect for furniture, construction, and packaging.
          </p>
        </div>

        {/* ГАЛЕРЕЯ ФОТОГРАФИЙ (Сетка из 6 фото) */}
        <h3 className="text-2xl font-bold mb-6 border-b-2 border-orange-500 pb-2 inline-block">Product Gallery & Packaging</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          {/* Фото 1: Готовые пакеты */}
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1597423498219-04418210827d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Timber packages" 
              className="rounded-lg h-56 w-full object-cover"
            />
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Export Standard Packaging</p>
          </div>
          
          {/* Фото 2: Текстура доски (Новая надежная ссылка) */}
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Pine wood texture" 
              className="rounded-lg h-56 w-full object-cover"
            />
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Clean Surface, No Stain</p>
          </div>

          {/* Фото 3: Склад / Объем */}
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1611078813455-83e3ce87e22b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Timber warehouse" 
              className="rounded-lg h-56 w-full object-cover"
            />
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Large Volume Capacity</p>
          </div>

          {/* Фото 4: Торец доски (Показывает плотность) */}
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Wood rings" 
              className="rounded-lg h-56 w-full object-cover"
            />
            <p className="text-center text-sm font-bold text-slate-500 mt-3">High Density Pine</p>
          </div>

          {/* Фото 5: Производство / Распиловка */}
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356f12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Sawmill" 
              className="rounded-lg h-56 w-full object-cover"
            />
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Direct from Sawmill</p>
          </div>

          {/* Фото 6: Погрузка в контейнер (Имитация) */}
          <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img 
              src="https://images.unsplash.com/photo-1493925410384-84f842e616fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Container loading" 
              className="rounded-lg h-56 w-full object-cover"
            />
            <p className="text-center text-sm font-bold text-slate-500 mt-3">Ready for Container Loading</p>
          </div>

        </div>

        {/* Спецификация */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-orange-500">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✔</span> 
                <span><strong>Standard:</strong> GOST 8486-86 (Grades 1-3)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✔</span> 
                <span><strong>Moisture:</strong> Kiln Dried (KD) 10-12%</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✔</span> 
                <span><strong>Treatment:</strong> AST (Anti-stain treated)</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✔</span> 
                <span><strong>Thickness:</strong> 44 mm / 50 mm</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✔</span> 
                <span><strong>Width:</strong> 100 / 150 / 200 mm</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✔</span> 
                <span><strong>Length:</strong> 5980 mm (Tolerance -0/+2mm)</span>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}