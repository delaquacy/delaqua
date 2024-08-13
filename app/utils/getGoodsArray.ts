import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import dayjs from "dayjs";

interface Goods {
  id: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: number;
  unitPrice: string;
}

export const getGoodsArray = async () => {
  const goodsRef = collection(db, "goodsInventory");
  const goods: Goods[] = [];

  await getDocs(goodsRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      goods.push({
        id: doc.id,
        ...doc.data(),
      } as Goods);
    });
  });

  return goods.map((good) => ({
    ...good,
    lastInvoiceDate: good.lastInvoiceDate
      ? good.lastInvoiceDate
      : dayjs().format("DD-MM-YYYY"),
    lastInvoiceNumber: good.lastInvoiceNumber || "NNNNNNN",
    unitPrice: good.unitPrice || 0,
  })) as Goods[];
};
