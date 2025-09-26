import React, { useState, useCallback } from 'react';
import { uploadPhoto } from '../services/photoService';
import Spinner from './Spinner';
import { GoogleGenAI, Type } from "@google/genai";

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
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

  const handleSuggestCaption = async () => {
    if (!file) {
      setError("Please select a photo first.");
      return;
    }
    setIsSuggesting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const base64Data = await blobToBase64(file);
      const imagePart = { inlineData: { mimeType: file.type, data: base64Data } };
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, {text: "Suggest a short, romantic or cute caption for this photo, and 3-5 relevant tags."}] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caption: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      });

      const result = JSON.parse(response.text);
      if (result.caption) setDescription(result.caption);
      if (result.tags) setTags(result.tags);

    } catch (err) {
      console.error("AI suggestion failed:", err);
      setError("Could not generate a suggestion. Please try again.");
    } finally {
      setIsSuggesting(false);
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
      await uploadPhoto(file, description, tags);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [file, description, tags, onClose, onUploadSuccess]);
  
  return (
    <div className="fixed inset-0 bg-primary-text/20 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white/50 backdrop-blur-xl rounded-xl shadow-gentle-lg w-full max-w-md text-primary-text p-6 sm:p-8 border border-white/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-primary-text mb-6">Add a New Memory</h2>
        
        <div className="space-y-6">
          <div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-accent-soft/80 border-dashed rounded-md bg-white/20">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto h-32 w-auto rounded-md object-contain" />
                ) : (
                   <svg className="mx-auto h-12 w-12 text-accent-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="description" className="block text-sm font-medium text-primary-text">Description</label>
              <button 
                onClick={handleSuggestCaption} 
                disabled={isSuggesting || !file}
                className="text-xs text-accent hover:text-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                 {isSuggesting ? (
                    <>
                      <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      Suggest Caption
                    </>
                 )}
              </button>
            </div>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-white/60 border border-accent-soft/60 rounded-md shadow-inner shadow-accent-soft/20 focus:ring-accent focus:border-accent sm:text-sm p-2 text-primary-text placeholder-secondary-text"
              placeholder="What is this memory about?"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
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