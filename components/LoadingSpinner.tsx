
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      <span className="ml-3 text-gray-300">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;