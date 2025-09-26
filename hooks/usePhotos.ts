

import { useState, useEffect, useCallback } from 'react';
import { getPhotos, deletePhoto } from '../services/photoService';
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
      console.error("Error fetching photos:", err);
      setError("Failed to load photos. Please check your Firebase setup and permissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removePhoto = useCallback(async (photo: Photo) => {
    try {
      await deletePhoto(photo);
      setPhotos(currentPhotos => currentPhotos.filter(p => p.id !== photo.id));
    } catch (err) {
      console.error("Error deleting photo:", err);
      alert("Failed to delete photo. Please check your Firebase rules and try again.");
    }
  }, []);

  return { photos, loading, error, refetchPhotos: fetchPhotos, removePhoto };
};