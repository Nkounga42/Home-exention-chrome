import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
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
} from 'lucide-react';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { BackgroundSettings } from './settings/BackgroundSettings';
import { SearchEngineSettings } from './settings/SearchEngineSettings';
import { DisplayClockSettings } from './settings/DisplayClockSettings';
import { CategoryManager } from './CategoryManager';
import { ChromeExtensionExporter } from './ChromeExtensionExporter';
import { ResetSettings } from './settings/ResetSettings';
import { useNavigate } from 'react-router-dom';

export type SettingsTab =
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

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'appearance',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[90vh] max-h-[760px] rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header of Modal */}
        <header className="w-full h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6 select-none flex-shrink-0">
          {/* Left: Title & Icon */}
          <div className="flex items-center gap-2.5 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sliders size={16} />
            </div>
            <span>Réglages Système</span>
          </div>

          {/* Right: Chrome Guide button + Close button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/extension-guide');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <HelpCircle size={15} />
              <span className="hidden sm:inline">Guide Extension Chrome</span>
            </button>

            <button
              type="button"
              id="settings-modal-close-btn"
              onClick={onClose}
              title="Fermer les paramètres (Échap)"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Modal Body: Left Sidebar + Right Settings Content */}
        <div className="flex-1 flex flex-col md:flex-row w-full min-h-0 overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-full md:w-64 bg-neutral-50/50 dark:bg-neutral-900/50 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0">
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
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <nav className="p-2 space-y-1 overflow-y-auto max-h-48 md:max-h-none flex-1">
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
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800'
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
          <main className="flex-1 bg-neutral-100/30 dark:bg-neutral-950/40 p-4 sm:p-7 overflow-y-auto">
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
    </div>
  );
};
