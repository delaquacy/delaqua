import dayjs, { Dayjs } from "dayjs";

export const deliveryValidation = (selectedDate: Date | Dayjs) => {
  const now = dayjs();
  const watchedDate = dayjs(selectedDate);

  const afterTen = now.startOf("day").add(10, "hours");
  const noon = now.startOf("day").add(12, "hours");

  return {
    isCurrentDayAfterTen:
      now.isSame(watchedDate, "day") && now.isAfter(afterTen),
    isCurrentDayAfterNoon: now.isSame(watchedDate, "day") && now.isAfter(noon),
    isCurrentDayPrevious: now.isAfter(watchedDate, "day"),
    isCurrentDayIsSunday: watchedDate.day() === 0,
  };
};
