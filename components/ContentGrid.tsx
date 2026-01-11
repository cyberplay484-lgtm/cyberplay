
import React, { ReactNode } from 'react';

interface ContentGridProps {
  children: ReactNode;
  title?: string;
}

const ContentGrid: React.FC<ContentGridProps> = ({ children, title }) => {
  return (
    <div className="mb-8">
      {title && <h3 className="text-2xl font-bold mb-4 text-blue-400">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {children}
      </div>
    </div>
  );
};

export default ContentGrid;