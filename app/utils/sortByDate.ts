import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

export const sortByDate = (
  a: string | Timestamp,
  b: string | Timestamp,
  formatString: string = "DD.MM.YYYY HH:mm"
) => {
  const dateA =
    typeof a === "string"
      ? dayjs(a, formatString)
      : dayjs((a as Timestamp).toDate());

  const dateB =
    typeof b === "string"
      ? dayjs(b, formatString)
      : dayjs((b as Timestamp).toDate());

  return dateB.isAfter(dateA) ? 1 : -1;
};
