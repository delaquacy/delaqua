import dayjs, { Dayjs } from "dayjs";
import { getFormattedDateString } from "./getFormattedDateString";

export const getDateDifference = (aValue: string | Dayjs, bValue: string) => {
  const dateA = dayjs(getFormattedDateString(aValue as string), "YYYY-MM-DD");
  const dateB = dayjs(getFormattedDateString(bValue as string), "YYYY-MM-DD");

  return dateB.diff(dayjs(dateA));
};
