import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/config";

interface Goods {
  id: string;
  itemCode: string;
  name: string;
  picture: string;
  netBuyWorth: string;
  netSaleWorth: string;
  sellPrice: string;
  sellPriceVAT: string;
  taxRate: string;
  buyPrice: string;
  buyPriceVAT: string;
}

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
