
import React, { useEffect, useCallback, useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import HomeView from './views/HomeView';
import LiveChannelsView from './views/LiveChannelsView';
import MoviesView from './views/MoviesView';
import SeriesView from './views/SeriesView';
import FavoritesView from './views/FavoritesView';
import SettingsView from './views/SettingsView';
import { View, LOCAL_STORAGE_M3U_KEY, LOCAL_STORAGE_XTREAM_CREDENTIALS_KEY } from './constants';
import { localStorageService } from './services/localStorageService';
import { fetchAndParseM3U, fetchXtreamData } from './services/iptvService';
import SplashScreen from './components/SplashScreen'; // Import the new SplashScreen

// Main App component that renders based on the global context
const AppContent: React.FC = () => {
  const {
    currentView,
    m3uChannels, setM3uChannels, setSelectedChannel,
    xtreamCredentials, setXtreamMovies, setXtreamSeries,
    setIsLoadingContent, setContentError,
  } = useAppContext();

  // Load M3U playlist on initial mount if URL is saved
  useEffect(() => {
    const savedM3uUrl = localStorageService.getItem<string>(LOCAL_STORAGE_M3U_KEY);
    if (savedM3uUrl) {
      handleInitialM3ULoad(savedM3uUrl);
    }
  }, []); // Run once on mount

  // Load Xtream Codes data on initial mount if credentials are saved
  useEffect(() => {
    if (xtreamCredentials && xtreamCredentials.url && xtreamCredentials.username && xtreamCredentials.password) {
      handleInitialXtreamLoad(xtreamCredentials);
    }
  }, [xtreamCredentials]); // Rerun if xtreamCredentials change (e.g., loaded from local storage)


  const handleInitialM3ULoad = useCallback(async (url: string) => {
    setIsLoadingContent(true);
    setContentError(null);
    try {
      const fetchedChannels = await fetchAndParseM3U(url);
      setM3uChannels(fetchedChannels);
      if (fetchedChannels.length > 0) {
        setSelectedChannel(fetchedChannels[0]);
      }
    } catch (error) {
      console.error("Failed to auto-load M3U playlist:", error);
      setContentError(`Falha ao carregar lista M3U salva: ${(error as Error).message}.`);
      localStorageService.removeItem(LOCAL_STORAGE_M3U_KEY); // Clear invalid URL
    } finally {
      setIsLoadingContent(false);
    }
  }, [setM3uChannels, setSelectedChannel, setIsLoadingContent, setContentError]);

  const handleInitialXtreamLoad = useCallback(async (credentials) => {
    setIsLoadingContent(true);
    setContentError(null);
    try {
      const { movies, series } = await fetchXtreamData(credentials);
      setXtreamMovies(movies);
      setXtreamSeries(series);
    } catch (error) {
      console.error("Failed to auto-load Xtream Codes data:", error);
      setContentError(`Falha ao carregar dados Xtream Codes salvos: ${(error as Error).message}.`);
      localStorageService.removeItem(LOCAL_STORAGE_XTREAM_CREDENTIALS_KEY); // FIX: Clear invalid credentials
    } finally {
      setIsLoadingContent(false);
    }
  }, [setXtreamMovies, setXtreamSeries, setIsLoadingContent, setContentError]);


  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <HomeView />;
      case View.LIVE_CHANNELS:
        return <LiveChannelsView />;
      case View.MOVIES:
        return <MoviesView />;
      case View.SERIES:
        return <SeriesView />;
      case View.FAVORITES:
        return <FavoritesView />;
      case View.SETTINGS:
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto pb-20 md:pb-4"> {/* Added pb-20 for mobile bottom nav */}
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const handleSplashScreenEnd = useCallback(() => {
    setShowSplashScreen(false);
  }, []);

  return (
    <AppProvider>
      {showSplashScreen ? (
        <SplashScreen onAnimationEnd={handleSplashScreenEnd} />
      ) : (
        <AppContent />
      )}
    </AppProvider>
  );
};

export default App;
