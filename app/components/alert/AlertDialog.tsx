import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";
import OrdersList from "../ordersList/OrdersList";
import "../../i18n";
interface AlertDialogProps {
  showWindow: boolean;
  setShowWindow: (value: boolean) => void;
}
const AlertDialog: React.FC<AlertDialogProps> = ({
  showWindow,
  setShowWindow,
}) => {
  const { t } = useTranslation("orderslist");
  const handleClose = () => {
    setShowWindow(false);
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={showWindow}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Orders history"}</DialogTitle>
        <DialogContent>
          <OrdersList />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            {t("close_button")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertDialog;
