
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlayerStatus, XtreamMovie, XtreamSerie } from '../types';
import { useAppContext } from '../AppContext';

const VideoPlayer: React.FC = () => {
  const { m3uChannels, selectedChannel, setSelectedChannel, selectedVodContent, addRecentContent } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(PlayerStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState('00:00');
  const [currentTime, setCurrentTime] = useState('00:00');
  const [showChannelSwitchOsd, setShowChannelSwitchOsd] = useState(false);
  const channelSwitchOsdTimeoutRef = useRef<number | null>(null);


  const currentContent = selectedChannel || selectedVodContent;
  const isLive = !!selectedChannel;
  const videoUrl = selectedChannel?.url || (selectedVodContent as XtreamMovie)?.url || (selectedVodContent as XtreamSerie)?.seasons?.[0]?.episodes?.[0]?.url;
  const contentName = currentContent?.name || 'Nenhum conteúdo selecionado';
  
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return hours > 0 ? `${hours}:${formattedMinutes}:${formattedSeconds}` : `${formattedMinutes}:${formattedSeconds}`;
  };

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(e => console.error("Play error:", e));
      } else {
        video.pause();
      }
    }
  }, []);
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
    if (newVolume > 0) setIsMuted(false);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };
  
  const toggleFullScreen = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
      } else {
        document.exitFullscreen();
      }
    }
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLive) return; // Disable seek for live channels
    const progressBar = e.currentTarget;
    const video = videoRef.current;
    if (progressBar && video) {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    }
  };

  const handleChannelSwitch = useCallback((direction: 'next' | 'prev') => {
    if (!isLive || m3uChannels.length === 0) return;
  
    const currentIndex = m3uChannels.findIndex(c => c.id === selectedChannel.id);
    if (currentIndex === -1) return;
  
    let nextIndex = direction === 'next' 
      ? (currentIndex + 1) % m3uChannels.length
      : (currentIndex - 1 + m3uChannels.length) % m3uChannels.length;
      
    const nextChannel = m3uChannels[nextIndex];
    setSelectedChannel(nextChannel);

    // Show OSD
    setShowChannelSwitchOsd(true);
    if(channelSwitchOsdTimeoutRef.current) clearTimeout(channelSwitchOsdTimeoutRef.current);
    channelSwitchOsdTimeoutRef.current = window.setTimeout(() => {
      setShowChannelSwitchOsd(false);
    }, 2000);
  }, [isLive, m3uChannels, selectedChannel, setSelectedChannel]);

  // Keyboard controls effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleChannelSwitch('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleChannelSwitch('prev');
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleChannelSwitch, togglePlayPause]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
        setCurrentTime(formatTime(video.currentTime));
      }
    };
    const onLoadedMetadata = () => {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    if (videoUrl) {
      setPlayerStatus(PlayerStatus.LOADING);
      setErrorMessage(null);
      video.src = videoUrl;
      video.load();
      video.play().then(() => {
          if (currentContent) addRecentContent(currentContent);
      }).catch(e => {
          console.warn("Autoplay was prevented.", e);
          setPlayerStatus(PlayerStatus.IDLE);
      });
    }

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [videoUrl, currentContent, addRecentContent]);


  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl group border border-zinc-700"
      onMouseMove={showControls}
      onMouseLeave={() => { if(controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current); setControlsVisible(false); }}
    >
      <video ref={videoRef} className="w-full h-full object-contain bg-black" onClick={togglePlayPause} />

      {/* Channel Switch OSD */}
      <div className={`absolute top-4 left-4 bg-black/70 p-3 rounded-lg text-white transition-opacity duration-300 ${showChannelSwitchOsd ? 'opacity-100' : 'opacity-0'}`}>
        <p className="font-bold text-lg">{contentName}</p>
      </div>
      
      {/* Player Status Overlay */}
      {(playerStatus === PlayerStatus.LOADING || errorMessage) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white p-4" role="alert" aria-live="assertive">
            {playerStatus === PlayerStatus.LOADING && (
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" aria-label="Loading video"></div>
            )}
            {errorMessage ? (
              <p className="text-red-400 text-lg text-center font-medium">{errorMessage}</p>
            ) : (
              <p className="text-lg text-center font-medium">Carregando <span className="font-semibold text-blue-300">{contentName}</span>...</p>
            )}
          </div>
      )}
      
      {!videoUrl && (
        <div className="flex items-center justify-center w-full h-full bg-neutral-900 text-gray-400 text-2xl font-semibold p-4 text-center">
          Selecione um canal ou conteúdo para assistir.
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 bg-gradient-to-t from-black/70 via-transparent to-black/30 ${controlsVisible && videoUrl ? 'opacity-100' : 'opacity-0'}`}>
        <div>{/* Top space */}</div>
        <div className="flex-grow flex items-center justify-center">
          {/* Central Play Button (optional, can be redundant) */}
        </div>
        <div className="p-4">
          {/* Progress Bar */}
          <div className={`relative w-full h-2 rounded-full mb-3 group ${isLive ? 'bg-zinc-700' : 'bg-zinc-600 cursor-pointer'}`} onClick={handleSeek}>
            <div className="absolute h-full bg-zinc-400 rounded-full" style={{ width: '0%' }}></div> {/* Loaded percentage, not implemented */}
            <div className="absolute h-full bg-blue-500 rounded-full" style={{ width: `${progress * 100}%` }}></div>
            <div className="absolute h-4 w-4 bg-white rounded-full -mt-1 transform transition-transform duration-100 group-hover:scale-125" style={{ left: `${progress * 100}%` }}></div>
          </div>
          
          {/* Bottom Controls */}
          <div className="flex items-center text-white gap-4">
            <button onClick={togglePlayPause} className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
              {isPlaying ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm5 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" /></svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              }
            </button>
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                {isMuted || volume === 0 ? 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.383-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5.072.566A1 1 0 016 1v18a1 1 0 01-1.447.894L.447 13.894A1 1 0 010 13V7a1 1 0 01.447-.894L4.553.106A1 1 0 015.072.566zM10 5a1 1 0 110-2h1a1 1 0 110 2h-1zm3 0a1 1 0 110-2h1a1 1 0 110 2h-1z" /></svg>
                }
              </button>
              <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-24 h-1 accent-blue-500" />
            </div>
            {!isLive && <div className="text-sm">{currentTime} / {duration}</div>}
            {isLive && <div className="text-sm font-semibold text-red-500 bg-red-900/50 px-2 py-0.5 rounded">LIVE</div>}
            <div className="flex-grow"></div> {/* Spacer */}
            <div className="relative group/quality">
              <button className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-1.57 1.996A1.532 1.532 0 013 8.249c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.948 2.286c-.836 1.372.734 2.942 1.996 1.57A1.532 1.532 0 018.249 17c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734 1.57-1.996A1.532 1.532 0 0117 11.751c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.948-2.286c.836-1.372-.734-2.942-1.996-1.57A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
              </button>
              <div className="absolute bottom-full right-0 mb-2 bg-neutral-800 rounded-lg shadow-lg hidden group-hover/quality:block w-32">
                <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-blue-600 rounded-t-lg">Automático</a>
                <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-blue-600">1080p</a>
                <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-blue-600">720p</a>
                <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-blue-600 rounded-b-lg">480p</a>
              </div>
            </div>
            <button onClick={toggleFullScreen} className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0 0h-4m0-4l-5 5M4 16v4m0 0h4m0 0l5-5m11 5v-4m0 0h-4m0 4l-5-5" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;