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
  runTransaction,
  Timestamp
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { db, storage } from "./firebase";
import { Photo, Comment } from "../types";

const PHOTOS_COLLECTION = "photos";
const COMMENTS_COLLECTION = "comments";

export const getPhotos = async (): Promise<Photo[]> => {
  const photosCollection = collection(db, PHOTOS_COLLECTION);
  const q = query(photosCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    isFavorite: doc.data().isFavorite || false,
  } as Photo));
};

export const uploadPhoto = async (file: File, description: string, tags: string[]): Promise<void> => {
  if (!file) throw new Error("No file provided for upload.");
  const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
  const imageRef = storageRef(storage, `${PHOTOS_COLLECTION}/${fileName}`);
  await uploadBytes(imageRef, file);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, PHOTOS_COLLECTION), {
    imageUrl,
    description,
    tags,
    isFavorite: false,
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
};

export const updatePhotoFavoriteStatus = async (photoId: string, isFavorite: boolean): Promise<void> => {
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(photoDocRef, { isFavorite });
};

export const deletePhoto = async (photo: Photo): Promise<void> => {
  if (!photo || !photo.id) throw new Error("Invalid photo data.");
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photo.id);
  
  // You might want to delete comments and storage image in a batch or cloud function for robustness
  await deleteDoc(photoDocRef);
  const imageRef = storageRef(storage, photo.imageUrl);
  await deleteObject(imageRef);
};

// NEW: Get comments for a photo
export const getComments = async (photoId: string): Promise<Comment[]> => {
    const commentsRef = collection(db, PHOTOS_COLLECTION, photoId, COMMENTS_COLLECTION);
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Comment);
};

// NEW: Add a comment to a photo
export const addComment = async (photoId: string, text: string, username: string): Promise<void> => {
    const photoRef = doc(db, PHOTOS_COLLECTION, photoId);
    const commentsRef = collection(photoRef, COMMENTS_COLLECTION);
    
    await runTransaction(db, async (transaction) => {
        const photoDoc = await transaction.get(photoRef);
        if (!photoDoc.exists()) {
            throw "Photo does not exist!";
        }
        
        const newCommentCount = (photoDoc.data().commentCount || 0) + 1;
        transaction.update(photoRef, { commentCount: newCommentCount });
        
        transaction.set(doc(commentsRef), {
            text,
            username,
            createdAt: serverTimestamp()
        });
    });
};
