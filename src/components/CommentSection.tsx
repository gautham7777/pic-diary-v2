import React, { useState, useEffect, useCallback } from 'react';
import { getComments, addComment } from '../services/photoService';
import { Comment, Photo } from '../types';
import { GoogleGenAI } from "@google/genai";
import Spinner from './Spinner';

const fileToBase64 = (file: File | string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (typeof file === 'string') {
            // It's already a URL, fetch and convert
            fetch(file)
                .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = error => reject(error);
                })
                .catch(error => reject(error));
        } else {
             // It's a File object
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = (error) => reject(error);
        }
    });
};


interface CommentSectionProps {
  photo: Photo;
}

const CommentSection: React.FC<CommentSectionProps> = ({ photo }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await getComments(photo.id);
        setComments(fetchedComments);
      } catch (err) {
        setError('Could not load comments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [photo.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const username = "You"; // Or a real username if you add authentication
      await addComment(photo.id, newComment, username);
      setComments(prev => [...prev, { text: newComment, username, createdAt: new Date() }]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateComment = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const base64Data = await fileToBase64(photo.imageUrl);
        
        const imagePart = {
            inlineData: { data: base64Data, mimeType: 'image/jpeg' }, // Assuming jpeg, adjust if needed
        };

        const textPart = { text: "You are a friendly and enthusiastic social media user. Look at this photo and write a short, positive, and complimentary comment, like you would on Instagram. Keep it under 15 words and include an emoji. For example: 'Wow, what a beautiful shot! 😍' or 'This looks like so much fun! ❤️'." };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
        });
        
        setNewComment(response.text);

    } catch (err) {
      console.error("Error generating comment with Gemini:", err);
      setError('AI failed to generate a comment.');
    } finally {
      setIsGenerating(false);
    }
  }, [photo.imageUrl]);


  return (
    <div className="w-full max-w-lg mx-auto mt-4 pt-4 border-t border-accent-soft/50">
        <h3 className="text-lg font-semibold text-primary-text mb-4">Comments</h3>
        <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
            {loading && <Spinner />}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && comments.length === 0 && <p className="text-sm text-secondary-text">Be the first to comment!</p>}
            {comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent font-bold text-sm shrink-0">
                        {comment.username.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-primary-text text-sm">{comment.username}</p>
                        <p className="text-secondary-text text-sm">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>

        <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2 items-start">
            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow bg-primary-bg border border-accent-soft/60 rounded-full shadow-sm focus:ring-accent focus:border-accent text-sm p-2 px-4 text-primary-text placeholder-secondary-text/70 transition-colors"
                disabled={isSubmitting || isGenerating}
            />
             <button
                type="button"
                onClick={handleGenerateComment}
                disabled={isGenerating || isSubmitting}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 group bg-accent/20 hover:bg-accent/30 shrink-0"
                aria-label="Generate AI comment"
              >
                {isGenerating ? <Spinner/> : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.628 2.034a1 1 0 011.228.665l.876 3.722 3.723.876a1 1 0 01.665 1.228l-2.43 5.67a1 1 0 01-1.22.665l-3.723-.876-3.722-.876a1 1 0 01-.665-1.228l2.43-5.67zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" /></svg>
                )}
            </button>
            <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting || isGenerating}
                className="w-10 h-10 bg-accent hover:bg-accent-hover text-white font-bold rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-accent/30 disabled:bg-secondary-bg disabled:text-secondary-text shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
        </form>
    </div>
  );
};

export default CommentSection;
