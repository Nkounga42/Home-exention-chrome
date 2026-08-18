import React, { useState } from 'react';
import { Pencil, Trash2, FolderPlus, Move } from 'lucide-react';
import { Shortcut } from '../types';
import { useApp } from '../context/AppContext';
import { extractDomain, getFaviconUrl } from '../utils/favicon';
import { getLucideIcon } from '../utils/icons';

interface ShortcutCardProps {
  shortcut: Shortcut;
}

export const ShortcutCard: React.FC<ShortcutCardProps> = ({ shortcut }) => {
  const {
    settings,
    deleteShortcut,
    openEditModal,
    incrementClick,
    setFolderCreationCandidate,
  } = useApp();

  const [faviconState, setFaviconState] = useState<'google' | 'ddg' | 'letter'>('google');
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const domain = extractDomain(shortcut.url);

  const handleOpenLink = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, form, input')) return;

    incrementClick(shortcut.id);

    if (settings.openInNewTab) {
      window.open(shortcut.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = shortcut.url;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteShortcut(shortcut.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(shortcut);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/shortcut-id', shortcut.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const sourceShortcutId = e.dataTransfer.getData('text/shortcut-id');

    if (sourceShortcutId && sourceShortcutId !== shortcut.id) {
      // Trigger folder creation modal / combining source and target
      setFolderCreationCandidate({
        sourceId: sourceShortcutId,
        targetId: shortcut.id,
      });
    }
  };

  // Render Icon
  const renderIcon = () => {
    if (shortcut.iconType === 'lucide') {
      const LucideComp = getLucideIcon(shortcut.lucideIconName);
      return (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs"
          style={{ backgroundColor: shortcut.color || '#3b82f6' }}
        >
          <LucideComp size={20} />
        </div>
      );
    }

    if (shortcut.iconType === 'favicon') {
      if (faviconState === 'google') {
        return (
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 border border-neutral-200/90 dark:border-neutral-700/80 overflow-hidden p-2 shadow-xs">
            <img
              src={getFaviconUrl(shortcut.url, 128)}
              alt={shortcut.title}
              className="w-6 h-6 object-contain"
              onError={() => setFaviconState('ddg')}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }

      if (faviconState === 'ddg') {
        return (
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 border border-neutral-200/90 dark:border-neutral-700/80 overflow-hidden p-2 shadow-xs">
            <img
              src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`}
              alt={shortcut.title}
              className="w-6 h-6 object-contain"
              onError={() => setFaviconState('letter')}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }
    }

    // Letter / Fallback
    const letter = (shortcut.title.charAt(0) || domain.charAt(0) || 'W').toUpperCase();
    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base text-white flex-shrink-0 shadow-xs"
        style={{ backgroundColor: shortcut.color || '#3b82f6' }}
      >
        {letter}
      </div>
    );
  };

  return (
    <div
      id={`shortcut-card-${shortcut.id}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleOpenLink}
      className={`group relative flex items-center gap-3.5 p-3.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer select-none shadow-xs hover:shadow-sm ${
        isDragging ? 'opacity-40 scale-95 cursor-grabbing' : ''
      } ${
        isDragOver
          ? 'bg-blue-50/95 dark:bg-blue-950/80 border-blue-500 ring-2 ring-blue-400 scale-[1.03] shadow-md z-10'
          : 'bg-white/90 dark:bg-neutral-900/90 border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
      }`}
    >
      {/* Drop Target Indicator Badge */}
      {isDragOver && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 pointer-events-none whitespace-nowrap animate-bounce">
          <FolderPlus size={11} />
          <span>Créer un dossier</span>
        </div>
      )}

      {renderIcon()}

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white">
          {shortcut.title}
        </h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
          {domain || shortcut.url}
        </p>
      </div>

      {/* Direct Quick Action Buttons on Hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          id={`edit-shortcut-btn-${shortcut.id}`}
          type="button"
          onClick={handleEdit}
          title="Modifier le raccourci"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <Pencil size={14} />
        </button>

        <button
          id={`delete-shortcut-btn-${shortcut.id}`}
          type="button"
          onClick={handleDelete}
          title="Supprimer le raccourci"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
