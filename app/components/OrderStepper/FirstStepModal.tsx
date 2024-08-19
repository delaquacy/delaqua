import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import { OrderCardCounter } from "./OrderCardCounter";
import { Controller, useForm } from "react-hook-form";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
};

interface FormValues {
  bottlesNumberToReturn: string;
}

export const FirstStepModal = ({ open, setOpen, onConfirm }: any) => {
  const { handleAddOrderDetails } = useOrderDetailsContext();
  const handleClose = () => setOpen(false);
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

  const onSubmit = (data: FormValues) => {
    handleAddOrderDetails(data);
    onConfirm(data);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={style}>
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
            Confirm
          </Button>
        </Box>
      </form>
    </Modal>
  );
};
