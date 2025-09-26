import React from 'react';
import { Photo } from '../types';
import PhotoCard from './PhotoCard';
import Spinner from './Spinner';

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  onDeletePhoto: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, loading, error, onDeletePhoto }) => {
  if (loading) {
    return <div className="mt-20"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-800 bg-red-100 border border-red-300 p-6 rounded-xl mt-10 max-w-2xl mx-auto shadow-gentle">
        <p className="font-bold font-serif text-xl text-red-900">Oh no, something went wrong!</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center text-secondary-text mt-20 bg-secondary-bg/50 p-10 rounded-xl max-w-md mx-auto border border-accent-soft/40 shadow-gentle">
        <h2 className="text-2xl font-serif text-primary-text">Our diary is empty.</h2>
        <p className="mt-2">Click the pink '+' button to add our first memory!</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDelete={onDeletePhoto} />
      ))}
    </div>
  );
};

export default PhotoGrid;
