import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResetSettings: React.FC = () => {
  const { resetToDefaults } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleExecuteReset = () => {
    resetToDefaults();
    setShowDialog(false);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Réinitialisation
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Rétablissez la configuration par défaut ou effacez la mémoire locale de l'application.
        </p>
      </div>

      {confirmed && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle size={16} />
          <span>L'application a été réinitialisée aux réglages d'usine avec succès.</span>
        </div>
      )}

      {/* Mac Grouped Reset Card */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-rose-900/60 flex-shrink-0 mt-0.5 sm:mt-0">
              <RotateCcw size={16} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Rétablir tous les réglages par défaut
              </h4>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                Supprime les raccourcis personnalisés créés et réinitialise les catégories, le thème et les préférences d'affichage.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs flex-shrink-0 cursor-pointer self-start sm:self-center"
          >
            Réinitialiser...
          </button>
        </div>
      </div>

      {/* Mac Modal Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Confirmer la réinitialisation
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Cette action est irréversible.
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80">
              Tous vos liens, dossiers de catégories et personnalisations de thème seront remplacés par les valeurs d'origine.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Réinitialiser définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
