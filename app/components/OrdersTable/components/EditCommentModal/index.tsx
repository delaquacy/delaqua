import { CloseModalButton, SharedButton } from "@/app/components/shared";
import { ModalWrapper } from "@/app/components/shared/styled/ModalWrapper";
import { Modal, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FlexRow } from "../../styled";

interface EditCommentModalProps {
  control: any;
  reset: any;

  open: boolean;
  onClose: () => void;
}

export const EditCommentModal = ({
  open,
  control,
  onClose,
}: EditCommentModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalWrapper>
        <CloseModalButton onClose={onClose} />
        Edit Comment
        <Controller
          name={"courierComment"}
          control={control}
          render={({ field }) => (
            <TextField
              multiline
              rows={3}
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
              }}
              sx={{
                width: "100%",
              }}
            />
          )}
        />
        <FlexRow>
          <SharedButton onClick={onClose} text="Apply" variantType="success" />
        </FlexRow>
      </ModalWrapper>
    </Modal>
  );
};
