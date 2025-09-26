import { Timestamp } from "firebase/firestore";

export interface Photo {
  id: string;
  imageUrl: string;
  description: string;
  createdAt: Timestamp;
}

// Fix: Manually define the structure of `import.meta.env` to provide TypeScript with type information
// for Vite environment variables, resolving errors about 'env' not existing on 'ImportMeta'.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_FIREBASE_API_KEY: string;
      readonly VITE_FIREBASE_AUTH_DOMAIN: string;
      readonly VITE_FIREBASE_DATABASE_URL: string;
      readonly VITE_FIREBASE_PROJECT_ID: string;
      readonly VITE_FIREBASE_STORAGE_BUCKET: string;
      readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
      readonly VITE_FIREBASE_APP_ID: string;
    }
  }
}
