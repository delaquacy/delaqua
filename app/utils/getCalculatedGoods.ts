import { GoodsAvailable } from "../components/GoodsAvailableTable";
import { GoodsValues } from "../components/GoodsIncomingForm";
import { OrdersData } from "../types";

export const getCalculatedGoods = (
  array: OrdersData[] | GoodsValues[],
  goods: GoodsAvailable[]
): GoodsAvailable[] => {
  return goods.map((good) => {
    const totalQuantity = array.reduce((acc, item) => {
      if ("canceled" in item || "orderStatus" in item) {
        const order = item as OrdersData;

        const completedOrder =
          (order?.orderStatus && !order.orderStatus.includes("Cancelled")) ||
          order.completed;

        if (!completedOrder) {
          return acc;
        }

        const matchingItem = order?.items?.find(
          (orderItem) => `${orderItem?.itemCode}` === `${good?.id}`
        );

        return acc + +(matchingItem?.count || 0);
      } else {
        const invoice = item as GoodsValues;

        const matchingItem = invoice?.items?.find(
          (invoiceItem) => `${invoiceItem?.itemCode}` === `${good?.id}`
        );

        return acc + +(matchingItem?.quantity || 0);
      }

      return acc;
    }, 0);

    return {
      ...good,
      quantity: totalQuantity.toString() || "0",
    };
  });
};
