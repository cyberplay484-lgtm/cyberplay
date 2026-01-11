
export const APP_NAME = "Cyber Play";
export const DEFAULT_M3U_URL = ""; // Can be pre-filled for testing if needed
export const GEMINI_API_MODEL = "gemini-3-flash-preview";
export const MAX_AI_RESPONSE_LENGTH = 500;

// Local Storage Keys
export const LOCAL_STORAGE_M3U_KEY = 'cyberplay_m3u_url';
export const LOCAL_STORAGE_FAVORITES_KEY = 'cyberplay_favorites_v2'; // Added v2 for potential schema changes
export const LOCAL_STORAGE_RECENTS_KEY = 'cyberplay_recents_v2'; // Added v2 for potential schema changes
export const LOCAL_STORAGE_XTREAM_CREDENTIALS_KEY = 'cyberplay_xtream_credentials';
export const MAX_RECENT_CHANNELS = 10; // Maximum number of channels to keep in recents

// Navigation views
export enum View {
  HOME = 'home',
  LIVE_CHANNELS = 'live_channels',
  MOVIES = 'movies',
  SERIES = 'series',
  FAVORITES = 'favorites',
  SETTINGS = 'settings',
}
