import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, getCurrentUserId } from "../lib/config";

export const updateNumberOfBottlesInDB = async (
  newNumberOfBottles: number,
  addressId: string
) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.error("User not authenticated!");
      return false;
    }

    const userDocRef = doc(
      db,
      `users/${userId}/addresses/${addressId}`
    );

    await setDoc(
      userDocRef,
      { numberOfBottles: newNumberOfBottles },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error updating numberOfBottles:", error);
    return false;
  }
};

export const getNumberOfBottlesFromDBAddresses = async (
  userId: string,
  addressId: string
) => {
  try {
    const addressDocRef = doc(
      db,
      `users/${userId}/addresses/${addressId}`
    );

    const addressDocSnapshot = await getDoc(addressDocRef);

    if (addressDocSnapshot.exists()) {
      const addressData = addressDocSnapshot.data();
      return addressData.numberOfBottles;
    } else {
      console.error("Address document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
