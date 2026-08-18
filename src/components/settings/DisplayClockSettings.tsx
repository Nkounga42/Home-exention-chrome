import React from 'react';
import {
  Clock,
  CloudSun,
  Flame,
  ExternalLink,
  Timer,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MacToggle } from '../MacToggle';
import { TimeFormat } from '../../types';

export const DisplayClockSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Horloge & Affichage
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Gérez l'horloge d'en-tête, la météo et les options d'ouverture des liens.
        </p>
      </div>

      {/* Section 1: Clock & Time Group */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
          Horloge Principale
        </h3>
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
          {/* Show Clock */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-900/60">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Afficher l'horloge et la date
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Affiche l'heure actuelle en grand dans l'en-tête
                </p>
              </div>
            </div>
            <MacToggle
              id="toggle-show-clock"
              checked={settings.showClock}
              onChange={(val) => updateSettings({ showClock: val })}
              label="Afficher l'horloge"
            />
          </div>

          {/* Time Format: 24h vs 12h */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/60">
                <Timer size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Format horaire
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Choisir entre le format 24 heures ou 12 heures (AM/PM)
                </p>
              </div>
            </div>
            {/* Mac Segmented Switch for 24h/12h */}
            <div className="p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center border border-neutral-200/80 dark:border-neutral-700/80">
              {(['24h', '12h'] as TimeFormat[]).map((fmt) => {
                const isSel = settings.timeFormat === fmt;
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateSettings({ timeFormat: fmt })}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      isSel
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Show Seconds */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-900/60">
                <Eye size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Afficher les secondes
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Précision à la seconde près
                </p>
              </div>
            </div>
            <MacToggle
              id="toggle-show-seconds"
              checked={settings.showSeconds}
              onChange={(val) => updateSettings({ showSeconds: val })}
              label="Afficher les secondes"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Links & Widgets */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
          Navigation & Widgets
        </h3>
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
          {/* Open in New Tab */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-900/60">
                <ExternalLink size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Ouvrir les liens dans un nouvel onglet
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Conserve la page d'accueil ouverte lors du clic
                </p>
              </div>
            </div>
            <MacToggle
              id="toggle-open-new-tab"
              checked={settings.openInNewTab}
              onChange={(val) => updateSettings({ openInNewTab: val })}
              label="Ouvrir dans un nouvel onglet"
            />
          </div>

          {/* Local Weather Widget */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-900/60">
                <CloudSun size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Widget météo local
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Affiche la température et les conditions météo en direct
                </p>
              </div>
            </div>
            <MacToggle
              id="toggle-show-weather"
              checked={settings.showWeather}
              onChange={(val) => updateSettings({ showWeather: val })}
              label="Widget météo"
            />
          </div>

          {/* Click Counter */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200/60 dark:border-orange-900/60">
                <Flame size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Compteur de clics & popularité
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Suit la fréquence d'utilisation de chaque raccourci
                </p>
              </div>
            </div>
            <MacToggle
              id="toggle-show-clicks"
              checked={settings.showClicks}
              onChange={(val) => updateSettings({ showClicks: val })}
              label="Compteur de clics"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
