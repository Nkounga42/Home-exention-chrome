import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Chrome,
  CheckCircle,
  Copy,
  Check,
  Download,
  Settings
} from 'lucide-react';

export const ExtensionGuidePage: React.FC = () => {
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const manifestCode = `{
  "manifest_version": 3,
  "name": "Ma Page d'Accueil - Raccourcis Personnalisés",
  "version": "1.0.0",
  "description": "Remplace la page de nouvel onglet Chrome par votre grille de raccourcis personnelle.",
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "permissions": [
    "storage"
  ],
  "action": {
    "default_title": "Ma Page d'Accueil"
  }
}`;

  const htmlLoaderCode = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${window.location.origin}/">
  <title>Nouvel Onglet</title>
</head>
<body>
  <p>Redirection vers votre page d'accueil personnelle...</p>
</body>
</html>`;

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestCode);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlLoaderCode);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadExtensionZip = () => {
    const blobManifest = new Blob([manifestCode], { type: 'application/json' });
    const urlManifest = URL.createObjectURL(blobManifest);
    const a = document.createElement('a');
    a.href = urlManifest;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(urlManifest);

    setTimeout(() => {
      const blobHtml = new Blob([htmlLoaderCode], { type: 'text/html' });
      const urlHtml = URL.createObjectURL(blobHtml);
      const b = document.createElement('a');
      b.href = urlHtml;
      b.download = 'index.html';
      b.click();
      URL.revokeObjectURL(urlHtml);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      {/* Top Header / Menu */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} />
              <span>Accueil</span>
            </Link>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <Chrome size={16} className="text-blue-500" />
              <span>Installation Extension Chrome</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Settings size={15} />
              <span className="hidden sm:inline">Réglages</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Intro Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Chrome size={18} className="text-blue-500" />
            <span>Transformer en page de démarrage Chrome</span>
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Google Chrome permet de remplacer la page de nouvel onglet par défaut par votre propre extension locale en 5 minutes, sans passer par le Chrome Web Store.
          </p>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleDownloadExtensionZip}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              <Download size={14} />
              <span>Télécharger les 2 fichiers (manifest.json & index.html)</span>
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex gap-3.5 items-start">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
              1
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Créer un dossier sur votre ordinateur
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Créez un nouveau dossier nommé par exemple <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px]">mon-extension-chrome</code> sur votre ordinateur.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex gap-3.5 items-start">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
              2
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Créer le fichier <code className="text-blue-500 font-mono">manifest.json</code>
                </h3>
                <button
                  type="button"
                  onClick={handleCopyManifest}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  {copiedManifest ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{copiedManifest ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                {manifestCode}
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex gap-3.5 items-start">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
              3
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Créer le fichier <code className="text-blue-500 font-mono">index.html</code>
                </h3>
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  {copiedHtml ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{copiedHtml ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
                {htmlLoaderCode}
              </pre>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex gap-3.5 items-start">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
              4
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Activer l'extension dans Google Chrome
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <li>Ouvrez Google Chrome et accédez à <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px]">chrome://extensions/</code></li>
                <li>Activez le <strong>« Mode développeur »</strong> en haut à droite.</li>
                <li>Cliquez sur <strong>« Charger l'extension non empaquetée »</strong> en haut à gauche.</li>
                <li>Sélectionnez votre dossier.</li>
              </ol>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 shadow-xs flex gap-3.5 items-start">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              5
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>Terminé ! Ouvrez un nouvel onglet</span>
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Appuyez sur <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 font-mono border border-emerald-200 dark:border-emerald-800 text-[11px]">Ctrl+T</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 font-mono border border-emerald-200 dark:border-emerald-800 text-[11px]">Cmd+T</kbd> pour afficher votre page personnalisée instantanément.
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Method */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            Méthode Alternative (Sans extension)
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Vous pouvez également définir cette adresse comme page de démarrage directe dans les paramètres de Chrome :
            accédez à <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px]">chrome://settings/onStartup</code>, choisissez <em>« Ouvrir une page ou un ensemble de pages spécifiques »</em> et collez l'URL de votre application.
          </p>
        </div>
      </main>
    </div>
  );
};
