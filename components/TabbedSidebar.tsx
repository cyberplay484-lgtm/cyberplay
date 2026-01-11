
import React, { useState } from 'react';

interface TabbedSidebarProps {
  children: React.ReactNode[];
  tabLabels: string[];
}

const TabbedSidebar: React.FC<TabbedSidebarProps> = ({ children, tabLabels }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col bg-neutral-900 rounded-xl shadow-lg h-[calc(100vh-250px)] md:h-[calc(100vh-180px)] border border-zinc-800">
      <div className="flex border-b border-zinc-700">
        {tabLabels.map((label, index) => (
          <button
            key={label}
            onClick={() => setActiveTab(index)}
            className={`flex-1 p-3 text-sm font-semibold transition-colors duration-200 ease-in-out focus:outline-none 
              ${activeTab === index 
                ? 'text-white border-b-2 border-blue-500 bg-zinc-800'
                : 'text-gray-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex-grow overflow-hidden">
        {children.map((child, index) => (
          <div key={index} className={`${activeTab === index ? 'block' : 'hidden'} h-full`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedSidebar;