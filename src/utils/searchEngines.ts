import { SearchEngine, SearchEngineId } from '../types';

export const SEARCH_ENGINES: Record<SearchEngineId, SearchEngine> = {
  google: {
    id: 'google',
    name: 'Google',
    searchUrl: 'https://www.google.com/search?q=',
    placeholder: 'Rechercher sur Google ou entrer une URL...',
    iconName: 'Search',
  },
  duckduckgo: {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    searchUrl: 'https://duckduckgo.com/?q=',
    placeholder: 'Recherche privée avec DuckDuckGo...',
    iconName: 'Shield',
  },
  brave: {
    id: 'brave',
    name: 'Brave Search',
    searchUrl: 'https://search.brave.com/search?q=',
    placeholder: 'Rechercher sur Brave...',
    iconName: 'Compass',
  },
  ecosia: {
    id: 'ecosia',
    name: 'Ecosia',
    searchUrl: 'https://www.ecosia.org/search?q=',
    placeholder: 'Planter des arbres en recherchant...',
    iconName: 'Globe',
  },
  bing: {
    id: 'bing',
    name: 'Bing',
    searchUrl: 'https://www.bing.com/search?q=',
    placeholder: 'Rechercher sur Bing...',
    iconName: 'Search',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    searchUrl: 'https://github.com/search?q=',
    placeholder: 'Rechercher des dépôts, code, utilisateurs...',
    iconName: 'Code',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    searchUrl: 'https://www.youtube.com/results?search_query=',
    placeholder: 'Rechercher des vidéos sur YouTube...',
    iconName: 'Video',
  },
  wikipedia: {
    id: 'wikipedia',
    name: 'Wikipédia',
    searchUrl: 'https://fr.wikipedia.org/w/index.php?search=',
    placeholder: 'Explorer l’encyclopédie libre...',
    iconName: 'BookOpen',
  },
};
