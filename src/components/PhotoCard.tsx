import React from 'react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onDelete: (photo: Photo) => void;
  onFavorite: (photo: Photo) => void;
  onClick: (photo: Photo) => void;
  index: number;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onDelete, onFavorite, onClick, index }) => {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this memory?')) {
      onDelete(photo);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFavorite(photo);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'Just now';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(timestamp.toDate());
  };

  return (
    <div
      className="relative group overflow-hidden rounded-xl mb-4 break-inside-avoid shadow-gentle hover:shadow-gentle-lg transition-all duration-300 bg-secondary-bg cursor-pointer opacity-0 animate-fade-in-up"
      onClick={() => onClick(photo)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <img
        src={photo.imageUrl}
        alt={photo.description || 'Photo entry'}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-4 w-full text-white">
        <p className="text-sm font-semibold transform transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
          {photo.description}
        </p>
      </div>

      {/* NEW: Comment count display */}
      {photo.commentCount > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-white/90">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
             <span>{photo.commentCount}</span>
          </div>
      )}

      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button onClick={handleFavoriteClick} aria-label="Favorite photo" className="p-1.5 bg-white/40 backdrop-blur-sm rounded-full text-primary-text hover:text-accent focus:outline-none transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" className={`transition-opacity ${photo.isFavorite ? 'opacity-100 text-accent' : 'opacity-60'}`} clipRule="evenodd" /></svg>
        </button>
        <button onClick={handleDeleteClick} aria-label="Delete photo" className="p-1.5 bg-white/40 backdrop-blur-sm rounded-full text-primary-text hover:text-white hover:bg-red-500 focus:outline-none transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default PhotoCard;
