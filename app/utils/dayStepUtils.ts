import dayjs, { Dayjs } from "dayjs";
import { deliveryValidation } from "./deliveryDateValidation";

// Formats the day of the week from a Date object into a two-letter abbreviation in uppercase - DataPicker.
export const dayOfWeekFormatter = (dayOfWeek: string, date: Dayjs) => {
  const formattedDay = dayjs(date).format("dd");
  return formattedDay.toUpperCase();
};

export const shouldDisableDate = (date: Dayjs, disabledDates: string[]) => {
  const {
    isCurrentDayAfterNoon,
    isCurrentDayIsSunday,
    infoDay,
    isDisabledDate,
  } = deliveryValidation(date, disabledDates);

  return (
    infoDay || isCurrentDayIsSunday || isCurrentDayAfterNoon || isDisabledDate
  );
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

export const datePickerStyle = (
  isSmallScreen: boolean,
  widthFull?: boolean
) => ({
  width: isSmallScreen ? (widthFull ? "100%" : "112px !important") : "231px",
  minWidth: isSmallScreen ? "90px !important" : "231px",
  "& .MuiFormLabel-root": {
    fontSize: isSmallScreen ? "10px" : "",
    transform: isSmallScreen ? "translate(14px, 9px) scale(1) !important" : "",
  },
  "& .MuiInputLabel-shrink": {
    fontSize: isSmallScreen ? "10px" : "",
    transform: isSmallScreen
      ? "translate(14px, -6px) scale(0.75) !important"
      : "",
  },
});
