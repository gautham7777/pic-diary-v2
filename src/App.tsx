import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import UploadModal from './components/UploadModal';
import { usePhotos } from './hooks/usePhotos';
import { Photo } from './types';

// Helper function to format date for searching and displaying
const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return '';
    }
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { photos, loading, error, refetchPhotos, removePhoto } = usePhotos();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUploadSuccess = useCallback(() => {
    refetchPhotos();
  }, [refetchPhotos]);

  const filteredPhotos = useMemo(() => {
    if (!searchTerm.trim()) {
      return photos;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return photos.filter(photo => {
      const descriptionMatch = photo.description.toLowerCase().includes(lowercasedFilter);
      const dateMatch = formatDate(photo.createdAt).toLowerCase().includes(lowercasedFilter);
      return descriptionMatch || dateMatch;
    });
  }, [photos, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-slate-100">
      <Header
        onAddPhotoClick={() => setIsModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
       />

      <main className="container mx-auto p-4">
        <PhotoGrid photos={filteredPhotos} loading={loading} error={error} onDeletePhoto={removePhoto} />
      </main>

      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default App;