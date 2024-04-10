import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APIKEY,
  authDomain: "delaqua-cy.firebaseapp.com",
  projectId: "delaqua-cy",
  storageBucket: "delaqua-cy.appspot.com",
  messagingSenderId: "864142248122",
  appId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_APPID,
  measurementId: "G-KKJWM4CM48",
};

const getCurrentUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return user.uid;
  } else {
    return null;
  }
};

const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}
const db = getFirestore(app);

export { app, db, getCurrentUserId };
