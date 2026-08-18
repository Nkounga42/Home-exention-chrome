export type IconType = 'favicon' | 'lucide' | 'letter';

export interface Shortcut {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  folderId?: string; // Optional folder ID if contained in a folder
  iconType: IconType;
  lucideIconName?: string;
  color?: string; // hex or tailwind solid badge color
  clicks: number;
  pinned: boolean;
  createdAt: number;
  description?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  createdAt: number;
  order?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export type SearchEngineId = 'google' | 'duckduckgo' | 'bing' | 'ecosia' | 'brave' | 'github' | 'youtube' | 'wikipedia';

export interface SearchEngine {
  id: SearchEngineId;
  name: string;
  searchUrl: string;
  placeholder: string;
  iconName: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type GridDensity = 'compact' | 'normal' | 'comfortable';
export type TimeFormat = '24h' | '12h';

export type BackgroundType = 'solid' | 'curated' | 'custom' | 'daily_unsplash';

export interface BackgroundConfig {
  type: BackgroundType;
  solidColor?: string;
  wallpaperId?: string;
  customUrl?: string;
  blur: number; // 0 to 20 px
  overlayOpacity: number; // 0 to 80 %
  overlayColor: 'dark' | 'light';
}

export interface AppSettings {
  theme: ThemeMode;
  density: GridDensity;
  searchEngine: SearchEngineId;
  openInNewTab: boolean;
  showClock: boolean;
  showWeather: boolean;
  showNotes: boolean;
  showSearch: boolean;
  timeFormat: TimeFormat;
  showSeconds: boolean;
  showClicks: boolean;
  selectedCategory: string; // 'all' or category ID
  searchQuery: string;
  sortBy: 'order' | 'clicks' | 'title' | 'recent';
  background: BackgroundConfig;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  condition: string;
  cityName: string;
  isDay: boolean;
  windSpeed: number;
  humidity?: number;
  lastUpdated: number;
}

export interface NoteItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
