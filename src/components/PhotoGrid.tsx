import React from 'react';
import { Photo } from '../types';
import PhotoCard from './PhotoCard';
import Spinner from './Spinner';

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  onDeletePhoto: (photo: Photo) => void;
  onFavoritePhoto: (photo: Photo) => void;
  onPhotoClick: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, loading, error, onDeletePhoto, onFavoritePhoto, onPhotoClick }) => {
  if (loading) {
    return <div className="mt-20"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-800 bg-red-100 border border-red-300 p-6 rounded-xl mt-10 max-w-2xl mx-auto shadow-gentle">
        <p className="font-bold text-xl text-red-900">Oh no, something went wrong!</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center text-secondary-text mt-20 bg-secondary-bg/50 p-10 rounded-xl max-w-md mx-auto border border-accent-soft/40 shadow-gentle flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-accent-soft mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent to-pink-400">Our Story Awaits</h2>
        <p className="mt-2">Click the pink '+' button to add our first memory!</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
      {photos.map((photo, index) => (
        <PhotoCard 
            key={photo.id} 
            photo={photo} 
            onDelete={onDeletePhoto} 
            onFavorite={onFavoritePhoto}
            onClick={onPhotoClick}
            index={index}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;