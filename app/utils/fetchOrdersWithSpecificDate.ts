import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/config";

export const fetchOrdersWithSpecificDate = async (date: any) => {
  const orders: any = [];

  try {
    const ordersQuery = query(
      collectionGroup(db, "orders"),
      where("deliveryDate", "==", date)
    );

    const querySnapshot = await getDocs(ordersQuery);
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders: ", error);
  }
};
