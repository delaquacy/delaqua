import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { datePickerStyle } from "@/app/components/OrdersTableFilter/DateRangePicker";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import { deliveryValidation } from "@/app/utils";
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  dayOfWeekFormatter,
  getValidationMessage,
  shouldDisableDate,
} from "@/app/utils/dayStepUtils";
import { getNextAvailableDate } from "@/app/utils/getNextAvailableDate";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import { DataStepModal } from "../DataStepModal";

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Nicosia");

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
  const { isSmallScreen } = useScreenSize();
  const { userOrder, allOrders, handleAddOrderDetails } =
    useOrderDetailsContext();

  const [showTooltipMessage, setShowTooltipMessage] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [nextDay, setNextDay] = useState(dayjs());
  const [openModal, setOpenModal] = useState(false);

  const { control, handleSubmit, watch } = useForm<FormValues>({
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
  }, [allOrders]);

  useEffect(() => {
    const disableNextConditions =
      isCurrentDayAfterNoon ||
      isCurrentDayPrevious ||
      isCurrentDayIsSunday ||
      infoDay ||
      isOrdersLimitReached;

    setShowTooltipMessage(disableNextConditions);

    !isCurrentDayPrevious &&
      !isCurrentDayAfterNoon &&
      setOpenModal(isOrdersLimitReached);
  }, [
    isCurrentDayAfterNoon,
    isCurrentDayPrevious,
    isCurrentDayIsSunday,
    infoDay,
    isOrdersLimitReached,
  ]);

  useEffect(() => {
    const validationMessage = getValidationMessage(
      t,
      isOrdersLimitReached,
      isCurrentDayIsSunday,
      isCurrentDayPrevious,
      isCurrentDayAfterNoon
    );
    setErrorMessage(validationMessage);
  }, [
    isOrdersLimitReached,
    isCurrentDayIsSunday,
    isCurrentDayPrevious,
    isCurrentDayAfterNoon,
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
                  sx={datePickerStyle(isSmallScreen, true)}
                />
                <FormHelperText
                  sx={{ color: errorMessage ? "#d32f2f" : "gray" }}
                >
                  {errorMessage || `* ${t("delivery_date")}`}
                </FormHelperText>

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
      <DataStepModal open={openModal} onClose={() => setOpenModal(false)} />
    </LocalizationProvider>
  );
};
