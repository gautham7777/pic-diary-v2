import React, { useState, useCallback } from 'react';
import { uploadPhoto } from '../services/photoService';
import Spinner from './Spinner';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please choose a photo to share.");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      await uploadPhoto(file, description);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [file, description, onClose, onUploadSuccess]);
  
  return (
    <div className="fixed inset-0 bg-primary-text/30 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-primary-bg rounded-xl shadow-gentle-lg w-full max-w-md text-primary-text p-8 border border-accent-soft/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-serif text-primary-text mb-6">Add a New Memory</h2>
        
        <div className="space-y-6">
          <div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-accent-soft border-dashed rounded-md bg-secondary-bg/50">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto h-32 w-auto rounded-md object-contain" />
                ) : (
                  <svg className="mx-auto h-12 w-12 text-accent-soft" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8L20 16m0 0h8m-8 0V8m12 12v12a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-secondary-text justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none">
                    <span>Choose a photo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-secondary-text/70">PNG, JPG, GIF</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-primary-text">Description</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-secondary-bg/70 border border-accent-soft/60 rounded-md shadow-inner shadow-accent-soft/20 focus:ring-accent focus:border-accent sm:text-sm p-2 text-primary-text placeholder-secondary-text"
              placeholder="What is this memory about?"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end items-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-secondary-text rounded-md hover:bg-accent-soft/30 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="px-6 py-2 text-sm font-bold text-white bg-accent rounded-md hover:bg-accent-hover disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[96px] h-9 shadow-lg shadow-accent/30"
          >
            {isUploading ? <Spinner/> : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
