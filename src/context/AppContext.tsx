import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, Category, ContextMenuItemType, ContextMenuState, Folder, NoteItem, Shortcut, WeatherData } from '../types';
import { fetchLiveWeather } from '../utils/weather';
import { CURATED_WALLPAPERS } from '../utils/wallpapers';
import { getEffectiveBackgroundLuminance, sampleImageBrightness } from '../utils/contrast';
import {
  loadCategories,
  loadFolders,
  loadNotes,
  loadSettings,
  loadShortcuts,
  saveCategories,
  saveFolders,
  saveNotes,
  saveSettings,
  saveShortcuts,
} from '../utils/storage';

interface AppContextType {
  shortcuts: Shortcut[];
  folders: Folder[];
  categories: Category[];
  settings: AppSettings;
  effectiveBackgroundDark: boolean;
  effectiveBackgroundLuminance: number;
  notes: NoteItem[];
  weather: WeatherData | null;
  isLoadingWeather: boolean;
  isAddModalOpen: boolean;
  editingShortcut: Shortcut | null;
  activeFolderModal: Folder | null;
  folderCreationCandidate: { sourceId: string; targetId: string } | null;
  contextMenu: ContextMenuState | null;
  openContextMenu: (e: React.MouseEvent, type: ContextMenuItemType, item: Shortcut | Folder) => void;
  closeContextMenu: () => void;
  openAddModal: (categoryId?: string, folderId?: string) => void;
  openEditModal: (shortcut: Shortcut) => void;
  closeModal: () => void;
  openFolderModal: (folder: Folder) => void;
  closeFolderModal: () => void;
  setFolderCreationCandidate: (candidate: { sourceId: string; targetId: string } | null) => void;
  addShortcut: (shortcut: Omit<Shortcut, 'id' | 'createdAt' | 'clicks'>) => void;
  updateShortcut: (id: string, updates: Partial<Shortcut>) => void;
  deleteShortcut: (id: string) => void;
  togglePin: (id: string) => void;
  incrementClick: (id: string) => void;
  reorderShortcuts: (reordered: Shortcut[]) => void;
  addFolder: (name: string, shortcutIds?: string[], color?: string) => string;
  updateFolder: (id: string, name: string, color?: string) => void;
  deleteFolder: (id: string, removeShortcutsToo?: boolean) => void;
  createFolderFromShortcuts: (sourceShortcutId: string, targetShortcutId: string, folderName?: string) => void;
  moveShortcutToFolder: (shortcutId: string, targetFolderId: string | null) => void;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  addNote: (text: string) => void;
  toggleNote: (id: string) => void;
  deleteNote: (id: string) => void;
  refreshWeather: () => Promise<void>;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [shortcuts, setShortcutsState] = useState<Shortcut[]>(loadShortcuts);
  const [folders, setFoldersState] = useState<Folder[]>(loadFolders);
  const [categories, setCategoriesState] = useState<Category[]>(loadCategories);
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [notes, setNotesState] = useState<NoteItem[]>(loadNotes);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [activeFolderModal, setActiveFolderModal] = useState<Folder | null>(null);
  const [folderCreationCandidate, setFolderCreationCandidate] = useState<{ sourceId: string; targetId: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [sampledImageLuminance, setSampledImageLuminance] = useState<number | null>(null);

  const openContextMenu = (e: React.MouseEvent, type: ContextMenuItemType, item: Shortcut | Folder) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      type,
      item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Sample image brightness when background image changes
  useEffect(() => {
    const bg = settings.background;
    let activeUrl = '';

    if (bg.type === 'curated') {
      const found = CURATED_WALLPAPERS.find((w) => w.id === bg.wallpaperId);
      if (found) {
        setSampledImageLuminance(found.luminance);
        return;
      }
    } else if (bg.type === 'custom' && bg.customUrl) {
      activeUrl = bg.customUrl;
    } else if (bg.type === 'daily_unsplash') {
      activeUrl = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=85';
    } else {
      setSampledImageLuminance(null);
      return;
    }

    if (activeUrl) {
      sampleImageBrightness(activeUrl).then((lum) => {
        setSampledImageLuminance(lum);
      });
    }
  }, [settings.background.type, settings.background.wallpaperId, settings.background.customUrl]);

  // Compute live effective background darkness factoring in wallpaper luminance, solid color, overlay, and theme
  const { isDark: effectiveBackgroundDark, luminance: effectiveBackgroundLuminance } = getEffectiveBackgroundLuminance(
    settings.background,
    settings.theme,
    sampledImageLuminance
  );

  // Sync dark class on root html with full system listener support
  useEffect(() => {
    const applyTheme = () => {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && isSystemDark);

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  // Initial weather load
  const refreshWeather = async () => {
    setIsLoadingWeather(true);
    const data = await fetchLiveWeather();
    if (data) setWeather(data);
    setIsLoadingWeather(false);
  };

  useEffect(() => {
    if (settings.showWeather) {
      refreshWeather();
      const interval = setInterval(refreshWeather, 1800000); // 30 min
      return () => clearInterval(interval);
    }
  }, [settings.showWeather]);

  const addShortcut = (data: Omit<Shortcut, 'id' | 'createdAt' | 'clicks'>) => {
    const newShortcut: Shortcut = {
      ...data,
      id: `shortcut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      clicks: 0,
      createdAt: Date.now(),
    };
    const updated = [newShortcut, ...shortcuts];
    setShortcutsState(updated);
    saveShortcuts(updated);
    setIsAddModalOpen(false);
    setEditingShortcut(null);
  };

  const updateShortcut = (id: string, updates: Partial<Shortcut>) => {
    const updated = shortcuts.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setShortcutsState(updated);
    saveShortcuts(updated);
    setIsAddModalOpen(false);
    setEditingShortcut(null);
  };

  const deleteShortcut = (id: string) => {
    const updated = shortcuts.filter((s) => s.id !== id);
    setShortcutsState(updated);
    saveShortcuts(updated);
  };

  const togglePin = (id: string) => {
    const updated = shortcuts.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s));
    setShortcutsState(updated);
    saveShortcuts(updated);
  };

  const incrementClick = (id: string) => {
    const updated = shortcuts.map((s) => (s.id === id ? { ...s, clicks: (s.clicks || 0) + 1 } : s));
    setShortcutsState(updated);
    saveShortcuts(updated);
  };

  const reorderShortcuts = (reordered: Shortcut[]) => {
    setShortcutsState(reordered);
    saveShortcuts(reordered);
  };

  // Folders management
  const addFolder = (name: string, shortcutIds: string[] = [], color: string = '#3b82f6'): string => {
    const folderId = `folder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newFolder: Folder = {
      id: folderId,
      name: name.trim() || 'Nouveau dossier',
      color,
      createdAt: Date.now(),
      order: folders.length,
    };
    const updatedFolders = [...folders, newFolder];
    setFoldersState(updatedFolders);
    saveFolders(updatedFolders);

    if (shortcutIds.length > 0) {
      const updatedShortcuts = shortcuts.map((s) =>
        shortcutIds.includes(s.id) ? { ...s, folderId } : s
      );
      setShortcutsState(updatedShortcuts);
      saveShortcuts(updatedShortcuts);
    }

    return folderId;
  };

  const updateFolder = (id: string, name: string, color?: string) => {
    const updatedFolders = folders.map((f) =>
      f.id === id ? { ...f, name: name.trim() || f.name, color: color || f.color } : f
    );
    setFoldersState(updatedFolders);
    saveFolders(updatedFolders);

    // Update active modal if open
    if (activeFolderModal && activeFolderModal.id === id) {
      setActiveFolderModal({ ...activeFolderModal, name: name.trim() || activeFolderModal.name, color: color || activeFolderModal.color });
    }
  };

  const deleteFolder = (id: string, removeShortcutsToo: boolean = false) => {
    const updatedFolders = folders.filter((f) => f.id !== id);
    setFoldersState(updatedFolders);
    saveFolders(updatedFolders);

    if (removeShortcutsToo) {
      const updatedShortcuts = shortcuts.filter((s) => s.folderId !== id);
      setShortcutsState(updatedShortcuts);
      saveShortcuts(updatedShortcuts);
    } else {
      // Release shortcuts from this folder
      const updatedShortcuts = shortcuts.map((s) =>
        s.folderId === id ? { ...s, folderId: undefined } : s
      );
      setShortcutsState(updatedShortcuts);
      saveShortcuts(updatedShortcuts);
    }

    if (activeFolderModal && activeFolderModal.id === id) {
      setActiveFolderModal(null);
    }
  };

  const createFolderFromShortcuts = (
    sourceShortcutId: string,
    targetShortcutId: string,
    folderName?: string
  ) => {
    if (sourceShortcutId === targetShortcutId) return;

    const source = shortcuts.find((s) => s.id === sourceShortcutId);
    const target = shortcuts.find((s) => s.id === targetShortcutId);
    if (!source || !target) return;

    const name = folderName || `${target.title} & ${source.title}`;
    const folderId = addFolder(name, [sourceShortcutId, targetShortcutId], target.color || '#3b82f6');

    // Also auto-open the newly created folder
    const createdFolder = {
      id: folderId,
      name,
      color: target.color || '#3b82f6',
      createdAt: Date.now(),
      order: folders.length,
    };
    setActiveFolderModal(createdFolder);
  };

  const moveShortcutToFolder = (shortcutId: string, targetFolderId: string | null) => {
    const updatedShortcuts = shortcuts.map((s) =>
      s.id === shortcutId ? { ...s, folderId: targetFolderId || undefined } : s
    );
    setShortcutsState(updatedShortcuts);
    saveShortcuts(updatedShortcuts);
  };

  const openFolderModal = (folder: Folder) => {
    setActiveFolderModal(folder);
  };

  const closeFolderModal = () => {
    setActiveFolderModal(null);
  };

  const addCategory = (name: string, color: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      color: color || '#3b82f6',
      order: categories.length,
    };
    const updated = [...categories, newCat];
    setCategoriesState(updated);
    saveCategories(updated);
  };

  const updateCategory = (id: string, name: string, color: string) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, name: name.trim(), color } : c));
    setCategoriesState(updated);
    saveCategories(updated);
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategoriesState(updated);
    saveCategories(updated);
    const fallbackId = updated[0]?.id || 'cat-favorites';
    const updatedShortcuts = shortcuts.map((s) => (s.categoryId === id ? { ...s, categoryId: fallbackId } : s));
    setShortcutsState(updatedShortcuts);
    saveShortcuts(updatedShortcuts);
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const addNote = (text: string) => {
    if (!text.trim()) return;
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    const updated = [newNote, ...notes];
    setNotesState(updated);
    saveNotes(updated);
  };

  const toggleNote = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n));
    setNotesState(updated);
    saveNotes(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotesState(updated);
    saveNotes(updated);
  };

  const openAddModal = (categoryId?: string, folderId?: string) => {
    setEditingShortcut(
      categoryId || folderId
        ? ({ categoryId: categoryId || 'cat-favorites', folderId } as Shortcut)
        : null
    );
    setIsAddModalOpen(true);
  };

  const openEditModal = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingShortcut(null);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        shortcuts,
        folders,
        categories,
        settings,
        effectiveBackgroundDark,
        effectiveBackgroundLuminance,
        notes,
        weather,
        isLoadingWeather,
        isAddModalOpen,
        editingShortcut,
        activeFolderModal,
        folderCreationCandidate,
        contextMenu,
        openContextMenu,
        closeContextMenu,
        openAddModal,
        openEditModal,
        closeModal,
        openFolderModal,
        closeFolderModal,
        setFolderCreationCandidate,
        addShortcut,
        updateShortcut,
        deleteShortcut,
        togglePin,
        incrementClick,
        reorderShortcuts,
        addFolder,
        updateFolder,
        deleteFolder,
        createFolderFromShortcuts,
        moveShortcutToFolder,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        addNote,
        toggleNote,
        deleteNote,
        refreshWeather,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
