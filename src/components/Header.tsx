import React from 'react';

interface HeaderProps {
    onAddPhotoClick: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPhotoClick, searchTerm, onSearchChange }) => {
  return (
    <header className="sticky top-0 z-10 p-4 bg-black/30 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h1
                className="text-xl font-medium text-slate-100 hidden sm:block"
            >
                Photo Diary
            </h1>
        </div>

        <div className="flex-1 max-w-lg">
            <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-full text-slate-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
        </div>

        <button
          onClick={onAddPhotoClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          aria-label="Add new photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;