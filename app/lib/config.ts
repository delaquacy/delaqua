import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAuGTH5cqRTsKIPAxxAupaL7yHHQPU0IaY",
  authDomain: "water-eadb1.firebaseapp.com",
  projectId: "water-eadb1",
  storageBucket: "water-eadb1.appspot.com",
  messagingSenderId: "356863911957",
  appId: "1:356863911957:web:4223ae3d98f141c2fe461c",
};

const app = initializeApp(firebaseConfig);
export { app };
