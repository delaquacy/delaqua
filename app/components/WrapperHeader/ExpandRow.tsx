"use client";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";

import TableCell from "@mui/material/TableCell";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { OrderItemsTable } from "../OrderItemsTable";

import { OrdersData } from "@/app/types";
import { Tooltip } from "@mui/material";
import Link from "next/link";

export function ExpandRow(props: { order: OrdersData }) {
  const { order } = props;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(["orderslist", "orderTable"]);

  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          transition: "all 0.3s",
          background: open ? "#D1E3F6" : "",
        }}
      >
        <TableCell>
          <Tooltip title={open ? t("close") : t("open")}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align="center">{`${order.deliveryDate}, ${order.deliveryTime}`}</TableCell>

        <TableCell align="center">{order.totalPayments}</TableCell>

        <TableCell align="center">
          {t(`paymentStatuses.${order.paymentStatus}`, { ns: "orderTable" })}
        </TableCell>

        <TableCell
          align="center"
          sx={{
            ":hover": {
              color: "#1565c0",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            },
          }}
        >
          <Link href={(order.paymentLink as string) || "/"} target="_blank">
            {order.paymentLink}
          </Link>
        </TableCell>
      </TableRow>

      <TableRow
        sx={{
          transition: "all 0.3s",
          background: open ? "rgba(209, 227, 246, 0.2)" : "",
        }}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                Order Details
              </Typography>
              <OrderItemsTable
                orderItems={order?.items || []}
                totalPayments={`${order.totalPayments}`}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
