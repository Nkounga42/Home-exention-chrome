export interface WallpaperItem {
  id: string;
  name: string;
  category: 'nature' | 'minimal' | 'space' | 'architecture' | 'dark';
  thumbnailUrl: string;
  fullUrl: string;
  author: string;
}

export const CURATED_WALLPAPERS: WallpaperItem[] = [
  {
    id: 'nordic-lake',
    name: 'Lac Alpin & Brume',
    category: 'nature',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85',
    author: 'Bailey Zindel',
  },
  {
    id: 'desert-dunes',
    name: 'Dunes Minimalistes',
    category: 'minimal',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2560&q=85',
    author: 'Jeremy Bishop',
  },
  {
    id: 'night-sky',
    name: 'Voie Lactée & Nuit Étoilée',
    category: 'space',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=85',
    author: 'Vincent Guth',
  },
  {
    id: 'misty-forest',
    name: 'Forêt de Pins & Brouillard',
    category: 'nature',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=85',
    author: 'Sebastian Unrau',
  },
  {
    id: 'modern-arch',
    name: 'Architecture Graphique',
    category: 'architecture',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2560&q=85',
    author: 'Simone Hutsch',
  },
  {
    id: 'tokyo-neon',
    name: 'Nuit Urbaine & Lumières',
    category: 'dark',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2560&q=85',
    author: 'Aleksandar Pasaric',
  },
  {
    id: 'iceland-waterfall',
    name: 'Cascade Islandaise',
    category: 'nature',
    thumbnailUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=2560&q=85',
    author: 'Robert Lukeman',
  },
  {
    id: 'abstract-waves',
    name: 'Ondes Sombres & Relief',
    category: 'dark',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=85',
    author: 'Milad Fakurian',
  },
  {
    id: 'sunset-ocean',
    name: 'Crépuscule Océanique',
    category: 'nature',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85',
    author: 'Sean Oulashin',
  },
  {
    id: 'cosmic-nebula',
    name: 'Nébuleuse Cosmique',
    category: 'space',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2560&q=85',
    author: 'Jeremy Thomas',
  },
];

export const SOLID_BACKGROUNDS = [
  { id: 'default', name: 'Thème Standard', color: 'transparent', previewClass: 'bg-neutral-100 dark:bg-neutral-950' },
  { id: 'dark-obsidian', name: 'Obsidienne Profonde', color: '#09090b', previewClass: 'bg-zinc-950' },
  { id: 'dark-slate', name: 'Ardoise Minérale', color: '#0f172a', previewClass: 'bg-slate-900' },
  { id: 'dark-navy', name: 'Bleu Minuit', color: '#030712', previewClass: 'bg-gray-950' },
  { id: 'dark-emerald', name: 'Forêt Sombre', color: '#022c22', previewClass: 'bg-emerald-950' },
  { id: 'warm-cream', name: 'Gris Chaud & Lin', color: '#f4f4f5', previewClass: 'bg-zinc-100' },
  { id: 'soft-ice', name: 'Glace Arctique', color: '#f0f9ff', previewClass: 'bg-sky-50' },
];
