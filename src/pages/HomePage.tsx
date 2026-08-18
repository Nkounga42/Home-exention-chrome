import React from 'react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { ShortcutGrid } from '../components/ShortcutGrid';
import { GoogleToolsSection } from '../components/GoogleToolsSection';
import { AddEditShortcutModal } from '../components/AddEditShortcutModal';
import { FolderModal } from '../components/FolderModal';
import { CreateFolderModal } from '../components/CreateFolderModal';
import { useApp } from '../context/AppContext';
import { CURATED_WALLPAPERS } from '../utils/wallpapers';

export const HomePage: React.FC = () => {
  const { settings } = useApp();
  const bg = settings.background;

  // Resolve active background image if applicable
  let activeImageUrl = '';
  if (bg.type === 'curated') {
    const found = CURATED_WALLPAPERS.find((w) => w.id === bg.wallpaperId);
    activeImageUrl = found ? found.fullUrl : CURATED_WALLPAPERS[0].fullUrl;
  } else if (bg.type === 'custom' && bg.customUrl) {
    activeImageUrl = bg.customUrl;
  } else if (bg.type === 'daily_unsplash') {
    activeImageUrl = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=85';
  }

  const isSolidCustom = bg.type === 'solid' && bg.solidColor && bg.solidColor !== 'transparent';
  const hasImageBg = Boolean(activeImageUrl);

  return (
    <main
      className={`min-h-screen relative flex flex-col transition-colors duration-200 ${
        !hasImageBg && !isSolidCustom
          ? 'bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100'
          : 'text-neutral-900 dark:text-neutral-100'
      }`}
      style={isSolidCustom ? { backgroundColor: bg.solidColor } : undefined}
    >
      {/* Background Layer with Blur and Contrast Dim Overlay */}
      {hasImageBg && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
          {/* Wallpaper Image */}
          <img
            src={activeImageUrl}
            alt="Arrière-plan"
            className="w-full h-full object-cover transition-all duration-500"
            style={{
              filter: bg.blur > 0 ? `blur(${bg.blur}px)` : 'none',
              transform: bg.blur > 0 ? 'scale(1.08)' : 'scale(1)',
            }}
          />

          {/* Dim Overlay for Perfect Text & UI Contrast */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundColor: bg.overlayColor === 'light' ? '#ffffff' : '#000000',
              opacity: (bg.overlayOpacity ?? 25) / 100,
            }}
          />
        </div>
      )}

      {/* Top minimal Header */}
      <Header />

      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-16">
        {/* Main Search Bar */}
        <SearchBar />

        {/* Clean Shortcut Grid */}
        <ShortcutGrid />

        {/* Google Tools and Services Container Section */}
        <GoogleToolsSection />
      </div>

      {/* Add / Edit Shortcut Modal */}
      <AddEditShortcutModal />

      {/* Folder Expanded Content View Modal */}
      <FolderModal />

      {/* Create Folder from Drag & Drop Modal */}
      <CreateFolderModal />
    </main>
  );
};
