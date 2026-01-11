
import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import ContentGrid from '../components/ContentGrid';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { XtreamMovie } from '../types';
import { View } from '../constants';

const MoviesView: React.FC = () => {
  const { xtreamMovies, isLoadingContent, contentError, setCurrentView } = useAppContext();

  // Group movies by genre (or category_id for Xtream)
  const moviesByCategory = useMemo(() => {
    const categories: { [key: string]: XtreamMovie[] } = {};
    xtreamMovies.forEach(movie => {
      const genre = movie.info.genere?.split('|')[0] || 'Uncategorized'; // Take first genre
      if (!categories[genre]) {
        categories[genre] = [];
      }
      categories[genre].push(movie);
    });
    return categories;
  }, [xtreamMovies]);

  const sortedCategories = useMemo(() => Object.keys(moviesByCategory).sort(), [moviesByCategory]);

  if (isLoadingContent) {
    return <LoadingSpinner />;
  }

  if (contentError) {
    return <p className="text-red-400 text-center mt-8">{contentError}</p>;
  }

  if (xtreamMovies.length === 0) {
    return (
      <p className="text-gray-400 text-center text-lg mt-8">
        Nenhum filme disponível. Por favor, configure suas credenciais Xtream Codes nas <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => setCurrentView(View.SETTINGS)}>Configurações</span>.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-black mb-6 text-blue-400 drop-shadow-lg">Filmes</h2>
      {sortedCategories.map(category => (
        <ContentGrid key={category} title={category}>
          {moviesByCategory[category].map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ContentGrid>
      ))}
    </div>
  );
};

export default MoviesView;
