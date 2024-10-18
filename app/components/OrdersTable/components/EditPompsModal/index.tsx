"use client";
import { SharedButton } from "@/app/components/shared";
import { ModalWrapper } from "@/app/components/shared/styled/ModalWrapper";
import { Box, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
  const [originalValues, setOriginalValues] = useState();

  useEffect(() => {
    if (editFields) {
      const originalValuesSnapshot = editFields.reduce((acc: any, obj: any) => {
        const index = getItemIndex(obj?.id);
        acc[`items.${index}.count`] = obj.count;
        return acc;
      }, {});

      setOriginalValues(originalValuesSnapshot);
    }
  }, [editFields, getItemIndex]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalWrapper>
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
