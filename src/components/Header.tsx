import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { settings, updateSettings, openAddModal, effectiveBackgroundDark } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatHours = () => {
    return time.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: settings.showSeconds ? '2-digit' : undefined,
      hour12: settings.timeFormat === '12h',
    });
  };

  const formatDate = () => {
    const formatted = time.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const isDarkMode =
    settings.theme === 'dark' ||
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="w-full max-w-5xl mx-auto pt-8 pb-4 px-4 sm:px-6 flex items-center justify-between">
      {/* Clock & Date with dynamic high contrast */}
      <div className="flex flex-col select-none">
        <span
          className={`text-3xl sm:text-4xl font-light tracking-tight font-mono transition-colors duration-200 ${
            effectiveBackgroundDark
              ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
              : 'text-neutral-900 drop-shadow-xs'
          }`}
        >
          {formatHours()}
        </span>
        <span
          className={`text-xs sm:text-sm font-medium capitalize transition-colors duration-200 ${
            effectiveBackgroundDark
              ? 'text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
              : 'text-neutral-600 drop-shadow-xs'
          }`}
        >
          {formatDate()}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          id="header-add-shortcut-btn"
          onClick={() => openAddModal()}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
            effectiveBackgroundDark
              ? 'bg-white text-neutral-950 hover:bg-neutral-100 hover:shadow-md'
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
        >
          <Plus size={15} />
          <span>Ajouter un raccourci</span>
        </button>

        <button
          id="nav-theme-toggle-btn"
          onClick={toggleTheme}
          title={isDarkMode ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'}
          className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer shadow-xs border ${
            effectiveBackgroundDark
              ? 'bg-black/50 hover:bg-black/70 text-white border-white/20'
              : 'bg-white/90 text-neutral-700 hover:bg-white border-neutral-200/90'
          }`}
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <Link
          id="nav-settings-link"
          to="/settings"
          title="Paramètres & Arrière-plan"
          className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer shadow-xs border ${
            effectiveBackgroundDark
              ? 'bg-black/50 hover:bg-black/70 text-white border-white/20'
              : 'bg-white/90 text-neutral-700 hover:bg-white border-neutral-200/90'
          }`}
        >
          <Settings size={17} />
        </Link>
      </div>
    </header>
  );
};
