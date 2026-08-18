import { BackgroundConfig, ThemeMode } from '../types';
import { CURATED_WALLPAPERS, SOLID_BACKGROUNDS } from './wallpapers';

// Cache sampled image luminances so canvas is not continuously queried
const imageLuminanceCache = new Map<string, number>();

/**
 * Calculates luminance for a hex color (0-255)
 */
export function calculateColorLuminance(hex: string): number {
  if (!hex || hex === 'transparent') return -1;

  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  // Standard perceived photometric luminance formula
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Dynamically samples an image URL via HTML5 Canvas to find its true average perceived brightness (0 to 255)
 */
export function sampleImageBrightness(imageUrl: string): Promise<number> {
  if (!imageUrl) return Promise.resolve(128);

  if (imageLuminanceCache.has(imageUrl)) {
    return Promise.resolve(imageLuminanceCache.get(imageUrl)!);
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';

      // Set timeout in case network image is blocked or slow
      const timeout = setTimeout(() => {
        resolve(80); // Default to moderately dark for safety
      }, 1500);

      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(80);
            return;
          }

          ctx.drawImage(img, 0, 0, 16, 16);
          const imageData = ctx.getImageData(0, 0, 16, 16).data;

          let totalLuminance = 0;
          let pixelCount = 0;

          for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3] / 255;

            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            totalLuminance += lum * a;
            pixelCount++;
          }

          const avgLum = pixelCount > 0 ? totalLuminance / pixelCount : 80;
          imageLuminanceCache.set(imageUrl, avgLum);
          resolve(avgLum);
        } catch {
          // If tainted by CORS, default to 75 (dark wallpaper safety)
          imageLuminanceCache.set(imageUrl, 75);
          resolve(75);
        }
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(80);
      };

      img.src = imageUrl;
    } catch {
      resolve(80);
    }
  });
}

/**
 * Computes the final effective background luminance (0-255)
 * factoring in image, solid color, overlay dimming, and theme.
 */
export function getEffectiveBackgroundLuminance(
  bg: BackgroundConfig,
  theme: ThemeMode,
  sampledImageLum: number | null
): { luminance: number; isDark: boolean } {
  const isSystemDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const activeThemeDark = theme === 'dark' || (theme === 'system' && isSystemDark);

  let rawLuminance: number;

  if (bg.type === 'curated') {
    const curated = CURATED_WALLPAPERS.find((w) => w.id === bg.wallpaperId);
    rawLuminance = curated ? curated.luminance : 80;
  } else if (bg.type === 'solid') {
    const solid = SOLID_BACKGROUNDS.find((s) => s.color === bg.solidColor);
    if (solid && solid.luminance >= 0) {
      rawLuminance = solid.luminance;
    } else if (bg.solidColor && bg.solidColor !== 'transparent') {
      rawLuminance = calculateColorLuminance(bg.solidColor);
    } else {
      rawLuminance = activeThemeDark ? 15 : 240;
    }
  } else if (bg.type === 'custom' || bg.type === 'daily_unsplash') {
    rawLuminance = sampledImageLum !== null ? sampledImageLum : 75;
  } else {
    rawLuminance = activeThemeDark ? 15 : 240;
  }

  // Factor in overlay (dark or light tint + opacity)
  const isImageBackground = bg.type === 'curated' || bg.type === 'custom' || bg.type === 'daily_unsplash';
  let finalLuminance = rawLuminance;

  if (isImageBackground && bg.overlayOpacity > 0) {
    const overlayFraction = Math.min(Math.max(bg.overlayOpacity / 100, 0), 1);
    const overlayLum = bg.overlayColor === 'light' ? 255 : 0;
    finalLuminance = rawLuminance * (1 - overlayFraction) + overlayLum * overlayFraction;
  }

  // Perceptual threshold for dark text vs light text
  // Anything below 140 is considered dark background and requires white/bright text
  const isDark = finalLuminance < 140;

  return {
    luminance: finalLuminance,
    isDark,
  };
}
