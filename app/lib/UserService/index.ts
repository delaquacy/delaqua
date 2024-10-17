import { collection, getDocs, query, where } from "firebase/firestore";
import { FirebaseService } from "../FirebaseServices";
import { db } from "../config";

interface UserData {
  generalNumberOfBottles: number;
  id: string;
  phoneNumber: string;
  userNumber: number;
}

export const UserService = {
  async getUserIdByUserNumber(userNumber: string): Promise<string | undefined> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userNumber", "==", userNumber));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;
    }
    return undefined;
  },

  async findUserByPhoneNumber(phoneNumber: string): Promise<UserData | null> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return userData[0] as UserData;
      } else {
        console.log("No user found with this phone number.");
        return null;
      }
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Error finding user by phone number");
    }
  },

  async createUserIfNotExists(phoneNumber: string) {
    const lastUserNumberDoc = await FirebaseService.getDocument(
      "list",
      "5n9NPK8Faw87bjbeenPw"
    );

    let lastUserNumber = lastUserNumberDoc
      ? lastUserNumberDoc.lastUserNumber
      : 0;

    const newUserNumber = lastUserNumber + 1;

    const newUser = {
      userNumber: newUserNumber,
      phoneNumber,
      generalNumberOfBottles: 0,
    };

    const newUserId = await FirebaseService.addDocument("users", newUser);

    await FirebaseService.updateDocument("list", "5n9NPK8Faw87bjbeenPw", {
      lastUserNumber: newUserNumber,
    });

    return { ...newUser, id: newUserId };
  },
};
