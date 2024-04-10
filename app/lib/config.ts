import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBmHfL_hBjgDUHBNTEc7cM1MSjFyCITUyo",
  authDomain: "delaqua-cy.firebaseapp.com",
  projectId: "delaqua-cy",
  storageBucket: "delaqua-cy.appspot.com",
  messagingSenderId: "864142248122",
  appId: "1:864142248122:web:82cbe223836d11eb805a83",
  measurementId: "G-KHGJRN2BNZ",
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
