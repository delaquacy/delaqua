import { deliveryValidation } from "@/app/utils/deliveryDateValidation";
import { Dayjs } from "dayjs";
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";

export const validateDate = (
  date: Dayjs | null,
  setError: UseFormSetError<any>,
  clearErrors: UseFormClearErrors<any>,
  setCanSubmitData: (val: boolean) => void
) => {
  if (!date) {
    return false;
  }

  const {
    isCurrentDayAfterNoon,
    isCurrentDayPrevious,
    isCurrentDayIsSunday,
    infoDay,
  } = deliveryValidation(date);

  if (
    (isCurrentDayAfterNoon && !isCurrentDayIsSunday && !isCurrentDayPrevious) ||
    isCurrentDayPrevious ||
    infoDay
  ) {
    setError("deliveryDate", {
      type: "manual",
      message: "soonest_day",
    });
    setCanSubmitData(false);

    return false;
  }

  if (isCurrentDayIsSunday) {
    setError("deliveryDate", {
      type: "manual",
      message: "sunday",
    });
    setCanSubmitData(false);

    return false;
  }

  clearErrors("deliveryDate");
  setCanSubmitData(true);
  return true;
};
