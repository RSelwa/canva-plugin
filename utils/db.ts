import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const apiKey = process.env.NEXT_PUBLIC_FBASE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_FBASE_PROJECT_ID || "";
const messagingSenderId = process.env.NEXT_PUBLIC_FBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FBASE_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId,
  appId,
  measurementId,
};
// TODO: Replace the following with your app's Firebase configuration

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);
