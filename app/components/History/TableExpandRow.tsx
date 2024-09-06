"use client";

import TableCell from "@mui/material/TableCell";

import { getDateFromTimestamp } from "@/app/utils";
import TableRow from "@mui/material/TableRow";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { OrdersData } from "@/app/types";
import { Tooltip } from "@mui/material";
import dynamic from "next/dynamic";

export function TableExpandRow(props: { order: OrdersData }) {
  const { order } = props;
  // const [open, setOpen] = useState(false);
  const { t } = useTranslation("orderslist");

  const GeneratePdf = dynamic(() => import("../InvoiceGenerator"), {
    ssr: false,
  });

  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          transition: "all 0.3s",
          // background: open ? "#D1E3F6" : "",
        }}
      >
        {/* <TableCell>
          <Tooltip title={open ? t("close") : t("open")}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell> */}

        <TableCell component="th" scope="row">
          {order.phoneNumber}
        </TableCell>
        <TableCell align="right">
          <Tooltip title={order.deliveryAddress}>
            <span>{`${order.postalIndex}, ${order.deliveryAddress}`}</span>
          </Tooltip>
        </TableCell>

        <TableCell
          align="right"
          padding="none"
          sx={{
            width: "100px",
            maxWidth: "120px",
            textAlign: "center",
            paddingInline: "5px",
          }}
        >
          {`${order.deliveryDate},`}
          <br />
          {order.deliveryTime}
        </TableCell>
        <TableCell
          align="center"
          padding="none"
          sx={{
            width: "100px",
            maxWidth: "120px",
            textAlign: "center",
            paddingInline: "5px",
          }}
        >
          {typeof order.createdAt === "string"
            ? order.createdAt
            : getDateFromTimestamp(order.createdAt as any)}
        </TableCell>

        <TableCell align="center" padding="none">
          {order.paymentMethod}
        </TableCell>
        <TableCell align="center" padding="none">
          {order.totalPayments}
        </TableCell>

        <TableCell align="center" padding="none">
          {order.paymentStatus}
        </TableCell>
        <TableCell align="center" padding="none">
          {order.invoiceNumber ? <GeneratePdf order={order} /> : "-"}
        </TableCell>
      </TableRow>

      {/* <TableRow
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
      </TableRow> */}
    </Fragment>
  );
}
