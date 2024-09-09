import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { collection, getDocs } from "firebase/firestore";

import dayjs from "dayjs";
import { db } from "../lib/config";
import { Invoices } from "../types";
import { sortByDate } from "./sortByDate";

dayjs.extend(customParseFormat);

export const getUserInvoices = async (): Promise<Invoices[]> => {
  try {
    const ordersRef = collection(db, "userInvoices");
    const querySnapshot = await getDocs(ordersRef);

    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return (invoices as Invoices[]).sort((a, b) => {
      return sortByDate(b.createdAt, a.createdAt, "DD.MM.YYYY HH:mm");
    });
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    return [];
  }
};
