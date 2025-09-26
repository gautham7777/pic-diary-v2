import { useState, useEffect, useCallback } from 'react';
import { getPhotos, deletePhoto, updatePhotoFavoriteStatus } from '../services/photoService';
import { Photo } from '../types';

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const photosData = await getPhotos();
      setPhotos(photosData);
    } catch (err) {
      console.error("Detailed error fetching photos:", err);
      setError("Failed to load photos. This could be due to network issues or incorrect Firebase permissions. Check the console for more details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLocalPhoto = useCallback((photoId: string, updates: Partial<Photo>) => {
    setPhotos(currentPhotos =>
      currentPhotos.map(p => (p.id === photoId ? { ...p, ...updates } : p))
    );
  }, []);

  const toggleFavorite = useCallback(async (photo: Photo) => {
    const newFavoriteStatus = !photo.isFavorite;
    // Update local state immediately for a responsive UI
    updateLocalPhoto(photo.id, { isFavorite: newFavoriteStatus });
    try {
      await updatePhotoFavoriteStatus(photo.id, newFavoriteStatus);
    } catch (err) {
      console.error("Error updating favorite status:", err);
      // Revert local state if the API call fails
      updateLocalPhoto(photo.id, { isFavorite: photo.isFavorite });
      alert("Failed to update favorite status. Please try again.");
    }
  }, [updateLocalPhoto]);

  const removePhoto = useCallback(async (photo: Photo) => {
    try {
      await deletePhoto(photo);
      setPhotos(currentPhotos => currentPhotos.filter(p => p.id !== photo.id));
    } catch (err) {
      console.error("Error deleting photo:", err);
      alert("Failed to delete photo. Please check your Firebase rules and try again.");
    }
  }, []);

  return { photos, loading, error, refetchPhotos: fetchPhotos, removePhoto, toggleFavorite };
};