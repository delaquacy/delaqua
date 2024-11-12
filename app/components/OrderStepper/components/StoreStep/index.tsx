import { FormWrapper } from "@/app/components/shared";
import { UserOrderItem } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import { useStoreStepLogic } from "@/app/hooks/useStoreStepLogic";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
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

  const {
    control,
    handleSubmit,
    onSubmit,
    showTooltipMessage,
    items,
    setValue,
    watch,
    suppliesError,
    bigBottle,
    bigBottleRent,
    middleBottle,
    smallBottle,
    isFirstOrder,
    goods,
  } = useStoreStepLogic(handleNext);

  return (
    <FormWrapper component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <WaterWrapper>
        {bigBottle && (
          <BigOrderCard
            imageSrc={bigBottle?.picture || ""}
            imageAlt={bigBottle.name}
            available={bigBottle.available}
            isFirstOrder={isFirstOrder}
            nameBottle={`items[1].count`}
            description={bigBottle?.description || ""}
            priceBottle={bigBottle.sellPrice}
            codeBottle={bigBottle.itemCode}
            nameRent={`items[0].count`}
            priceRent={bigBottleRent?.sellPrice || "7"}
            codeRent={bigBottleRent?.itemCode || "120"}
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
                    sx={{
                      paddingTop: "10px",
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
                    sx={{
                      paddingTop: "10px",
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
      {renderButtonsGroup(
        suppliesError
          ? t("suppliesWithoutWater")
          : showTooltipMessage
          ? t("minimumOrder")
          : ""
      )}
    </FormWrapper>
  );
};
