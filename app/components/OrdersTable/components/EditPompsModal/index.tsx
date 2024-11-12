"use client";
import { CloseModalButton, SharedButton } from "@/app/components/shared";
import { ModalWrapper } from "@/app/components/shared/styled/ModalWrapper";
import { Box, Modal, Typography } from "@mui/material";
import { FlexRow } from "../../styled";
import EditableInput from "../EditableInput";

interface EditModalProps {
  open: boolean;
  control: any;
  editFields: any;
  reset: any;
  onClose: () => void;
  getItemIndex: (id: string) => number;
  onCountChange: () => void;
}

export const EditPompsModal = ({
  open,
  editFields,
  control,
  reset,
  onClose,
  getItemIndex,
  onCountChange,
}: EditModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalWrapper>
        <CloseModalButton onClose={onClose} />
        Edit Pomps
        <Box>
          {editFields &&
            editFields.map((obj: any, index: number) => {
              return (
                <FlexRow key={obj.id || index}>
                  <Typography>{obj.name ? obj.name : obj}</Typography>
                  <EditableInput
                    fieldName={`items.${getItemIndex(obj?.id)}.count`}
                    control={control}
                    type="number"
                    onCountChange={onCountChange}
                  />
                </FlexRow>
              );
            })}
        </Box>
        <FlexRow>
          <SharedButton onClick={onClose} text="Apply" variantType="success" />
        </FlexRow>
      </ModalWrapper>
    </Modal>
  );
};
