import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const backendSecret = "supersecret";

const result = await fetch("http://localhost:3001/config", {
  headers: {
    method: "GET",
    Authorization: `Bearer ${backendSecret}`,
  },
});

const firebaseConfig = await result.json();
// TODO: Replace the following with your app's Firebase configuration

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);
