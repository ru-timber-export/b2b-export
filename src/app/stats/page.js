import Link from 'next/link';

export default function SpyDashboard() {
  return (
    <div className="flex h-screen bg-black text-slate-200 font-mono selection:bg-green-500 selection:text-black">
      
      {/* БОКОВОЕ МЕНЮ */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="p-6 relative z-10">
          <h1 className="text-2xl font-black text-green-500 tracking-widest drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">OVERSEER</h1>
          <p className="text-[10px] text-green-700 mt-1 uppercase tracking-widest">Global Tracking System</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 relative z-10">
          <Link href="/" className="block px-4 py-3 rounded text-zinc-500 hover:text-green-400 hover:bg-green-900/20 transition-all text-sm uppercase tracking-wider">
            [01] Public Site
          </Link>
          <Link href="/stats" className="block px-4 py-3 rounded bg-green-900/20 text-green-400 border border-green-500/30 text-sm uppercase tracking-wider shadow-[inset_0_0_10px_rgba(0,255,0,0.1)]">
            [02] Live Intercept
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-600 text-center uppercase tracking-widest">
          Encrypted Connection
        </div>
      </aside>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        <header className="mb-8 flex justify-between items-end border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-3xl font-light text-white tracking-widest">TARGET <span className="font-bold text-green-500">TELEMETRY</span></h2>
            <p className="text-zinc-500 mt-1 text-xs uppercase tracking-widest">Real-time session monitoring</p>
          </div>
          <div className="flex items-center gap-3 bg-red-900/20 text-red-500 px-4 py-2 border border-red-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">1 Target Active</span>
          </div>
        </header>

        {/* СЕТКА ПЕНТАГОНА */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* DIGITAL FOOTPRINT */}
          <div className="bg-zinc-900/50 p-6 border border-zinc-800 relative group hover:border-green-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>
            
            <h3 className="text-green-600 text-xs font-bold mb-4 uppercase tracking-widest">Digital Footprint</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">IP Address</span>
                <span className="text-white">103.119.165.42</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">Location</span>
                <span className="text-orange-400">Mumbai, IND [21.02, 75.31]</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">ISP</span>
                <span className="text-white">Reliance Jio Infocomm</span>
              </div>
            </div>
          </div>

          {/* DEVICE TELEMETRY */}
          <div className="bg-zinc-900/50 p-6 border border-zinc-800 relative group hover:border-green-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>

            <h3 className="text-green-600 text-xs font-bold mb-4 uppercase tracking-widest">Device Specs</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">Hardware</span>
                <span className="text-white">Apple iPhone 14 Pro</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">Network</span>
                <span className="text-green-400">4G LTE (Good Signal)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">Battery</span>
                <span className="text-red-400">18% (Discharging)</span>
              </div>
            </div>
          </div>

          {/* BEHAVIORAL INTERCEPT */}
          <div className="bg-zinc-900/50 p-6 border border-zinc-800 relative group hover:border-green-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>

            <h3 className="text-green-600 text-xs font-bold mb-4 uppercase tracking-widest">Action Intercept</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">Time on Site</span>
                <span className="text-white">04m 12s</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">Focus Area</span>
                <span className="text-white">"Option B: $260"</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span className="text-zinc-500">Clipboard Event</span>
                <span className="text-orange-400 bg-orange-900/30 px-1">Copied Text</span>
              </div>
            </div>
          </div>
        </div>

        {/* ЖИВОЙ ТЕРМИНАЛ */}
        <div className="bg-black p-4 border border-zinc-800 font-mono text-xs text-green-500 h-48 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
          <p className="opacity-50">&gt; INITIALIZING SECURE CONNECTION...</p>
          <p className="opacity-60">&gt; BYPASSING PROXY...</p>
          <p className="opacity-70">&gt; CONNECTION ESTABLISHED. PORT 443.</p>
          <p className="opacity-80">&gt; NEW TARGET ACQUIRED: 103.119.165.42</p>
          <p className="opacity-90">&gt; TARGET SCROLLING TO "TECHNICAL SPECIFICATIONS"</p>
          <p className="text-white">&gt; [ALERT] TARGET HIGHLIGHTED TEXT: "GOST 8486-86"</p>
          <p className="animate-pulse mt-2">_</p>
        </div>

      </main>
    </div>
  );
}