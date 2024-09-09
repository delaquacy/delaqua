import { default as customParseFormat, default as dayjs } from "dayjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { getDateDifference } from "./getDateDifference";
import { getDateFromTimestamp } from "./getDateFromTimestamp";
dayjs.extend(customParseFormat);

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface Order {
  addressDetails: string;
  bottlesNumberToBuy: number;
  bottlesNumberToReturn: number;
  comments: string;
  createdAt: Timestamp | string;
  completed: boolean;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  depositForBottles: string;
  firstAndLast: string;
  geolocation: string;
  id: string;
  items?: any[];
  invoiceNumber?: string;
  numberOfBottlesAtThisAddress: number;
  paymentMethod: string;
  paymentStatus: string;
  phoneNumber: string;
  postalIndex: string;
  priceOfWater: number;
  pump: string;
  pumpPrice: string;
  totalPayments: number;
  useId: number;
  canceled: boolean;
}

export const getOrdersArray = async () => {
  const ordersRef = collection(db, "allOrders");
  const orders: Order[] = [];

  await getDocs(ordersRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      orders.push({
        ...doc.data(),
        id: doc.id,
      } as Order);
    });
  });

  const ordersWithCorrectData = orders.map((order) => {
    const [day, month, year] = order.deliveryDate
      .split(".")
      .map((num) => num.padStart(2, "0"));

    const deliveryDate = dayjs(`${year}-${month}-${day}`).format("DD.MM.YYYY");

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

  return ordersWithCorrectData.map((order) => {
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
  });
};
