import dayjs from "dayjs";
import { serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { UserOrderItem } from "../types";

export const NEW_ORDER = {
  id: uuidv4(),
  items: [] as UserOrderItem[],
  deliveryDate: dayjs(),
  deliveryTime: "9-12",
  deliveryAddressObj: {
    id: "",
    firstAndLast: "",
    postalIndex: "",
    deliveryAddress: "",
    geolocation: "",
    addressDetails: "",
    comments: "",
    createdAt: serverTimestamp(),
    archived: false,
    numberOfBottles: "",
  },
  phoneNumber: "",
  bottlesNumberToReturn: "",
  pump: "",
  createdAt: "",
  userId: "",
  priceOfWater: "",
  depositForBottles: "",
  totalPayments: "",
  numberOfBottlesAtThisAddress: "",
  paymentStatus: "Unpaid",
  paymentMethod: "",
  completed: false,
  canceled: false,
};
