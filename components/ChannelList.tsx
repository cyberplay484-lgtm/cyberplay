
import React, { useState, useMemo, useCallback } from 'react';
import { IptvChannel, IptvCategory, PlaylistContent } from '../types';
import { useAppContext } from '../AppContext';
import LoadingSpinner from './LoadingSpinner';

interface ChannelListProps {
  channels: IptvChannel[];
  // onSelectChannel, onToggleFavorite, favoritedChannelIds, recentChannels
  // are now handled via context, so they are removed as props.
  // selectedChannel: IptvChannel | null;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels }) => {
  const {
    selectedChannel, setSelectedChannel,
    favoritedContentIds, toggleFavorite,
    recentContent, isLoadingContent, contentError,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const liveRecentChannels = useMemo(() => {
    // Filter recent content to only include IptvChannel types
    const recents = recentContent.filter((c): c is IptvChannel => 'url' in c);
    // Ensure these channels are still present in the currently loaded M3U channels
    return recents.filter(recent => channels.some(c => c.id === recent.id));
  }, [recentContent, channels]);


  const filteredChannels = useMemo(() => {
    let filtered = channels;

    if (activeCategory === 'Favorites') {
      // Filter live channels that are favorited
      filtered = channels.filter(channel => favoritedContentIds.has(channel.id));
    } else if (activeCategory === 'Recents') {
      filtered = liveRecentChannels;
    } else if (activeCategory !== 'All') {
      filtered = channels.filter(channel => channel.groupTitle === activeCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [channels, searchTerm, activeCategory, favoritedContentIds, liveRecentChannels]);

  const categorizedChannels = useMemo(() => {
    const categories: { [key: string]: IptvChannel[] } = {};
    channels.forEach(channel => {
      const group = channel.groupTitle || 'Other';
      if (!categories[group]) {
        categories[group] = [];
      }
      categories[group].push(channel);
    });

    const sortedGroupTitles = Object.keys(categories).sort();
    
    // Always include 'All', 'Favorites', 'Recents' first
    const specialCategories: IptvCategory[] = [
      { name: 'All', channels: channels },
      { name: 'Favorites', channels: channels.filter(c => favoritedContentIds.has(c.id)) },
      { name: 'Recents', channels: liveRecentChannels },
    ];

    const normalCategories: IptvCategory[] = sortedGroupTitles.map(categoryName => ({
      name: categoryName,
      channels: categories[categoryName],
    }));

    return [...specialCategories, ...normalCategories];
  }, [channels, favoritedContentIds, liveRecentChannels]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryClick = useCallback((categoryName: string) => {
    setActiveCategory(categoryName);
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent, channel: IptvChannel) => {
    e.stopPropagation(); // Prevent selecting the channel when clicking favorite
    toggleFavorite(channel);
  }, [toggleFavorite]);

  return (
    <div className="flex flex-col h-full p-4">
      {/* Search and Category moved inside to fit the tabbed view */}
      <input
        type="text"
        placeholder="Buscar canais..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary text-gray-100 placeholder-gray-400 transition-all duration-200"
        aria-label="Search channels"
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
        {categorizedChannels.map(category => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ease-in-out whitespace-nowrap
              ${activeCategory === category.name
                ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-500/30'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-blue-300'
              }`}
            aria-pressed={activeCategory === category.name}
            aria-label={`Show ${category.name} channels`}
          >
            {category.name} ({category.channels.length})
          </button>
        ))}
      </div>

      {isLoadingContent && channels.length === 0 ? (
        <LoadingSpinner />
      ) : contentError ? (
        <p className="text-red-400 text-center mt-8">{contentError}</p>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800" role="list">
          {filteredChannels.length === 0 && (
            <p className="text-gray-400 text-center mt-8">Nenhum canal encontrado.</p>
          )}
          {filteredChannels.map(channel => {
            const isFavorited = favoritedContentIds.has(channel.id);
            return (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                  ${selectedChannel?.id === channel.id
                    ? 'bg-gradient-to-r from-blue-700 to-emerald-600 shadow-md shadow-blue-500/30 border border-blue-500'
                    : 'bg-zinc-800 hover:bg-zinc-700 border border-transparent hover:border-blue-500/30'
                  }`}
                role="listitem"
                aria-current={selectedChannel?.id === channel.id ? 'true' : 'false'}
              >
                {channel.logo && (
                  <img
                    src={channel.logo}
                    alt={`${channel.name} logo`}
                    className="w-8 h-8 rounded-full mr-3 object-cover bg-zinc-700 flex-shrink-0 border border-zinc-600"
                    onError={(e) => { e.currentTarget.src = `https://picsum.photos/40/40?random=${channel.id}`; }} // Fallback image
                  />
                )}
                {!channel.logo && (
                  <div className="w-8 h-8 rounded-full mr-3 bg-zinc-700 flex items-center justify-center text-xs font-semibold text-gray-300 flex-shrink-0 border border-zinc-600" aria-hidden="true">
                    {channel.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col overflow-hidden flex-grow">
                  <p className="text-gray-100 font-medium truncate" title={channel.name}>{channel.name}</p>
                  <p className="text-gray-400 text-xs truncate" title={channel.groupTitle}>{channel.groupTitle}</p>
                </div>
                
                <button
                  onClick={(e) => handleFavoriteClick(e, channel)}
                  className="ml-auto p-1 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-glow-primary transition-all duration-200"
                  aria-label={isFavorited ? `Unfavorite ${channel.name}` : `Favorite ${channel.name}`}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChannelList;