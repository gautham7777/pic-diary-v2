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

// Helper function to format the date for the heading
const formatGroupDate = (dateString: string) => {
  const date = new Date(dateString);
  // Adjust for timezone offset to prevent date changes
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
  }).format(adjustedDate);
};


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
           <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent to-pink-400">No Memories Found</h2>
        <p className="mt-2">Try a different search, or click the '+' to add a photo.</p>
      </div>
    );
  }

  // Group photos by date
  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!photo.createdAt || !photo.createdAt.toDate) {
      return acc;
    }
    // 'en-CA' format (YYYY-MM-DD) is reliable for grouping and sorting
    const date = photo.createdAt.toDate().toLocaleDateString('en-CA');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  // Sort dates from newest to oldest
  const sortedDates = Object.keys(groupedPhotos).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let photoIndex = 0; // for staggered animation delay

  return (
    <div className="w-full mx-auto space-y-12">
      {sortedDates.map(date => (
        <section key={date}>
          <h2 className="text-xl font-semibold text-primary-text pb-2 mb-6 border-b border-accent-soft">
            {formatGroupDate(date)}
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {groupedPhotos[date].map(photo => (
              <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  onDelete={onDeletePhoto} 
                  onFavorite={onFavoritePhoto}
                  onClick={onPhotoClick}
                  index={photoIndex++}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default PhotoGrid;
