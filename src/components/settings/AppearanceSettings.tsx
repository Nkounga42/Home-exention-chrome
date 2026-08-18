import React from 'react';
import { Sun, Moon, Monitor, LayoutGrid, Rows3, Columns3, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode, GridDensity, ShortcutLayoutStyle, GridColumns } from '../../types';

export const AppearanceSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Apparence & Disposition
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Personnalisez le mode d'affichage, le style des raccourcis et le nombre de colonnes de la grille.
        </p>
      </div>

      {/* 1. Theme Selection Group */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 sm:p-5 shadow-xs space-y-3">
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

      {/* 2. Shortcut Layout Style (Icons vs Cards) */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 sm:p-5 shadow-xs space-y-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Style d'affichage des raccourcis
          </label>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Choisissez entre un affichage épuré centré sur les icônes ou des cartes horizontales détaillées.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option: Icons with Title Below */}
          <button
            type="button"
            id="layout-style-icons-btn"
            onClick={() => updateSettings({ layoutStyle: 'icons' })}
            className={`p-4 rounded-xl border flex flex-col items-start gap-3 transition-all text-left cursor-pointer select-none relative ${
              (settings.layoutStyle || 'icons') === 'icons'
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40'
            }`}
          >
            {/* Visual Icon Grid Miniature */}
            <div className="w-full h-16 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 border border-neutral-300/80 dark:border-neutral-700 flex items-center justify-center gap-3 px-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 flex items-center justify-center shadow-2xs">
                    <div className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
                  </div>
                  <div className="w-6 h-1 rounded-full bg-neutral-400/70 dark:bg-neutral-500" />
                </div>
              ))}
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid size={15} className={(settings.layoutStyle || 'icons') === 'icons' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500'} />
                  <span className={`text-xs font-bold ${(settings.layoutStyle || 'icons') === 'icons' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                    Icônes & Titre en dessous
                  </span>
                </div>
                {(settings.layoutStyle || 'icons') === 'icons' && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Affiche uniquement les icônes au centre avec leur titre juste en dessous. Style épuré et moderne.
              </p>
            </div>
          </button>

          {/* Option: Horizontal Cards */}
          <button
            type="button"
            id="layout-style-cards-btn"
            onClick={() => updateSettings({ layoutStyle: 'cards' })}
            className={`p-4 rounded-xl border flex flex-col items-start gap-3 transition-all text-left cursor-pointer select-none relative ${
              settings.layoutStyle === 'cards'
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40'
            }`}
          >
            {/* Visual Card Miniature */}
            <div className="w-full h-16 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 border border-neutral-300/80 dark:border-neutral-700 flex items-center justify-center gap-2 px-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex-1 h-9 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 flex items-center gap-1.5 px-1.5 shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-blue-500 flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="w-full h-1.5 rounded-full bg-neutral-700 dark:bg-neutral-300" />
                    <div className="w-2/3 h-1 rounded-full bg-neutral-400" />
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Rows3 size={15} className={settings.layoutStyle === 'cards' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500'} />
                  <span className={`text-xs font-bold ${settings.layoutStyle === 'cards' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                    Cartes horizontales
                  </span>
                </div>
                {settings.layoutStyle === 'cards' && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Vignettes rectangulaires détaillées avec icône à gauche, titre du site et domaine web.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Columns Layout Management */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 sm:p-5 shadow-xs space-y-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Columns3 size={15} className="text-blue-600 dark:text-blue-400" />
            <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Nombre de colonnes de la grille
            </label>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Contrôlez la disposition et le nombre exact de colonnes affichées horizontalement.
          </p>
        </div>

        {/* Columns Selector Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[
            { id: 'auto', label: 'Auto', desc: 'Adaptatif' },
            { id: 3, label: '3 col', desc: '3 par ligne' },
            { id: 4, label: '4 col', desc: '4 par ligne' },
            { id: 5, label: '5 col', desc: '5 par ligne' },
            { id: 6, label: '6 col', desc: '6 par ligne' },
            { id: 7, label: '7 col', desc: '7 par ligne' },
            { id: 8, label: '8 col', desc: '8 par ligne' },
            { id: 10, label: '10 col', desc: '10 par ligne' },
          ].map((colOpt) => {
            const isSelected = (settings.gridColumns || 'auto') === colOpt.id;
            return (
              <button
                key={String(colOpt.id)}
                type="button"
                id={`column-select-${colOpt.id}`}
                onClick={() => updateSettings({ gridColumns: colOpt.id as GridColumns })}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer select-none ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/30 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 font-medium'
                }`}
              >
                <span className={`text-xs ${isSelected ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {colOpt.label}
                </span>
                <span className="text-[9px] text-neutral-400 truncate max-w-full">
                  {colOpt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Grid Density Group */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 sm:p-5 shadow-xs space-y-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Taille & espacement (Densité)
          </label>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Ajustez l'échelle des icônes et l'espacement des vignettes.
          </p>
        </div>

        {/* 3 Interactive Cards with live visual grid previews */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'compact',
              label: 'Compacte',
              desc: 'Petites icônes, espacement serré',
              colsCount: 6,
              boxClass: 'h-3 w-3 rounded-xs',
            },
            {
              id: 'normal',
              label: 'Normale',
              desc: 'Taille standard équilibrée',
              colsCount: 4,
              boxClass: 'h-4 w-4 rounded-xs',
            },
            {
              id: 'comfortable',
              label: 'Spacieuse',
              desc: 'Grandes icônes aérées',
              colsCount: 3,
              boxClass: 'h-5 w-5 rounded-sm',
            },
          ].map((d) => {
            const isSelected = (settings.density || 'normal') === d.id;
            return (
              <button
                key={d.id}
                type="button"
                id={`density-select-${d.id}`}
                onClick={() => updateSettings({ density: d.id as GridDensity })}
                className={`p-3.5 rounded-xl border flex flex-col items-start gap-2.5 transition-all text-left cursor-pointer select-none relative ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40'
                }`}
              >
                {/* Visual miniature representation */}
                <div className="w-full h-12 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 border border-neutral-300/80 dark:border-neutral-700 flex items-center justify-center gap-1.5 px-2">
                  {Array.from({ length: d.colsCount }).map((_, i) => (
                    <div
                      key={i}
                      className={`${d.boxClass} bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 flex-shrink-0 shadow-2xs`}
                    />
                  ))}
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                      {d.label}
                    </span>
                    {isSelected && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {d.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
