import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { collection, getDocs } from "firebase/firestore";

import dayjs from "dayjs";
import { db } from "../lib/config";
import { Invoices } from "../types";

dayjs.extend(customParseFormat);

export const getUserInvoices = async (): Promise<Invoices[]> => {
  try {
    const ordersRef = collection(db, "userInvoices");
    const querySnapshot = await getDocs(ordersRef);

    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const processedInvoices = (invoices as Invoices[]).sort((a, b) => {
      const dateA =
        typeof a.createdAt === "string"
          ? dayjs(a.createdAt, "DD.MM.YYYY HH:mm").toDate()
          : new Date(a.createdAt);

      const dateB =
        typeof b.createdAt === "string"
          ? dayjs(b.createdAt, "DD.MM.YYYY HH:mm").toDate()
          : new Date(b.createdAt);

      return dateB.getTime() - dateA.getTime();
    });

    return processedInvoices as Invoices[];
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    return [];
  }
};
