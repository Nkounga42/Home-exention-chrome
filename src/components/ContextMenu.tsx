import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  ArrowUpRight,
  Pencil,
  Copy,
  Check,
  Pin,
  PinOff,
  FolderInput,
  Trash2,
  FolderOpen,
  Plus,
  LogOut,
  FolderMinus,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Folder, Shortcut } from '../types';

export const ContextMenu: React.FC = () => {
  const {
    contextMenu,
    closeContextMenu,
    openEditModal,
    deleteShortcut,
    togglePin,
    moveShortcutToFolder,
    folders,
    openFolderModal,
    updateFolder,
    deleteFolder,
    openAddModal,
    isDarkMode,
  } = useApp();

  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showFolderSubmenu, setShowFolderSubmenu] = useState(false);

  // Close on outside click or scroll or escape
  useEffect(() => {
    if (!contextMenu?.isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextMenu();
      }
    };

    const handleScroll = () => {
      closeContextMenu();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [contextMenu?.isOpen, closeContextMenu]);

  if (!contextMenu?.isOpen) return null;

  // Calculate clamped position so context menu doesn't overflow screen
  const menuWidth = 240;
  const menuHeight = contextMenu.type === 'shortcut' ? 290 : 220;

  let left = contextMenu.x;
  let top = contextMenu.y;

  if (typeof window !== 'undefined') {
    if (left + menuWidth > window.innerWidth) {
      left = Math.max(10, window.innerWidth - menuWidth - 12);
    }
    if (top + menuHeight > window.innerHeight) {
      top = Math.max(10, window.innerHeight - menuHeight - 12);
    }
  }

  // Action handlers for Shortcuts
  const shortcut = contextMenu.type === 'shortcut' ? (contextMenu.item as Shortcut) : null;
  const folder = contextMenu.type === 'folder' ? (contextMenu.item as Folder) : null;

  const handleOpenNewTab = () => {
    if (shortcut) {
      window.open(shortcut.url, '_blank', 'noopener,noreferrer');
    }
    closeContextMenu();
  };

  const handleOpenCurrentTab = () => {
    if (shortcut) {
      window.location.href = shortcut.url;
    }
    closeContextMenu();
  };

  const handleEdit = () => {
    if (shortcut) {
      openEditModal(shortcut);
    }
    closeContextMenu();
  };

  const handleCopyLink = () => {
    if (shortcut) {
      navigator.clipboard.writeText(shortcut.url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        closeContextMenu();
      }, 600);
    }
  };

  const handleTogglePin = () => {
    if (shortcut) {
      togglePin(shortcut.id);
    }
    closeContextMenu();
  };

  const handleMoveToFolder = (targetFolderId: string | null) => {
    if (shortcut) {
      moveShortcutToFolder(shortcut.id, targetFolderId);
    }
    closeContextMenu();
  };

  const handleDeleteShortcut = () => {
    if (shortcut) {
      deleteShortcut(shortcut.id);
    }
    closeContextMenu();
  };

  // Action handlers for Folders
  const handleOpenFolder = () => {
    if (folder) {
      openFolderModal(folder);
    }
    closeContextMenu();
  };

  const handleRenameFolder = () => {
    if (folder) {
      const newName = window.prompt('Nouveau nom du dossier :', folder.name);
      if (newName && newName.trim()) {
        updateFolder(folder.id, newName.trim());
      }
    }
    closeContextMenu();
  };

  const handleAddShortcutToFolder = () => {
    if (folder) {
      openAddModal(undefined, folder.id);
    }
    closeContextMenu();
  };

  const handleDissolveFolder = () => {
    if (folder) {
      deleteFolder(folder.id, false);
    }
    closeContextMenu();
  };

  const handleDeleteFolderAndContents = () => {
    if (folder) {
      if (window.confirm(`Supprimer le dossier "${folder.name}" et tous ses raccourcis ?`)) {
        deleteFolder(folder.id, true);
      }
    }
    closeContextMenu();
  };

  const itemBaseClass = `w-full px-3 py-2 text-xs font-medium rounded-xl flex items-center gap-2.5 transition-colors text-left cursor-pointer select-none`;
  const itemNormalClass = isDarkMode
    ? 'text-neutral-200 hover:text-white hover:bg-white/10'
    : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100';

  const itemDangerClass = isDarkMode
    ? 'text-red-400 hover:text-red-300 hover:bg-red-950/40'
    : 'text-red-600 hover:text-red-700 hover:bg-red-50';

  const separatorClass = isDarkMode
    ? 'border-t border-white/10 my-1'
    : 'border-t border-neutral-200/90 my-1';

  return (
    <div
      ref={menuRef}
      id="app-context-menu"
      style={{ left: `${left}px`, top: `${top}px` }}
      className={`fixed z-50 w-60 rounded-2xl p-1.5 border shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 select-none ${
        isDarkMode
          ? 'bg-neutral-900/95 border-white/15 text-white shadow-black/60'
          : 'bg-white/95 border-neutral-200/90 text-neutral-900 shadow-neutral-900/20'
      }`}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header Info */}
      <div className="px-3 py-1.5 mb-1 border-b border-neutral-200/70 dark:border-white/10">
        <p className="text-xs font-bold truncate">
          {shortcut ? shortcut.title : folder ? folder.name : 'Options'}
        </p>
        <p className="text-[10px] text-neutral-400 dark:text-neutral-400 truncate">
          {shortcut ? shortcut.url : 'Dossier de raccourcis'}
        </p>
      </div>

      {/* SHORTCUT MENU ITEMS */}
      {shortcut && (
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={handleOpenNewTab}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            <ExternalLink size={14} className="text-blue-500 flex-shrink-0" />
            <span>Ouvrir dans un nouvel onglet</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCurrentTab}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            <ArrowUpRight size={14} className="text-neutral-400 flex-shrink-0" />
            <span>Ouvrir dans cet onglet</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            {copied ? (
              <Check size={14} className="text-green-500 flex-shrink-0" />
            ) : (
              <Copy size={14} className="text-neutral-400 flex-shrink-0" />
            )}
            <span>{copied ? 'Adresse copiée !' : "Copier l'adresse"}</span>
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            <Pencil size={14} className="text-neutral-400 flex-shrink-0" />
            <span>Modifier le raccourci</span>
          </button>

          <button
            type="button"
            onClick={handleTogglePin}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            {shortcut.pinned ? (
              <>
                <PinOff size={14} className="text-amber-500 flex-shrink-0" />
                <span>Détacher</span>
              </>
            ) : (
              <>
                <Pin size={14} className="text-neutral-400 flex-shrink-0" />
                <span>Épingler</span>
              </>
            )}
          </button>

          {/* Move to folder submenu trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFolderSubmenu((prev) => !prev)}
              className={`${itemBaseClass} ${itemNormalClass} justify-between`}
            >
              <div className="flex items-center gap-2.5">
                <FolderInput size={14} className="text-neutral-400 flex-shrink-0" />
                <span>Déplacer dans un dossier</span>
              </div>
              <span className="text-[10px] text-neutral-400">▶</span>
            </button>

            {showFolderSubmenu && (
              <div
                className={`absolute left-full top-0 ml-1 w-48 p-1 rounded-xl border shadow-xl backdrop-blur-xl z-50 flex flex-col gap-0.5 ${
                  isDarkMode
                    ? 'bg-neutral-900/95 border-white/20 text-white'
                    : 'bg-white/95 border-neutral-200 text-neutral-900'
                }`}
              >
                {shortcut.folderId && (
                  <button
                    type="button"
                    onClick={() => handleMoveToFolder(null)}
                    className={`${itemBaseClass} ${itemNormalClass}`}
                  >
                    <FolderMinus size={13} className="text-amber-500 flex-shrink-0" />
                    <span>Hors des dossiers</span>
                  </button>
                )}
                {folders.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    disabled={shortcut.folderId === f.id}
                    onClick={() => handleMoveToFolder(f.id)}
                    className={`${itemBaseClass} ${
                      shortcut.folderId === f.id ? 'opacity-40 cursor-not-allowed' : itemNormalClass
                    }`}
                  >
                    <span className="truncate">{f.name}</span>
                    {shortcut.folderId === f.id && <span className="text-[10px] ml-auto">✓</span>}
                  </button>
                ))}
                {folders.length === 0 && !shortcut.folderId && (
                  <span className="px-3 py-2 text-[11px] text-neutral-400 text-center">
                    Aucun dossier existant
                  </span>
                )}
              </div>
            )}
          </div>

          <div className={separatorClass} />

          <button
            type="button"
            onClick={handleDeleteShortcut}
            className={`${itemBaseClass} ${itemDangerClass}`}
          >
            <Trash2 size={14} className="flex-shrink-0" />
            <span>Supprimer</span>
          </button>
        </div>
      )}

      {/* FOLDER MENU ITEMS */}
      {folder && (
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={handleOpenFolder}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            <FolderOpen size={14} className="text-blue-500 flex-shrink-0" />
            <span>Ouvrir le dossier</span>
          </button>

          <button
            type="button"
            onClick={handleRenameFolder}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            <Pencil size={14} className="text-neutral-400 flex-shrink-0" />
            <span>Renommer</span>
          </button>

          <button
            type="button"
            onClick={handleAddShortcutToFolder}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            <Plus size={14} className="text-neutral-400 flex-shrink-0" />
            <span>Ajouter un lien ici</span>
          </button>

          <button
            type="button"
            onClick={handleDissolveFolder}
            className={`${itemBaseClass} ${itemNormalClass}`}
          >
            <LogOut size={14} className="text-amber-500 flex-shrink-0" />
            <span>Dissoudre le dossier</span>
          </button>

          <div className={separatorClass} />

          <button
            type="button"
            onClick={handleDeleteFolderAndContents}
            className={`${itemBaseClass} ${itemDangerClass}`}
          >
            <Trash2 size={14} className="flex-shrink-0" />
            <span>Supprimer tout</span>
          </button>
        </div>
      )}
    </div>
  );
};
