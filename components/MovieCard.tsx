
import React from 'react';
import { XtreamMovie } from '../types';
import { useAppContext } from '../AppContext';
import { View } from '../constants';

interface MovieCardProps {
  movie: XtreamMovie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { setSelectedVodContent, setCurrentView, toggleFavorite, favoritedContentIds } = useAppContext();
  const isFavorited = favoritedContentIds.has(movie.id);

  const handleSelectMovie = () => {
    setSelectedVodContent(movie);
    setCurrentView(View.LIVE_CHANNELS);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div
      className="relative group cursor-pointer bg-neutral-900 rounded-xl overflow-hidden transition-all duration-300 ease-in-out border border-zinc-800 hover:border-transparent"
      role="button"
      tabIndex={0}
      aria-label={`Play movie: ${movie.name}`}
      onClick={handleSelectMovie}
    >
      {/* Animated Neon Border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
      
      <div className="relative">
        <div className="relative w-full h-48">
          <img
            src={movie.info.movie_image || movie.stream_icon || `https://picsum.photos/200/300?random=${movie.id}`}
            alt={movie.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = `https://picsum.photos/200/300?random=${movie.id}`; }}
          />
          {/* Gradient Overlay and Play Icon */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse group-hover:animate-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h4 className="text-base font-bold text-gray-100 truncate" title={movie.name}>{movie.name}</h4>
          <p className="text-sm text-gray-400 mt-1">{movie.info.genere?.split('|')[0]}</p>
        </div>

        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 transition-all duration-200"
          aria-label={isFavorited ? `Unfavorite ${movie.name}` : `Favorite ${movie.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isFavorited ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
