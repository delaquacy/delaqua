"use client";
import { useScreenSize, useWriteGoodsOff } from "@/app/hooks";
import { UserOrderItem } from "@/app/types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Controller } from "react-hook-form";
import { Loader } from "../Loader";
import { OrderCard } from "../OrderStepper/components";
import { CardShadow, SharedButton } from "../shared";
import { FormWrapper, Grid } from "./styled";

export interface FormValues {
  items: UserOrderItem[];
  createdAt: Dayjs;
}

export const WriteGoodsOff = () => {
  const { isSmallScreen } = useScreenSize();

  const { isLoading, goods, control, handleSubmit, onSubmit, hasCount, items } =
    useWriteGoodsOff();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CardShadow>
        <FormWrapper onSubmit={handleSubmit(onSubmit)} component="form">
          <Controller
            name="createdAt"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Write-off date"
                format="DD-MM-YYYY"
                defaultValue={dayjs()}
                slotProps={{
                  textField: {
                    id: field.name,
                  },
                }}
              />
            )}
          />

          <Grid>
            {goods.map((good) => {
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
          </Grid>

          <SharedButton
            type="submit"
            text="Submit"
            onClick={() => {}}
            disabled={!hasCount}
          />
        </FormWrapper>
      </CardShadow>
    </LocalizationProvider>
  );
};
