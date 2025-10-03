import React from 'react';
import { Photo } from '../types';
import CommentSection from './CommentSection'; // Import the new component

interface LightboxModalProps {
  photo: Photo;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ photo, onClose }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'Just now';
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(timestamp.toDate());
  };

  return (
    <div 
      className="fixed inset-0 bg-primary-bg/80 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in-up" 
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-gentle-lg w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-sm rounded-full text-primary-text hover:text-accent focus:outline-none transition-all duration-200 z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-2/3 bg-primary-bg flex items-center justify-center p-2">
          <img
            src={photo.imageUrl}
            alt={photo.description || 'Photo diary entry'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>
        
        <div className="w-full md:w-1/3 p-6 flex flex-col justify-between overflow-y-auto">
            <div>
                <p className="text-lg font-semibold text-primary-text">{photo.description}</p>
                <p className="text-sm text-secondary-text mt-1">{formatDate(photo.createdAt)}</p>
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {photo.tags.map(tag => (
                      <span key={tag} className="text-xs bg-accent/20 text-accent font-medium px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
            </div>
            {/* NEW: Integrate the CommentSection component */}
            <CommentSection photo={photo} />
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
