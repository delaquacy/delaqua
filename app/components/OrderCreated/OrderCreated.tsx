import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styles from "./OrderCreated.module.css";

interface ModalProps {
  method: "online" | "cash";
  url?: any;
  amount?: any;
  isOpen: boolean;
  bottlesNumber: number;
  deliveryDate: any;
  onClose: () => void;
}
const BasicModal: React.FC<ModalProps> = ({
  method,
  url,
  amount,
  isOpen,
  onClose,
  bottlesNumber,
  deliveryDate,
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
        <div> Proceed with online payment:</div>
        <div>
          <a href={url} style={{ color: "blue" }} target="_blank">
            Click here to pay online
          </a>
        </div>
      </>
    ) : (
      <span style={{ fontWeight: "bold" }}>
        Prepare ${amount} € for payment
      </span>
    );

  const optionsDayOfWeek: Intl.DateTimeFormatOptions = {
    weekday: "long",
  };

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const dayOfWeek = new Intl.DateTimeFormat(
    "en-US",
    optionsDayOfWeek
  ).format(deliveryDate);

  const formattedDate = new Intl.DateTimeFormat(
    "de-DE",
    optionsDate
  ).format(deliveryDate);

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
            <CheckBoxIcon fontSize="large" className={styles.icon} />
          </Box>
          <Typography
            className={styles.center}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            <span className={styles.bold}>
              {" "}
              Thank you for your order!
            </span>
          </Typography>

          <Typography
            className={styles.center}
            id="modal-modal-description"
          >
            We will deliver to you&nbsp;
            <span className={styles.bold}>{bottlesNumber}</span>&nbsp;
            bottles of water on&nbsp;
            <span className={styles.bold}>{dayOfWeek}</span>&nbsp;
            <span className={styles.bold}>{formattedDate}</span>.
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
