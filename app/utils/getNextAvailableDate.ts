import dayjs from "dayjs";
import { OrdersData } from "../types";
import { deliveryValidation } from "./deliveryDateValidation";

export const getNextAvailableDate = (
  disabledDates: string[],
  allOrders: OrdersData[]
) => {
  let nextDay = dayjs().add(1, "day");

  while (true) {
    const { isCurrentDayIsSunday, infoDay, isOrdersLimitReached } =
      deliveryValidation(nextDay, disabledDates, allOrders);

    if (!isCurrentDayIsSunday && !infoDay && !isOrdersLimitReached) {
      break;
    }

    nextDay = nextDay.add(1, "day");
  }

  return nextDay;
};
