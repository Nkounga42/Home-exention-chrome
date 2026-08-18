import React from 'react';
import { Sun, Moon, Monitor, LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode, GridDensity } from '../../types';

export const AppearanceSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Apparence
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Personnalisez le mode d'affichage et l'agencement de vos raccourcis.
        </p>
      </div>

      {/* Theme Selection Group */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs space-y-3">
        <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
          Mode d'affichage
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              id: 'light',
              label: 'Clair',
              icon: Sun,
              desc: 'Thème lumineux',
              previewBg: 'bg-neutral-100 border-neutral-300',
              previewBar: 'bg-white border-neutral-300',
            },
            {
              id: 'dark',
              label: 'Sombre',
              icon: Moon,
              desc: 'Thème sombre',
              previewBg: 'bg-neutral-900 border-neutral-700',
              previewBar: 'bg-neutral-800 border-neutral-700',
            },
            {
              id: 'system',
              label: 'Auto',
              icon: Monitor,
              desc: 'Selon le système',
              previewBg: 'bg-gradient-to-r from-neutral-100 to-neutral-900 border-neutral-400',
              previewBar: 'bg-neutral-400/40 border-neutral-400',
            },
          ].map((themeOpt) => {
            const Icon = themeOpt.icon;
            const isSelected = settings.theme === themeOpt.id;

            return (
              <button
                key={themeOpt.id}
                type="button"
                id={`theme-select-${themeOpt.id}`}
                onClick={() => updateSettings({ theme: themeOpt.id as ThemeMode })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer select-none ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40'
                }`}
              >
                {/* Visual miniature preview box */}
                <div
                  className={`w-full h-12 rounded-lg border p-1 flex flex-col justify-between overflow-hidden shadow-xs ${themeOpt.previewBg}`}
                >
                  <div className={`w-full h-2 rounded-sm border ${themeOpt.previewBar}`} />
                  <div className="flex gap-1">
                    <div className={`w-2.5 h-2.5 rounded-xs border ${themeOpt.previewBar}`} />
                    <div className={`w-2.5 h-2.5 rounded-xs border ${themeOpt.previewBar}`} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Icon size={14} className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500'} />
                  <span className={`text-xs font-semibold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                    {themeOpt.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Density Group */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs space-y-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Densité de la grille de raccourcis
          </label>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Ajustez l'espacement et la taille des vignettes sur la page principale.
          </p>
        </div>

        {/* Mac Segmented Control */}
        <div className="p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-1 border border-neutral-200/80 dark:border-neutral-700/80">
          {[
            { id: 'compact', label: 'Compacte', desc: 'Plus de cartes par ligne' },
            { id: 'normal', label: 'Normale', desc: 'Agencement équilibré' },
            { id: 'comfortable', label: 'Spacieuse', desc: 'Grandes cartes aérées' },
          ].map((d) => {
            const isSelected = settings.density === d.id;
            return (
              <button
                key={d.id}
                type="button"
                id={`density-select-${d.id}`}
                onClick={() => updateSettings({ density: d.id as GridDensity })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <LayoutGrid size={13} />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
