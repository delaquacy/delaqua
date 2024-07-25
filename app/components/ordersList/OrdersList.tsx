import {
  CircularProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./OrdersList.module.css";
import "../../i18n";
import { OrdersData } from "@/app/types";
import { getDateFromTimestamp } from "@/app/utils";
import useGetOrdersFromDb from "@/app/utils/getOrdersfromDb";

export default function OrdersList() {
  const { orders, loading } = useGetOrdersFromDb();

  const { t } = useTranslation("orderslist");
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">{t("table_phone")}</TableCell>
            <TableCell align="center">{t("table_index")}</TableCell>
            <TableCell align="center">{t("table_address")}</TableCell>
            <TableCell align="center">{t("table_bottles_to_buy")}</TableCell>
            <TableCell align="center">{t("table_delivery_time")}</TableCell>
            <TableCell align="center">{t("table_order_time")}</TableCell>
            <TableCell align="center">{t("table_payment_method")}</TableCell>
            <TableCell align="center">{t("table_total")}</TableCell>
            <TableCell align="center">{t("table_status")}</TableCell>
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
            orders.map((order: OrdersData) => (
              <TableRow
                key={order.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="center">{order.phoneNumber}</TableCell>
                <TableCell align="center">{order.postalIndex}</TableCell>
                <TableCell className={styles.truncated} align="center">
                  <Tooltip title={order.deliveryAddress}>
                    <span>{order.deliveryAddress}</span>
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  {`${order.bottlesNumberToBuy} / ${order.bottlesNumberToReturn} / ${order.pump}`}
                </TableCell>
                <TableCell align="center">
                  {`${order.deliveryDate},`}
                  <br />
                  {order.deliveryTime}
                </TableCell>
                <TableCell align="center">
                  {getDateFromTimestamp(order.createdAt as any)}
                </TableCell>
                <TableCell align="center">{order.paymentMethod}</TableCell>
                <TableCell align="center">{order.totalPayments}</TableCell>

                <TableCell align="center">{order.paymentStatus}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
