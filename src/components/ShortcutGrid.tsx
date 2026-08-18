import React from 'react';
import { Plus, FolderPlus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShortcutCard } from './ShortcutCard';
import { FolderCard } from './FolderCard';

export const ShortcutGrid: React.FC = () => {
  const { shortcuts, folders, openAddModal, addFolder } = useApp();

  // Root level shortcuts (not inside any folder)
  const rootShortcuts = shortcuts.filter((s) => !s.folderId);

  const handleCreateEmptyFolder = () => {
    addFolder('Nouveau dossier', [], '#3b82f6');
  };

  return (
    <div className="w-full">
      {/* Grid containing Folders and Root Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {/* Folders first */}
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}

        {/* Root Shortcuts */}
        {rootShortcuts.map((shortcut) => (
          <ShortcutCard key={shortcut.id} shortcut={shortcut} />
        ))}

        {/* Add Shortcut Tile */}
        <button
          id="grid-add-shortcut-tile"
          type="button"
          onClick={() => openAddModal()}
          className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-600 bg-white/50 dark:bg-neutral-900/40 hover:bg-white dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all cursor-pointer select-none text-left group"
        >
          <div className="w-10 h-10 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:border-neutral-500 flex-shrink-0 transition-colors">
            <Plus size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-semibold block">Ajouter un lien</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 block">Nouveau raccourci</span>
          </div>
        </button>

        {/* Create Folder Tile */}
        <button
          id="grid-create-folder-tile"
          type="button"
          onClick={handleCreateEmptyFolder}
          className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-dashed border-neutral-300/80 dark:border-neutral-800/80 hover:border-blue-500/70 dark:hover:border-blue-600/70 bg-white/40 dark:bg-neutral-900/30 hover:bg-white/80 dark:hover:bg-neutral-900/80 text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer select-none text-left group"
        >
          <div className="w-10 h-10 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-500/70 flex-shrink-0 transition-colors">
            <FolderPlus size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-semibold block">Créer un dossier</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 block">Ou glissez un lien sur un autre</span>
          </div>
        </button>
      </div>

      {/* Helpful Hint banner */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 text-center select-none">
        <Sparkles size={13} className="text-blue-500 flex-shrink-0" />
        <span>Glissez-déposez un raccourci sur un autre ou sur un dossier pour organiser votre page</span>
      </div>
    </div>
  );
};
