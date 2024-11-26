import { WriteOffData } from "@/app/contexts/WriteOffGoodContext";
import { getSortedOrders } from "@/app/utils";
import { collection, onSnapshot } from "firebase/firestore";
import { FirebaseService } from "../FirebaseServices";
import { db } from "../config";

export const WriteOffService = {
  async addWriteOffDoc(data: WriteOffData) {
    await FirebaseService.setDocument("writeOffService", data.id, data);
  },

  getWriteOffDataArray(callback: (writeOffItems: WriteOffData[]) => void) {
    const writeOffRef = collection(db, "writeOffService");

    const unsubscribe = onSnapshot(writeOffRef, (snapshot) => {
      const writeOffItems: WriteOffData[] = [];

      snapshot.docs.forEach((doc) => {
        writeOffItems.push({
          ...doc.data(),
        } as WriteOffData);
      });

      callback(getSortedOrders(writeOffItems).reverse() as WriteOffData[]);
    });

    return unsubscribe;
  },
};
