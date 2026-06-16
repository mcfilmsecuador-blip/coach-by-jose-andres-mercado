import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services with indexedDB persistence for Capacitor compatibility,
// and standard web persistence for web browser environments.
const isNative = Capacitor.isNativePlatform();

export const auth = isNative
  ? initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    })
  : getAuth(app);

export const db = getFirestore(app);
export default app;
