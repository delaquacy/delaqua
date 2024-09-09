import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { datePickerStyle } from "@/app/components/OrdersTableFilter/DateRangePicker";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import { deliveryValidation } from "@/app/utils";
import useDatesFromDB from "@/app/utils/getUnableDates";
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Nicosia");

// Formats the day of the week from a Date object into a two-letter abbreviation in uppercase - DataPicker.
const dayOfWeekFormatter = (dayOfWeek: string, date: Dayjs) => {
  const formattedDay = dayjs(date).format("dd");
  return formattedDay.toUpperCase();
};

interface FormValues {
  deliveryDate: Dayjs | string;
  deliveryTime: string;
}

export const DateStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const { t } = useTranslation("form");

  const { userOrder, handleAddOrderDetails } = useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();

  const disabledDates: any = useDatesFromDB();

  const [showTooltipMessage, setShowTooltipMessage] = useState(true);
  const [nextDay, setNextDay] = useState(dayjs());

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      deliveryDate: dayjs(userOrder.deliveryDate, "DD.MM.YYYY"),
      deliveryTime: userOrder.deliveryTime,
    },
  });

  const selectedDate = watch("deliveryDate");

  const {
    isCurrentDayAfterTen,
    isCurrentDayAfterNoon,
    isCurrentDayPrevious,
    isCurrentDayIsSunday,
    infoDay,
  } = deliveryValidation(selectedDate as Dayjs);

  if (isCurrentDayAfterTen) {
    setValue("deliveryTime", "9-17");
  }

  const shouldDisableDate = (date: Dayjs) => {
    const { isCurrentDayAfterNoon, isCurrentDayIsSunday, infoDay } =
      deliveryValidation(date);

    return (
      infoDay ||
      isCurrentDayIsSunday ||
      disabledDates.includes(date.format("DD.MM.YYYY")) ||
      isCurrentDayAfterNoon
    );
  };

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    handleAddOrderDetails({
      deliveryDate: (data.deliveryDate as Dayjs).format("DD.MM.YYYY"),
      deliveryTime: data.deliveryTime,
    });
    handleNext();
  };

  useEffect(() => {
    // Calculate the next delivery day.
    // If today is Saturday and the current time is after noon, set the next delivery day to Monday.
    let nextDay = dayjs().add(1, "day");

    if (
      dayjs().day() === 6 &&
      dayjs().isAfter(dayjs().startOf("day").add(12, "hours"))
    ) {
      nextDay = dayjs().add(2, "day");
    }

    setNextDay(nextDay);

    if (isCurrentDayIsSunday || isCurrentDayAfterNoon) {
      setValue("deliveryDate", nextDay);
    }
  }, []);

  useEffect(() => {
    const disableNextConditions =
      isCurrentDayAfterNoon ||
      isCurrentDayPrevious ||
      isCurrentDayIsSunday ||
      infoDay;

    setShowTooltipMessage(disableNextConditions);
  }, [
    isCurrentDayAfterNoon,
    isCurrentDayPrevious,
    isCurrentDayIsSunday,
    infoDay,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component={"form"}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Controller
            name="deliveryDate"
            control={control}
            render={({ field }) => (
              <Box>
                <DatePicker
                  label={t("delivery_date_short")}
                  format="DD-MM-YYYY"
                  value={field.value as Dayjs}
                  onChange={(newVal) => field.onChange(newVal)}
                  disablePast
                  dayOfWeekFormatter={dayOfWeekFormatter}
                  shouldDisableDate={(date: Dayjs) => shouldDisableDate(date)}
                  sx={datePickerStyle(isSmallScreen)}
                />
                {
                  <FormHelperText
                    sx={{
                      color: showTooltipMessage ? "#d32f2f" : "gray",
                    }}
                  >
                    {!isCurrentDayPrevious && isCurrentDayIsSunday
                      ? t("sunday")
                      : isCurrentDayPrevious || isCurrentDayAfterNoon
                      ? t("change_day")
                      : `* ${t("delivery_date")}`}
                  </FormHelperText>
                }
                <FormHelperText
                  sx={{
                    color: "#d32f2f",
                  }}
                >
                  {showTooltipMessage &&
                    t("soonest_day", {
                      nextDay: `${nextDay.format("dddd")} - ${nextDay.format(
                        "DD MMMM"
                      )}`,
                    })}
                </FormHelperText>
              </Box>
            )}
          />

          <Controller
            name="deliveryTime"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                }}
              >
                <FormControlLabel
                  value="9-12"
                  control={<Radio />}
                  label={t("delivery_time_9_12")}
                  disabled={showTooltipMessage || isCurrentDayAfterTen}
                />
                <FormControlLabel
                  value="9-17"
                  control={<Radio />}
                  label={t("delivery_time_9_17")}
                  disabled={showTooltipMessage}
                />
              </RadioGroup>
            )}
          />
        </Box>
        {renderButtonsGroup(
          showTooltipMessage ? "Please select correct delivery date" : ""
        )}
      </Box>
    </LocalizationProvider>
  );
};
