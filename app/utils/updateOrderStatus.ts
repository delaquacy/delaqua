import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/config";

export const updateOrderStatus = async (
  orderIds: string[],
  status: "completed" | "canceled"
) => {
  const updatePromises = orderIds.map((orderId) => {
    const allOrdersRef = doc(db, `allOrders/${orderId}`);

    if (status === "completed") {
      return updateDoc(allOrdersRef, { completed: true, canceled: false });
    }

    if (status === "canceled") {
      return updateDoc(allOrdersRef, { canceled: true, completed: false });
    }
  });

  await Promise.all(updatePromises);
};
