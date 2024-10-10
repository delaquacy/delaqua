"use client";
import dynamic from "next/dynamic";

import { getDateFromTimestamp } from "@/app/utils";
import TableRow from "@mui/material/TableRow";

import { OrdersData } from "@/app/types";
import { ApartmentOutlined, HouseOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { useTranslation } from "react-i18next";
import { HistoryTableCell, HistoryTableWidthCell } from "./styled";

export function HistoryTableRow(props: { order: OrdersData }) {
  const { order } = props;
  const { t } = useTranslation(["orderTable", "savedAddresses"]);

  const GeneratePdf = dynamic(() => import("../InvoiceGenerator"), {
    ssr: false,
  });

  const addressParts = [
    order.postalIndex,
    order.deliveryAddress,
    order.addressDetails,
  ];

  const fullAddress = addressParts.filter(Boolean).join(", ");

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
            {!order?.deliveryAddressObj ||
            !order?.deliveryAddressObj?.addressType ||
            order?.deliveryAddressObj?.addressType === "Home" ? (
              <HouseOutlined />
            ) : (
              <ApartmentOutlined />
            )}
            <Typography fontSize="12px">
              {t(
                order?.deliveryAddressObj?.addressType?.toLowerCase() || "home",
                { ns: "savedAddresses" }
              )}
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

      <HistoryTableCell>
        {t(`paymentStatuses.${order.paymentStatus}`)}
      </HistoryTableCell>
      <HistoryTableCell align="center">
        <GeneratePdf order={order} />
      </HistoryTableCell>
    </TableRow>
  );
}
