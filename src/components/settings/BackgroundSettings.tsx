import React, { useState } from 'react';
import {
  Image,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Palette,
  Check,
  Trash2,
  Eye,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CURATED_WALLPAPERS,
  SOLID_BACKGROUNDS,
  WallpaperItem,
} from '../../utils/wallpapers';
import { BackgroundType } from '../../types';

export const BackgroundSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const bg = settings.background;

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [customUrlInput, setCustomUrlInput] = useState(bg.customUrl || '');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredWallpapers = CURATED_WALLPAPERS.filter((w) => {
    if (selectedFilter === 'all') return true;
    return w.category === selectedFilter;
  });

  const handleSelectWallpaper = (wallpaper: WallpaperItem) => {
    updateSettings({
      background: {
        ...bg,
        type: 'curated',
        wallpaperId: wallpaper.id,
      },
    });
  };

  const handleSelectSolid = (color: string) => {
    updateSettings({
      background: {
        ...bg,
        type: 'solid',
        solidColor: color,
      },
    });
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    updateSettings({
      background: {
        ...bg,
        type: 'custom',
        customUrl: customUrlInput.trim(),
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomUrlInput(dataUrl);
        updateSettings({
          background: {
            ...bg,
            type: 'custom',
            customUrl: dataUrl,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSetDailyUnsplash = () => {
    updateSettings({
      background: {
        ...bg,
        type: 'daily_unsplash',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Système d'Arrière-Plan
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Personnalisez le fond de votre page d'accueil avec des fonds d'écran HD, des images personnelles ou des teintes épurées.
        </p>
      </div>

      {/* Mode Selector Segmented Control */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs space-y-3">
        <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100">
          Source de l'arrière-plan
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'solid', label: 'Couleur unie', icon: Palette },
            { id: 'curated', label: 'Fonds d’écran HD', icon: Image },
            { id: 'custom', label: 'Image perso', icon: Upload },
            { id: 'daily_unsplash', label: 'Photo du jour', icon: Sparkles },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = bg.type === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                id={`bg-mode-${mode.id}`}
                onClick={() => {
                  if (mode.id === 'daily_unsplash') {
                    handleSetDailyUnsplash();
                  } else {
                    updateSettings({
                      background: {
                        ...bg,
                        type: mode.id as BackgroundType,
                      },
                    });
                  }
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all text-center cursor-pointer select-none ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Icon size={18} />
                <span className="text-xs">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Curated Wallpapers Gallery */}
      {bg.type === 'curated' && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Galerie de photographies sélectionnées
              </h3>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Haute définition, optimisées pour la rapidité de chargement.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'nature', label: 'Nature' },
                { id: 'minimal', label: 'Minimal' },
                { id: 'dark', label: 'Sombres' },
                { id: 'space', label: 'Espace' },
                { id: 'architecture', label: 'Archi' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedFilter === cat.id
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredWallpapers.map((w) => {
              const isSelected = bg.wallpaperId === w.id;

              return (
                <button
                  key={w.id}
                  type="button"
                  id={`wallpaper-card-${w.id}`}
                  onClick={() => handleSelectWallpaper(w)}
                  className={`group relative h-28 rounded-xl overflow-hidden border transition-all text-left cursor-pointer select-none ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <img
                    src={w.thumbnailUrl}
                    alt={w.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 text-white">
                    <span className="text-[11px] font-semibold truncate leading-tight">
                      {w.name}
                    </span>
                    <span className="text-[9px] text-neutral-300 truncate">
                      par {w.author}
                    </span>
                  </div>

                  {/* Check indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: Solid Backgrounds */}
      {bg.type === 'solid' && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs space-y-3">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Palette de teintes épurées
            </h3>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Couleurs unies sobres adaptées à la concentration et au repos visuel.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SOLID_BACKGROUNDS.map((solid) => {
              const isSelected =
                (bg.solidColor || 'transparent') === solid.color ||
                (solid.id === 'default' && (!bg.solidColor || bg.solidColor === 'transparent'));

              return (
                <button
                  key={solid.id}
                  type="button"
                  onClick={() => handleSelectSolid(solid.color)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-full h-10 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-xs flex items-center justify-center ${solid.previewClass}`}
                    style={solid.color !== 'transparent' ? { backgroundColor: solid.color } : {}}
                  >
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                    {solid.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Custom Image (Upload or URL) */}
      {bg.type === 'custom' && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Image personnalisée
            </h3>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Importez une photo depuis votre appareil ou collez l'adresse URL d'une image en ligne.
            </p>
          </div>

          {uploadError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {uploadError}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors bg-neutral-50/50 dark:bg-neutral-800/30">
              <Upload size={20} className="text-neutral-500" />
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Choisir une image locale...
              </span>
              <span className="text-[10px] text-neutral-400">
                JPG, PNG, WebP (max 5 Mo)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Or Paste URL Form */}
          <form onSubmit={handleSaveCustomUrl} className="space-y-2">
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Ou coller une URL d'image web
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Appliquer
              </button>
            </div>
          </form>

          {/* Active Preview */}
          {bg.customUrl && (
            <div className="relative h-32 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <img
                src={bg.customUrl}
                alt="Aperçu personnalisé"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setCustomUrlInput('');
                  updateSettings({
                    background: {
                      ...bg,
                      customUrl: '',
                      type: 'solid',
                    },
                  });
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                title="Supprimer cette image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Section 4: Daily Unsplash Photo */}
      {bg.type === 'daily_unsplash' && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles size={16} />
            <h3 className="text-xs font-bold">Photo Nature Aléatoire du Jour</h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Votre arrière-plan affichera chaque jour une nouvelle photographie de paysage et de nature en haute résolution.
          </p>
        </div>
      )}

      {/* Visual Adjustments (Blur, Dim Overlay, Overlay Tint) */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1 flex items-center gap-1.5">
          <Sliders size={13} />
          <span>Filtres de Lisibilité & Effets Visuels</span>
        </h3>

        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
          {/* Blur Level */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Eye size={14} className="text-neutral-500" />
                <span>Flou d'arrière-plan</span>
              </label>
              <span className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                {bg.blur} px
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { label: 'Net (0px)', val: 0 },
                { label: 'Doux (4px)', val: 4 },
                { label: 'Moyen (8px)', val: 8 },
                { label: 'Fort (16px)', val: 16 },
              ].map((p) => {
                const isSel = bg.blur === p.val;
                return (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() =>
                      updateSettings({
                        background: { ...bg, blur: p.val },
                      })
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center ${
                      isSel
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dim Overlay Opacity */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Voile d'assombrissement (Contraste du texte)
              </label>
              <span className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                {bg.overlayOpacity}%
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { label: '0%', val: 0 },
                { label: '25%', val: 25 },
                { label: '40%', val: 40 },
                { label: '60%', val: 60 },
              ].map((op) => {
                const isSel = bg.overlayOpacity === op.val;
                return (
                  <button
                    key={op.val}
                    type="button"
                    onClick={() =>
                      updateSettings({
                        background: { ...bg, overlayOpacity: op.val },
                      })
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center ${
                      isSel
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {op.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overlay Tint Color (Dark vs Light) */}
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Teinte du voile de contraste
              </h4>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Voile noir pour thème sombre ou voile blanc pour thème clair
              </p>
            </div>

            <div className="p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center border border-neutral-200/80 dark:border-neutral-700/80">
              {[
                { id: 'dark', label: 'Sombre' },
                { id: 'light', label: 'Clair' },
              ].map((t) => {
                const isSel = bg.overlayColor === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      updateSettings({
                        background: { ...bg, overlayColor: t.id as 'dark' | 'light' },
                      })
                    }
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      isSel
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
