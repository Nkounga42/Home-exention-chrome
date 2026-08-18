import React, { useState } from 'react';
import { Plus, Check, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GoogleTool {
  id: string;
  name: string;
  url: string;
  domain: string;
  category: string;
  color: string;
  description: string;
}

const GOOGLE_TOOLS: GoogleTool[] = [
  {
    id: 'google-search',
    name: 'Google',
    url: 'https://www.google.com',
    domain: 'google.com',
    category: 'Recherche',
    color: '#4285F4',
    description: 'Moteur de recherche',
  },
  {
    id: 'google-gmail',
    name: 'Gmail',
    url: 'https://mail.google.com',
    domain: 'mail.google.com',
    category: 'Messagerie',
    color: '#EA4335',
    description: 'Boîte de réception & e-mails',
  },
  {
    id: 'google-drive',
    name: 'Drive',
    url: 'https://drive.google.com',
    domain: 'drive.google.com',
    category: 'Stockage',
    color: '#34A853',
    description: 'Fichiers & cloud sécurisé',
  },
  {
    id: 'google-calendar',
    name: 'Agenda',
    url: 'https://calendar.google.com',
    domain: 'calendar.google.com',
    category: 'Organisation',
    color: '#4285F4',
    description: 'Planning & événements',
  },
  {
    id: 'google-youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    domain: 'youtube.com',
    category: 'Médias',
    color: '#FF0000',
    description: 'Vidéos & streaming',
  },
  {
    id: 'google-gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com',
    domain: 'gemini.google.com',
    category: 'IA',
    color: '#8E24AA',
    description: 'Assistant IA conversationnel',
  },
  {
    id: 'google-maps',
    name: 'Maps',
    url: 'https://maps.google.com',
    domain: 'maps.google.com',
    category: 'Navigation',
    color: '#34A853',
    description: 'Cartes, GPS & trajets',
  },
  {
    id: 'google-meet',
    name: 'Meet',
    url: 'https://meet.google.com',
    domain: 'meet.google.com',
    category: 'Communication',
    color: '#00897B',
    description: 'Visioconférences HD',
  },
  {
    id: 'google-docs',
    name: 'Docs',
    url: 'https://docs.google.com',
    domain: 'docs.google.com',
    category: 'Bureautique',
    color: '#4285F4',
    description: 'Traitement de texte en ligne',
  },
  {
    id: 'google-sheets',
    name: 'Sheets',
    url: 'https://sheets.google.com',
    domain: 'sheets.google.com',
    category: 'Bureautique',
    color: '#0F9D58',
    description: 'Tableurs collaboratifs',
  },
  {
    id: 'google-slides',
    name: 'Slides',
    url: 'https://slides.google.com',
    domain: 'slides.google.com',
    category: 'Bureautique',
    color: '#F4B400',
    description: 'Présentations & diaporamas',
  },
  {
    id: 'google-keep',
    name: 'Keep',
    url: 'https://keep.google.com',
    domain: 'keep.google.com',
    category: 'Organisation',
    color: '#FBBC04',
    description: 'Notes rapides & listes',
  },
  {
    id: 'google-translate',
    name: 'Traduction',
    url: 'https://translate.google.com',
    domain: 'translate.google.com',
    category: 'Outils',
    color: '#4285F4',
    description: 'Traduction multilingue instantanée',
  },
  {
    id: 'google-photos',
    name: 'Photos',
    url: 'https://photos.google.com',
    domain: 'photos.google.com',
    category: 'Médias',
    color: '#EA4335',
    description: 'Sauvegarde & retouche photo',
  },
  {
    id: 'google-contacts',
    name: 'Contacts',
    url: 'https://contacts.google.com',
    domain: 'contacts.google.com',
    category: 'Communication',
    color: '#1A73E8',
    description: 'Carnet d’adresses synchronisé',
  },
  {
    id: 'google-news',
    name: 'Actualités',
    url: 'https://news.google.com',
    domain: 'news.google.com',
    category: 'Information',
    color: '#1A73E8',
    description: 'Flux d’actualités mondiales',
  },
  {
    id: 'google-forms',
    name: 'Formulaires',
    url: 'https://forms.google.com',
    domain: 'forms.google.com',
    category: 'Bureautique',
    color: '#7248B9',
    description: 'Questionnaires & sondages',
  },
  {
    id: 'google-classroom',
    name: 'Classroom',
    url: 'https://classroom.google.com',
    domain: 'classroom.google.com',
    category: 'Éducation',
    color: '#1E8E3E',
    description: 'Espace pédagogique & cours',
  },
];

interface ToolItemProps {
  tool: GoogleTool;
  isAdded: boolean;
  onAdd: (e: React.MouseEvent, tool: GoogleTool) => void;
}

const GoogleToolCard: React.FC<ToolItemProps> = ({ tool, isAdded, onAdd }) => {
  const [imgError, setImgError] = useState(false);
  const iconSrc = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`;

  return (
    <div
      id={`google-tool-${tool.id}`}
      className="group relative flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs hover:shadow-sm select-none"
      onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
    >
      {/* Authentic High-Res Icon */}
      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 border border-neutral-200/80 dark:border-neutral-700/80 p-2 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
        {!imgError ? (
          <img
            src={iconSrc}
            alt={tool.name}
            className="w-6 h-6 object-contain"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="w-full h-full rounded-lg flex items-center justify-center font-bold text-xs text-white"
            style={{ backgroundColor: tool.color }}
          >
            {tool.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Tool Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white">
            {tool.name}
          </h4>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
          {tool.description}
        </p>
      </div>

      {/* Quick Add / Status button */}
      <button
        id={`add-tool-btn-${tool.id}`}
        type="button"
        onClick={(e) => onAdd(e, tool)}
        title={isAdded ? 'Déjà dans vos raccourcis' : 'Ajouter à vos raccourcis'}
        className={`p-1.5 rounded-lg transition-all cursor-pointer flex-shrink-0 ${
          isAdded
            ? 'bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 opacity-100'
            : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isAdded ? <Check size={14} /> : <Plus size={14} />}
      </button>
    </div>
  );
};

export const GoogleToolsSection: React.FC = () => {
  const { shortcuts, addShortcut } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [feedbackIds, setFeedbackIds] = useState<Record<string, boolean>>({});

  const handleAddShortcut = (e: React.MouseEvent, tool: GoogleTool) => {
    e.stopPropagation();

    const alreadyExists = shortcuts.some(
      (s) =>
        s.url.toLowerCase() === tool.url.toLowerCase() ||
        s.title.toLowerCase() === `google ${tool.name}`.toLowerCase() ||
        s.title.toLowerCase() === tool.name.toLowerCase()
    );

    if (!alreadyExists) {
      addShortcut({
        title: tool.name === 'Google' ? 'Google' : `Google ${tool.name}`,
        url: tool.url,
        categoryId: 'cat-favorites',
        iconType: 'favicon',
        lucideIconName: 'Globe',
        color: tool.color,
        pinned: false,
      });
    }

    setFeedbackIds((prev) => ({ ...prev, [tool.id]: true }));
    setTimeout(() => {
      setFeedbackIds((prev) => ({ ...prev, [tool.id]: false }));
    }, 2000);
  };

  const isToolInShortcuts = (tool: GoogleTool) => {
    return shortcuts.some(
      (s) =>
        s.url.toLowerCase().includes(tool.domain.toLowerCase()) ||
        s.title.toLowerCase() === `google ${tool.name}`.toLowerCase() ||
        s.title.toLowerCase() === tool.name.toLowerCase()
    );
  };

  const filteredTools = GOOGLE_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section
      id="google-tools-container"
      className="w-full mt-10 p-5 sm:p-6 rounded-3xl bg-neutral-100/80 dark:bg-neutral-900/70 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-800/90 shadow-xs"
    >
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Outils & Services Google
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {GOOGLE_TOOLS.length}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Accès rapide aux applications Google. Cliquez pour ouvrir ou sur le « + » pour épingler dans vos raccourcis.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            id="google-tools-filter-input"
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filtrer un outil Google..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>

      {/* Grid of Google Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredTools.map((tool) => (
          <GoogleToolCard
            key={tool.id}
            tool={tool}
            isAdded={Boolean(feedbackIds[tool.id] || isToolInShortcuts(tool))}
            onAdd={handleAddShortcut}
          />
        ))}
      </div>
    </section>
  );
};
