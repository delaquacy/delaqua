import dayjs from "dayjs";
import { OrdersData } from "../types";
import { deliveryValidation } from "./deliveryDateValidation";

export const getNextAvailableDate = (allOrders: OrdersData[]) => {
  let nextDay = dayjs().add(1, "day");

  while (true) {
    const { isCurrentDayIsSunday, infoDay, isOrdersLimitReached } =
      deliveryValidation(nextDay, allOrders);

    if (!isCurrentDayIsSunday && !infoDay && !isOrdersLimitReached) {
      break;
    }

    nextDay = nextDay.add(1, "day");
  }

  return nextDay;
};
