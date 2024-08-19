import { useEffect, useState } from "react";
import { Box, Card, FormHelperText, Theme, useTheme } from "@mui/material";
import { OrderCard } from "./OrderCard";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  UserOrderItem,
  useOrderDetailsContext,
} from "@/app/contexts/OrderDetailsContext";
import { useTranslation } from "react-i18next";

interface FormValues {
  items: UserOrderItem[];
}

export const FirstStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const theme = useTheme();
  const { t } = useTranslation("form");

  const { goods, userOrder, isFirstOrder, handleAddOrderDetails } =
    useOrderDetailsContext();

  const [showTooltipMessage, setShowTooltipMessage] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      items: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const bigBottleCount = watchedItems.find((item) => item.id === "119")?.count;

  const getOrderItemSum = (order: UserOrderItem) => {
    return +order.count ? +order.count * +order.sellPrice : "";
  };

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    const formattedData = data.items.map((order) => ({
      ...order,
      sum: getOrderItemSum(order),
    }));

    handleAddOrderDetails({
      items: formattedData,
      totalPayments: formattedData.reduce((acc, item) => acc + +item.sum, 0),
    });

    handleNext();
  };

  useEffect(() => {
    if (userOrder.items.length > 0) {
      reset({
        items: userOrder.items,
      });
    }
  }, [userOrder.items]);

  useEffect(() => {
    if (bigBottleCount === undefined) return;
    // User should order 1 or more bottles on the first order and 2 or more bottles on the next orders
    const orderRequirement = isFirstOrder
      ? +bigBottleCount >= 1
      : +bigBottleCount >= 2;

    setShowTooltipMessage(!orderRequirement);
  }, [bigBottleCount, isFirstOrder]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          padding: "20px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        {/* TODO: ADD ACCORDION FOR TWO CATEGORIES */}
        <Box sx={gridStyle(theme)}>
          {/* {errors.items && (
            <Box color={"black"}>{errors?.items?.root?.message}</Box> //TODO way to show error
          )} */}
          {goods
            .filter((good) => good.id !== "120")
            .reverse()
            .map((good, index) => {
              return (
                <Controller
                  key={good.id}
                  control={control}
                  name={`items.${index}.count`}
                  render={({ field }) => (
                    <OrderCard
                      imageSrc={good!.picture}
                      imageAlt={good!.name}
                      title={good!.name}
                      description={good!.description}
                      price={good!.sellPrice}
                      code={good!.itemCode}
                      count={field.value}
                      onAdd={() => {
                        field.onChange(+field.value + 1);
                      }}
                      onRemove={() => {
                        field.onChange(Math.max(+field.value - 1, 0));
                      }}
                    />
                  )}
                />
              );
            })}
        </Box>

        <FormHelperText
          sx={{
            marginTop: "30px",
            fontSize: "14px",
          }}
        >
          {isFirstOrder ? t("minimumOrderSmall") : t("minimumOrderBig")}
        </FormHelperText>

        {renderButtonsGroup(showTooltipMessage ? t("minimumOrder") : "")}
      </Card>
    </form>
  );
};

const gridStyle = (theme: Theme) => ({
  display: "grid",
  [theme.breakpoints.down(350)]: {
    gridTemplateColumns: "repeat(1, 1fr)",
  },
  [theme.breakpoints.between("xs", "sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(5, 1fr)",
  },
  gap: "25px",
});
