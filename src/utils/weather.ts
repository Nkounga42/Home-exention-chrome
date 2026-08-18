import { WeatherData } from '../types';

const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: 'Ciel dégagé',
  1: 'Principalement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine modérée',
  55: 'Bruine dense',
  61: 'Pluie faible',
  63: 'Pluie modérée',
  65: 'Forte pluie',
  71: 'Chute de neige légère',
  73: 'Chute de neige modérée',
  75: 'Forte chute de neige',
  80: 'Averses légères',
  81: 'Averses modérées',
  82: 'Averses violentes',
  95: 'Orage',
  96: 'Orage avec grêle',
};

export async function fetchLiveWeather(): Promise<WeatherData | null> {
  try {
    // 1. Determine position (user geolocation or default Paris / France)
    let latitude = 48.8566;
    let longitude = 2.3522;
    let cityName = 'Paris';

    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 6000,
            maximumAge: 600000,
          });
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        cityName = 'Position locale';
      } catch {
        // Fallback to Paris coordinates
      }
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const current = data.current;

    const code = current.weather_code || 0;
    const condition = WEATHER_CODE_DESCRIPTIONS[code] || 'Clair';

    return {
      temperature: Math.round(current.temperature_2m),
      weatherCode: code,
      condition,
      cityName,
      isDay: current.is_day === 1,
      windSpeed: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
      lastUpdated: Date.now(),
    };
  } catch (err) {
    console.warn('Could not fetch weather', err);
    return null;
  }
}
