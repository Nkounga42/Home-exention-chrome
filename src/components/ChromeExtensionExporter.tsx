import React, { useState } from 'react';
import {
  Download,
  Upload,
  Copy,
  Check,
  FileCode,
  Bookmark,
  HardDriveDownload,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportAllData, importAllData } from '../utils/storage';

export const ChromeExtensionExporter: React.FC = () => {
  const { shortcuts, categories } = useApp();
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const manifestJsonContent = `{
  "manifest_version": 3,
  "name": "Page d'Accueil - Raccourcis & Startpage",
  "version": "1.0.0",
  "description": "Nouvelle page d'onglet Chrome personnalisée avec grille de raccourcis, météo et recherche rapide.",
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "permissions": ["storage"],
  "icons": {
    "128": "icon.png"
  }
}`;

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestJsonContent);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chrome-startpage-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importAllData(content);
        if (res.success) {
          setImportStatus('✅ Sauvegarde importée avec succès. Rechargement...');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setImportStatus(`❌ Erreur: ${res.message}`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExportNetscapeBookmarks = () => {
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file. It will be read and overwritten. DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
    categories.forEach((cat) => {
      const catShortcuts = shortcuts.filter((s) => s.categoryId === cat.id);
      if (catShortcuts.length > 0) {
        html += `    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}">${cat.name}</H3>\n    <DL><p>\n`;
        catShortcuts.forEach((s) => {
          html += `        <DT><A HREF="${s.url}" ADD_DATE="${Math.floor(s.createdAt / 1000)}">${s.title}</A>\n`;
        });
        html += `    </DL><p>\n`;
      }
    });
    html += `</DL><p>\n`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chrome-bookmarks-export.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Sauvegarde & Extension Chrome
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Exportez vos données, transférez vos favoris ou configurez l'extension pour remplacer le nouvel onglet.
        </p>
      </div>

      {importStatus && (
        <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
          {importStatus}
        </div>
      )}

      {/* Mac Grouped Data Transfer Table */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
          Données & Fichiers
        </h3>
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
          {/* Export JSON */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-900/60">
                <Download size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Exporter les données (JSON)
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Sauvegarde complète de vos {shortcuts.length} raccourcis et catégories
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              Exporter...
            </button>
          </div>

          {/* Import JSON */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-900/60">
                <Upload size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Importer un fichier de sauvegarde (JSON)
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Restaurez vos raccourcis depuis un fichier JSON précédemment exporté
                </p>
              </div>
            </div>
            <label className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
              Choisir un fichier...
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Export Netscape HTML Bookmarks */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-900/60">
                <Bookmark size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Exporter en Favoris HTML Navigateur
                </h4>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Format standard compatible avec Google Chrome, Safari, Firefox et Edge
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportNetscapeBookmarks}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              Télécharger HTML
            </button>
          </div>
        </div>
      </div>

      {/* Chrome Extension Manifest Block */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
          Manifest Extension Chrome (Manifest V3)
        </h3>
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-blue-500" />
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                manifest.json
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyManifest}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              {copiedManifest ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copiedManifest ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-neutral-950 text-neutral-200 text-xs font-mono overflow-x-auto leading-relaxed border border-neutral-800">
            {manifestJsonContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
