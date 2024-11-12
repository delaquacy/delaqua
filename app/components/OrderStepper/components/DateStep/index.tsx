import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize, useToast } from "@/app/hooks";
import { deliveryValidation } from "@/app/utils";
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Loader } from "@/app/components/Loader";

import {
  datePickerStyle,
  dayOfWeekFormatter,
  getValidationMessage,
  shouldDisableDate,
} from "@/app/utils/dayStepUtils";
import { getNextAvailableDate } from "@/app/utils/getNextAvailableDate";
import { processOrder } from "@/app/utils/processOrder";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import { DataStepModal } from "../DataStepModal";
import { OrderCardCounter } from "../OrderCardCounter";

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
  bottlesNumberToReturn?: string;
}

export const DateStep = ({
  renderButtonsGroup,
  handleNext,
  returnBottles,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
  returnBottles?: boolean;
}) => {
  const { t } = useTranslation(["form", "main"]);

  const {
    userOrder,
    userData,
    allOrders,
    disabledDates,
    handleAddOrderDetails,
    setPaymentUrl,
  } = useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();
  const { showErrorToast } = useToast();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showTooltipMessage, setShowTooltipMessage] = useState({
    date: true,
    bottles: true,
  });
  const [nextDay, setNextDay] = useState(dayjs());
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      deliveryDate: dayjs(userOrder.deliveryDate, "DD.MM.YYYY"),
      deliveryTime: userOrder.deliveryTime,
      ...(returnBottles && { bottlesNumberToReturn: "0" }),
    },
  });

  const selectedDate = watch("deliveryDate");
  const returnBottlesCount = watch("bottlesNumberToReturn");

  const {
    isCurrentDayAfterTen,
    isCurrentDayAfterNoon,
    isCurrentDayPrevious,
    isCurrentDayIsSunday,
    infoDay,
    isOrdersLimitReached,
    isDisabledDate,
  } = deliveryValidation(selectedDate as Dayjs, disabledDates, allOrders);

  const onSubmit = async (data: FormValues) => {
    if (showTooltipMessage.date) {
      setShowTooltipMessage((prev) => ({
        ...prev,
        date: true,
      }));
      return;
    }

    const dateObj = {
      deliveryDate: (data.deliveryDate as Dayjs).format("DD.MM.YYYY"),
      deliveryTime: data.deliveryTime,
    };

    handleAddOrderDetails(dateObj);

    if (returnBottles) {
      setLoading(true);

      handleAddOrderDetails({
        bottlesNumberToReturn: data.bottlesNumberToReturn,
      });

      const orderData = {
        ...userOrder,
        ...dateObj,
        ...(returnBottles && {
          bottlesNumberToReturn: data.bottlesNumberToReturn,
        }),
        createdAt: dayjs().format("DD.MM.YYYY HH:mm"),
        items: [],
        paymentMethod: "Return cash",
        paymentStatus: "ReturnCash",
      };

      await processOrder(
        userData,
        userOrder,
        orderData,
        disabledDates,
        setPaymentUrl,
        handleNext,
        showErrorToast,
        returnBottles
      );
    }

    handleNext();
  };

  useEffect(() => {
    const nextDay = getNextAvailableDate(disabledDates, allOrders);
    setNextDay(nextDay);
  }, [allOrders]);

  useEffect(() => {
    const disableNextConditions =
      isCurrentDayAfterNoon ||
      isCurrentDayPrevious ||
      isCurrentDayIsSunday ||
      infoDay ||
      isDisabledDate ||
      isOrdersLimitReached;

    !isCurrentDayPrevious &&
      !isCurrentDayAfterNoon &&
      setOpenModal(isOrdersLimitReached);

    setShowTooltipMessage((prev) => ({ ...prev, date: disableNextConditions }));
  }, [
    isCurrentDayAfterNoon,
    isCurrentDayPrevious,
    isCurrentDayIsSunday,
    infoDay,
    isDisabledDate,
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

  useEffect(() => {
    if (returnBottles) {
      setValue("bottlesNumberToReturn", userOrder.bottlesNumberToReturn);
    } else {
      setShowTooltipMessage((prev) => ({
        ...prev,
        bottles: false,
      }));
    }
  }, [userOrder, returnBottles]);

  useEffect(() => {
    if (returnBottles) {
      setShowTooltipMessage((prev) => ({
        ...prev,
        bottles: +(returnBottlesCount || "0") <= 0,
      }));
    }
  }, [returnBottles, returnBottlesCount]);

  if (loading) {
    return <Loader text={t("loading_order")} />;
  }

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
                    shouldDisableDate(date, disabledDates)
                  }
                  sx={datePickerStyle(isSmallScreen, true)}
                />
                {
                  <FormHelperText
                    sx={{
                      color: showTooltipMessage.date ? "#d32f2f" : "gray",
                    }}
                  >
                    {!isCurrentDayPrevious && isCurrentDayIsSunday
                      ? t("sunday")
                      : infoDay
                      ? t("info", { ns: "main" })
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
                  {showTooltipMessage.date &&
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
                  disabled={showTooltipMessage.date || isCurrentDayAfterTen}
                />
                <FormControlLabel
                  value="9-17"
                  control={<Radio />}
                  label={t("delivery_time_9_17")}
                  disabled={showTooltipMessage.date}
                />
              </RadioGroup>
            )}
          />
          {returnBottles && (
            <Box
              sx={{
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              <Controller
                name="bottlesNumberToReturn"
                control={control}
                render={({ field }) => (
                  <Box display="flex" flexDirection="column">
                    <Typography textAlign={isSmallScreen ? "center" : "left"}>
                      {t("number_of_bottles_to_return")}
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent={isSmallScreen ? "center" : "flex-start"}
                    >
                      <OrderCardCounter
                        count={field?.value || "0"}
                        onAdd={() => field.onChange(+(field?.value || "0") + 1)}
                        disabled={showTooltipMessage.date}
                        onRemove={() => {
                          field.onChange(
                            Math.max(+(field?.value || "0") - 1, 0)
                          );
                        }}
                      />
                    </Box>
                  </Box>
                )}
              />
            </Box>
          )}
        </Box>
        {renderButtonsGroup(
          showTooltipMessage.date
            ? "Please select correct delivery date"
            : showTooltipMessage.bottles
            ? "You can not to return 0 bottles"
            : ""
        )}
      </Box>
      <DataStepModal open={openModal} onClose={() => setOpenModal(false)} />
    </LocalizationProvider>
  );
};
