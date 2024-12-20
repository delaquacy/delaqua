import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { OrdersData } from "../types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Nicosia");

export const ORDERS_MAX_NUM = 45;

export const deliveryValidation = (
  selectedDate: Date | Dayjs,
  disabledDates: string[],
  allOrders?: OrdersData[]
) => {
  const now = dayjs().tz();
  const watchedDate = dayjs(selectedDate).tz();

  const afterTen = now.startOf("day").add(10, "hours");
  const noon = now.startOf("day").add(12, "hours");
  const infoDay = dayjs(selectedDate).format("DD/MM/YYYY") === "28/10/2024";

  const isDisabledDate = disabledDates.includes(
    watchedDate.format("DD-MM-YYYY")
  );

  const ordersOnSelectedDate =
    allOrders &&
    allOrders.filter(({ deliveryDate, orderStatus, canceled, userId }) => {
      const isCorrectDate = deliveryDate === watchedDate.format("DD.MM.YYYY");

      const isNotCancelled = orderStatus
        ? !orderStatus.includes("Cancelled")
        : !canceled;

      const isNotDevUser = userId !== 808; // 808 - dev userId

      return isCorrectDate && isNotCancelled && isNotDevUser;
    });

  const isOrdersLimitReached = ordersOnSelectedDate
    ? ordersOnSelectedDate.length >= ORDERS_MAX_NUM
    : !!ordersOnSelectedDate;

  return {
    isCurrentDayAfterTen:
      now.isSame(watchedDate, "day") && now.isAfter(afterTen),
    isCurrentDayAfterNoon: now.isSame(watchedDate, "day") && now.isAfter(noon),
    isCurrentDayPrevious: now.isAfter(watchedDate, "day"),
    isCurrentDayIsSunday: watchedDate.day() === 0,
    infoDay,
    isOrdersLimitReached,
    isDisabledDate,
  };
};
