import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const modalWidth = window.innerWidth < 600 ? 360 : 600;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: modalWidth,
  bgcolor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(8px)",
  border: "2px solid #000",
  borderRadius: "4px",
  boxShadow: 24,
  p: 4,
};
const center = {
  display: "flex",
  justifyContent: "center",
  margin: "10px 0",
};
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
        <Box sx={style}>
          <Box sx={center}>
            <CheckCircleIcon
              fontSize="large"
              color="success"
              style={{ display: "flex", justifyContent: "center" }}
            />
          </Box>
          <Typography
            sx={center}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Thanks for your order
          </Typography>
          <Typography sx={center} id="modal-modal-description">
            {paymentText}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default BasicModal;
