import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { GoodsValues } from "../components/GoodsIncomingForm";

export const getGoodsIncomingInvoices = async () => {
  const goodsRef = collection(db, "goodsIncomingInvoices");
  const goods: GoodsValues[] = [];

  await getDocs(goodsRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      goods.push({
        id: doc.id,
        ...doc.data(),
      } as GoodsValues);
    });
  });

  return goods;
};
