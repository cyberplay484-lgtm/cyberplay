
import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import ContentGrid from '../components/ContentGrid';
import SeriesCard from '../components/SeriesCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { XtreamSerie } from '../types';
import { View } from '../constants';

const SeriesView: React.FC = () => {
  const { xtreamSeries, isLoadingContent, contentError, setCurrentView } = useAppContext();

  // Group series by genre
  const seriesByCategory = useMemo(() => {
    const categories: { [key: string]: XtreamSerie[] } = {};
    xtreamSeries.forEach(serie => {
      const genre = serie.genre?.split('|')[0] || 'Uncategorized'; // Take first genre
      if (!categories[genre]) {
        categories[genre] = [];
      }
      categories[genre].push(serie);
    });
    return categories;
  }, [xtreamSeries]);

  const sortedCategories = useMemo(() => Object.keys(seriesByCategory).sort(), [seriesByCategory]);

  if (isLoadingContent) {
    return <LoadingSpinner />;
  }

  if (contentError) {
    return <p className="text-red-400 text-center mt-8">{contentError}</p>;
  }

  if (xtreamSeries.length === 0) {
    return (
      <p className="text-gray-400 text-center text-lg mt-8">
        Nenhuma série disponível. Por favor, configure suas credenciais Xtream Codes nas <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => setCurrentView(View.SETTINGS)}>Configurações</span>.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-black mb-6 text-blue-400 drop-shadow-lg">Séries</h2>
      {sortedCategories.map(category => (
        <ContentGrid key={category} title={category}>
          {seriesByCategory[category].map(serie => (
            <SeriesCard key={serie.id} serie={serie} />
          ))}
        </ContentGrid>
      ))}
    </div>
  );
};

export default SeriesView;
