import React from 'react';

interface HeaderProps {
    onAddPhotoClick: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPhotoClick, searchTerm, onSearchChange }) => {
  return (
    <header className="sticky top-0 z-10 p-4 bg-primary-bg/80 backdrop-blur-lg border-b border-accent-soft/50">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.318a4.5 4.5 0 00-4.5 4.5V14a1 1 0 001 1h7a1 1 0 001-1V8.818a4.5 4.5 0 00-4.5-4.5zM9 8.818a2.5 2.5 0 012.5-2.5h.001A2.5 2.5 0 0114 8.818V12H9V8.818z"/>
              <path d="M4 7a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3.32a6.506 6.506 0 01-1.423-3.32L14.5 2h-5l-.757 1.68A6.506 6.506 0 017.32 7H4zm13.788 1.818a4.5 4.5 0 00-4.47-4.47l.451-1.008a.5.5 0 01.447-.292h4.564a.5.5 0 01.447.292l.451 1.008a4.5 4.5 0 00-1.89 4.47zM12 11.001a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
              <path fillRule="evenodd" d="M7.854 18.146a.5.5 0 010-.708L9.293 16a.5.5 0 01.707 0l1.293 1.293a.5.5 0 00.707 0L13.293 16a.5.5 0 01.707 0l1.414 1.414a.5.5 0 010 .708l-2.121 2.121a.5.5 0 01-.707 0L12 19.414l-1.586 1.586a.5.5 0 01-.707 0L7.854 18.146z" clipRule="evenodd"/>
            </svg>
            <h1
                className="text-2xl font-serif text-primary-text hidden sm:block"
            >
                Our Photo Diary
            </h1>
        </div>

        <div className="flex-1 max-w-lg">
            <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-5 py-2 bg-secondary-bg/70 border border-accent-soft/60 rounded-full text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 shadow-inner shadow-accent-soft/20"
            />
        </div>

        <button
          onClick={onAddPhotoClick}
          className="bg-accent hover:bg-accent-hover text-white font-bold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-accent/30 hover:shadow-accent/50 transform hover:scale-110"
          aria-label="Add new memory"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clipRule="evenodd" />
            <path d="M2.5 6.5a1 1 0 00-1 1v8a1 1 0 001 1h15a1 1 0 001-1v-8a1 1 0 00-1-1H14a1 1 0 01-1-1V5a3 3 0 00-3-3H7a3 3 0 00-3 3v.5a1 1 0 01-1 1h-.5z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
