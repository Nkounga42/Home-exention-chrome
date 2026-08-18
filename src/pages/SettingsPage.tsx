import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  Palette,
  Image,
  SearchCode,
  Clock,
  FolderTree,
  HardDriveDownload,
  RotateCcw,
  Sliders,
  HelpCircle,
  X,
} from 'lucide-react';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { BackgroundSettings } from '../components/settings/BackgroundSettings';
import { SearchEngineSettings } from '../components/settings/SearchEngineSettings';
import { DisplayClockSettings } from '../components/settings/DisplayClockSettings';
import { CategoryManager } from '../components/CategoryManager';
import { ChromeExtensionExporter } from '../components/ChromeExtensionExporter';
import { ResetSettings } from '../components/settings/ResetSettings';

type SettingsTab =
  | 'appearance'
  | 'background'
  | 'search'
  | 'clock'
  | 'categories'
  | 'export'
  | 'reset';

interface SidebarItem {
  id: SettingsTab;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  colorBg: string;
  colorIcon: string;
  keywords: string[];
}

const SETTINGS_SECTIONS: SidebarItem[] = [
  {
    id: 'appearance',
    label: 'Apparence',
    sublabel: 'Thème sombre & clair, grille',
    icon: Palette,
    colorBg: 'bg-amber-500',
    colorIcon: 'text-white',
    keywords: ['thème', 'theme', 'sombre', 'clair', 'dark', 'light', 'densité', 'grille'],
  },
  {
    id: 'background',
    label: 'Arrière-plan',
    sublabel: 'Wallpapers HD, perso, filtres',
    icon: Image,
    colorBg: 'bg-indigo-600',
    colorIcon: 'text-white',
    keywords: ['fond', 'arrière-plan', 'wallpaper', 'image', 'photo', 'flou', 'voile', 'unsplash', 'upload'],
  },
  {
    id: 'search',
    label: 'Moteur de recherche',
    sublabel: 'Google, DuckDuckGo, Bing...',
    icon: SearchCode,
    colorBg: 'bg-blue-600',
    colorIcon: 'text-white',
    keywords: ['moteur', 'recherche', 'google', 'duckduckgo', 'bing', 'search'],
  },
  {
    id: 'clock',
    label: 'Horloge & Widgets',
    sublabel: 'Heure, Météo, Secondes',
    icon: Clock,
    colorBg: 'bg-purple-600',
    colorIcon: 'text-white',
    keywords: ['horloge', 'heure', 'format', '24h', '12h', 'secondes', 'météo', 'widget'],
  },
  {
    id: 'categories',
    label: 'Catégories',
    sublabel: 'Dossiers de raccourcis',
    icon: FolderTree,
    colorBg: 'bg-emerald-600',
    colorIcon: 'text-white',
    keywords: ['catégorie', 'dossier', 'couleur', 'raccourcis', 'organisation'],
  },
  {
    id: 'export',
    label: 'Sauvegarde & Extension',
    sublabel: 'Export JSON, HTML, Manifest',
    icon: HardDriveDownload,
    colorBg: 'bg-cyan-600',
    colorIcon: 'text-white',
    keywords: ['sauvegarde', 'export', 'import', 'json', 'favoris', 'manifest', 'extension', 'chrome'],
  },
  {
    id: 'reset',
    label: 'Réinitialisation',
    sublabel: 'Rétablir réglages d’usine',
    icon: RotateCcw,
    colorBg: 'bg-rose-600',
    colorIcon: 'text-white',
    keywords: ['reset', 'réinitialiser', 'défaut', 'restaurer', 'usine'],
  },
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SETTINGS_SECTIONS;
    return SETTINGS_SECTIONS.filter(
      (sec) =>
        sec.label.toLowerCase().includes(q) ||
        sec.sublabel.toLowerCase().includes(q) ||
        sec.keywords.some((k) => k.includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-100/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6 select-none flex-shrink-0">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            id="back-home-button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ChevronLeft size={15} />
            <span>Accueil</span>
          </Link>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            <Sliders size={16} className="text-neutral-500" />
            <span>Réglages Système</span>
          </div>
        </div>

        {/* Right: Guide shortcut */}
        <div className="flex items-center gap-2">
          <Link
            to="/extension-guide"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <HelpCircle size={15} />
            <span className="hidden sm:inline">Guide Extension Chrome</span>
          </Link>
        </div>
      </header>

      {/* Main App Layout: Left Sidebar + Right Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-full md:w-68 bg-white dark:bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0">
          {/* Quick Search in Sidebar */}
          <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un réglage..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-56 md:max-h-none flex-1">
            {filteredSections.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-400">
                Aucun réglage trouvé
              </div>
            ) : (
              filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    id={`sidebar-item-${sec.id}`}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer select-none ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {/* Icon Badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : `${sec.colorBg} ${sec.colorIcon}`
                      }`}
                    >
                      <Icon size={15} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">{sec.label}</div>
                      <div
                        className={`text-[11px] truncate ${
                          isActive ? 'text-blue-100' : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      >
                        {sec.sublabel}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </nav>
        </aside>

        {/* Right Settings Content Pane */}
        <main className="flex-1 bg-neutral-50/70 dark:bg-neutral-950/60 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'background' && <BackgroundSettings />}
            {activeTab === 'search' && <SearchEngineSettings />}
            {activeTab === 'clock' && <DisplayClockSettings />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'export' && <ChromeExtensionExporter />}
            {activeTab === 'reset' && <ResetSettings />}
          </div>
        </main>
      </div>
    </div>
  );
};
