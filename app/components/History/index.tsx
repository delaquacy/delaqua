"use client";
import { useUserContext } from "@/app/contexts/UserContext";
import { useScreenSize } from "@/app/hooks";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { MainContentWrapper } from "../shared/styled";
import { TableExpandRow } from "./TableExpandRow";

export const History = () => {
  const { t } = useTranslation("orderslist");
  const { orders, loading } = useUserContext();
  const { isSmallScreen } = useScreenSize();

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={100} thickness={2} />
      </Box>
    );
  }

  return (
    <MainContentWrapper>
      {t("history")}
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
              {/* <TableCell /> */}

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
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                }}
              >
                Invoice
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.length ? (
              orders.map((order, index) => (
                <TableExpandRow key={order.id + index} order={order} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  {t("table_no_orders_yet")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainContentWrapper>
  );
};
