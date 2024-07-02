import dayjs from "dayjs";

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export const getDateFromTimestamp = (timestamp: Timestamp) => {
  const milliseconds =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
  return dayjs(milliseconds).format("DD.MM.YYYY, HH:mm");
};
