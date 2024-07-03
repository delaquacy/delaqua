import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";

interface Admin {
  id: string;
  phoneNumber: string;
}

export const adminCheck = async (phoneNumber: string) => {
  const adminRef = collection(db, "admins");
  const admins: Admin[] = [];

  await getDocs(adminRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      admins.push({ ...doc.data(), id: doc.id } as Admin);
    });
  });

  const currentAdmin = admins.find(
    (admin) => admin.phoneNumber === phoneNumber
  );

  return !!currentAdmin;
};
