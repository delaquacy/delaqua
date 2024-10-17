import { CombinedItem, OrdersData, UserOrderItem } from "../types";
import { findBottlesByCode } from "./findBottlesByCode";

const POMP_CODES_MAX = 104;

export const getFormattedDataForCVS = (orders: OrdersData[]) => {
  return orders.map((order) => {
    const { bigBottle, bigBottleRent, middleBottle, smallBottle } =
      findBottlesByCode(order?.items) as Record<
        string,
        CombinedItem | undefined
      >;

    const pomps =
      order?.items &&
      order?.items.reduce(
        (acc: string, item: UserOrderItem) =>
          +item.itemCode <= +POMP_CODES_MAX
            ? acc + ` ${item.itemCode}(${item.count})`
            : acc,
        ""
      );

    const {
      userId,
      useId,
      firstAndLast,
      phoneNumber,
      bottlesNumberToBuy,
      bottlesNumberToReturn,
      pump,
      deliveryDate,
      postalIndex,
      deliveryAddress,
      addressDetails,
      geolocation,
      deliveryTime,
      comments,
      totalPayments,
      paymentMethod,
      paymentStatus,
    } = order;

    return {
      "Client ID": userId || useId,
      "Client Name": firstAndLast,
      "Client Phone": phoneNumber,
      "18.9 L Bottles to delivery": bigBottle?.count || "-",
      "Bottles to return": bottlesNumberToReturn || "-",
      "15 L Bottles to delivery": middleBottle?.count || "-",
      "10 L Bottles to delivery": smallBottle?.count || "-",
      Pump: pomps || "-",
      Date: deliveryDate,
      Index: postalIndex,
      Address: deliveryAddress,
      "Address details": addressDetails || "-",
      Location: geolocation,
      Time: deliveryTime,
      Notes: comments || "-",
      Money: totalPayments,
      Payment: `${paymentMethod} - ${paymentStatus}`,
    };
  });
};
