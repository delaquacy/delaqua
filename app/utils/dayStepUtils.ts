import dayjs, { Dayjs } from "dayjs";
import { deliveryValidation } from "./deliveryDateValidation";

// Formats the day of the week from a Date object into a two-letter abbreviation in uppercase - DataPicker.
export const dayOfWeekFormatter = (dayOfWeek: string, date: Dayjs) => {
  const formattedDay = dayjs(date).format("dd");
  return formattedDay.toUpperCase();
};

export const shouldDisableDate = (date: Dayjs) => {
  const { isCurrentDayAfterNoon, isCurrentDayIsSunday, infoDay } =
    deliveryValidation(date);

  return infoDay || isCurrentDayIsSunday || isCurrentDayAfterNoon;
};

export const getValidationMessage = (
  t: any,
  isOrdersLimitReached: boolean,
  isSunday: boolean,
  isPrevious: boolean,
  isAfterNoon: boolean
): string => {
  if (isPrevious || isAfterNoon) return t("change_day");
  if (isOrdersLimitReached)
    return `${t("maxNumOrdersTitle")} ${t("maxNumOrdersSubtitle")}`;
  if (isSunday) return t("sunday");
  return "";
};
