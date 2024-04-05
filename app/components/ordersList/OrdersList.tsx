import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IForm } from "@/app/lib/definitions";
import { CircularProgress, Tooltip } from "@mui/material";
import useGetOrdersFromDb from "@/app/utils/getOrdersfromDb";
import { useTranslation } from "react-i18next";
import styles from "./OrdersList.module.css";
import "../../i18n";

export default function OrdersList() {
  const { orders, loading } = useGetOrdersFromDb();

  const { t } = useTranslation("orderslist");
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">{t("table_phone")}</TableCell>
            <TableCell align="center">{t("table_index")}</TableCell>
            <TableCell align="center">{t("table_address")}</TableCell>
            <TableCell align="center">{t("table_pump")}</TableCell>
            <TableCell align="center">
              {t("table_bottles_to_buy")}
            </TableCell>
            <TableCell align="center">
              {t("table_bottles_to_return")}
            </TableCell>
            <TableCell align="center">
              {t("table_delivery_time")}
            </TableCell>
            <TableCell align="center">
              {t("table_payment_method")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} align="center">
                {t("table_no_orders_yet")}
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order: IForm) => (
              <TableRow
                key={order.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center">
                  {order.phoneNumber}
                </TableCell>
                <TableCell align="center">
                  {order.postalIndex}
                </TableCell>
                <TableCell
                  className={styles.truncated}
                  align="center"
                >
                  <Tooltip title={order.deliveryAddress}>
                    <span>{order.deliveryAddress}</span>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">{order.pump}</TableCell>
                <TableCell align="center">
                  {order.bottlesNumberToBuy}
                </TableCell>
                <TableCell align="center">
                  {order.bottlesNumberToReturn}
                </TableCell>
                <TableCell align="center">
                  {" "}
                  {order.deliveryTime}
                </TableCell>
                <TableCell align="center">
                  {order.paymentMethod}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
