import { Box, Card } from "@mui/material";
import { useForm } from "react-hook-form";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useState } from "react";
import dayjs from "dayjs";

import { useTranslation } from "react-i18next";
import { useScreenSize } from "@/app/hooks";

import useDatesFromDB from "@/app/utils/getUnableDates";
import { useTheme } from "@emotion/react";

interface FormValues {}

export const FifthStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const { t } = useTranslation("form");

  const theme = useTheme();
  const { userOrder, handleAddOrderDetails } = useOrderDetailsContext();
  const { isSmallScreen } = useScreenSize();
  const disabledDates: any = useDatesFromDB();

  const [showTooltipMessage, setShowTooltipMessage] = useState(true);
  const [nextDay, setNextDay] = useState(dayjs());

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {},
  });

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    console.log(data, "INSIDE");

    // handleAddOrderDetails(data);
    // handleNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          padding: "20px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          ** info after payment
        </Box>
        {renderButtonsGroup(showTooltipMessage ? "Done Requirement first" : "")}
      </Card>
    </form>
  );
};
