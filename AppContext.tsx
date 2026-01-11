
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { IptvChannel, XtreamMovie, XtreamSerie, XtreamCredentials, PlaylistContent } from './types';
import { View, LOCAL_STORAGE_FAVORITES_KEY, LOCAL_STORAGE_RECENTS_KEY, MAX_RECENT_CHANNELS, LOCAL_STORAGE_XTREAM_CREDENTIALS_KEY } from './constants';
import { localStorageService } from './services/localStorageService';

interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  
  // M3U Channels
  m3uChannels: IptvChannel[];
  setM3uChannels: (channels: IptvChannel[]) => void;
  selectedChannel: IptvChannel | null;
  setSelectedChannel: (channel: IptvChannel | null) => void;

  // Xtream Codes
  xtreamCredentials: XtreamCredentials | null;
  setXtreamCredentials: (credentials: XtreamCredentials | null) => void;
  xtreamMovies: XtreamMovie[];
  setXtreamMovies: (movies: XtreamMovie[]) => void;
  xtreamSeries: XtreamSerie[];
  setXtreamSeries: (series: XtreamSerie[]) => void;
  selectedVodContent: XtreamMovie | XtreamSerie | null;
  setSelectedVodContent: (content: XtreamMovie | XtreamSerie | null) => void;

  // Favorites
  favoritedContentIds: Set<string>;
  toggleFavorite: (content: PlaylistContent) => void;

  // Recents
  recentContent: PlaylistContent[];
  addRecentContent: (content: PlaylistContent) => void;

  // Loading/Errors
  isLoadingContent: boolean;
  setIsLoadingContent: (isLoading: boolean) => void;
  contentError: string | null;
  setContentError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  
  // M3U State
  const [m3uChannels, setM3uChannels] = useState<IptvChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<IptvChannel | null>(null);

  // Xtream Codes State
  const [xtreamCredentials, setXtreamCredentials] = useState<XtreamCredentials | null>(() => 
    localStorageService.getItem<XtreamCredentials>(LOCAL_STORAGE_XTREAM_CREDENTIALS_KEY)
  );
  const [xtreamMovies, setXtreamMovies] = useState<XtreamMovie[]>([]);
  const [xtreamSeries, setXtreamSeries] = useState<XtreamSerie[]>([]);
  const [selectedVodContent, setSelectedVodContent] = useState<XtreamMovie | XtreamSerie | null>(null);

  // Favorites State
  const [favoritedContentIds, setFavoritedContentIds] = useState<Set<string>>(() => {
    const savedFavorites = localStorageService.getItem<string[]>(LOCAL_STORAGE_FAVORITES_KEY);
    return new Set(savedFavorites || []);
  });

  // Recents State
  const [recentContent, setRecentContent] = useState<PlaylistContent[]>(() => {
    const savedRecents = localStorageService.getItem<PlaylistContent[]>(LOCAL_STORAGE_RECENTS_KEY);
    return savedRecents || [];
  });

  // Global Loading & Error State
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [contentError, setContentError] = useState<string | null>(null);


  // Effects for persisting state to local storage
  useEffect(() => {
    localStorageService.saveItem(LOCAL_STORAGE_FAVORITES_KEY, Array.from(favoritedContentIds));
  }, [favoritedContentIds]);

  useEffect(() => {
    localStorageService.saveItem(LOCAL_STORAGE_RECENTS_KEY, recentContent);
  }, [recentContent]);

  useEffect(() => {
    localStorageService.saveItem(LOCAL_STORAGE_XTREAM_CREDENTIALS_KEY, xtreamCredentials);
  }, [xtreamCredentials]);


  // Actions
  const toggleFavorite = useCallback((content: PlaylistContent) => {
    setFavoritedContentIds(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(content.id)) {
        newFavorites.delete(content.id);
      } else {
        newFavorites.add(content.id);
      }
      return newFavorites;
    });
  }, []);

  const addRecentContent = useCallback((content: PlaylistContent) => {
    setRecentContent(prevRecents => {
      // Remove if already in recents to move it to the top
      const filtered = prevRecents.filter(c => c.id !== content.id);
      // Add to the beginning, and limit the array size
      return [content, ...filtered].slice(0, MAX_RECENT_CHANNELS);
    });
  }, []);


  const value = {
    currentView,
    setCurrentView,
    m3uChannels,
    setM3uChannels,
    selectedChannel,
    setSelectedChannel,
    xtreamCredentials,
    setXtreamCredentials,
    xtreamMovies,
    setXtreamMovies,
    xtreamSeries,
    setXtreamSeries,
    selectedVodContent,
    setSelectedVodContent,
    favoritedContentIds,
    toggleFavorite,
    recentContent,
    addRecentContent,
    isLoadingContent,
    setIsLoadingContent,
    contentError,
    setContentError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};