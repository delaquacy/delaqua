import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../lib/config";
import { OrdersData } from "../types";
import { sortByDate } from "./sortByDate";

dayjs.extend(customParseFormat);

// get all user orders in real-time
export const getAllUserOrders = async (
  userId: string,
  setOrders: (orders: OrdersData[]) => void
) => {
  try {
    const userDocRef = doc(db, "users", userId);

    const userDoc = await getDoc(userDocRef);

    const user =
      userDoc.exists() && ({ id: userDoc.id, ...userDoc.data() } as any);

    const userNum = user?.userNumber;

    const ordersQuery = query(
      collection(db, "allOrders"),
      where("userId", "==", +userNum)
    );

    const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      const orders = querySnapshot.docs.map((doc) => {
        return {
          idDb: doc.id,
          ...doc.data(),
        };
      });

      const processOrders = async () => {
        const processedOrders: OrdersData[] = [];

        for (const order of orders as OrdersData[]) {
          if (!order.items) {
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

            processedOrders.push({ ...order, items } as any);
          } else {
            processedOrders.push(order);
          }
        }

        const formatString = "DD.MM.YYYY HH:mm";
        const sortedOrders = processedOrders.sort((a, b) =>
          sortByDate(a.createdAt, b.createdAt, formatString)
        );

        setOrders(sortedOrders);
      };

      processOrders();
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching user orders in real-time:", error);
  }
};
