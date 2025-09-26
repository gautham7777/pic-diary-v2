import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import UploadModal from './components/UploadModal';
import LightboxModal from './components/LightboxModal';
import { usePhotos } from './hooks/usePhotos';
import { Photo } from './types';

// Helper function to format date for searching and displaying
const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return '';
    }
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { photos, loading, error, refetchPhotos, removePhoto, toggleFavorite } = usePhotos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const handleUploadSuccess = useCallback(() => {
    refetchPhotos();
  }, [refetchPhotos]);

  const filteredPhotos = useMemo(() => {
    let photosToFilter = photos;

    if (showFavoritesOnly) {
      photosToFilter = photosToFilter.filter(photo => photo.isFavorite);
    }

    if (!searchTerm.trim()) {
      return photosToFilter;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    return photosToFilter.filter(photo => {
      const descriptionMatch = photo.description.toLowerCase().includes(lowercasedFilter);
      const dateMatch = formatDate(photo.createdAt).toLowerCase().includes(lowercasedFilter);
      const tagsMatch = photo.tags?.some(tag => tag.toLowerCase().includes(lowercasedFilter));
      return descriptionMatch || dateMatch || tagsMatch;
    });
  }, [photos, searchTerm, showFavoritesOnly]);

  return (
    <div className="min-h-screen">
      <Header
        onAddPhotoClick={() => setIsModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isGridEmpty={photos.length === 0 && !loading}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        showFavorites={showFavoritesOnly}
       />

      <main className="container mx-auto p-4 md:p-8">
        <PhotoGrid 
          photos={filteredPhotos} 
          loading={loading} 
          error={error} 
          onDeletePhoto={removePhoto}
          onFavoritePhoto={toggleFavorite}
          onPhotoClick={setSelectedPhoto}
        />
      </main>

      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {selectedPhoto && (
        <LightboxModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};

export default App;