"use client";
import dynamic from "next/dynamic";

import { getDateFromTimestamp } from "@/app/utils";
import TableRow from "@mui/material/TableRow";

import { OrdersData } from "@/app/types";
import { Tooltip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { useTranslation } from "react-i18next";
import { HistoryTableCell, HistoryTableWidthCell } from "./styled";

export function HistoryTableRow(props: { order: OrdersData }) {
  const { order } = props;
  const { t } = useTranslation("orderTable");

  const GeneratePdf = dynamic(() => import("../InvoiceGenerator"), {
    ssr: false,
  });

  return (
    <TableRow
      sx={{
        "& > *": { borderBottom: "unset" },
        transition: "all 0.3s",
      }}
    >
      <TableCell>{order.phoneNumber}</TableCell>

      <TableCell align="right">
        <Tooltip title={order.deliveryAddress}>
          <span>{`${order.postalIndex}, ${order.deliveryAddress}`}</span>
        </Tooltip>
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
