import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../types";
import { sortByDate } from "./sortByDate";

dayjs.extend(customParseFormat);

export const getAllUserOrders = async (
  userId: string
): Promise<OrdersData[]> => {
  try {
    const ordersRef = collection(db, `users/${userId}/orders`);

    const querySnapshot = await getDocs(ordersRef);

    const orders = querySnapshot.docs.map((doc) => ({
      idDb: doc.id,
      ...doc.data(),
    }));

    const processedOrders = (orders as OrdersData[]).map((order) => {
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

      return { ...order, items };
    }) as OrdersData[];

    const formatString = "DD.MM.YYYY HH:mm";

    return processedOrders
      .filter((order) => (order as any).createdAt)
      .sort((a, b) => {
        return sortByDate(a.createdAt, b.createdAt, formatString);
      });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};
