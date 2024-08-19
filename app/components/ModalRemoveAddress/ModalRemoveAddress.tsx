import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
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
      </Box>
    </Modal>
  );
};
