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
  Timestamp
} from "firebase/firestore";
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "./firebase";
import { Photo } from "../types";

const PHOTOS_COLLECTION = "photos";

export const getPhotos = async (): Promise<Photo[]> => {
  const photosCollection = collection(db, PHOTOS_COLLECTION);
  const q = query(photosCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    isFavorite: doc.data().isFavorite || false, // Ensure isFavorite exists
  } as Photo));
};

export const uploadPhoto = async (file: File, description: string, tags: string[]): Promise<void> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const imageRef = storageRef(storage, `${PHOTOS_COLLECTION}/${fileName}`);

  await uploadBytes(imageRef, file);
  const imageUrl = await getDownloadURL(imageRef);

  await addDoc(collection(db, PHOTOS_COLLECTION), {
    imageUrl,
    description,
    tags,
    isFavorite: false,
    createdAt: serverTimestamp(),
  });
};

export const updatePhotoFavoriteStatus = async (photoId: string, isFavorite: boolean): Promise<void> => {
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(photoDocRef, { isFavorite });
};


export const deletePhoto = async (photo: Photo): Promise<void> => {
  if (!photo || !photo.id || !photo.imageUrl) {
    throw new Error("Invalid photo data provided for deletion.");
  }

  // Delete the document from Firestore
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photo.id);
  await deleteDoc(photoDocRef);

  // Delete the image from Firebase Storage
  const imageRef = storageRef(storage, photo.imageUrl);
  await deleteObject(imageRef);
};