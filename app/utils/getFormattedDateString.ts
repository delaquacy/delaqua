export const getFormattedDateString = (dateString: string): string => {
  const [day, month, year] = dateString
    .split(".")
    .map((num) => num.padStart(2, "0"));
  return `${year}-${month}-${day}`;
};
