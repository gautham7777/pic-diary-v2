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

  // Function to format the timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Just now';
    }
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="relative group overflow-hidden rounded-xl mb-4 break-inside-avoid shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800">
      <img
        src={photo.imageUrl}
        alt={photo.description || 'Photo diary entry'}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 p-4 w-full text-white">
        <p className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-y-0 translate-y-4">
          {photo.description}
        </p>
        <p className="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {formatDate(photo.createdAt)}
        </p>
      </div>
      <button
        onClick={handleDeleteClick}
        aria-label="Delete photo"
        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white/80 hover:text-white hover:bg-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PhotoCard;