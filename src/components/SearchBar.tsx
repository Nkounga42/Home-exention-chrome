import React, { useState, useRef } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEARCH_ENGINES } from '../utils/searchEngines';
import { formatUrl } from '../utils/favicon';

export const SearchBar: React.FC = () => {
  const { settings } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentEngine = SEARCH_ENGINES[settings.searchEngine] || SEARCH_ENGINES.google;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check if user entered a direct web URL (e.g., github.com, http://..., localhost)
    const isUrl =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed) ||
      /^localhost(:\d+)?(\/.*)?$/i.test(trimmed);

    if (isUrl && !trimmed.includes(' ')) {
      const formatted = formatUrl(trimmed);
      if (settings.openInNewTab) {
        window.open(formatted, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = formatted;
      }
      return;
    }

    // Web search using selected engine
    const searchTarget = `${currentEngine.searchUrl}${encodeURIComponent(trimmed)}`;
    if (settings.openInNewTab) {
      window.open(searchTarget, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = searchTarget;
    }
  };

  return (
    <div className="w-full max-w-2xl my-6">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-neutral-400 pointer-events-none">
          <Search size={18} />
        </div>

        <input
          ref={inputRef}
          id="main-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher sur le web ou entrer une adresse URL..."
          className="w-full pl-11 pr-20 py-3.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-xs transition-all"
          autoFocus
        />

        <div className="absolute right-3 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <button
            id="search-submit-btn"
            type="submit"
            className="p-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-xs"
            title="Lancer la recherche"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </div>
  );
};
