import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../components/OrdersTable";

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

    if (allOrder && allOrder.paymentStatus !== order.paymentStatus) {
      // The order is paid, update the user's order status
      const userOrderRef = doc(db, `users/${userId}/orders/${order.id}`);

      await updateDoc(userOrderRef, {
        paymentStatus: allOrder.paymentStatus,
      });
    } else {
      result.push(order);
    }
  }
  console.log(result);
  return result;
};
