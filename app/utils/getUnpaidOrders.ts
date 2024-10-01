import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../types";
import { sortByDate } from "./sortByDate";

export const getUnpaidOrders = async (
  userId: string
): Promise<OrdersData[]> => {
  const result: OrdersData[] = [];
  const ordersRef = collection(db, `users/${userId}/orders`);

  const statusConditions = [
    "Unpaid",
    "ORDER_CANCELLED",
    "ORDER_PAYMENT_DECLINED",
    "ORDER_PAYMENT_FAILED",
  ];

  const unpaidOrdersQuery = query(
    ordersRef,
    where("paymentStatus", "in", statusConditions),
    where("paymentLink", "!=", null)
  );
  const snapshot = await getDocs(unpaidOrdersQuery);
  const unpaidOrders: OrdersData[] = snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        id: doc.id,
      } as OrdersData)
  );
  // Check if these orders are truly unpaid in the allOrders collection

  for (const order of unpaidOrders) {
    const allOrdersQuery = query(
      collection(db, "allOrders"),
      where("paymentId", "==", order.paymentId)
    );
    const allOrdersSnapshot = await getDocs(allOrdersQuery);
    // Assuming there is only one document per paymentId in allOrders

    const allOrder = allOrdersSnapshot.docs[0]?.data();

    if (allOrder) {
      const updates: Partial<OrdersData> = {};

      if (allOrder.canceled !== order.canceled) {
        updates.canceled = allOrder.canceled;
      }
      if (allOrder.completed !== order.completed) {
        updates.completed = allOrder.completed;
      }
      if (allOrder.paymentStatus !== order.paymentStatus) {
        updates.paymentStatus = allOrder.paymentStatus;
      }

      // Update the user's order status
      if (Object.keys(updates).length > 0) {
        const userOrderRef = doc(db, `users/${userId}/orders/${order.id}`);
        await updateDoc(userOrderRef, updates);
      } else {
        result.push(order);
      }
    } else {
      result.push(order);
    }
  }

  return result
    .sort((a, b) => sortByDate(a.createdAt, b.createdAt))
    .filter((order) => !order.canceled && !order.completed);
};
