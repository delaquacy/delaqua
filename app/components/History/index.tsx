"use client";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableExpandRow } from "./TableExpandRow";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@/app/contexts/UserContext";
import { useScreenSize } from "@/app/hooks";
// import OrdersList from "../ordersList/OrdersList";

export const History = () => {
  const { t } = useTranslation("orderslist");
  const { orders } = useUserContext();
  const { isSmallScreen } = useScreenSize();

  return (
    <Box
      sx={{
        height: "calc(100dvh - 84px - 129px)",
        padding: "20px",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          paddingInline: "20px",
          paddingBottom: "20px",

          height: isSmallScreen
            ? `calc(100dvh - 84px - 129px)`
            : `calc(100dvh - 110px - 129px)`,
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Table
          stickyHeader
          sx={{
            paddingBottom: "10px",
            overflowY: "scroll",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell />

              <TableCell
                align="center"
                padding="none"
                sx={{
                  paddingBlock: "10px",
                  fontWeight: 600,
                }}
              >
                {t("table_phone")}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                }}
              >
                {t("table_address")}
              </TableCell>

              <TableCell
                align="center"
                padding="none"
                sx={{
                  maxWidth: "120px",
                  fontWeight: 600,
                }}
              >
                {t("table_delivery_time")}
              </TableCell>
              <TableCell
                align="center"
                padding="none"
                sx={{
                  maxWidth: "120px",
                  fontWeight: 600,
                }}
              >
                {t("table_order_time")}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                }}
              >
                {t("table_payment_method")}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                }}
              >
                {t("table_total")}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                }}
              >
                {t("table_status")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableExpandRow key={order.id + index} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
