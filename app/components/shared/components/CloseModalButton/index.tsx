import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface CloseModalButtonProps {
  onClose: () => void;
}

export const CloseModalButton = ({ onClose }: CloseModalButtonProps) => {
  return (
    <IconButton
      onClick={onClose}
      sx={{
        position: "absolute",
        right: 5,
        top: 5,
      }}
    >
      <Close />
    </IconButton>
  );
};
