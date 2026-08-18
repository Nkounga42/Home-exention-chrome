import React, { useState } from 'react';
import { Folder as FolderIcon, Pencil, Trash2, Layers } from 'lucide-react';
import { Folder, Shortcut } from '../types';
import { useApp } from '../context/AppContext';
import { getFaviconUrl } from '../utils/favicon';
import { getLucideIcon } from '../utils/icons';

interface FolderCardProps {
  folder: Folder;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  const { shortcuts, openFolderModal, deleteFolder, moveShortcutToFolder, updateFolder } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameVal, setNameVal] = useState(folder.name);

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
    // Only reset if leaving this container
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFolder(folder.id, false); // release shortcuts back to main grid
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (nameVal.trim()) {
      updateFolder(folder.id, nameVal.trim());
    }
    setIsEditing(false);
  };

  // Preview up to 4 icons inside folder mini-grid
  const previewItems = folderShortcuts.slice(0, 4);

  return (
    <div
      id={`folder-card-${folder.id}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex items-center gap-3.5 p-3.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer select-none shadow-xs hover:shadow-sm ${
        isDragOver
          ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 ring-2 ring-blue-400 scale-[1.02]'
          : 'bg-white/90 dark:bg-neutral-900/90 border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
      }`}
    >
      {/* 2x2 Mini Icon Grid Preview (iOS/Mac/Chrome style) */}
      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 flex-shrink-0 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs grid grid-cols-2 gap-0.5 overflow-hidden">
        {previewItems.length === 0 ? (
          <div className="col-span-2 row-span-2 flex items-center justify-center text-neutral-400">
            <FolderIcon size={16} />
          </div>
        ) : (
          previewItems.map((item, i) => {
            if (item.iconType === 'lucide') {
              const LucideComp = getLucideIcon(item.lucideIconName);
              return (
                <div
                  key={item.id}
                  className="w-full h-full rounded-sm flex items-center justify-center text-white"
                  style={{ backgroundColor: item.color || '#3b82f6' }}
                >
                  <LucideComp size={9} />
                </div>
              );
            }
            return (
              <div
                key={item.id}
                className="w-full h-full rounded-sm bg-white dark:bg-neutral-700 flex items-center justify-center p-0.5 overflow-hidden"
              >
                <img
                  src={getFaviconUrl(item.url, 64)}
                  alt=""
                  className="w-3 h-3 object-contain"
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
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="w-full text-xs font-semibold px-1.5 py-0.5 rounded border border-blue-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </form>
        ) : (
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white flex items-center gap-1.5">
            <span>{folder.name}</span>
          </h3>
        )}
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          {folderShortcuts.length} raccourci{folderShortcuts.length > 1 ? 's' : ''}
          {isDragOver && <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">• Déposer ici</span>}
        </p>
      </div>

      {/* Folder Hover Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          id={`edit-folder-btn-${folder.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          title="Renommer le dossier"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <Pencil size={14} />
        </button>

        <button
          id={`delete-folder-btn-${folder.id}`}
          type="button"
          onClick={handleDelete}
          title="Supprimer le dossier (conserver les raccourcis)"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
