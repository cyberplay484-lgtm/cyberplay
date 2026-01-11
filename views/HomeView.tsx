import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import ContentGrid from '../components/ContentGrid';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { View } from '../constants'; 
import { CYBER_PLAY_LOGO_BASE64, LOGO_IMG_ALT } from '../assets/logo';

const HomeView: React.FC = () => {
  const { m3uChannels, xtreamMovies, xtreamSeries, isLoadingContent, contentError, setSelectedChannel, setSelectedVodContent, setCurrentView } = useAppContext();

  // Combine and shuffle some content for a dynamic home screen
  const featuredContent = useMemo(() => {
    const allContent = [
      ...m3uChannels.slice(0, 5).map(c => ({...c, type: 'channel'})), // Take first 5 channels
      ...xtreamMovies.slice(0, 5).map(m => ({...m, type: 'movie'})),  // Take first 5 movies
      ...xtreamSeries.slice(0, 5).map(s => ({...s, type: 'series'})), // Take first 5 series
    ];
    // Simple shuffle for variety
    return allContent.sort(() => 0.5 - Math.random());
  }, [m3uChannels, xtreamMovies, xtreamSeries]);

  const handleContentClick = (content: any) => {
    if (content.type === 'channel') {
      setSelectedChannel(content);
      setSelectedVodContent(null);
    } else {
      setSelectedVodContent(content);
      setSelectedChannel(null);
    }
    setCurrentView(View.LIVE_CHANNELS); // Navigate to the player view
  };

  if (isLoadingContent) {
    return <LoadingSpinner />;
  }

  if (contentError) {
    return <p className="text-red-400 text-center text-lg mt-8">{contentError}</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-center mb-8">
        <img 
          src={CYBER_PLAY_LOGO_BASE64} 
          alt={LOGO_IMG_ALT} 
          className="w-64 md:w-80 h-auto"
        />
      </div>

      <h2 className="text-3xl font-black mb-6 text-blue-400 drop-shadow-lg">Destaques</h2>
      
      {featuredContent.length === 0 && (
        <p className="text-gray-400 text-center text-lg mt-8">
          Nenhum conteúdo disponível. Por favor, adicione uma lista M3U ou credenciais Xtream Codes nas <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => setCurrentView(View.SETTINGS)}>Configurações</span>.
        </p>
      )}

      {featuredContent.length > 0 && (
        <ContentGrid>
          {featuredContent.map((content: any) => (
            <div key={content.id}> {/* Div to handle click for all card types */}
              {content.type === 'movie' ? (
                <MovieCard movie={content} />
              ) : content.type === 'series' ? (
                <SeriesCard serie={content} />
              ) : (
                <div
                  className="relative group cursor-pointer bg-neutral-900 rounded-xl overflow-hidden transition-all duration-300 ease-in-out border border-zinc-800 hover:border-transparent"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play channel: ${content.name}`}
                  onClick={() => handleContentClick(content)}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                  <div className="relative">
                    <div className="relative w-full h-48">
                      <img
                        src={content.logo || `https://picsum.photos/200/300?random=${content.id}`}
                        alt={content.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/200/300?random=${content.id}`; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse group-hover:animate-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-base font-bold text-gray-100 truncate" title={content.name}>{content.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">Canal ao Vivo</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </ContentGrid>
      )}
    </div>
  );
};

export default HomeView;
