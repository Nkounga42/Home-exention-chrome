import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, Sun, Moon, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { settings, updateSettings, openAddModal } = useApp();
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

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="w-full max-w-5xl mx-auto pt-8 pb-4 px-4 sm:px-6 flex items-center justify-between">
      {/* Clock & Date */}
      <div className="flex flex-col select-none">
        <span className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 font-mono drop-shadow-xs">
          {formatHours()}
        </span>
        <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 capitalize drop-shadow-xs">
          {formatDate()}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          id="header-add-shortcut-btn"
          onClick={() => openAddModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={15} />
          <span>Ajouter un raccourci</span>
        </button>

        <button
          id="nav-theme-toggle-btn"
          onClick={toggleTheme}
          title={settings.theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
          className="p-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-600 dark:text-neutral-400 border border-neutral-200/90 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
        >
          {settings.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <Link
          id="nav-settings-link"
          to="/settings"
          title="Paramètres & Arrière-plan"
          className="p-2 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-600 dark:text-neutral-400 border border-neutral-200/90 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <Settings size={17} />
        </Link>
      </div>
    </header>
  );
};
