import { Timestamp } from "firebase/firestore";

export interface Photo {
  id: string;
  imageUrl: string;
  description: string;
  createdAt: Timestamp;
  isFavorite: boolean;
  tags?: string[];
  commentCount?: number;
}

export interface Comment {
  text: string;
  username: string;
  createdAt: any;
  isUserComment?: boolean; // Flag to identify user's own comments
}