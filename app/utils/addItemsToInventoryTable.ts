import { doc, getDoc, updateDoc } from "firebase/firestore";
import { GoodsValues } from "../components/GoodsIncomingForm";
import { db } from "../lib/config";

export const addItemsQuantityToInventoryTable = async (
  goodsValues: GoodsValues
) => {
  goodsValues.items.forEach(async (item) => {
    const itemRef = doc(db, `goodsInventory/${item.itemCode}`);

    const itemSnapshot = await getDoc(itemRef);

    await updateDoc(itemRef, {
      quantity: +itemSnapshot?.data()?.quantity + +item.quantity,
      lastInvoiceNumber: goodsValues.invoiceNumber,
      lastInvoiceDate: goodsValues.date,
    });
  });
};
