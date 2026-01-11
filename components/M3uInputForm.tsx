
import React, { useState, useCallback, useEffect } from 'react';
import { DEFAULT_M3U_URL, LOCAL_STORAGE_M3U_KEY } from '../constants';
import { localStorageService } from '../services/localStorageService';
import { useAppContext } from '../AppContext';

interface M3uInputFormProps {
  onLoadM3U: (url: string) => Promise<void>;
  // isLoading e error agora vêm do contexto, não precisam ser props aqui
  // isLoading: boolean;
  // error: string | null;
}

const M3uInputForm: React.FC<M3uInputFormProps> = ({ onLoadM3U }) => {
  const { isLoadingContent, contentError, setIsLoadingContent, setContentError } = useAppContext();
  const [m3uUrl, setM3uUrl] = useState<string>(() => localStorageService.getItem<string>(LOCAL_STORAGE_M3U_KEY) || DEFAULT_M3U_URL);

  useEffect(() => {
    // Attempt to auto-load the saved URL on initial mount if it exists
    if (m3uUrl && m3uUrl !== DEFAULT_M3U_URL) {
      onLoadM3U(m3uUrl);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (m3uUrl.trim()) {
      setIsLoadingContent(true);
      setContentError(null);
      try {
        await onLoadM3U(m3uUrl.trim());
        localStorageService.saveItem(LOCAL_STORAGE_M3U_KEY, m3uUrl.trim());
      } catch (err) {
        setContentError(`Failed to load playlist: ${(err as Error).message}. Please check the URL and try again.`);
        localStorageService.removeItem(LOCAL_STORAGE_M3U_KEY); // Clear on failure
      } finally {
        setIsLoadingContent(false);
      }
    }
  }, [m3uUrl, onLoadM3U, setIsLoadingContent, setContentError]);

  const handleClearUrl = useCallback(() => {
    setM3uUrl('');
    localStorageService.removeItem(LOCAL_STORAGE_M3U_KEY);
    // Also clear associated channels/error if present
    setContentError(null);
  }, [setContentError]);

  return (
    <div className="bg-neutral-900 p-4 rounded-xl shadow-lg mb-6 md:mb-8 border border-zinc-800">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="url"
            value={m3uUrl}
            onChange={(e) => setM3uUrl(e.target.value)}
            placeholder="Enter M3U Playlist URL (e.g., http://example.com/playlist.m3u)"
            className="w-full p-3 pr-10 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary text-gray-100 placeholder-gray-400 transition-all duration-200"
            disabled={isLoadingContent}
            aria-label="M3U Playlist URL Input"
          />
          {m3uUrl && !isLoadingContent && (
            <button
              type="button"
              onClick={handleClearUrl}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors duration-200"
              aria-label="Clear URL Input"
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
          {isLoadingContent ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          ) : (
            'Load Playlist'
          )}
        </button>
      </form>
      {contentError && (
        <p className="mt-3 text-red-400 text-sm" role="alert">{contentError}</p>
      )}
    </div>
  );
};

export default M3uInputForm;