import dayjs from "dayjs";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../types";
import { getDateDifference } from "./getDateDifference";
import { getDateFromTimestamp } from "./getDateFromTimestamp";

export const getOrdersArray = (callback: (orders: OrdersData[]) => void) => {
  const ordersRef = collection(db, "allOrders");

  const unsubscribe = onSnapshot(
    ordersRef,
    (snapshot) => {
      const orders: OrdersData[] = [];

      snapshot.docs.forEach((doc) => {
        orders.push({
          ...doc.data(),
          id: doc.id,
        } as OrdersData);
      });

      const ordersWithCorrectData = orders.map((order) => {
        const [day, month, year] = order.deliveryDate
          .split(".")
          .map((num) => num.padStart(2, "0"));

        const deliveryDate = dayjs(`${year}-${month}-${day}`).format(
          "DD.MM.YYYY"
        );

        return {
          ...order,
          createdAt:
            typeof order.createdAt === "string"
              ? order.createdAt
              : getDateFromTimestamp(order.createdAt),
          deliveryDate,
          expire:
            getDateDifference(
              dayjs().format("YYYY-MM-DD"),
              deliveryDate as string
            ) < 0,
        };
      });

      callback(ordersWithCorrectData);
    },
    (error) => {
      console.error("Error fetching real-time orders:", error);
    }
  );

  return unsubscribe;
};
