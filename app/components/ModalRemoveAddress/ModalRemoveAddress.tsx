import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalRemoveAddress: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
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
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          Bottles transfer
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Do you want to transfer bottles from this address to last
          added address?
        </Typography>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
        >
          <Button onClick={onConfirm} sx={{ mr: 1 }}>
            Yes
          </Button>
          <Button onClick={onClose}>No</Button>
        </Box>
      </Box>
    </Modal>
  );
};
