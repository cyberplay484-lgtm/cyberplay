
import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import ContentGrid from '../components/ContentGrid';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { IptvChannel, XtreamMovie, XtreamSerie } from '../types';
import { View } from '../constants'; 

const FavoritesView: React.FC = () => {
  const { m3uChannels, xtreamMovies, xtreamSeries, favoritedContentIds, isLoadingContent, contentError, setSelectedChannel, setSelectedVodContent, setCurrentView } = useAppContext();

  const favoriteContent = useMemo(() => {
    const allAvailableContent: { [id: string]: IptvChannel | XtreamMovie | XtreamSerie } = {};
    m3uChannels.forEach(c => allAvailableContent[c.id] = c);
    xtreamMovies.forEach(m => allAvailableContent[m.id] = m);
    xtreamSeries.forEach(s => allAvailableContent[s.id] = s);

    const favorites: (IptvChannel | XtreamMovie | XtreamSerie)[] = [];
    favoritedContentIds.forEach(id => {
      if (allAvailableContent[id]) {
        favorites.push(allAvailableContent[id]);
      }
    });
    return favorites;
  }, [m3uChannels, xtreamMovies, xtreamSeries, favoritedContentIds]);

  const handleContentClick = (content: IptvChannel | XtreamMovie | XtreamSerie) => {
    if ('url' in content && 'groupTitle' in content) { // It's an IptvChannel
      setSelectedChannel(content as IptvChannel);
      setSelectedVodContent(null);
    } else { // It's XtreamMovie or XtreamSerie
      setSelectedVodContent(content as XtreamMovie | XtreamSerie);
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

  if (favoriteContent.length === 0) {
    return (
      <p className="text-gray-400 text-center text-lg mt-8">
        Nenhum conteúdo favorito adicionado ainda. Marque algo com a estrela para ver aqui!
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-black mb-6 text-blue-400 drop-shadow-lg">Meus Favoritos</h2>
      <ContentGrid>
        {favoriteContent.map(content => (
          <div key={content.id}> {/* Div to handle click for all card types */}
            {'groupTitle' in content ? ( // It's an IptvChannel (more reliable check)
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
                      src={(content as IptvChannel).logo || `https://picsum.photos/200/300?random=${content.id}`}
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
            ) : 'stream_type' in content && content.stream_type === 'movie' ? ( // It's an XtreamMovie
              <MovieCard movie={content as XtreamMovie} />
            ) : ( // It's an XtreamSerie
              <SeriesCard serie={content as XtreamSerie} />
            )}
          </div>
        ))}
      </ContentGrid>
    </div>
  );
};

export default FavoritesView;
