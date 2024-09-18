import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { FilterItem, OrdersData } from "../types";
import { getFormattedDateString } from "./getFormattedDateString";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const getFilteredOrders = (
  filters: FilterItem[],
  orders: OrdersData[]
): OrdersData[] => {
  let filteredOrders = orders;

  const filterFunctions: {
    [key: string]: (order: OrdersData, filter: FilterItem) => boolean;
  } = {
    "Delivery Date": (order, filter) => {
      const startDate = dayjs(filter.value1);
      const endDate = dayjs(filter.value2);
      const deliveryDate = dayjs(getFormattedDateString(order.deliveryDate));

      return (
        deliveryDate.isSameOrAfter(startDate, "day") &&
        deliveryDate.isSameOrBefore(endDate, "day")
      );
    },
    "Phone Number": (order, filter) => order.phoneNumber === filter.value1,
    "Client ID": (order, filter) =>
      (order?.userId || order?.useId || "") === +filter.value1,
    "Payment Status": (order, filter) => order.paymentStatus === filter.value1,
    "Delivery Time": (order, filter) =>
      order.deliveryTime === filter.value1.split(" ").join(""),
    "Order Status": (order, filter) =>
      filter.value1 === "progress"
        ? !order.canceled && !order.completed
        : (order[filter.value1 as keyof OrdersData] as boolean),
  };

  filters.forEach((filter) => {
    const filterFunction = filterFunctions[filter.column];

    if (filterFunction && !!filter.value1) {
      filteredOrders = filteredOrders.filter((order) =>
        filterFunction(order, filter)
      );
    }
  });

  return filteredOrders;
};
