import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  runTransaction
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { db, storage } from "./firebase";
import { Photo, Comment } from "../types";
import { GoogleGenAI } from "@google/genai"; // CORRECTED NAME

const PHOTOS_COLLECTION = "photos";
const COMMENTS_COLLECTION = "comments";
const fakeUsernames = ["PhotoFan", "MemoryMaker", "SunnyDays", "Shutterbug", "Wanderlust", "Dreamer", "Explorer_22", "GoodVibesOnly"];

const imageUrlToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => res.blob()).then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        }).catch(error => reject(error));
    });
};

export const uploadPhoto = async (file: File, description: string, tags: string[]): Promise<void> => {
  if (!file) throw new Error("No file provided for upload.");
  const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
  const imageRef = storageRef(storage, `${PHOTOS_COLLECTION}/${fileName}`);
  await uploadBytes(imageRef, file);
  const imageUrl = await getDownloadURL(imageRef);

  const newPhotoDoc = await addDoc(collection(db, PHOTOS_COLLECTION), {
    imageUrl, description, tags, isFavorite: false, commentCount: 0, createdAt: serverTimestamp(),
  });
  
  if (process.env.GEMINI_API_KEY) {
      try {
          const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY); // CORRECTED NAME
          const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
          const base64Data = await imageUrlToBase64(imageUrl);
          const imagePart = { inlineData: { data: base64Data, mimeType: file.type } };
          const prompt = "You are a friendly and enthusiastic social media user. Look at this photo and write a short, positive, and complimentary comment, like you would on Instagram. Keep it under 15 words and include an emoji. For example: 'Wow, what a beautiful shot! 😍' or 'This looks like so much fun! ❤️'.";
          
          const result = await model.generateContent([prompt, imagePart]);
          const response = await result.response;
          const aiCommentText = response.text();
          const fakeUsername = fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)];
          
          if (aiCommentText) {
            await addComment(newPhotoDoc.id, aiCommentText, fakeUsername, false);
          }
      } catch (err) {
          console.error("Failed to generate automatic AI comment:", err);
      }
  }
};

export const getComments = async (photoId: string): Promise<Comment[]> => {
    const commentsRef = collection(db, PHOTOS_COLLECTION, photoId, COMMENTS_COLLECTION);
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => doc.data() as Comment);
    return comments.sort((a, b) => {
        if (a.isUserComment && !b.isUserComment) return -1;
        if (!a.isUserComment && b.isUserComment) return 1;
        return 0;
    });
};

export const addComment = async (photoId: string, text: string, username: string, isUser: boolean = true): Promise<void> => {
    const photoRef = doc(db, PHOTOS_COLLECTION, photoId);
    const commentsRef = collection(photoRef, COMMENTS_COLLECTION);
    await runTransaction(db, async (transaction) => {
        const photoDoc = await transaction.get(photoRef);
        if (!photoDoc.exists()) throw "Photo does not exist!";
        const newCommentCount = (photoDoc.data().commentCount || 0) + 1;
        transaction.update(photoRef, { commentCount: newCommentCount });
        transaction.set(doc(commentsRef), { text, username, isUserComment: isUser, createdAt: serverTimestamp() });
    });
};

// --- Other existing functions ---
export const getPhotos = async (): Promise<Photo[]> => {
  const q = query(collection(db, PHOTOS_COLLECTION), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isFavorite: doc.data().isFavorite || false } as Photo));
};
export const updatePhotoFavoriteStatus = async (photoId: string, isFavorite: boolean): Promise<void> => {
  await updateDoc(doc(db, PHOTOS_COLLECTION, photoId), { isFavorite });
};
export const deletePhoto = async (photo: Photo): Promise<void> => {
    if (!photo || !photo.id) throw new Error("Invalid photo data.");
    await deleteDoc(doc(db, PHOTOS_COLLECTION, photo.id));
    await deleteObject(storageRef(storage, photo.imageUrl));
};
