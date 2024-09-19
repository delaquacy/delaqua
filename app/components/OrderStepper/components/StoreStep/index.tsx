import { FormWrapper } from "@/app/components/shared";
import {
  UserOrderItem,
  useOrderDetailsContext,
} from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import { CombinedItem } from "@/app/types";
import { findBottlesByCode } from "@/app/utils/findBottlesByCode";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>(
    {
      defaultValues: {
        items: [],
        bottlesNumberToReturn: "0",
      },
    }
  );

  const items = watch("items");

  const itemsDetails = items.map((item) => {
    const good = goods.find((good) => good.itemCode === item.itemCode);
    return {
      ...item,
      ...good,
    };
  });

  const { bigBottle, bigBottleRent, middleBottle, smallBottle } =
    findBottlesByCode(itemsDetails) as Record<string, CombinedItem | undefined>;

  const getOrderItemSum = (orderCount: string, orderSellPrice: string) => {
    return +orderCount * +orderSellPrice;
  };

  const onSubmit = (data: FormValues) => {
    if (showTooltipMessage) return;

    const formattedData = data.items.map((order) => {
      const isBigBottle = +order.itemCode === 119;
      const isMoreThanOneBigBottle = isBigBottle && +order.count > 1;

      const newSellPrice =
        isFirstOrder && isBigBottle && !isMoreThanOneBigBottle
          ? `${+order.sellPrice + 1}`
          : order.sellPrice;

      return {
        ...order,
        sellPrice: newSellPrice,
        sum: getOrderItemSum(order.count, newSellPrice),
      };
    });

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
        bottlesNumberToReturn: userOrder.bottlesNumberToReturn,
      });
    }
  }, [userOrder.items]);

  useEffect(() => {
    const bigBottleCount = bigBottle?.count ? +bigBottle.count : 0;
    const middleBottleCount = middleBottle?.count ? +middleBottle.count : 0;
    const smallBottleCount = smallBottle?.count ? +smallBottle.count : 0;

    const minOrder =
      (isFirstOrder ? bigBottleCount >= 1 : bigBottleCount >= 2) ||
      middleBottleCount >= 2 ||
      smallBottleCount >= 4;

    setShowTooltipMessage(!minOrder);
  }, [bigBottle, middleBottle, smallBottle, isFirstOrder]);

  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <WaterWrapper>
        {bigBottle && (
          <BigOrderCard
            imageSrc={bigBottle?.picture || ""}
            imageAlt={bigBottle.name}
            isFirstOrder={isFirstOrder}
            nameBottle={`items[1].count`}
            description={bigBottle?.description || ""}
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
            {middleBottle && (
              <Controller
                control={control}
                name={`items.2.count`}
                render={({ field }) => (
                  <OrderCard
                    imageAlt={middleBottle.name}
                    size="50"
                    available={middleBottle.available}
                    description={middleBottle.description || ""}
                    price={middleBottle!.sellPrice}
                    code={middleBottle!.itemCode}
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
                    available={smallBottle.available}
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
                      available={good!.available}
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
