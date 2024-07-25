import { OrdersData } from "../types";

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
      "Bottles to delivery": bottlesNumberToBuy,
      "Bottles to return": bottlesNumberToReturn,
      Pump: pump,
      Date: deliveryDate,
      Index: postalIndex,
      Address: deliveryAddress,
      "Address details": addressDetails,
      Location: geolocation,
      Time: deliveryTime,
      Notes: comments,
      Money: totalPayments,
      Payment: `${paymentMethod} - ${paymentStatus}`,
    };
  });
};
