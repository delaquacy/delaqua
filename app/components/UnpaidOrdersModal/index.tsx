import { OrdersData } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ExpandRow } from "../WrapperHeader/ExpandRow";

interface UnpaidOrdersModalProps {
  showWindow: boolean;
  onClose: () => void;
  unpaidOrders: OrdersData[];
}

export const UnpaidOrdersModal = ({
  showWindow,
  onClose,
  unpaidOrders,
}: UnpaidOrdersModalProps) => {
  const { t, i18n } = useTranslation("orderTable");
  console.log("Current locale:", i18n.language);

  return (
    <Dialog
      fullWidth={true}
      maxWidth="xl"
      open={showWindow}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Unpaid orders"}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {t("tableHeadCells.dateAndTime")}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {t("tableHeadCells.total")}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {t("tableHeadCells.status")}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {t("tableHeadCells.paymentLink")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unpaidOrders.map((order: OrdersData) => (
                <ExpandRow order={order} key={order.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};
