import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../components/OrdersTable";

export const getUnpaidOrders = async (
  userId: string
): Promise<OrdersData[]> => {
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

  return unpaidOrders;
};
