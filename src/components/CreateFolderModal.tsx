import React, { useState, useEffect, useRef } from 'react';
import { FolderPlus, X, Check, ArrowRight, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractDomain } from '../utils/favicon';

export const CreateFolderModal: React.FC = () => {
  const {
    shortcuts,
    folderCreationCandidate,
    setFolderCreationCandidate,
    createFolderFromShortcuts,
  } = useApp();

  const [folderName, setFolderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const sourceShortcut = shortcuts.find((s) => s.id === folderCreationCandidate?.sourceId);
  const targetShortcut = shortcuts.find((s) => s.id === folderCreationCandidate?.targetId);

  useEffect(() => {
    if (sourceShortcut && targetShortcut) {
      // Suggest clean default name
      setFolderName(`${targetShortcut.title} & ${sourceShortcut.title}`);
      setTimeout(() => {
        inputRef.current?.select();
      }, 50);
    }
  }, [sourceShortcut, targetShortcut]);

  if (!folderCreationCandidate || !sourceShortcut || !targetShortcut) {
    return null;
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderCreationCandidate) return;

    createFolderFromShortcuts(
      folderCreationCandidate.sourceId,
      folderCreationCandidate.targetId,
      folderName.trim() || undefined
    );
    setFolderCreationCandidate(null);
  };

  const handleCancel = () => {
    setFolderCreationCandidate(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200/90 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/80 dark:border-blue-900/60 shadow-xs">
            <FolderPlus size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">Créer un nouveau dossier</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Regrouper ces 2 raccourcis dans un dossier
            </p>
          </div>
        </div>

        {/* Visual Preview of the two items being grouped */}
        <div className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 mb-5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold truncate max-w-[120px] text-neutral-800 dark:text-neutral-200">
              {targetShortcut.title}
            </span>
          </div>

          <div className="text-neutral-400">
            <Plus size={14} />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold truncate max-w-[120px] text-neutral-800 dark:text-neutral-200">
              {sourceShortcut.title}
            </span>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              Nom du dossier
            </label>
            <input
              ref={inputRef}
              id="new-folder-name-input"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Ex: Réseaux Sociaux, Outils, Travail..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-neutral-900 transition-all"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              id="confirm-create-folder-btn"
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check size={14} />
              <span>Créer le dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
