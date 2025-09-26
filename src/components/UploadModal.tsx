import React, { useState, useCallback } from 'react';
// Correctly import GoogleGenAI for interacting with the Gemini API
import { GoogleGenAI } from "@google/genai";
import { uploadPhoto } from '../services/photoService';
import Spinner from './Spinner';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

// Helper to convert file to a base64 string for the API
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File is too large. Maximum size is 10MB.");
        return;
      }
      setFile(selectedFile);
      setTags([]); // Reset tags when a new file is selected
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGenerateTags = useCallback(async () => {
    if (!file) {
      setError('Please select a photo first to generate tags.');
      return;
    }
    setIsGeneratingTags(true);
    setError(null);
    try {
        // Initialize the Gemini AI client
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const base64Data = await fileToBase64(file);
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: file.type,
            },
        };
        const textPart = { text: "Analyze this image and generate 3 to 5 relevant, single-word, lowercase tags that describe the main subjects, setting, or mood. Separate the tags with commas. For example: 'nature, sunset, beach, ocean, serene'." };

        // Call the Gemini API to generate content based on the image and prompt
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const generatedTags = response.text
            .split(',')
            .map(tag => tag.trim().toLowerCase().replace(/[^a-z0-9\s-]/gi, '')) // Sanitize tags
            .filter(tag => tag && tag.length > 1 && tag.length < 20); // Basic validation
      
        setTags(prevTags => [...new Set([...prevTags, ...generatedTags])]);

    } catch (err) {
      console.error("Error generating tags with Gemini:", err);
      setError('Failed to generate tags. Please check your API key or add tags manually.');
    } finally {
      setIsGeneratingTags(false);
    }
  }, [file]);
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim() !== '') {
      e.preventDefault();
      const newTags = tagInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t && t.length > 1);
      setTags([...new Set([...tags, ...newTags])]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a photo to upload.");
      return;
    }
    if (!description.trim()) {
        setError("Please add a description for your memory.");
        return;
    }
    setIsUploading(true);
    setError(null);
    try {
      await uploadPhoto(file, description, tags);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please check the console and try again.");
    } finally {
      setIsUploading(false);
    }
  }, [file, description, tags, onClose, onUploadSuccess]);

  return (
    <div className="fixed inset-0 bg-primary-bg/80 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={onClose}>
      <div 
        className="bg-secondary-bg rounded-xl shadow-gentle-lg w-full max-w-lg text-primary-text p-6 sm:p-8 border border-accent-soft/50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent to-pink-400 mb-6">Add a New Memory</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-secondary-text mb-2">Photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-accent-soft/60 border-dashed rounded-md bg-primary-bg">
              <div className="space-y-2 text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto h-40 w-auto rounded-md object-contain" />
                ) : (
                  <svg className="mx-auto h-12 w-12 text-accent-soft" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8L20 16m0 0h8m-8 0V8m12 12v12a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-secondary-text justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-accent hover:text-accent-hover focus-within:outline-none">
                    <span>{file ? 'Change file' : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-secondary-text/70">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-secondary-text">Description</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-primary-bg border border-accent-soft/60 rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm p-2 text-primary-text placeholder-secondary-text/70 transition-colors"
              placeholder="What's this memory about?"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-secondary-text mb-1">Tags</label>
            <div className="flex gap-2 items-start">
              <div className="flex-grow">
                <input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={isGeneratingTags}
                    className="block w-full bg-primary-bg border border-accent-soft/60 rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm p-2 text-primary-text placeholder-secondary-text/70 transition-colors"
                    placeholder="Add tags (e.g., vacation, family)"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                    <span key={tag} className="flex items-center bg-accent/20 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-accent/70 hover:text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </span>
                    ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerateTags}
                disabled={!file || isGeneratingTags || isUploading}
                className="px-3 py-2 text-sm font-medium text-white bg-accent/80 rounded-md hover:bg-accent-hover disabled:bg-secondary-bg disabled:text-secondary-text disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center h-9 shadow-md disabled:shadow-none shrink-0"
              >
                {isGeneratingTags ? <Spinner/> : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.628 2.034a1 1 0 011.228.665l.876 3.722 3.723.876a1 1 0 01.665 1.228l-2.43 5.67a1 1 0 01-1.22.665l-3.723-.876-3.722-.876a1 1 0 01-.665-1.228l2.43-5.67zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" /></svg>
                )}
                 {isGeneratingTags ? '' : 'AI Tags'}
              </button>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 bg-red-900/40 p-2 rounded-md">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end items-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-secondary-text rounded-md hover:bg-accent-soft/20 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !file || isGeneratingTags}
            className="px-6 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent-hover disabled:bg-secondary-bg disabled:text-secondary-text disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[100px] h-9 shadow-lg shadow-accent/30"
          >
            {isUploading ? <Spinner/> : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
