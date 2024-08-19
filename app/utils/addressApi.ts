import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../lib/config";

export async function fetchAddresses(userId: string) {
  try {
    const q = query(collection(db, `users/${userId}/addresses`));
    const querySnapshot = await getDocs(q);

    const addressesData = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        comments: doc.data().comments || "",
      }))
      //@ts-ignore
      .filter((address) => !address.archived)
      .sort((a: any, b: any) => b.createdAt - a.createdAt);

    return addressesData;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}
export async function fetchOrders(userId: string) {
  try {
    const ordersQuery = query(collection(db, `users/${userId}/orders`));
    const ordersQuerySnapshot = await getDocs(ordersQuery);

    const ordersData = ordersQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ordersData;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function fetchUserNumber(userId: string) {
  try {
    const userDocRef = doc(db, `users/${userId}`);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const userNumber = userData.userNumber;
      return userNumber;
    } else {
      console.error("User document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user number:", error);
    throw error;
  }
}
