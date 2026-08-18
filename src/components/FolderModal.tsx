import React, { useState, useEffect } from 'react';
import {
  Folder as FolderIcon,
  X,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractDomain, getFaviconUrl } from '../utils/favicon';
import { getLucideIcon } from '../utils/icons';
import { Shortcut } from '../types';

export const FolderModal: React.FC = () => {
  const {
    activeFolderModal,
    closeFolderModal,
    shortcuts,
    openAddModal,
    openEditModal,
    deleteShortcut,
    deleteFolder,
    updateFolder,
    moveShortcutToFolder,
    settings,
  } = useApp();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (activeFolderModal) {
      setFolderName(activeFolderModal.name);
      setIsEditingTitle(false);
    }
  }, [activeFolderModal]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeFolderModal) {
        closeFolderModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFolderModal, closeFolderModal]);

  if (!activeFolderModal) return null;

  const folderShortcuts = shortcuts.filter((s) => s.folderId === activeFolderModal.id);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      updateFolder(activeFolderModal.id, folderName.trim());
    }
    setIsEditingTitle(false);
  };

  const handleOpenShortcut = (s: Shortcut) => {
    if (settings.openInNewTab) {
      window.open(s.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = s.url;
    }
  };

  const handleRemoveFromFolder = (e: React.MouseEvent, shortcutId: string) => {
    e.stopPropagation();
    moveShortcutToFolder(shortcutId, null);
  };

  const handleDeleteShortcut = (e: React.MouseEvent, shortcutId: string) => {
    e.stopPropagation();
    deleteShortcut(shortcutId);
  };

  const handleEditShortcut = (e: React.MouseEvent, s: Shortcut) => {
    e.stopPropagation();
    openEditModal(s);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeFolderModal}
    >
      <div
        className="w-full max-w-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-200/90 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 relative max-h-[85vh] flex flex-col select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/80 dark:border-blue-900/60 flex-shrink-0 shadow-xs">
              <FolderIcon size={20} />
            </div>

            <div className="min-w-0 flex-1">
              {isEditingTitle ? (
                <form onSubmit={handleTitleSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={handleTitleSubmit}
                    autoFocus
                    className="text-base font-bold px-2 py-1 rounded-lg border border-blue-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    <Check size={14} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight truncate">
                    {activeFolderModal.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(true)}
                    title="Renommer le dossier"
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {folderShortcuts.length} raccourci{folderShortcuts.length > 1 ? 's' : ''} dans ce dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openAddModal(undefined, activeFolderModal.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Ajouter</span>
            </button>

            <button
              onClick={() => deleteFolder(activeFolderModal.id, false)}
              title="Dissoudre le dossier (garder les raccourcis)"
              className="p-2 rounded-xl text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>

            <button
              onClick={closeFolderModal}
              title="Fermer"
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Shortcuts Inside Folder */}
        <div className="flex-1 overflow-y-auto pt-4 pb-2 pr-1 my-2">
          {folderShortcuts.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <FolderIcon size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Ce dossier est vide</p>
              <p className="text-xs mt-1 text-neutral-500">
                Glissez des raccourcis dans ce dossier ou cliquez sur Ajouter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {folderShortcuts.map((s) => {
                const domain = extractDomain(s.url);
                return (
                  <div
                    key={s.id}
                    onClick={() => handleOpenShortcut(s)}
                    className="group relative flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-200/70 dark:border-neutral-700/60 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    {/* Icon */}
                    {s.iconType === 'lucide' ? (
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: s.color || '#3b82f6' }}
                      >
                        {React.createElement(getLucideIcon(s.lucideIconName), { size: 18 })}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 border border-neutral-200/80 dark:border-neutral-600/80 overflow-hidden p-1.5 shadow-xs">
                        <img
                          src={getFaviconUrl(s.url, 128)}
                          alt={s.title}
                          className="w-5 h-5 object-contain"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white">
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                        {domain}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleRemoveFromFolder(e, s.id)}
                        title="Sortir du dossier"
                        className="p-1 rounded-lg text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                      >
                        <LogOut size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleEditShortcut(e, s)}
                        title="Modifier"
                        className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteShortcut(e, s.id)}
                        title="Supprimer"
                        className="p-1 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Cliquez sur l'icône de sortie pour replacer un raccourci sur la grille principale</span>
          <button
            onClick={closeFolderModal}
            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
