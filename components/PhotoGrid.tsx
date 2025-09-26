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
      <div className="text-center text-red-300 bg-red-900/50 border border-red-500/30 p-4 rounded-lg mt-10 max-w-2xl mx-auto">
        <p className="font-bold text-red-200">An Error Occurred</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-20 bg-gray-800 p-8 rounded-xl max-w-md mx-auto border border-gray-700">
        <h2 className="text-2xl font-medium text-gray-200">The diary is empty.</h2>
        <p className="mt-2">Click the 'Add Photo' button to add the first memory!</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDelete={onDeletePhoto} />
      ))}
    </div>
  );
};

export default PhotoGrid;