"use client";

import { useState, useEffect } from "react";

const CORRECT_PASSWORD = "web86206";
const STORAGE_KEY = "ru-timber-captain-auth";

export default function CaptainGate({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  // Проверяем сохранённую авторизацию при загрузке
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === CORRECT_PASSWORD) {
        setAuthorized(true);
      }
    } catch (e) {
      console.error("Auth check failed:", e);
    }
    setChecked(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim() === CORRECT_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, password.trim());
      } catch (e) {
        console.error("Save failed:", e);
      }
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Logout failed:", e);
    }
    setAuthorized(false);
    setPassword("");
  };

  // Пока проверяем localStorage — ничего не показываем
  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-mono">
        <div className="text-sm text-slate-400">⚓ Checking access...</div>
      </div>
    );
  }

  // Если не авторизован — показываем форму входа
  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-800 border-2 border-orange-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl mb-4 shadow-lg">
              <span className="text-5xl">⚓</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-wider">CAPTAIN MODE</h1>
            <p className="text-sm text-slate-400 mt-2">Authorized access only · RU-TIMBER Export</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              🔐 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full mt-2 p-3 bg-slate-900 border-2 rounded-lg text-lg font-mono text-white ${
                error
                  ? "border-rose-500 animate-pulse"
                  : "border-slate-700 focus:border-orange-500"
              } outline-none transition-colors`}
              placeholder="••••••••"
              autoFocus
            />
            {error && (
              <div className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                ❌ Wrong password. Try again, Captain.
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white py-3 rounded-lg font-black text-lg active:scale-95 transition-all shadow-lg"
            >
              ENTER CAPTAIN MODE →
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 text-center">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-orange-400 transition-colors"
            >
              ← Back to ru-timber.com
            </a>
          </div>

          <div className="mt-4 text-center text-[10px] text-slate-600">
            🌲 RU-TIMBER Export · Internal Dashboard
          </div>
        </div>
      </div>
    );
  }

  // Если авторизован — показываем дашборд + кнопку выхода
  return (
    <>
      <button
        onClick={logout}
        className="fixed top-2 right-2 z-[100] bg-slate-900/80 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-full border border-slate-700 hover:border-rose-500 transition-all backdrop-blur-sm"
        title="Logout from Captain Mode"
      >
        🔒 Logout
      </button>
      {children}
    </>
  );
}