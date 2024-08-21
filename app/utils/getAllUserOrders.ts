import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../types";

export const getAllUserOrders = async (
  userId: string
): Promise<OrdersData[]> => {
  try {
    const ordersRef = collection(db, `users/${userId}/orders`);
    const querySnapshot = await getDocs(ordersRef);

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return (orders as OrdersData[]).map((order) => {
      if (order?.items) return order;

      const items = [
        {
          id: "119",
          itemCode: "119",
          name: "Mersini Spring Water 18.9 lt",
          sellPrice: "6",
          count: order.bottlesNumberToBuy,
          sum: `${6 * order.bottlesNumberToBuy}`,
        },
      ];

      if (order.pump !== "no") {
        items.push({
          id: "101",
          itemCode: "101",
          name: "Manual pump",
          sellPrice: "10",
          count: 1,
          sum: "10",
        });
      }

      if (order.depositForBottles !== "0") {
        items.push({
          id: "120",
          itemCode: "120",
          name: "Returnable Bottle 18.9lt (rent)",
          sellPrice: "7",
          count: +order.depositForBottles / 7,
          sum: order.depositForBottles,
        });
      }

      console.log({ ...order, items });

      return { ...order, items };
    }) as OrdersData[];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};
