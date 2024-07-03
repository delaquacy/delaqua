import dayjs from "dayjs";
import { getFormattedDateString } from "./getFormattedDateString";
import { getDateDifference } from "./getDateDifference";

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = a[orderBy] as string | number;
  const bValue = b[orderBy] as string | number;

  const isDate = (value: string | number): value is string => {
    return (
      typeof value === "string" &&
      dayjs(getFormattedDateString(value), "YYYY-MM-DD", true).isValid()
    );
  };

  if (isDate(aValue) && isDate(bValue)) {
    return getDateDifference(aValue, bValue);
  }

  return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
}
