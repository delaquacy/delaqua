import { FormWrapper } from "@/app/components/shared";
import {
  UserOrderItem,
  useOrderDetailsContext,
} from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BigOrderCard } from "../BigOrderCard";
import { OrderCard } from "../OrderCard";
import {
  CustomGrid,
  SmallWaterWrapper,
  TextWrapper,
  WaterWrapper,
} from "./styled";

interface FormValues {
  items: UserOrderItem[];
  bottlesNumberToReturn: string;
}

export const StoreStep = ({
  renderButtonsGroup,
  handleNext,
}: {
  renderButtonsGroup: (errorMessage?: string) => React.ReactNode;
  handleNext: () => void;
}) => {
  const { t } = useTranslation("form");
  const { isSmallScreen } = useScreenSize();

  const { goods, userOrder, isFirstOrder, handleAddOrderDetails } =
    useOrderDetailsContext();

  const [showTooltipMessage, setShowTooltipMessage] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      items: [],
      bottlesNumberToReturn: "0",
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const itemsDetails = items.map((item) => {
    const good = goods.find((good) => good.itemCode === item.itemCode);

    return {
      ...item,
      ...good,
    };
  });

  const bigBottle = itemsDetails[1];
  const mediumBottle = itemsDetails[2];
  const smallBottle = itemsDetails[3];

  const getOrderItemSum = (order: UserOrderItem) => {
    return +order.count ? +order.count * +order.sellPrice : "";
  };

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    console.log(data, "DATA");

    const formattedData = data.items.map((order) => ({
      ...order,
      sum: getOrderItemSum(order),
    }));

    console.log(formattedData);

    handleAddOrderDetails({
      items: formattedData,
      bottlesNumberToReturn: data.bottlesNumberToReturn,
      totalPayments: formattedData.reduce((acc, item) => acc + +item.sum, 0),
    });

    handleNext();
  };

  useEffect(() => {
    if (userOrder.items.length > 0) {
      reset({
        items: userOrder.items,
        bottlesNumberToReturn: userOrder.deliveryAddressObj.numberOfBottles,
      });
    }
  }, [userOrder.items]);

  useEffect(() => {
    const minOrder =
      (isFirstOrder ? +bigBottle?.count >= 1 : +bigBottle?.count >= 2) ||
      +mediumBottle?.count >= 2 ||
      +smallBottle?.count >= 4;

    setShowTooltipMessage(!minOrder);
  }, [bigBottle, mediumBottle, smallBottle, isFirstOrder]);

  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <WaterWrapper>
        {bigBottle && (
          <BigOrderCard
            imageSrc={bigBottle.picture || ""}
            imageAlt={bigBottle.name}
            isFirstOrder={isFirstOrder}
            nameBottle={`items[1].count`}
            description={bigBottle.description || ""}
            priceBottle={bigBottle.sellPrice}
            codeBottle={bigBottle.itemCode}
            nameRent={`items[0].count`}
            priceRent={goods.at(-1)!.sellPrice}
            codeRent={goods.at(-1)!.itemCode}
            nameReturn={"bottlesNumberToReturn"}
            watch={watch}
            control={control}
            setValue={setValue}
          />
        )}

        <SmallWaterWrapper>
          <Box
            sx={{
              flex: 1,
            }}
          >
            {mediumBottle && (
              <Controller
                control={control}
                name={`items.2.count`}
                render={({ field }) => (
                  <OrderCard
                    imageAlt={mediumBottle.name}
                    size="50"
                    description={mediumBottle.description || ""}
                    price={mediumBottle!.sellPrice}
                    code={mediumBottle!.itemCode}
                    count={field.value}
                    minOrder={"115Min"}
                    onAdd={() => {
                      field.onChange(+field.value + 1);
                      setValue("bottlesNumberToReturn", "0");
                    }}
                    onRemove={() => {
                      field.onChange(Math.max(+field.value - 1, 0));
                    }}
                  />
                )}
              />
            )}
          </Box>

          <Box
            sx={{
              flex: 1,
            }}
          >
            {smallBottle && (
              <Controller
                control={control}
                name={`items.3.count`}
                render={({ field }) => (
                  <OrderCard
                    imageAlt={smallBottle.name}
                    size="50"
                    description={smallBottle.description || ""}
                    price={smallBottle.sellPrice}
                    code={smallBottle.itemCode}
                    count={field.value}
                    minOrder={"110Min"}
                    onAdd={() => {
                      field.onChange(+field.value + 1);
                      setValue("bottlesNumberToReturn", "0");
                    }}
                    onRemove={() => {
                      field.onChange(Math.max(+field.value - 1, 0));
                    }}
                  />
                )}
              />
            )}
          </Box>
        </SmallWaterWrapper>
      </WaterWrapper>

      <TextWrapper>
        <Typography fontWeight="bold" fontSize="18px">
          {t(`${isFirstOrder ? "addToOrderFirst" : "addToOrder"}`)}:
        </Typography>
      </TextWrapper>

      <CustomGrid>
        {goods
          .filter((good) => good.category === "supplies")
          .map((good) => {
            const itemIndex = items.findIndex(
              (item) => good.itemCode === item.itemCode
            );

            return (
              itemIndex !== -1 && (
                <Controller
                  key={good.id}
                  control={control}
                  name={`items.${itemIndex}.count`}
                  render={({ field }) => (
                    <OrderCard
                      imageSrc={
                        isSmallScreen
                          ? good!.picture
                          : +good.itemCode === 104
                          ? ""
                          : good!.picture
                      }
                      imageAlt={good!.name}
                      size="40"
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
                      sx={{
                        flex: 1,
                      }}
                    />
                  )}
                />
              )
            );
          })}
      </CustomGrid>
      {renderButtonsGroup(showTooltipMessage ? t("minimumOrder") : "")}
    </FormWrapper>
  );
};
