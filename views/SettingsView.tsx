
import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { fetchAndParseM3U, fetchXtreamData } from '../services/iptvService';
import { LOCAL_STORAGE_M3U_KEY } from '../constants';
import { localStorageService } from '../services/localStorageService';
import LoadingSpinner from '../components/LoadingSpinner';

const SettingsView: React.FC = () => {
  const { 
    setM3uChannels, setSelectedChannel,
    xtreamCredentials, setXtreamCredentials, setXtreamMovies, setXtreamSeries,
    isLoadingContent, setIsLoadingContent, contentError, setContentError,
  } = useAppContext();

  const [m3uUrl, setM3uUrl] = useState<string>(() => localStorageService.getItem<string>(LOCAL_STORAGE_M3U_KEY) || '');
  const [xtreamUrl, setXtreamUrl] = useState<string>(xtreamCredentials?.url || '');
  const [xtreamUsername, setXtreamUsername] = useState<string>(xtreamCredentials?.username || '');
  const [xtreamPassword, setXtreamPassword] = useState<string>(xtreamCredentials?.password || '');
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Clear success message after a few seconds
    if (settingsSuccessMessage) {
      const timer = setTimeout(() => setSettingsSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [settingsSuccessMessage]);

  const handleLoadM3U = useCallback(async (url: string) => {
    setIsLoadingContent(true);
    setContentError(null);
    setSettingsSuccessMessage(null);
    setM3uChannels([]);
    setSelectedChannel(null); // Clear selected channel when loading new playlist
    try {
      const fetchedChannels = await fetchAndParseM3U(url);
      setM3uChannels(fetchedChannels);
      if (fetchedChannels.length > 0) {
        setSelectedChannel(fetchedChannels[0]); // Select first channel by default
      }
      localStorageService.saveItem(LOCAL_STORAGE_M3U_KEY, url);
      setSettingsSuccessMessage("Lista M3U carregada com sucesso!");
    } catch (error) {
      console.error("Failed to load M3U playlist:", error);
      setContentError(`Falha ao carregar lista M3U: ${(error as Error).message}. Verifique a URL e tente novamente.`);
      localStorageService.removeItem(LOCAL_STORAGE_M3U_KEY);
    } finally {
      setIsLoadingContent(false);
    }
  }, [setM3uChannels, setSelectedChannel, setIsLoadingContent, setContentError]);

  const handleClearM3uUrl = useCallback(() => {
    setM3uUrl('');
    localStorageService.removeItem(LOCAL_STORAGE_M3U_KEY);
    setM3uChannels([]); // Clear channels
    setSelectedChannel(null);
    setContentError(null);
    setSettingsSuccessMessage("URL M3U limpa.");
  }, [setM3uChannels, setSelectedChannel, setContentError]);

  const handleLoadXtream = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xtreamUrl.trim() || !xtreamUsername.trim() || !xtreamPassword.trim()) {
      setContentError("Por favor, preencha todos os campos do Xtream Codes.");
      return;
    }

    setIsLoadingContent(true);
    setContentError(null);
    setSettingsSuccessMessage(null);
    setXtreamMovies([]);
    setXtreamSeries([]);

    const newCredentials = {
      url: xtreamUrl.trim(),
      username: xtreamUsername.trim(),
      password: xtreamPassword.trim(),
    };

    try {
      const { movies, series } = await fetchXtreamData(newCredentials);
      setXtreamMovies(movies);
      setXtreamSeries(series);
      setXtreamCredentials(newCredentials); // Save credentials to context and local storage
      setSettingsSuccessMessage("Xtream Codes carregado com sucesso!");
    } catch (error) {
      console.error("Failed to load Xtream Codes data:", error);
      setContentError(`Falha ao carregar Xtream Codes: ${(error as Error).message}. Verifique as credenciais.`);
      setXtreamCredentials(null); // Clear credentials on failure
    } finally {
      setIsLoadingContent(false);
    }
  }, [xtreamUrl, xtreamUsername, xtreamPassword, setXtreamMovies, setXtreamSeries, setXtreamCredentials, setIsLoadingContent, setContentError]);

  const handleClearXtream = useCallback(() => {
    setXtreamUrl('');
    setXtreamUsername('');
    setXtreamPassword('');
    setXtreamCredentials(null);
    setXtreamMovies([]);
    setXtreamSeries([]);
    setContentError(null);
    setSettingsSuccessMessage("Credenciais Xtream Codes limpas.");
  }, [setXtreamCredentials, setXtreamMovies, setXtreamSeries, setContentError]);


  return (
    <div className="p-4">
      <h2 className="text-3xl font-black mb-6 text-blue-400 drop-shadow-lg">Configurações</h2>

      {isLoadingContent && <LoadingSpinner />}
      {contentError && (
        <p className="mt-3 p-3 bg-red-900/50 text-red-100 rounded-lg text-sm mb-4 border border-red-600" role="alert">{contentError}</p>
      )}
      {settingsSuccessMessage && (
        <p className="mt-3 p-3 bg-emerald-900/50 text-emerald-100 rounded-lg text-sm mb-4 border border-emerald-600 animate-fade-in-out" role="status">{settingsSuccessMessage}</p>
      )}

      {/* M3U Playlist Input */}
      <div className="bg-neutral-900 p-6 rounded-xl shadow-lg mb-8 border border-zinc-700">
        <h3 className="text-xl font-bold mb-4 text-gray-100">Lista M3U</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleLoadM3U(m3uUrl); }} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="url"
              value={m3uUrl}
              onChange={(e) => setM3uUrl(e.target.value)}
              placeholder="URL da Lista M3U"
              className="w-full p-3 pr-10 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary text-gray-100 placeholder-gray-400 transition-all duration-200"
              disabled={isLoadingContent}
              aria-label="URL da Lista M3U"
            />
            {m3uUrl && !isLoadingContent && (
              <button
                type="button"
                onClick={handleClearM3uUrl}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors duration-200"
                aria-label="Limpar URL M3U"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            disabled={isLoadingContent}
            aria-live="polite"
          >
            Carregar M3U
          </button>
        </form>
      </div>

      {/* Xtream Codes API Input */}
      <div className="bg-neutral-900 p-6 rounded-xl shadow-lg border border-zinc-700">
        <h3 className="text-xl font-bold mb-4 text-gray-100">Xtream Codes API</h3>
        <form onSubmit={handleLoadXtream} className="flex flex-col gap-4">
          <input
            type="url"
            value={xtreamUrl}
            onChange={(e) => setXtreamUrl(e.target.value)}
            placeholder="URL do Servidor (ex: http://domain.com:port)"
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary text-gray-100 placeholder-gray-400 transition-all duration-200"
            disabled={isLoadingContent}
            aria-label="URL do Servidor Xtream Codes"
          />
          <input
            type="text"
            value={xtreamUsername}
            onChange={(e) => setXtreamUsername(e.target.value)}
            placeholder="Nome de Usuário"
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary text-gray-100 placeholder-gray-400 transition-all duration-200"
            disabled={isLoadingContent}
            aria-label="Nome de Usuário Xtream Codes"
          />
          <input
            type="password"
            value={xtreamPassword}
            onChange={(e) => setXtreamPassword(e.target.value)}
            placeholder="Senha"
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary text-gray-100 placeholder-gray-400 transition-all duration-200"
            disabled={isLoadingContent}
            aria-label="Senha Xtream Codes"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-grow px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
              disabled={isLoadingContent}
              aria-live="polite"
            >
              Carregar Xtream Codes
            </button>
            <button
              type="button"
              onClick={handleClearXtream}
              className="flex-grow px-6 py-3 bg-zinc-600 hover:bg-zinc-700 active:bg-zinc-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-zinc-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black"
              disabled={isLoadingContent}
              aria-label="Limpar credenciais Xtream Codes"
            >
              Limpar Credenciais
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;