
export interface IptvChannel {
  id: string;
  name: string;
  url: string;
  logo: string;
  groupTitle: string;
  tvgId: string;
}

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtreamMovie {
  id: string; // From stream_id
  name: string; // From stream_display_name
  added: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
  num: number;
  stream_icon: string; // logo
  stream_id: number;
  stream_type: 'movie';
  category_id: string;
  info: {
    name: string;
    aka: string;
    imdb_id: string;
    youtube_trailer: string;
    director: string;
    actors: string;
    rating: string;
    plot: string;
    cast: string;
    duration_secs: number;
    duration: string;
    movie_image: string;
    backdrop_path: string[];
    releaseDate: string;
    genere: string; // Typo in common Xtream API, keep it
    // ... other info
  };
  // We'll store the full URL constructed from Xtream base URL + stream_id
  url?: string; 
}

export interface XtreamSerieEpisode {
  id: string; // Constructed from episode_num and season_num
  name: string;
  added: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
  num: number;
  stream_icon: string;
  stream_id: number;
  episode_num: number;
  season: number;
  info: {
    plot: string;
    air_date: string;
    // ... other info
  };
  url?: string;
}

export interface XtreamSerieSeason {
  season_num: number;
  episodes: XtreamSerieEpisode[];
}

export interface XtreamSerie {
  id: string; // From series_id
  name: string; // From title
  series_id: number;
  cover: string; // Logo/cover image
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string;
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  num_seasons: number;
  seasons?: XtreamSerieSeason[]; // Episodes will be fetched per series/season
  // We'll store the full URL constructed from Xtream base URL + series_id for info
  url?: string; 
}

export type PlaylistContent = IptvChannel | XtreamMovie | XtreamSerie;

export interface IptvCategory {
  name: string;
  channels: IptvChannel[];
}

export enum PlayerStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  ERROR = 'ERROR',
}

export enum GeminiModel {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview',
}

export interface XtreamCredentials {
  url: string;
  username: string;
  password?: string; // Optional for security, but usually required by API
}
