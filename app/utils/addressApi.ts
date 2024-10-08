import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../types";
import { sortByDate } from "./sortByDate";

export async function fetchAddresses(userId: string) {
  try {
    const addressesRef = collection(db, `users/${userId}/addresses`);
    const querySnapshot = await getDocs(addressesRef);

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
    const ordersRef = collection(db, `users/${userId}/orders`);
    const ordersQuerySnapshot = await getDocs(ordersRef);

    const ordersData = ordersQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const formatString = "DD.MM.YYYY HH:mm";

    return (ordersData as OrdersData[])
      .filter((order) => (order as any).createdAt)
      .sort((a, b) => {
        return sortByDate(a.createdAt, b.createdAt, formatString);
      });
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
