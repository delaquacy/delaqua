import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./OrderCreated.module.css";
import { style } from "@mui/system";

interface ModalProps {
  method: "online" | "cash";
  url?: any;
  amount?: any;
  isOpen: boolean;
  onClose: () => void;
}
const BasicModal: React.FC<ModalProps> = ({
  method,
  url,
  amount,
  isOpen,
  onClose,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
    window.location.reload();
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    if (isOpen) {
      handleOpen();
    }
  }, []);
  const paymentText =
    method === "online" ? (
      <>
        {" "}
        Here is a link to pay{" "}
        <a href={url} style={{ color: "blue" }} target="_blank">
          LINK
        </a>
      </>
    ) : (
      `Prepare a ${amount} EUR for the courier.`
    );
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <Box className={styles.center}>
            <CheckCircleIcon fontSize="large" color="success" />
          </Box>
          <Typography
            className={styles.center}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Thanks for your order
          </Typography>
          <Typography
            className={styles.center}
            id="modal-modal-description"
          >
            {paymentText}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default BasicModal;
