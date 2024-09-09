import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";
import { Goods } from "../types";

export const getStaticGoodsArray = async () => {
  const goodsRef = collection(db, "goods");
  const goods: Goods[] = [];

  await getDocs(goodsRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      goods.push({
        id: doc.id,
        ...doc.data(),
      } as Goods);
    });
  });

  return goods;
};
