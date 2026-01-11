
import React from 'react';
import ChannelList from '../components/ChannelList';
import VideoPlayer from '../components/VideoPlayer';
import AIAssistant from '../components/AIAssistant';
import { useAppContext } from '../AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { View } from '../constants';
import TabbedSidebar from '../components/TabbedSidebar'; // Import the new component
import { IptvChannel } from '../types';

const ContentInfo: React.FC = () => {
  const { selectedChannel, selectedVodContent } = useAppContext();
  const content = selectedChannel || selectedVodContent;

  if (!content) return null;

  const isChannel = 'groupTitle' in content;

  return (
    <div className="mt-4 p-4 bg-neutral-900 rounded-xl border border-zinc-800">
      <h3 className="text-xl font-bold text-blue-400 truncate">{content.name}</h3>
      <p className="text-sm text-gray-400 mt-1">
        {isChannel ? (content as IptvChannel).groupTitle : (content as any).info?.genere?.split('|')[0] || (content as any).genre?.split('|')[0] || 'VOD Content'}
      </p>
      <p className="text-sm text-gray-300 mt-2 line-clamp-3">
        {(content as any).info?.plot || (content as any).plot || 'No description available.'}
      </p>
    </div>
  );
};

const LiveChannelsView: React.FC = () => {
  const { 
    m3uChannels,
    isLoadingContent, 
    contentError,
    setCurrentView
  } = useAppContext();
  
  const hasContent = m3uChannels.length > 0;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-black mb-6 text-blue-400 drop-shadow-lg">Player</h2>
      
      {isLoadingContent && !hasContent ? (
        <LoadingSpinner />
      ) : !hasContent ? (
        <div className="text-center mt-8">
            <p className="text-gray-400 text-lg">
            Nenhum conteúdo carregado.
            </p>
            <button 
                onClick={() => setCurrentView(View.SETTINGS)}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
            >
                Ir para Configurações
            </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Main Content Area */}
          <div className="flex-1 lg:w-2/3">
            <VideoPlayer />
            <ContentInfo />
          </div>

          {/* Sidebar Area with Tabs */}
          <div className="lg:w-1/3 xl:w-1/4">
            <TabbedSidebar tabLabels={['Canais', 'Assistente IA']}>
              <ChannelList channels={m3uChannels} />
              <AIAssistant />
            </TabbedSidebar>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChannelsView;