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
    if (window.confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
      onDelete(photo);
    }
  };

  // Function to format the timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Just now';
    }
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="relative group overflow-hidden rounded-xl mb-4 break-inside-avoid shadow-gentle hover:shadow-gentle-lg transition-shadow duration-300 bg-secondary-bg">
      <img
        src={photo.imageUrl}
        alt={photo.description || 'Photo diary entry'}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-accent/60 via-accent-soft/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 p-4 w-full text-white">
        <p className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
          {photo.description}
        </p>
        <p className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {formatDate(photo.createdAt)}
        </p>
      </div>
      <button
        onClick={handleDeleteClick}
        aria-label="Delete photo"
        className="absolute top-2 right-2 p-1.5 bg-white/40 backdrop-blur-sm rounded-full text-primary-text hover:text-white hover:bg-accent focus:outline-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default PhotoCard;
