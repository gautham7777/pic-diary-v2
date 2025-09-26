import React from 'react';

interface HeaderProps {
    onAddPhotoClick: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    isGridEmpty: boolean;
    onToggleFavorites: () => void;
    showFavorites: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddPhotoClick, searchTerm, onSearchChange, isGridEmpty, onToggleFavorites, showFavorites }) => {
  return (
    <header className="sticky top-0 z-20 p-4 bg-primary-bg/80 backdrop-blur-lg border-b border-accent-soft/50">
      <div className="container mx-auto flex justify-between items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-3 shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <h1
                className="text-xl font-semibold text-primary-text hidden md:block"
            >
                Our Photo Diary
            </h1>
        </div>

        <div className="flex-1 w-full max-w-lg">
            <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-5 py-2 bg-secondary-bg/70 border border-accent-soft/60 rounded-full text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 shadow-inner shadow-accent-soft/20 text-sm"
            />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleFavorites}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group ${showFavorites ? 'bg-accent/20' : 'hover:bg-accent/10'}`}
            aria-label="Show favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-all duration-300 ${showFavorites ? 'text-accent' : 'text-accent/70 group-hover:text-accent'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={onAddPhotoClick}
            className={`bg-accent hover:bg-accent-hover text-white font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-accent/30 hover:shadow-accent/50 transform hover:scale-110 shrink-0 ${isGridEmpty ? 'animate-soft-pulse' : ''}`}
            aria-label="Add new memory"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;