import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./styled";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transfer: boolean) => void;
}

export const ModalRemoveAddress: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation("form");

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Wrapper>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("bottles_transfer")}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {t("bottles_transfer_question")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button onClick={() => onConfirm(true)} sx={{ mr: 1 }}>
            Yes
          </Button>
          <Button onClick={onClose}>No</Button>
        </Box>
      </Wrapper>
    </Modal>
  );
};
