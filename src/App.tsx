import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import UploadModal from './components/UploadModal';
import { usePhotos } from './hooks/usePhotos';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { photos, loading, error, refetchPhotos, removePhoto } = usePhotos();

  const handleUploadSuccess = useCallback(() => {
    refetchPhotos();
  }, [refetchPhotos]);

  return (
    <div className="min-h-screen bg-gray-900 text-slate-100">
      <Header onAddPhotoClick={() => setIsModalOpen(true)} />
      
      <main className="container mx-auto p-4">
        <PhotoGrid photos={photos} loading={loading} error={error} onDeletePhoto={removePhoto} />
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
