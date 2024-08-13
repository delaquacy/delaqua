import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import dayjs from "dayjs";
import { GoodsAvailable } from "../components/GoodsAvailableTable";

export const getGoodsArray = async () => {
  const goodsRef = collection(db, "goodsInventory");
  const goods: GoodsAvailable[] = [];

  await getDocs(goodsRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      goods.push({
        id: doc.id,
        ...doc.data(),
      } as GoodsAvailable);
    });
  });

  return goods.map((good) => ({
    ...good,
    lastInvoiceDate: good.lastInvoiceDate
      ? good.lastInvoiceDate
      : dayjs().format("DD-MM-YYYY"),
    lastInvoiceNumber: good.lastInvoiceNumber || "NNNNNNN",
    unitPrice: good.unitPrice || 0,
  })) as GoodsAvailable[];
};
