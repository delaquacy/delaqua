import {
  addDoc,
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/config";

export const checkAndAddAllOrder = async (order: any) => {
  try {
    const ordersQuery = query(
      collectionGroup(db, "allOrders"),
      where("id", "==", order.id)
    );

    const querySnapshot = await getDocs(ordersQuery);
    const orderS = querySnapshot.docs[0]?.data();

    if (!orderS) {
      await addDoc(collection(db, `allOrders`), order);
    }

    return orderS;
  } catch (error) {
    console.error("Error fetching orders: ", error);
  }
};
