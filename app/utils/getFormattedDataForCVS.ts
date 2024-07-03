import { OrdersData } from "../components/OrdersTable";

export const getFormattedDataForCVS = (orders: OrdersData[]) => {
  return orders.map((order) => {
    const {
      userId,
      useId,
      firstAndLast,
      phoneNumber,
      bottlesNumberToBuy,
      bottlesNumberToReturn,
      pump,
      deliveryDate,
      index,
      deliveryAddress,
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
      "Bottles to delivery": bottlesNumberToBuy,
      "Bottles to return": bottlesNumberToReturn,
      Pump: pump,
      Date: deliveryDate,
      Index: index,
      Address: deliveryAddress,
      Location: geolocation,
      Time: deliveryTime,
      Notes: comments,
      Money: totalPayments,
      Payment: `${paymentMethod} - ${paymentStatus}`,
    };
  });
};
