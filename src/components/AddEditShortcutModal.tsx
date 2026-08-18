import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Globe, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractDomain, formatUrl } from '../utils/favicon';
import { AVAILABLE_ICONS, getLucideIcon } from '../utils/icons';

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#171717', // Neutral Black
];

export const AddEditShortcutModal: React.FC = () => {
  const {
    isAddModalOpen,
    editingShortcut,
    closeModal,
    addShortcut,
    updateShortcut,
  } = useApp();

  const isEditing = Boolean(editingShortcut && editingShortcut.id);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [iconType, setIconType] = useState<'favicon' | 'lucide' | 'letter'>('favicon');
  const [lucideIconName, setLucideIconName] = useState('Globe');
  const [color, setColor] = useState('#3b82f6');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAddModalOpen) {
      if (editingShortcut && editingShortcut.id) {
        setTitle(editingShortcut.title || '');
        setUrl(editingShortcut.url || '');
        setIconType(editingShortcut.iconType || 'favicon');
        setLucideIconName(editingShortcut.lucideIconName || 'Globe');
        setColor(editingShortcut.color || '#3b82f6');
      } else {
        setTitle('');
        setUrl('');
        setIconType('favicon');
        setLucideIconName('Globe');
        setColor('#3b82f6');
      }
      setErrorMessage('');
    }
  }, [isAddModalOpen, editingShortcut]);

  if (!isAddModalOpen) return null;

  const handleUrlBlur = () => {
    if (url.trim() && !title.trim()) {
      const domain = extractDomain(url);
      if (domain) {
        const capitalized = domain.charAt(0).toUpperCase() + domain.slice(1).split('.')[0];
        setTitle(capitalized);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatUrl(url);

    if (!formatted) {
      setErrorMessage('Veuillez renseigner une adresse web (URL) valide.');
      return;
    }

    const finalTitle = title.trim() || extractDomain(formatted) || 'Lien';

    if (isEditing && editingShortcut) {
      updateShortcut(editingShortcut.id, {
        title: finalTitle,
        url: formatted,
        iconType,
        lucideIconName,
        color,
      });
    } else {
      addShortcut({
        title: finalTitle,
        url: formatted,
        categoryId: editingShortcut?.categoryId || 'cat-favorites',
        folderId: editingShortcut?.folderId,
        iconType,
        lucideIconName,
        color,
        pinned: false,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {isEditing ? 'Modifier le lien' : 'Ajouter un raccourci'}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Quick Suggestions for new links */}
          {!isEditing && (
            <div>
              <span className="block text-[11px] font-medium text-neutral-400 dark:text-neutral-500 mb-1.5">
                Suggestions rapides :
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { name: 'Google', url: 'https://google.com' },
                  { name: 'Gmail', url: 'https://mail.google.com' },
                  { name: 'Drive', url: 'https://drive.google.com' },
                  { name: 'YouTube', url: 'https://youtube.com' },
                  { name: 'Docs', url: 'https://docs.google.com' },
                  { name: 'Agenda', url: 'https://calendar.google.com' },
                ].map((sug) => (
                  <button
                    key={sug.name}
                    type="button"
                    onClick={() => {
                      setUrl(sug.url);
                      setTitle(sug.name);
                    }}
                    className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    + {sug.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* URL Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <LinkIcon size={13} className="text-neutral-400" />
              <span>Adresse URL *</span>
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="ex: github.com ou https://youtube.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
              autoFocus
            />
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Nom affiché
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: GitHub, YouTube..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
            />
          </div>

          {/* Optional Icon Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Icône
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIconType('favicon')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  iconType === 'favicon'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Globe size={13} />
                <span>Favicon auto</span>
              </button>

              <button
                type="button"
                onClick={() => setIconType('lucide')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  iconType === 'lucide'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Sparkles size={13} />
                <span>Symbole</span>
              </button>

              <button
                type="button"
                onClick={() => setIconType('letter')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  iconType === 'letter'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <span className="font-mono font-bold">A</span>
                <span>Initiale</span>
              </button>
            </div>
          </div>

          {/* Color palette */}
          {(iconType === 'letter' || iconType === 'lucide') && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-lg transition-transform cursor-pointer ${
                    color === c ? 'ring-2 ring-offset-2 ring-neutral-800 scale-110' : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

