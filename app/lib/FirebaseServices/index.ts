import { db } from "@/app/lib/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const FirebaseService = {
  async addDocument(collectionName: string, data: any) {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  },

  async setDocument(collectionName: string, documentId: string, data: any) {
    const docRef = doc(db, collectionName, documentId);

    await setDoc(docRef, data, { merge: true });
  },

  async getDocument(collectionName: string, documentId: string) {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      throw new Error("Document not found");
    }
  },

  async updateDocument(collectionName: string, documentId: string, data: any) {
    const docRef = doc(db, collectionName, documentId);

    await updateDoc(docRef, data);
  },

  async deleteDocument(collectionName: string, documentId: string) {
    const docRef = doc(db, collectionName, documentId);

    await deleteDoc(docRef);
  },

  async getAllDocuments(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};
