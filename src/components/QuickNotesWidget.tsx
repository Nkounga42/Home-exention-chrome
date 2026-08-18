import React, { useState } from 'react';
import {
  X,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  StickyNote
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickNotesWidget: React.FC = () => {
  const { settings, updateSettings, notes, addNote, toggleNote, deleteNote } = useApp();
  const [newNoteText, setNewNoteText] = useState('');

  if (!settings.showNotes) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote(newNoteText);
    setNewNoteText('');
  };

  return (
    <div
      id="quick-notes-widget"
      className="fixed right-4 bottom-4 z-40 w-80 sm:w-96 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <StickyNote size={16} className="text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Bloc-Notes & Tâches rapides
          </h3>
        </div>
        <button
          type="button"
          onClick={() => updateSettings({ showNotes: false })}
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* Note Input */}
      <form onSubmit={handleAdd} className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex gap-2">
        <input
          type="text"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Nouvelle note ou tâche..."
          className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />
        <button
          type="submit"
          disabled={!newNoteText.trim()}
          className="p-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 disabled:opacity-40 transition-opacity"
        >
          <Plus size={14} />
        </button>
      </form>

      {/* Notes List */}
      <div className="max-h-60 overflow-y-auto p-3 space-y-1.5">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-xs text-neutral-400">
            Aucune note pour le moment.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
            >
              <button
                type="button"
                onClick={() => toggleNote(note.id)}
                className="flex items-center gap-2 text-left min-w-0 flex-1"
              >
                {note.completed ? (
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-neutral-400 flex-shrink-0" />
                )}
                <span
                  className={`text-xs truncate ${
                    note.completed
                      ? 'line-through text-neutral-400 dark:text-neutral-500'
                      : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {note.text}
                </span>
              </button>

              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-all"
                title="Supprimer la note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
