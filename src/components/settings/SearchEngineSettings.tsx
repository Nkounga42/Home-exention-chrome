import React from 'react';
import { Search, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEARCH_ENGINES } from '../../utils/searchEngines';
import { SearchEngineId } from '../../types';

export const SearchEngineSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Moteur de Recherche
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Choisissez le fournisseur de recherche utilisé par la barre d'accueil.
        </p>
      </div>

      {/* Mac Grouped Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
        {Object.values(SEARCH_ENGINES).map((engine) => {
          const isSelected = settings.searchEngine === engine.id;

          return (
            <div
              key={engine.id}
              id={`engine-row-${engine.id}`}
              onClick={() => updateSettings({ searchEngine: engine.id as SearchEngineId })}
              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80">
                  <Search size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {engine.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    {engine.placeholder}
                  </p>
                </div>
              </div>

              {/* Radio check indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs'
                    : 'border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
