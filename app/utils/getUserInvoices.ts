import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { Invoices } from "../types";

export const getUserInvoices = async (): Promise<Invoices[]> => {
  try {
    const ordersRef = collection(db, "userInvoices");
    const querySnapshot = await getDocs(ordersRef);

    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return invoices as Invoices[];
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    return [];
  }
};
