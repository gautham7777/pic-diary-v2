import React from 'react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  onDelete: (photo: Photo) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onDelete }) => {

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      onDelete(photo);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-lg mb-4 break-inside-avoid shadow-lg shadow-black/25">
      <img
        src={photo.imageUrl}
        alt={photo.description || 'Photo diary entry'}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      {photo.description && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
          <p className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
            {photo.description}
          </p>
        </div>
      )}
       <button
        onClick={handleDeleteClick}
        aria-label="Delete photo"
        className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white/80 hover:text-white hover:bg-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PhotoCard;
