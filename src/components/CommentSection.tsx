import React, { useState, useEffect, useCallback } from 'react';
import { getComments, addComment } from '../services/photoService';
import { Comment, Photo } from '../types';
import { GoogleGenerativeAI } from "@google/genai";
import Spinner from './Spinner';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const CommentSection: React.FC<{ photo: Photo }> = ({ photo }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (photo.id) {
        getComments(photo.id).then(setComments).catch(() => setError('Could not load comments.')).finally(() => setLoading(false));
    }
  }, [photo.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addComment(photo.id, newComment, "You", true);
      setComments(prev => [{ text: newComment, username: "You", createdAt: new Date(), isUserComment: true }, ...prev]);
      setNewComment('');
    } catch {
      setError('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateComment = useCallback(async () => {
    if (!GEMINI_API_KEY) { setError("Gemini API key is not configured."); return; }
    setIsGenerating(true);
    setError(null);
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const imageUrl = photo.imageUrl;
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        
        const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });

        const imagePart = { inlineData: { data: base64Data, mimeType: blob.type } };
        const prompt = "You are a friendly social media user. Write a short, positive, complimentary comment for this photo, under 15 words, with an emoji. Example: 'So beautiful! 😍'";
        
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        setNewComment(response.text());

    } catch(err) {
      console.error("Error generating comment:", err);
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
            {!loading && comments.length === 0 && <p className="text-sm text-secondary-text">No comments yet.</p>}
            {comments.map((comment, index) => (
                <div key={index} className={`p-3 rounded-lg ${comment.isUserComment ? 'bg-accent/10' : 'bg-secondary-bg/50'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${comment.isUserComment ? 'bg-accent text-white' : 'bg-accent-soft text-accent'}`}>
                            {comment.username.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-primary-text text-sm">{comment.username}</p>
                            <p className="text-secondary-text text-sm">{comment.text}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2 items-start">
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add your comment..." className="flex-grow bg-primary-bg border border-accent-soft/60 rounded-full shadow-sm focus:ring-accent focus:border-accent text-sm p-2 px-4 text-primary-text placeholder-secondary-text/70 transition-colors" disabled={isSubmitting || isGenerating} />
            <button type="button" onClick={handleGenerateComment} disabled={isGenerating || isSubmitting} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 group bg-accent/20 hover:bg-accent/30 shrink-0" aria-label="Generate AI comment">
                {isGenerating ? <Spinner/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.628 2.034a1 1 0 011.228.665l.876 3.722 3.723.876a1 1 0 01.665 1.228l-2.43 5.67a1 1 0 01-1.22.665l-3.723-.876-3.722-.876a1 1 0 01-.665-1.228l2.43-5.67zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" /></svg>}
            </button>
            <button type="submit" disabled={!newComment.trim() || isSubmitting || isGenerating} className="w-10 h-10 bg-accent hover:bg-accent-hover text-white font-bold rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-accent/30 disabled:bg-secondary-bg disabled:text-secondary-text shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
        </form>
    </div>
  );
};

export default CommentSection;