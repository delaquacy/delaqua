import { GoodsAvailable } from "@/app/components/GoodsAvailableTable";
import { GoodsValues } from "@/app/components/GoodsIncomingForm";
import { Goods, OrdersData } from "@/app/types";
import dayjs from "dayjs";
import { collection, onSnapshot } from "firebase/firestore";
import { FirebaseService } from "../FirebaseServices";
import { db } from "../config";

export const GoodService = {
  async addItemsQuantityToInventoryTable(goodsValues: GoodsValues) {
    goodsValues.items.forEach(async (item) => {
      const itemData = await FirebaseService.getDocument(
        "goodsInventory",
        `${item.itemCode}` as string
      );

      const updatedQuantity = +itemData?.quantity + +item.quantity;

      await FirebaseService.updateDocument(
        "goodsInventory",
        `${item.itemCode}` as string,
        {
          quantity: updatedQuantity,
          lastInvoiceNumber: goodsValues.invoiceNumber,
          lastInvoiceDate: goodsValues.date,
        }
      );
    });
  },

  async addOrderItemsToInventoryTable(goodsValues: OrdersData) {
    (goodsValues?.items || []).forEach(async (item) => {
      const itemData = await FirebaseService.getDocument(
        "goodsInventory",
        `${item?.itemCode}` as string
      );

      const updatedQuantity = +itemData?.quantity - +item?.count;

      await FirebaseService.updateDocument(
        "goodsInventory",
        `${item.itemCode}` as string,
        {
          quantity: updatedQuantity,
          lastInvoiceNumber: goodsValues.invoiceNumber,
          lastInvoiceDate: goodsValues.createdAt,
        }
      );
    });
  },

  async addIncomingGoodsItem(data: any) {
    return await FirebaseService.addDocument("goodsIncomingInvoices", data);
  },

  getGoodsInventoryArray(callback: (goods: GoodsAvailable[]) => void) {
    const goodsRef = collection(db, "goodsInventory");

    const unsubscribe = onSnapshot(goodsRef, (snapshot) => {
      const goods: GoodsAvailable[] = [];

      snapshot.docs.forEach((doc) => {
        goods.push({
          id: doc.id,
          ...doc.data(),
        } as GoodsAvailable);
      });

      const updatedGoods = goods.map((good) => ({
        ...good,
        lastInvoiceDate: good.lastInvoiceDate
          ? good.lastInvoiceDate
          : dayjs().format("DD-MM-YYYY"),
        lastInvoiceNumber: good.lastInvoiceNumber || "NNNNNNN",
        unitPrice: good.unitPrice || 0,
      }));

      callback(updatedGoods as GoodsAvailable[]);
    });

    return unsubscribe;
  },

  getGoodsIncomingInvoices(callback: (goods: GoodsValues[]) => void) {
    const goodsRef = collection(db, "goodsIncomingInvoices");

    const unsubscribe = onSnapshot(goodsRef, (snapshot) => {
      const goods: GoodsValues[] = [];

      snapshot.docs.forEach((doc) => {
        goods.push({
          id: doc.id,
          ...doc.data(),
        } as GoodsValues);
      });

      callback(goods);
    });

    return unsubscribe;
  },
  getGoods(callback: (goods: Goods[]) => void) {
    const goodsRef = collection(db, "goods");

    const unsubscribe = onSnapshot(goodsRef, (snapshot) => {
      const goods: Goods[] = [];

      snapshot.docs.forEach((doc) => {
        goods.push({
          id: doc.id,
          ...doc.data(),
        } as Goods);
      });

      callback(goods);
    });

    return unsubscribe;
  },
};
