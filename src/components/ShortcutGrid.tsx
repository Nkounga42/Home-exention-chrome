import React, { useState } from 'react';
import { Plus, FolderPlus, Sparkles, LayoutGrid, Rows3, Columns3, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShortcutCard } from './ShortcutCard';
import { FolderCard } from './FolderCard';
import { GridColumns, ShortcutLayoutStyle } from '../types';

export const ShortcutGrid: React.FC = () => {
  const {
    shortcuts,
    folders,
    openAddModal,
    addFolder,
    settings,
    updateSettings,
    effectiveBackgroundDark,
  } = useApp();

  const [showColumnPicker, setShowColumnPicker] = useState(false);

  const density = settings.density || 'normal';
  const layoutStyle = settings.layoutStyle || 'icons';
  const gridColumns = settings.gridColumns || 'auto';

  // Root level shortcuts (not inside any folder)
  const rootShortcuts = shortcuts.filter((s) => !s.folderId);

  const handleCreateEmptyFolder = () => {
    addFolder('Nouveau dossier', [], '#3b82f6');
  };

  // Determine dynamic grid columns style / classes
  const getGridStyle = (): React.CSSProperties => {
    if (gridColumns === 'auto') {
      return {};
    }
    return {
      gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
    };
  };

  const getGridClass = () => {
    if (gridColumns !== 'auto') {
      // Use CSS grid with dynamic inline template columns, plus responsive gap
      return layoutStyle === 'icons'
        ? 'grid gap-2.5 sm:gap-4'
        : 'grid gap-3 sm:gap-3.5';
    }

    // Default 'auto' responsive layout based on density & style
    if (layoutStyle === 'icons') {
      if (density === 'compact') {
        return 'grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3';
      }
      if (density === 'comfortable') {
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6';
      }
      return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4.5';
    }

    // Cards layout
    if (density === 'compact') {
      return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5';
    }
    if (density === 'comfortable') {
      return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
    }
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5';
  };

  // Sizes for Add buttons in icon mode
  const actionIconBoxSize =
    density === 'compact'
      ? 'w-12 h-12 sm:w-13 sm:h-13 rounded-xl'
      : density === 'comfortable'
      ? 'w-18 h-18 sm:w-20 sm:h-20 rounded-3xl'
      : 'w-15 h-15 sm:w-16 sm:h-16 rounded-2xl';

  const actionIconLucideSize =
    density === 'compact' ? 18 : density === 'comfortable' ? 26 : 22;

  // Sizes for Add buttons in horizontal card mode
  const cardActionTilePadding =
    density === 'compact'
      ? 'p-2.5 rounded-xl gap-2.5'
      : density === 'comfortable'
      ? 'p-4 sm:p-4.5 rounded-2xl gap-4'
      : 'p-3.5 rounded-2xl gap-3.5';

  const cardActionIconContainerSize =
    density === 'compact' ? 'w-8 h-8 rounded-lg' : density === 'comfortable' ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10 rounded-xl';

  const columnOptions: { id: GridColumns; label: string }[] = [
    { id: 'auto', label: 'Auto' },
    { id: 3, label: '3 col' },
    { id: 4, label: '4 col' },
    { id: 5, label: '5 col' },
    { id: 6, label: '6 col' },
    { id: 7, label: '7 col' },
    { id: 8, label: '8 col' },
    { id: 10, label: '10 col' },
  ];

  return (
    <div className="w-full">
      {/* Top Quick Layout Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1 select-none">
        {/* Left: Section Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              effectiveBackgroundDark ? 'text-white/70' : 'text-neutral-500'
            }`}
          >
            Raccourcis
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              effectiveBackgroundDark ? 'bg-white/10 text-white/90' : 'bg-neutral-200/80 text-neutral-700'
            }`}
          >
            {rootShortcuts.length + folders.length}
          </span>
        </div>

        {/* Right: Quick Controls for Style & Columns */}
        <div className="flex items-center gap-1.5">
          {/* Display Mode Toggle: Icons vs Cards */}
          <div
            className={`flex items-center p-0.5 rounded-xl border backdrop-blur-md ${
              effectiveBackgroundDark
                ? 'bg-black/40 border-white/15 text-white'
                : 'bg-white/80 border-neutral-200/90 text-neutral-800'
            }`}
          >
            <button
              type="button"
              id="view-mode-icons-btn"
              onClick={() => updateSettings({ layoutStyle: 'icons' })}
              title="Affichage: Icônes avec titre en dessous"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                layoutStyle === 'icons'
                  ? effectiveBackgroundDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">Icônes</span>
            </button>

            <button
              type="button"
              id="view-mode-cards-btn"
              onClick={() => updateSettings({ layoutStyle: 'cards' })}
              title="Affichage: Cartes horizontales"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                layoutStyle === 'cards'
                  ? effectiveBackgroundDark
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Rows3 size={13} />
              <span className="hidden sm:inline">Cartes</span>
            </button>
          </div>

          {/* Columns Selector Dropdown / Segment */}
          <div className="relative">
            <button
              type="button"
              id="grid-column-toggle-btn"
              onClick={() => setShowColumnPicker((prev) => !prev)}
              title="Changer le nombre de colonnes de la grille"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all cursor-pointer ${
                effectiveBackgroundDark
                  ? 'bg-black/40 border-white/15 text-white/90 hover:bg-black/60 hover:text-white'
                  : 'bg-white/80 border-neutral-200/90 text-neutral-700 hover:bg-white hover:text-neutral-900'
              }`}
            >
              <Columns3 size={13} />
              <span className="text-[11px] capitalize">
                {gridColumns === 'auto' ? 'Auto' : `${gridColumns} col.`}
              </span>
            </button>

            {/* Columns Popover Menu */}
            {showColumnPicker && (
              <div
                className={`absolute right-0 top-full mt-1.5 p-1.5 rounded-2xl border shadow-xl backdrop-blur-xl z-30 flex flex-col gap-0.5 min-w-[120px] ${
                  effectiveBackgroundDark
                    ? 'bg-neutral-900/95 border-white/20 text-white'
                    : 'bg-white/95 border-neutral-200 text-neutral-900'
                }`}
                onMouseLeave={() => setShowColumnPicker(false)}
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Colonnes
                </div>
                {columnOptions.map((opt) => (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => {
                      updateSettings({ gridColumns: opt.id });
                      setShowColumnPicker(false);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-xl font-medium text-left transition-colors flex items-center justify-between cursor-pointer ${
                      gridColumns === opt.id
                        ? 'bg-blue-600 text-white font-bold'
                        : effectiveBackgroundDark
                        ? 'hover:bg-white/10 text-neutral-300 hover:text-white'
                        : 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {gridColumns === opt.id && <span className="text-[10px]">•</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Responsive Grid */}
      <div className={getGridClass()} style={getGridStyle()}>
        {/* Folders first */}
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}

        {/* Root Shortcuts */}
        {rootShortcuts.map((shortcut) => (
          <ShortcutCard key={shortcut.id} shortcut={shortcut} />
        ))}

        {/* Add Shortcut Tile */}
        {layoutStyle === 'icons' ? (
          <div
            id="grid-add-shortcut-tile"
            onClick={() => openAddModal()}
            className="group relative flex flex-col items-center justify-start text-center cursor-pointer select-none p-2 sm:p-2.5 rounded-2xl transition-all duration-200"
          >
            <div
              className={`flex items-center justify-center border-2 border-dashed transition-all duration-200 group-hover:scale-105 backdrop-blur-md ${actionIconBoxSize} ${
                effectiveBackgroundDark
                  ? 'border-white/20 group-hover:border-white/50 bg-black/30 group-hover:bg-black/50 text-white/60 group-hover:text-white'
                  : 'border-neutral-300 group-hover:border-neutral-500 bg-white/40 group-hover:bg-white/80 text-neutral-400 group-hover:text-neutral-800'
              }`}
            >
              <Plus size={actionIconLucideSize} />
            </div>
            <span
              className={`mt-2 text-xs font-medium truncate w-full transition-colors leading-tight px-0.5 ${
                effectiveBackgroundDark
                  ? 'text-white/70 group-hover:text-white'
                  : 'text-neutral-600 group-hover:text-neutral-900'
              }`}
            >
              Ajouter
            </span>
          </div>
        ) : (
          <button
            id="grid-add-shortcut-tile"
            type="button"
            onClick={() => openAddModal()}
            className={`flex items-center ${cardActionTilePadding} border border-dashed backdrop-blur-md transition-all cursor-pointer select-none text-left group ${
              effectiveBackgroundDark
                ? 'border-white/20 hover:border-white/40 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white'
                : 'border-neutral-300 hover:border-neutral-500 bg-white/50 hover:bg-white text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <div
              className={`${cardActionIconContainerSize} border border-dashed flex items-center justify-center flex-shrink-0 transition-colors ${
                effectiveBackgroundDark
                  ? 'border-white/20 text-white/60 group-hover:text-white group-hover:border-white/50'
                  : 'border-neutral-300 text-neutral-400 group-hover:text-neutral-900 group-hover:border-neutral-500'
              }`}
            >
              <Plus size={actionIconLucideSize} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold block">Ajouter un lien</span>
              <span
                className={`text-xs block truncate ${
                  effectiveBackgroundDark ? 'text-white/50 group-hover:text-white/70' : 'text-neutral-400'
                }`}
              >
                Nouveau raccourci
              </span>
            </div>
          </button>
        )}

        {/* Create Folder Tile */}
        {layoutStyle === 'icons' ? (
          <div
            id="grid-create-folder-tile"
            onClick={handleCreateEmptyFolder}
            className="group relative flex flex-col items-center justify-start text-center cursor-pointer select-none p-2 sm:p-2.5 rounded-2xl transition-all duration-200"
          >
            <div
              className={`flex items-center justify-center border-2 border-dashed transition-all duration-200 group-hover:scale-105 backdrop-blur-md ${actionIconBoxSize} ${
                effectiveBackgroundDark
                  ? 'border-white/20 group-hover:border-blue-400 bg-black/30 group-hover:bg-black/50 text-white/60 group-hover:text-blue-300'
                  : 'border-neutral-300 group-hover:border-blue-500 bg-white/40 group-hover:bg-white/80 text-neutral-400 group-hover:text-blue-600'
              }`}
            >
              <FolderPlus size={actionIconLucideSize} />
            </div>
            <span
              className={`mt-2 text-xs font-medium truncate w-full transition-colors leading-tight px-0.5 ${
                effectiveBackgroundDark
                  ? 'text-white/70 group-hover:text-blue-300'
                  : 'text-neutral-600 group-hover:text-blue-600'
              }`}
            >
              Dossier
            </span>
          </div>
        ) : (
          <button
            id="grid-create-folder-tile"
            type="button"
            onClick={handleCreateEmptyFolder}
            className={`flex items-center ${cardActionTilePadding} border border-dashed backdrop-blur-md transition-all cursor-pointer select-none text-left group ${
              effectiveBackgroundDark
                ? 'border-white/20 hover:border-blue-400 bg-black/40 hover:bg-black/60 text-white/80 hover:text-blue-300'
                : 'border-neutral-300/80 hover:border-blue-500/70 bg-white/40 hover:bg-white/80 text-neutral-500 hover:text-blue-600'
            }`}
          >
            <div
              className={`${cardActionIconContainerSize} border border-dashed flex items-center justify-center flex-shrink-0 transition-colors ${
                effectiveBackgroundDark
                  ? 'border-white/20 text-white/60 group-hover:text-blue-400 group-hover:border-blue-400/70'
                  : 'border-neutral-300 text-neutral-400 group-hover:text-blue-600 group-hover:border-blue-500/70'
              }`}
            >
              <FolderPlus size={actionIconLucideSize} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold block">Créer un dossier</span>
              <span
                className={`text-xs block truncate ${
                  effectiveBackgroundDark ? 'text-white/50 group-hover:text-white/70' : 'text-neutral-400'
                }`}
              >
                Glisser un lien sur un autre
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Helpful Hint banner */}
      <div
        className={`mt-4 flex items-center justify-center gap-1.5 text-xs text-center select-none ${
          effectiveBackgroundDark
            ? 'text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] font-medium'
            : 'text-neutral-500'
        }`}
      >
        <Sparkles size={13} className="text-blue-400 flex-shrink-0" />
        <span>Clic droit sur un raccourci ou dossier pour le menu d'options (modifier, supprimer, déplacer)</span>
      </div>
    </div>
  );
};
