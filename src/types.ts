import { Timestamp } from "firebase/firestore";

export interface Photo {
  id: string;
  imageUrl: string;
  description: string;
  createdAt: Timestamp;
}
