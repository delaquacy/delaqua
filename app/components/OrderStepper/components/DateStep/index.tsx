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

import { OrdersData } from "@/app/types";
import { getNextAvailableDate } from "@/app/utils/getNextAvailableDate";
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

  const { userOrder, allOrders, handleAddOrderDetails } =
    useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();

  const disabledDates: any = useDatesFromDB();

  const [showTooltipMessage, setShowTooltipMessage] = useState(true);
  const [nextDay, setNextDay] = useState(dayjs());
  const [isOrdersMaxNum, setIsOrdersMaxNum] = useState(false);

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
    isOrdersLimitReached,
  } = deliveryValidation(selectedDate as Dayjs, allOrders);

  const shouldDisableDate = (date: Dayjs, orders: OrdersData[]) => {
    const { isCurrentDayAfterNoon, isCurrentDayIsSunday, infoDay } =
      deliveryValidation(date, allOrders);

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
    const nextDay = getNextAvailableDate(allOrders);
    setNextDay(nextDay);
  }, [allOrders, disabledDates]);

  useEffect(() => {
    const disableNextConditions =
      isCurrentDayAfterNoon ||
      isCurrentDayPrevious ||
      isCurrentDayIsSunday ||
      infoDay ||
      isOrdersLimitReached;

    setShowTooltipMessage(disableNextConditions);
    setIsOrdersMaxNum(isOrdersLimitReached);
  }, [
    isCurrentDayAfterNoon,
    isCurrentDayPrevious,
    isCurrentDayIsSunday,
    infoDay,
    isOrdersLimitReached,
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
                  shouldDisableDate={(date: Dayjs) =>
                    shouldDisableDate(date, allOrders)
                  }
                  sx={datePickerStyle(isSmallScreen, true)}
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
                      : isOrdersMaxNum
                      ? t("maxNumOrders")
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
