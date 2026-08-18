import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  FolderPlus,
  Folder
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';

const CATEGORY_PALETTE = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#64748b', // Slate
];

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, shortcuts } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_PALETTE[0]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setNewCatName('');
    setNewCatColor(CATEGORY_PALETTE[Math.floor(Math.random() * CATEGORY_PALETTE.length)]);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatColor);
    setIsAdding(false);
    setNewCatName('');
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateCategory(id, editName, editColor);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Catégories & Dossiers
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Organisez vos raccourcis selon vos habitudes de travail et de navigation.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
          >
            <FolderPlus size={14} />
            <span>Ajouter une catégorie</span>
          </button>
        )}
      </div>

      {/* Add New Category Card */}
      {isAdding && (
        <form
          onSubmit={handleSaveNew}
          className="p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Nouvelle catégorie
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Nom de la catégorie
            </label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="ex: Design, Veille Tech, Médias..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Couleur d'identification
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORY_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCatColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-white transition-transform cursor-pointer ${
                    newCatColor === c ? 'ring-2 ring-neutral-900 dark:ring-neutral-100 scale-110' : ''
                  }`}
                >
                  {newCatColor === c && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-xs font-semibold text-white dark:text-neutral-900 cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Mac Grouped Category List */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
        {categories.map((cat) => {
          const count = shortcuts.filter((s) => s.categoryId === cat.id).length;
          const isEditingThis = editingId === cat.id;

          return (
            <div
              key={cat.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
            >
              {isEditingThis ? (
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5">
                    {CATEGORY_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-sm flex items-center justify-center text-white cursor-pointer ${
                          editColor === c ? 'ring-2 ring-neutral-800 dark:ring-neutral-200' : ''
                        }`}
                      >
                        {editColor === c && <Check size={10} />}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-2 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat.id)}
                      className="p-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 cursor-pointer"
                      title="Valider"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                      title="Annuler"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Folder size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {cat.name}
                      </span>
                      <span className="ml-2 text-[11px] text-neutral-400">
                        ({count} {count > 1 ? 'raccourcis' : 'raccourci'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Pencil size={13} />
                    </button>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
