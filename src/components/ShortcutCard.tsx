import React, { useState } from 'react';
import { FolderPlus, Pin } from 'lucide-react';
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
    incrementClick,
    setFolderCreationCandidate,
    openContextMenu,
    effectiveBackgroundDark,
  } = useApp();

  const [faviconState, setFaviconState] = useState<'google' | 'ddg' | 'letter'>('google');
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const domain = extractDomain(shortcut.url);
  const density = settings.density || 'normal';
  const layoutStyle = settings.layoutStyle || 'icons';

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

  const handleContextMenu = (e: React.MouseEvent) => {
    openContextMenu(e, 'shortcut', shortcut);
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
      setFolderCreationCandidate({
        sourceId: sourceShortcutId,
        targetId: shortcut.id,
      });
    }
  };

  // Render Icon Graphic
  const renderIconGraphic = (containerSize: string, imgSize: string, lucideSize: number, fontSize: string) => {
    if (shortcut.iconType === 'lucide') {
      const LucideComp = getLucideIcon(shortcut.lucideIconName);
      return (
        <div
          className={`${containerSize} flex items-center justify-center text-white flex-shrink-0 shadow-xs`}
          style={{ backgroundColor: shortcut.color || '#3b82f6' }}
        >
          <LucideComp size={lucideSize} />
        </div>
      );
    }

    if (shortcut.iconType === 'favicon') {
      if (faviconState === 'google') {
        return (
          <div
            className={`${containerSize} ${
              effectiveBackgroundDark ? 'bg-neutral-800/90 border-neutral-700' : 'bg-neutral-100 border-neutral-200/90'
            } flex items-center justify-center flex-shrink-0 border overflow-hidden p-2 shadow-xs`}
          >
            <img
              src={getFaviconUrl(shortcut.url, 128)}
              alt={shortcut.title}
              className={`${imgSize} object-contain`}
              onError={() => setFaviconState('ddg')}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }

      if (faviconState === 'ddg') {
        return (
          <div
            className={`${containerSize} ${
              effectiveBackgroundDark ? 'bg-neutral-800/90 border-neutral-700' : 'bg-neutral-100 border-neutral-200/90'
            } flex items-center justify-center flex-shrink-0 border overflow-hidden p-2 shadow-xs`}
          >
            <img
              src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`}
              alt={shortcut.title}
              className={`${imgSize} object-contain`}
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
        className={`${containerSize} flex items-center justify-center font-bold ${fontSize} text-white flex-shrink-0 shadow-xs`}
        style={{ backgroundColor: shortcut.color || '#3b82f6' }}
      >
        {letter}
      </div>
    );
  };

  // ==========================================
  // 1. ICON ON TOP + TITLE UNDERNEATH MODE
  // ==========================================
  if (layoutStyle === 'icons') {
    const iconBoxSize =
      density === 'compact'
        ? 'w-12 h-12 sm:w-13 sm:h-13 rounded-xl'
        : density === 'comfortable'
        ? 'w-18 h-18 sm:w-20 sm:h-20 rounded-3xl'
        : 'w-15 h-15 sm:w-16 sm:h-16 rounded-2xl';

    const faviconSize =
      density === 'compact'
        ? 'w-6 h-6'
        : density === 'comfortable'
        ? 'w-9 h-9 sm:w-10 sm:h-10'
        : 'w-7 h-7 sm:w-8 sm:h-8';

    const lucideSize =
      density === 'compact'
        ? 22
        : density === 'comfortable'
        ? 34
        : 28;

    const letterSize =
      density === 'compact'
        ? 'text-base'
        : density === 'comfortable'
        ? 'text-2xl'
        : 'text-xl';

    const titleTextClass =
      density === 'compact'
        ? 'text-[11px] sm:text-xs font-medium max-w-[80px]'
        : density === 'comfortable'
        ? 'text-xs sm:text-sm font-semibold max-w-[120px]'
        : 'text-xs sm:text-sm font-medium max-w-[100px]';

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
        onContextMenu={handleContextMenu}
        className={`group relative flex flex-col items-center justify-start text-center cursor-pointer select-none p-2 sm:p-2.5 rounded-2xl transition-all duration-200 ${
          isDragging ? 'opacity-40 scale-90 cursor-grabbing' : ''
        }`}
      >
        {/* Drop Target Indicator Badge */}
        {isDragOver && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 pointer-events-none whitespace-nowrap animate-bounce z-20">
            <FolderPlus size={11} />
            <span>Créer un dossier</span>
          </div>
        )}

        {/* Icon Tile Box */}
        <div
          className={`relative flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
            isDragOver
              ? 'ring-3 ring-blue-500 bg-blue-500/20 scale-105 shadow-lg'
              : effectiveBackgroundDark
              ? 'bg-neutral-900/80 hover:bg-neutral-800/90 border border-white/10 hover:border-white/30 text-white shadow-xs group-hover:shadow-md'
              : 'bg-white/85 hover:bg-white border border-neutral-200/80 hover:border-neutral-400 text-neutral-900 shadow-xs group-hover:shadow-md'
          } backdrop-blur-xl ${iconBoxSize}`}
        >
          {renderIconGraphic(iconBoxSize, faviconSize, lucideSize, letterSize)}

          {/* Pinned Badge */}
          {shortcut.pinned && (
            <div className="absolute -top-1 -left-1 p-1 rounded-full bg-amber-500 text-white shadow-xs">
              <Pin size={8} />
            </div>
          )}
        </div>

        {/* Title Underneath Icon */}
        <span
          className={`mt-2 ${titleTextClass} truncate w-full transition-colors leading-tight px-0.5 ${
            effectiveBackgroundDark
              ? 'text-white/90 group-hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
              : 'text-neutral-800 group-hover:text-neutral-950'
          }`}
          title={shortcut.title}
        >
          {shortcut.title}
        </span>
      </div>
    );
  }

  // ==========================================
  // 2. HORIZONTAL CARD MODE
  // ==========================================
  const iconContainerSize =
    density === 'compact'
      ? 'w-8 h-8 rounded-lg'
      : density === 'comfortable'
      ? 'w-12 h-12 rounded-2xl'
      : 'w-10 h-10 rounded-xl';

  const iconLucideSize = density === 'compact' ? 16 : density === 'comfortable' ? 24 : 20;
  const faviconImgSize = density === 'compact' ? 'w-4 h-4' : density === 'comfortable' ? 'w-7 h-7' : 'w-6 h-6';
  const letterFontSize = density === 'compact' ? 'text-xs' : density === 'comfortable' ? 'text-lg' : 'text-base';

  const cardPadding =
    density === 'compact'
      ? 'p-2.5 rounded-xl gap-2.5'
      : density === 'comfortable'
      ? 'p-4 sm:p-4.5 rounded-2xl gap-4'
      : 'p-3.5 rounded-2xl gap-3.5';

  const titleClass =
    density === 'compact' ? 'text-xs font-semibold' : density === 'comfortable' ? 'text-base font-semibold' : 'text-sm font-semibold';

  const domainClass = density === 'compact' ? 'text-[10px]' : 'text-xs';

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
      onContextMenu={handleContextMenu}
      className={`group relative flex items-center ${cardPadding} border backdrop-blur-xl transition-all cursor-pointer select-none shadow-xs hover:shadow-md ${
        isDragging ? 'opacity-40 scale-95 cursor-grabbing' : ''
      } ${
        isDragOver
          ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-400 scale-[1.03] shadow-md z-10'
          : effectiveBackgroundDark
          ? 'bg-neutral-950/80 border-white/10 hover:border-white/30 text-white'
          : 'bg-white/90 border-neutral-200/90 hover:border-neutral-400 text-neutral-900'
      }`}
    >
      {/* Drop Target Indicator Badge */}
      {isDragOver && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 pointer-events-none whitespace-nowrap animate-bounce">
          <FolderPlus size={11} />
          <span>Créer un dossier</span>
        </div>
      )}

      {renderIconGraphic(iconContainerSize, faviconImgSize, iconLucideSize, letterFontSize)}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3
            className={`${titleClass} truncate font-semibold transition-colors ${
              effectiveBackgroundDark ? 'text-white group-hover:text-white' : 'text-neutral-900 group-hover:text-neutral-950'
            }`}
          >
            {shortcut.title}
          </h3>
          {shortcut.pinned && <Pin size={11} className="text-amber-500 flex-shrink-0" />}
        </div>
        <p
          className={`${domainClass} truncate transition-colors ${
            effectiveBackgroundDark ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-700'
          }`}
        >
          {domain || shortcut.url}
        </p>
      </div>
    </div>
  );
};
