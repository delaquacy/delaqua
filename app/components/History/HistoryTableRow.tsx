"use client";
import dynamic from "next/dynamic";

import { getDateFromTimestamp } from "@/app/utils";
import TableRow from "@mui/material/TableRow";

import { OrdersData } from "@/app/types";
import { ApartmentOutlined, HouseOutlined } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { useTranslation } from "react-i18next";
import { HistoryTableCell, HistoryTableWidthCell } from "./styled";

export function HistoryTableRow(props: {
  order: OrdersData;
  hasUncompletedOrder: boolean;
  handleOpenCancelModal: (order: OrdersData) => void;
}) {
  const { order, hasUncompletedOrder, handleOpenCancelModal } = props;
  const { t } = useTranslation("orderTable");
  const GeneratePdf = dynamic(() => import("../InvoiceGenerator"), {
    ssr: false,
  });

  const addressParts = [
    order?.postalIndex,
    order?.deliveryAddress,
    order?.addressDetails,
  ];

  const fullAddress = addressParts.filter(Boolean).join(", ");

  const typeOfAddress = order?.deliveryAddressObj?.addressType || "Home";
  const couldBeCanceled = !order.canceled && !order.completed;

  const paymentStatusText = Array.isArray(order.paymentStatus)
    ? order.paymentStatus
        .map((status) =>
          t(`paymentStatuses.${status.toLowerCase().replace(/\s+/g, "_")}`)
        )
        .join(", ")
    : typeof order.paymentStatus === "string"
    ? t(
        `paymentStatuses.${order.paymentStatus
          .toLowerCase()
          .replace(/\s+/g, "_")}`
      )
    : t("paymentStatuses.unpaid");

  return (
    <TableRow
      sx={{
        "& > *": { borderBottom: "unset" },
        transition: "all 0.3s",
      }}
    >
      <TableCell>{order.phoneNumber}</TableCell>

      <TableCell align="right">
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            {typeOfAddress === "Home" ? (
              <HouseOutlined />
            ) : (
              <ApartmentOutlined />
            )}
            <Typography fontSize="12px">
              {t(typeOfAddress.toLowerCase(), { ns: "savedAddresses" })}
            </Typography>
          </Box>
          <Tooltip title={order.deliveryAddress}>
            <Typography textAlign={"left"}>{fullAddress}</Typography>
          </Tooltip>
        </Box>
      </TableCell>

      <HistoryTableWidthCell align="right">
        {`${order.deliveryDate},`}
        <br />
        {order.deliveryTime}
      </HistoryTableWidthCell>

      <HistoryTableWidthCell>
        {typeof order.createdAt === "string"
          ? order.createdAt
          : getDateFromTimestamp(order.createdAt as any)}
      </HistoryTableWidthCell>

      <HistoryTableCell>{order.paymentMethod}</HistoryTableCell>
      <HistoryTableCell>{order.totalPayments}</HistoryTableCell>

      <HistoryTableCell>{paymentStatusText}</HistoryTableCell>
      <HistoryTableCell align="center">
        {order.paymentMethod === "Return cash" ? (
          "-"
        ) : (
          <GeneratePdf order={order} />
        )}
      </HistoryTableCell>
      <HistoryTableCell align="center">
        {couldBeCanceled && hasUncompletedOrder && (
          <Button
            variant="contained"
            sx={{
              textTransform: "capitalize",
            }}
            onClick={() => handleOpenCancelModal(order)}
          >
            {t("cancel", {
              ns: "form",
            })}
          </Button>
        )}
      </HistoryTableCell>
    </TableRow>
  );
}
