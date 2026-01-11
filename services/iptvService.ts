import { IptvChannel, XtreamMovie, XtreamSerie, XtreamCategory, XtreamCredentials } from '../types';

/**
 * Fetches an M3U playlist from a given URL and parses it into a list of IptvChannel objects.
 * @param url The URL of the M3U playlist.
 * @returns A promise that resolves to an array of IptvChannel objects.
 */
export async function fetchAndParseM3U(url: string): Promise<IptvChannel[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U playlist: ${response.statusText}`);
    }
    const text = await response.text();
    return parseM3UContent(text);
  } catch (error) {
    console.error('Error fetching or parsing M3U:', error);
    throw error;
  }
}

/**
 * Parses the raw content of an M3U playlist string.
 * @param m3uContent The raw string content of the M3U file.
 * @returns An array of IptvChannel objects.
 */
function parseM3UContent(m3uContent: string): IptvChannel[] {
  const lines = m3uContent.split(/\r?\n/);
  const channels: IptvChannel[] = [];
  let currentChannel: Partial<IptvChannel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // New channel definition
      currentChannel = {}; // Reset for new channel
      
      // Extract attributes
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupTitleMatch = line.match(/group-title="([^"]*)"/);
      
      const nameMatch = line.match(/,(.*)$/); // Get everything after the last comma

      currentChannel.tvgId = tvgIdMatch ? tvgIdMatch[1] : '';
      currentChannel.logo = tvgLogoMatch ? tvgLogoMatch[1] : '';
      currentChannel.groupTitle = groupTitleMatch ? groupTitleMatch[1] : 'Other';
      currentChannel.name = nameMatch ? nameMatch[1].trim() : `Channel ${channels.length + 1}`;

    } else if (line && !line.startsWith('#') && currentChannel.name) {
      // This is likely the URL for the current channel
      currentChannel.url = line;
      // Assign a unique ID (can be improved for more robust unique keys if needed)
      currentChannel.id = `channel-${currentChannel.name}-${channels.length}`;
      channels.push(currentChannel as IptvChannel);
      currentChannel = {}; // Clear for next channel
    }
  }

  return channels;
}


/**
 * Simulates fetching movies and series data from an Xtream Codes API.
 * In a real application, this would involve making authenticated HTTP requests.
 * @param credentials Xtream Codes API credentials.
 * @returns A promise that resolves to an object containing movies and series.
 */
export async function fetchXtreamData(credentials: XtreamCredentials): Promise<{ movies: XtreamMovie[]; series: XtreamSerie[] }> {
  console.log("Simulating Xtream Codes API fetch with credentials:", credentials);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!credentials.url || !credentials.username || !credentials.password) {
    throw new Error("Invalid Xtream Codes credentials provided.");
  }

  // --- Mock Data for Movies ---
  const mockMovies: XtreamMovie[] = [
    {
      id: "movie-1",
      name: "Cyberpunk 2077: O Filme",
      added: "1678886400", // Timestamp
      container_extension: "mp4",
      custom_sid: "",
      direct_source: "",
      num: 1,
      stream_icon: "https://image.tmdb.org/t/p/w500/uDgy6hyPd82K7WmHGDTQJp0gQT0.jpg",
      stream_id: 101,
      stream_type: "movie",
      category_id: "1", // Action
      info: {
        name: "Cyberpunk 2077: O Filme",
        aka: "",
        imdb_id: "tt12894014",
        youtube_trailer: "",
        director: "Ava",
        actors: "V, Johnny Silverhand",
        rating: "8.5",
        plot: "Em uma metrópole distópica do futuro, um mercenário cyberneticamente aprimorado embarca em uma perigosa missão de roubo.",
        cast: "Keanu Reeves, Cherami Leigh, Gavin Drea",
        duration_secs: 7200,
        duration: "2:00:00",
        movie_image: "https://image.tmdb.org/t/p/w500/uDgy6hyPd82K7WmHGDTQJp0gQT0.jpg",
        backdrop_path: [],
        releaseDate: "2025-01-01",
        genere: "Ação|Ficção Científica",
      },
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Placeholder URL
    },
    {
      id: "movie-2",
      name: "Aventuras no Metaverso",
      added: "1678886400", // Timestamp
      container_extension: "mp4",
      custom_sid: "",
      direct_source: "",
      num: 2,
      stream_icon: "https://image.tmdb.org/t/p/w500/yYrvz58gHTHQjJCT4YJQO2ymADt.jpg",
      stream_id: 102,
      stream_type: "movie",
      category_id: "2", // Comedy
      info: {
        name: "Aventuras no Metaverso",
        aka: "",
        imdb_id: "tt12345678",
        youtube_trailer: "",
        director: "Zoe",
        actors: "",
        rating: "7.2",
        plot: "Um grupo de amigos explora um metaverso caótico, encontrando personagens estranhos e desafios hilários.",
        cast: "Alice, Bob, Charlie",
        duration_secs: 5400,
        duration: "1:30:00",
        movie_image: "https://image.tmdb.org/t/p/w500/yYrvz58gHTHQjJCT4YJQO2ymADt.jpg",
        backdrop_path: [],
        releaseDate: "2024-06-15",
        genere: "Comédia|Aventura",
      },
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" // Placeholder URL
    },
    {
      id: "movie-3",
      name: "O Código do Passado",
      added: "1678886400", // Timestamp
      container_extension: "mp4",
      custom_sid: "",
      direct_source: "",
      num: 3,
      stream_icon: "https://image.tmdb.org/t/p/w500/z0GfA2E07g3N4P1LwzYwY2C8Xw.jpg",
      stream_id: 103,
      stream_type: "movie",
      category_id: "3", // Terror
      info: {
        name: "O Código do Passado",
        aka: "",
        imdb_id: "tt98765432",
        youtube_trailer: "",
        director: "Max",
        actors: "",
        rating: "6.8",
        plot: "Um mistério antigo é revelado por um código digital, desencadeando eventos aterrorizantes.",
        cast: "David, Emily",
        duration_secs: 6000,
        duration: "1:40:00",
        movie_image: "https://image.tmdb.org/t/p/w500/z0GfA2E07g3N4P1LwzYwY2C8Xw.jpg",
        backdrop_path: [],
        releaseDate: "2023-10-20",
        genere: "Terror|Suspense",
      },
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" // Placeholder URL
    }
  ];

  // --- Mock Data for Series ---
  const mockSeries: XtreamSerie[] = [
    {
      id: "series-1",
      name: "Protocolo Ômega",
      series_id: 201,
      cover: "https://image.tmdb.org/t/p/w500/fTqX84m2K2P4S6z1k4z7p2zP3j.jpg",
      plot: "Uma equipe de cientistas descobre um protocolo que pode mudar a realidade, mas com consequências imprevistas.",
      cast: "Laura, Miguel",
      director: "Dr. Elena",
      genre: "Ficção Científica|Drama",
      releaseDate: "2023-03-01",
      last_modified: "1680000000",
      rating: "8.1",
      backdrop_path: [],
      youtube_trailer: "",
      episode_run_time: "45 min",
      num_seasons: 2,
      seasons: [ // Simplified seasons data, full episodes would be fetched per season
        { season_num: 1, episodes: [{
          id: "series-1-s1e1", name: "Início", stream_id: 2001, episode_num: 1, season: 1,
          added: "", container_extension: "mp4", custom_sid: "", direct_source: "", num: 1, stream_icon: "", 
          // Add missing 'air_date' property to match XtreamSerieEpisode type
          info: {plot: "Ep 1 plot", air_date: "2023-03-01"},
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        }] },
        { season_num: 2, episodes: [{
          id: "series-1-s2e1", name: "Conflito", stream_id: 2002, episode_num: 1, season: 2,
          added: "", container_extension: "mp4", custom_sid: "", direct_source: "", num: 1, stream_icon: "", 
          // Add missing 'air_date' property to match XtreamSerieEpisode type
          info: {plot: "Ep 1 plot", air_date: "2023-03-01"},
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
        }] },
      ],
    },
    {
      id: "series-2",
      name: "Sombras da Cidade",
      series_id: 202,
      cover: "https://image.tmdb.org/t/p/w500/d9MhD0q0X5G7m1X3P1p4h3s0F9.jpg",
      plot: "Um detetive investiga crimes misteriosos nas ruas escuras de uma metrópole futurista.",
      cast: "Jack, Sarah",
      director: "Inspector Lee",
      genre: "Suspense|Crime",
      releaseDate: "2024-01-20",
      last_modified: "1690000000",
      rating: "7.9",
      backdrop_path: [],
      youtube_trailer: "",
      episode_run_time: "50 min",
      num_seasons: 1,
      seasons: [
        { season_num: 1, episodes: [{
          id: "series-2-s1e1", name: "O Caso Neon", stream_id: 2003, episode_num: 1, season: 1,
          added: "", container_extension: "mp4", custom_sid: "", direct_source: "", num: 1, stream_icon: "", 
          // Add missing 'air_date' property to match XtreamSerieEpisode type
          info: {plot: "Ep 1 plot", air_date: "2024-01-20"},
          url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
        }] },
      ],
    },
  ];

  // In a real scenario, you'd construct API URLs like:
  // const baseUrl = `${credentials.url}/player_api.php?username=${credentials.username}&password=${credentials.password}`;
  // const moviesUrl = `${baseUrl}&action=get_vod_streams&category_id=XXX`;
  // const seriesUrl = `${baseUrl}&action=get_series_streams`;

  // For this mock, we just return the data
  return {
    movies: mockMovies,
    series: mockSeries,
  };
}