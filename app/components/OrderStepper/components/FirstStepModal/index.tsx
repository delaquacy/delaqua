import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { OrderCardCounter } from "../OrderCardCounter";
import { Wrapper } from "./styled";

interface FormValues {
  bottlesNumberToReturn: string;
}

export const FirstStepModal = ({ open, setOpen, onConfirm }: any) => {
  const { handleAddOrderDetails } = useOrderDetailsContext();

  const { t } = useTranslation("form");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      bottlesNumberToReturn: "0",
    },
  });

  const handleClose = () => setOpen(false);

  const onSubmit = (data: FormValues) => {
    handleAddOrderDetails(data);
    onConfirm(data);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Wrapper>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {t("number_of_bottles_to_return")}
          </Typography>

          <Controller
            control={control}
            name="bottlesNumberToReturn"
            render={({ field }) => (
              <OrderCardCounter
                onAdd={() => field.onChange(`${+field.value + 1}`)}
                onRemove={() =>
                  field.onChange(Math.max(+field.value - 1, 0).toString())
                }
                count={field.value}
              />
            )}
          />

          <Button
            color="primary"
            type="submit"
            sx={{ border: "1px solid lightgray" }}
          >
            {t("confirm")}
          </Button>
        </Wrapper>
      </form>
    </Modal>
  );
};
