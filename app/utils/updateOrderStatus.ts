import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/config";

export const updateOrderStatus = async (
  orderIds: string[],
  status: "completed" | "canceled"
) => {
  const updatePromises = orderIds.map(async (orderId) => {
    const allOrdersRef = doc(db, `allOrders/${orderId}`);
    const allOrdersDoc = await getDoc(allOrdersRef);

    if (!allOrdersDoc.exists()) {
      console.log(`Order with ID ${orderId} does not exist in allOrders`);
      return;
    }

    const allOrdersData = allOrdersDoc.data();
    if (status === "completed") {
      await updateDoc(allOrdersRef, { completed: true, canceled: false });
    } else if (status === "canceled") {
      await updateDoc(allOrdersRef, { canceled: true, completed: false });
    }

    const paymentId = allOrdersData?.paymentId;
    if (paymentId) {
      const ordersQuery = query(
        collectionGroup(db, "orders"),
        where("paymentId", "==", paymentId)
      );
      const snapshot = await getDocs(ordersQuery);

      const updateOrdersPromises = snapshot.docs.map((docSnapshot) => {
        const orderRef = doc(db, docSnapshot.ref.path);
        if (status === "completed") {
          return updateDoc(orderRef, { completed: true, canceled: false });
        } else if (status === "canceled") {
          return updateDoc(orderRef, { canceled: true, completed: false });
        }
      });

      await Promise.all(updateOrdersPromises);
    }
  });

  await Promise.all(updatePromises);
};
