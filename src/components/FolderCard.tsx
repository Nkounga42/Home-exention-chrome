import React, { useState } from 'react';
import { Folder as FolderIcon } from 'lucide-react';
import { Folder } from '../types';
import { useApp } from '../context/AppContext';
import { getFaviconUrl } from '../utils/favicon';
import { getLucideIcon } from '../utils/icons';

interface FolderCardProps {
  folder: Folder;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  const {
    settings,
    shortcuts,
    openFolderModal,
    moveShortcutToFolder,
    openContextMenu,
    effectiveBackgroundDark,
  } = useApp();

  const [isDragOver, setIsDragOver] = useState(false);

  const density = settings.density || 'normal';
  const layoutStyle = settings.layoutStyle || 'icons';
  const folderShortcuts = shortcuts.filter((s) => s.folderId === folder.id);

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
    if (sourceShortcutId) {
      moveShortcutToFolder(sourceShortcutId, folder.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, form')) return;
    openFolderModal(folder);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    openContextMenu(e, 'folder', folder);
  };

  // Preview up to 4 icons inside folder mini-grid
  const previewItems = folderShortcuts.slice(0, 4);

  // ==========================================
  // 1. ICON ON TOP + TITLE UNDERNEATH MODE
  // ==========================================
  if (layoutStyle === 'icons') {
    const iconBoxSize =
      density === 'compact'
        ? 'w-12 h-12 sm:w-13 sm:h-13 rounded-xl p-1'
        : density === 'comfortable'
        ? 'w-18 h-18 sm:w-20 sm:h-20 rounded-3xl p-2'
        : 'w-15 h-15 sm:w-16 sm:h-16 rounded-2xl p-1.5';

    const miniIconSize =
      density === 'compact' ? 7 : density === 'comfortable' ? 12 : 9;

    const titleTextClass =
      density === 'compact'
        ? 'text-[11px] sm:text-xs font-medium max-w-[80px]'
        : density === 'comfortable'
        ? 'text-xs sm:text-sm font-semibold max-w-[120px]'
        : 'text-xs sm:text-sm font-medium max-w-[100px]';

    return (
      <div
        id={`folder-card-${folder.id}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="group relative flex flex-col items-center justify-start text-center cursor-pointer select-none p-2 sm:p-2.5 rounded-2xl transition-all duration-200"
      >
        {/* Folder Icon Tile with 2x2 Mini Preview */}
        <div
          className={`relative flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
            isDragOver
              ? 'ring-3 ring-blue-500 bg-blue-500/20 scale-105 shadow-lg'
              : effectiveBackgroundDark
              ? 'bg-neutral-900/80 hover:bg-neutral-800/90 border border-white/10 hover:border-white/30 text-white shadow-xs group-hover:shadow-md'
              : 'bg-white/85 hover:bg-white border border-neutral-200/80 hover:border-neutral-400 text-neutral-900 shadow-xs group-hover:shadow-md'
          } backdrop-blur-xl ${iconBoxSize}`}
        >
          {previewItems.length === 0 ? (
            <div className="flex items-center justify-center text-neutral-400">
              <FolderIcon size={density === 'compact' ? 18 : density === 'comfortable' ? 28 : 22} />
            </div>
          ) : (
            <div className="w-full h-full grid grid-cols-2 gap-1 overflow-hidden">
              {previewItems.map((item) => {
                if (item.iconType === 'lucide') {
                  const LucideComp = getLucideIcon(item.lucideIconName);
                  return (
                    <div
                      key={item.id}
                      className="w-full h-full rounded-sm flex items-center justify-center text-white"
                      style={{ backgroundColor: item.color || '#3b82f6' }}
                    >
                      <LucideComp size={miniIconSize} />
                    </div>
                  );
                }
                return (
                  <div
                    key={item.id}
                    className="w-full h-full rounded-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center p-0.5 overflow-hidden"
                  >
                    <img
                      src={getFaviconUrl(item.url, 64)}
                      alt=""
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Title Underneath Folder Icon */}
        <div className="w-full mt-2">
          <span
            className={`block ${titleTextClass} truncate w-full transition-colors leading-tight px-0.5 ${
              effectiveBackgroundDark
                ? 'text-white/90 group-hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                : 'text-neutral-800 group-hover:text-neutral-950'
            }`}
            title={`${folder.name} (${folderShortcuts.length})`}
          >
            {folder.name}
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. HORIZONTAL CARD MODE
  // ==========================================
  const iconContainerSize =
    density === 'compact' ? 'w-8 h-8 rounded-lg p-0.5' : density === 'comfortable' ? 'w-12 h-12 rounded-2xl p-1.5' : 'w-10 h-10 rounded-xl p-1';

  const cardPadding =
    density === 'compact' ? 'p-2.5 rounded-xl gap-2.5' : density === 'comfortable' ? 'p-4 sm:p-4.5 rounded-2xl gap-4' : 'p-3.5 rounded-2xl gap-3.5';

  const titleClass =
    density === 'compact' ? 'text-xs font-semibold' : density === 'comfortable' ? 'text-base font-semibold' : 'text-sm font-semibold';

  const countClass = density === 'compact' ? 'text-[10px]' : 'text-xs';

  return (
    <div
      id={`folder-card-${folder.id}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex items-center ${cardPadding} border backdrop-blur-xl transition-all cursor-pointer select-none shadow-xs hover:shadow-md ${
        isDragOver
          ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-400 scale-[1.02] z-10'
          : effectiveBackgroundDark
          ? 'bg-neutral-950/80 border-white/10 hover:border-white/30 text-white'
          : 'bg-white/90 border-neutral-200/90 hover:border-neutral-400 text-neutral-900'
      }`}
    >
      {/* 2x2 Mini Icon Grid Preview */}
      <div
        className={`${iconContainerSize} ${
          effectiveBackgroundDark ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100 border-neutral-200/80'
        } flex-shrink-0 border shadow-xs grid grid-cols-2 gap-0.5 overflow-hidden`}
      >
        {previewItems.length === 0 ? (
          <div className="col-span-2 row-span-2 flex items-center justify-center text-neutral-400">
            <FolderIcon size={density === 'compact' ? 13 : density === 'comfortable' ? 18 : 16} />
          </div>
        ) : (
          previewItems.map((item) => {
            if (item.iconType === 'lucide') {
              const LucideComp = getLucideIcon(item.lucideIconName);
              return (
                <div
                  key={item.id}
                  className="w-full h-full rounded-xs flex items-center justify-center text-white"
                  style={{ backgroundColor: item.color || '#3b82f6' }}
                >
                  <LucideComp size={density === 'compact' ? 7 : density === 'comfortable' ? 11 : 9} />
                </div>
              );
            }
            return (
              <div
                key={item.id}
                className="w-full h-full rounded-xs bg-white dark:bg-neutral-700 flex items-center justify-center p-0.5 overflow-hidden"
              >
                <img
                  src={getFaviconUrl(item.url, 64)}
                  alt=""
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Folder Name & Info */}
      <div className="min-w-0 flex-1">
        <h3
          className={`${titleClass} truncate flex items-center gap-1.5 transition-colors ${
            effectiveBackgroundDark ? 'text-white group-hover:text-white' : 'text-neutral-900 group-hover:text-neutral-950'
          }`}
        >
          <span>{folder.name}</span>
        </h3>
        <p
          className={`${countClass} transition-colors ${
            effectiveBackgroundDark ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-700'
          }`}
        >
          {folderShortcuts.length} raccourci{folderShortcuts.length > 1 ? 's' : ''}
          {isDragOver && <span className="ml-1 text-blue-400 font-medium">• Déposer ici</span>}
        </p>
      </div>
    </div>
  );
};
