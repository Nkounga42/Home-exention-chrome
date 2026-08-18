import { AppSettings, Category, Folder, NoteItem, Shortcut } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-favorites', name: 'Favoris', color: '#3b82f6', order: 0 },
  { id: 'cat-work', name: 'Travail & Prod', color: '#10b981', order: 1 },
  { id: 'cat-dev', name: 'Développement', color: '#8b5cf6', order: 2 },
  { id: 'cat-media', name: 'Médias & Loisirs', color: '#f59e0b', order: 3 },
  { id: 'cat-tools', name: 'Outils & IA', color: '#ec4899', order: 4 },
];

export const DEFAULT_FOLDERS: Folder[] = [];

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  // Favoris
  {
    id: 's-google',
    title: 'Google',
    url: 'https://www.google.com',
    categoryId: 'cat-favorites',
    iconType: 'favicon',
    clicks: 42,
    pinned: true,
    createdAt: 1700000000000,
    description: 'Moteur de recherche',
  },
  {
    id: 's-youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    categoryId: 'cat-media',
    iconType: 'favicon',
    clicks: 35,
    pinned: true,
    createdAt: 1700000001000,
    description: 'Vidéos et musique',
  },
  {
    id: 's-gmail',
    title: 'Gmail',
    url: 'https://mail.google.com',
    categoryId: 'cat-work',
    iconType: 'favicon',
    clicks: 28,
    pinned: true,
    createdAt: 1700000002000,
    description: 'Messagerie électronique',
  },
  {
    id: 's-github',
    title: 'GitHub',
    url: 'https://github.com',
    categoryId: 'cat-dev',
    iconType: 'favicon',
    clicks: 25,
    pinned: true,
    createdAt: 1700000003000,
    description: 'Hébergement de code & Git',
  },
  {
    id: 's-chatgpt',
    title: 'ChatGPT',
    url: 'https://chatgpt.com',
    categoryId: 'cat-tools',
    iconType: 'favicon',
    clicks: 22,
    pinned: true,
    createdAt: 1700000004000,
    description: 'Assistant IA',
  },
  {
    id: 's-notion',
    title: 'Notion',
    url: 'https://www.notion.so',
    categoryId: 'cat-work',
    iconType: 'favicon',
    clicks: 19,
    pinned: false,
    createdAt: 1700000005000,
    description: 'Espace de travail et notes',
  },
  {
    id: 's-lemonde',
    title: 'Le Monde',
    url: 'https://www.lemonde.fr',
    categoryId: 'cat-media',
    iconType: 'favicon',
    clicks: 14,
    pinned: false,
    createdAt: 1700000006000,
    description: 'Actualités en continu',
  },
  {
    id: 's-reddit',
    title: 'Reddit',
    url: 'https://www.reddit.com',
    categoryId: 'cat-media',
    iconType: 'favicon',
    clicks: 16,
    pinned: false,
    createdAt: 1700000007000,
    description: 'Communautés et discussions',
  },
  {
    id: 's-stackoverflow',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    categoryId: 'cat-dev',
    iconType: 'favicon',
    clicks: 15,
    pinned: false,
    createdAt: 1700000008000,
    description: 'Entraide pour développeurs',
  },
  {
    id: 's-wikipedia',
    title: 'Wikipédia',
    url: 'https://fr.wikipedia.org',
    categoryId: 'cat-favorites',
    iconType: 'favicon',
    clicks: 11,
    pinned: false,
    createdAt: 1700000009000,
    description: 'Encyclopédie libre',
  },
  {
    id: 's-deepl',
    title: 'DeepL Traducteur',
    url: 'https://www.deepl.com/translator',
    categoryId: 'cat-tools',
    iconType: 'favicon',
    clicks: 13,
    pinned: false,
    createdAt: 1700000010000,
    description: 'Traduction précise',
  },
  {
    id: 's-calendar',
    title: 'Google Agenda',
    url: 'https://calendar.google.com',
    categoryId: 'cat-work',
    iconType: 'favicon',
    clicks: 17,
    pinned: false,
    createdAt: 1700000011000,
    description: 'Planification d’événements',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  density: 'normal',
  layoutStyle: 'icons',
  gridColumns: 'auto',
  searchEngine: 'google',
  openInNewTab: true,
  showClock: true,
  showWeather: true,
  showNotes: false,
  showSearch: true,
  timeFormat: '24h',
  showSeconds: false,
  showClicks: true,
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'order',
  background: {
    type: 'solid',
    solidColor: 'transparent',
    wallpaperId: 'nordic-lake',
    customUrl: '',
    blur: 0,
    overlayOpacity: 25,
    overlayColor: 'dark',
  },
};

const STORAGE_KEYS = {
  SHORTCUTS: 'chrome_startpage_shortcuts_v1',
  CATEGORIES: 'chrome_startpage_categories_v1',
  FOLDERS: 'chrome_startpage_folders_v1',
  SETTINGS: 'chrome_startpage_settings_v1',
  NOTES: 'chrome_startpage_notes_v1',
};

export function loadShortcuts(): Shortcut[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHORTCUTS);
    if (!raw) return DEFAULT_SHORTCUTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SHORTCUTS;
  } catch {
    return DEFAULT_SHORTCUTS;
  }
}

export function saveShortcuts(shortcuts: Shortcut[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTCUTS, JSON.stringify(shortcuts));
  } catch (err) {
    console.error('Failed to save shortcuts to localStorage', err);
  }
}

export function loadFolders(): Folder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!raw) return DEFAULT_FOLDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FOLDERS;
  } catch {
    return DEFAULT_FOLDERS;
  }
}

export function saveFolders(folders: Folder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  } catch (err) {
    console.error('Failed to save folders to localStorage', err);
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage', err);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      background: {
        ...DEFAULT_SETTINGS.background,
        ...(parsed.background || {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}

export function loadNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) {
      return [
        { id: 'note-1', text: 'Appuyer sur Ajouter (+) pour créer un raccourci', completed: false, createdAt: Date.now() - 3600000 },
        { id: 'note-2', text: 'Changer le moteur de recherche dans les paramètres', completed: false, createdAt: Date.now() - 1800000 },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveNotes(notes: NoteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes to localStorage', err);
  }
}

export function exportAllData(): string {
  const data = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    shortcuts: loadShortcuts(),
    folders: loadFolders(),
    categories: loadCategories(),
    settings: loadSettings(),
    notes: loadNotes(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonStr: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.shortcuts && Array.isArray(parsed.shortcuts)) {
      saveShortcuts(parsed.shortcuts);
    }
    if (parsed.folders && Array.isArray(parsed.folders)) {
      saveFolders(parsed.folders);
    }
    if (parsed.categories && Array.isArray(parsed.categories)) {
      saveCategories(parsed.categories);
    }
    if (parsed.settings && typeof parsed.settings === 'object') {
      const mergedSettings = {
        ...DEFAULT_SETTINGS,
        ...parsed.settings,
        background: {
          ...DEFAULT_SETTINGS.background,
          ...(parsed.settings.background || {}),
        },
      };
      saveSettings(mergedSettings);
    }
    if (parsed.notes && Array.isArray(parsed.notes)) {
      saveNotes(parsed.notes);
    }
    return { success: true, message: 'Données importées avec succès.' };
  } catch (err) {
    return { success: false, message: 'Format de fichier JSON invalide.' };
  }
}
