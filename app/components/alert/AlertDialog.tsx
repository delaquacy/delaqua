import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import OrdersList from "../ordersList/OrdersList";

interface AlertDialogProps {
  showWindow: boolean;
  setShowWindow: (value: boolean) => void;
}
const AlertDialog: React.FC<AlertDialogProps> = ({
  showWindow,
  setShowWindow,
}) => {
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
        <DialogTitle id="alert-dialog-title">
          {"Orders history"}
        </DialogTitle>
        <DialogContent>
          <OrdersList />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlertDialog;
