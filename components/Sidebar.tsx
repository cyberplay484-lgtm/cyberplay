import React from 'react';
import { useAppContext } from '../AppContext';
import { View } from '../constants';
import { CYBER_PLAY_LOGO_BASE64, LOGO_IMG_ALT } from '../assets/logo';

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext();

  const navItems = [
    { id: View.HOME, label: 'Início', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: View.LIVE_CHANNELS, label: 'Canais ao Vivo', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )},
    { id: View.MOVIES, label: 'Filmes', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    )},
    { id: View.SERIES, label: 'Séries', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )},
    { id: View.FAVORITES, label: 'Favoritos', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    )},
    { id: View.SETTINGS, label: 'Configurações', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  return (
    <aside className="bg-neutral-900/50 backdrop-blur-sm text-gray-100 w-full md:w-64 flex flex-col p-4 md:h-screen fixed md:static bottom-0 left-0 right-0 z-50 md:z-auto border-t md:border-t-0 md:border-r border-zinc-800">
      <div className="hidden md:flex items-center mb-6 mt-2 justify-center">
        <button onClick={() => setCurrentView(View.HOME)} className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg" aria-label="Go to Home">
          <img 
            src={CYBER_PLAY_LOGO_BASE64} 
            alt={LOGO_IMG_ALT + " - Home"} 
            className="w-48 h-auto"
          />
        </button>
      </div>
      <nav className="flex md:flex-col justify-around md:justify-start flex-grow">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`relative flex items-center p-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ease-in-out group
              ${currentView === item.id
                ? 'bg-blue-600/20 text-white'
                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
              }
              md:mb-2
            `}
            aria-current={currentView === item.id ? 'page' : undefined}
            aria-label={item.label}
          >
            {/* Neon indicator bar */}
            <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-blue-500 transition-all duration-300 ease-in-out ${currentView === item.id ? 'scale-y-100 shadow-glow-primary' : 'scale-y-0 group-hover:scale-y-75'}`}></div>
            <span className="mr-0 md:mr-4 ml-2 md:ml-2">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
