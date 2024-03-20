import dayjs from "dayjs";

type DayOfWeekMap = {
  [key: string]: string;
};
export const dayOfWeekUk: DayOfWeekMap = {
  Monday: "понеділок",
  Tuesday: "вівторок",
  Wednesday: "середу",
  Thursday: "четвер",
  Friday: "п’ятницю",
  Saturday: "суботу",
  Sunday: "неділю",
};
export const dayOfWeekRu: DayOfWeekMap = {
  Monday: "понедельник",
  Tuesday: "вторник",
  Wednesday: "среду",
  Thursday: "четверг",
  Friday: "пятницу",
  Saturday: "субботу",
  Sunday: "воскресенье",
};
export const dayOfWeekEl: DayOfWeekMap = {
  Monday: "Δευτέρα",
  Tuesday: "Τρίτη",
  Wednesday: "Τετάρτη",
  Thursday: "Πέμπτη",
  Friday: "Παρασκευή",
  Saturday: "Σάββατο",
  Sunday: "Κυριακή",
};
export const dayOfWeekEn: DayOfWeekMap = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
};

export function getDayOfWeek(date: any, lang: string): string {
  const engDayOfWeek = dayjs(date).format("dddd");
  console.log(engDayOfWeek);
  switch (lang) {
    case "uk":
      return dayOfWeekUk[engDayOfWeek];
    case "ru":
      return dayOfWeekRu[engDayOfWeek];
    case "el":
      return dayOfWeekEl[engDayOfWeek];
    case "en":
      return dayOfWeekEn[engDayOfWeek];
    default:
      return engDayOfWeek;
  }
}
