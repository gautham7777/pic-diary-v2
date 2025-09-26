import React from 'react';
import { Photo } from '../types';

interface LightboxModalProps {
  photo: Photo;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ photo, onClose }) => {

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'Just now';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div 
      className="fixed inset-0 bg-primary-bg/80 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in-up" 
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-10 -right-2 sm:top-0 sm:-right-12 p-2 bg-white/50 backdrop-blur-sm rounded-full text-primary-text hover:text-accent focus:outline-none transition-all duration-200 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-white rounded-xl shadow-gentle-lg p-3">
          <img
            src={photo.imageUrl}
            alt={photo.description || 'Photo diary entry'}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        
        <div className="text-center mt-4 w-full max-w-2xl px-4">
            <p className="text-lg font-medium text-primary-text">{photo.description}</p>
            <p className="text-sm text-secondary-text mt-1">{formatDate(photo.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
