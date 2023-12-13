import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IForm } from "@/app/lib/definitions";
import Link from "next/link";

interface AlertDialogProps {
  data: IForm | undefined;
  showWindow: boolean;
  setShowWindow: (value: boolean) => void;
}
const AlertDialog: React.FC<AlertDialogProps> = ({
  data,
  showWindow,
  setShowWindow,
}) => {
  const handleClose = () => {
    setShowWindow(false);
  };

  return (
    <>
      <Dialog
        open={showWindow}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Data from the form"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${data?.firstAndLast},${data?.phoneNumber}, ${
              data?.postalIndex
            }, ${data?.deliveryAddress}, ${data?.addressDetails}, ${
              data?.geolocation
            }, ${data?.pump}, ${data?.bottlesNumber}, ${
              data?.deliveryTime
            }, ${data?.deliveryDate.toLocaleDateString()}, 
             ${data?.paymentMethod}, ${data?.comments}`}
          </DialogContentText>
          <DialogContentText>
            You can see result at{" "}
            <Link
              style={{ fontWeight: "bold" }}
              href="https://docs.google.com/spreadsheets/d/1UOLFfG0d_sQ9DwmQKV9V0n6f-bLr3yPzPAa_mXpbClA/edit#gid=0"
              target="_blank"
            >
              Google Sheets
            </Link>
          </DialogContentText>
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
