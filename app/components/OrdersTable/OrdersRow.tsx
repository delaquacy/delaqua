import { useScreenSize } from "@/app/hooks";
import {
  CancelOutlined,
  CheckCircle,
  ContentCopy,
  HourglassBottom,
} from "@mui/icons-material";
import { Box, Button, Checkbox, TableCell, TableRow } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface OrderRowProps {
  handleClick: (event: any, id: string) => void;
  row: any;
  isItemSelected: boolean;
  labelId: string;
  onCopy: (event: any) => void;
}

export const OrderRow = ({
  handleClick,
  row,
  isItemSelected,
  labelId,
  onCopy,
}: OrderRowProps) => {
  const { isSmallScreen } = useScreenSize();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("orderslist");

  return (
    <>
      <TableRow
        onClick={(event: any) => handleClick(event, row.id as string)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id as string}
        selected={isItemSelected}
        sx={{
          cursor: "pointer",
          transition: "all, 0.3s",
          background: row.completed
            ? "#EAF4EA"
            : row.expire || row.canceled
            ? "#FFE5E5"
            : "#fff",

          "&.Mui-selected": {
            background: "#D1E3F6",
            "&:hover": {
              background: "#E8F1FA",
            },
          },
          ":hover": {
            background: !row.completed && !row.expire ? "#E8F1FA" : "",
          },
        }}
      >
        <TableCell
          sx={{
            position: isSmallScreen ? "static" : "sticky",
            left: 0,
            zIndex: 2,
            background: "inherit",
          }}
        >
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          padding="none"
          align="center"
          sx={{
            position: isSmallScreen ? "static" : "sticky",
            left: "74px",
            zIndex: 2,
            background: "inherit",
          }}
        >
          {row.userId || row.useId}
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
          align="center"
          sx={{
            position: isSmallScreen ? "static" : "sticky",
            left: "155.45px",
            zIndex: 2,
            background: "inherit",
          }}
        >
          {row.phoneNumber}
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="normal"
          align="center"
          sx={{
            position: isSmallScreen ? "static" : "sticky",
            left: "290.9px",
            zIndex: 2,
            background: "inherit",
            borderRight: "solid 1px rgba(38, 40, 82, 0.1)",
          }}
        >
          {row.firstAndLast}
        </TableCell>
        <TableCell align="center">{row.bottlesNumberToBuy}</TableCell>
        <TableCell align="center">{row.bottlesNumberToReturn}</TableCell>
        <TableCell align="center">{row.pump}</TableCell>
        <TableCell align="center" padding="none">
          <Link
            href={row.geolocation as string}
            onClick={(event) => event.stopPropagation()}
          >
            <Box
              paddingBlock={2}
              sx={{
                transition: "all 0.3s",
                ":hover": {
                  color: "#4788C7",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                },
              }}
            >
              {row.postalIndex
                ? `${row.postalIndex} ${
                    row.deliveryAddress ? `, ${row.deliveryAddress}` : ""
                  }`
                : row.deliveryAddress}
            </Box>
          </Link>
        </TableCell>
        <TableCell align="center">{row.addressDetails}</TableCell>
        <TableCell align="center">{row.deliveryDate}</TableCell>
        <TableCell align="center">{row.deliveryTime}</TableCell>
        <TableCell align="center">{row.totalPayments}</TableCell>
        {/* <TableCell align="center">{row.paymentMethod}</TableCell> */}
        <TableCell align="center">{row.paymentStatus}</TableCell>
        <TableCell align="center" padding="none">
          {row.comments || "-"}
        </TableCell>
        <TableCell align="center">{row.createdAt}</TableCell>
        <TableCell align="center" padding="none">
          {row.completed ? (
            <CheckCircle
              sx={{
                color: "green",
              }}
            />
          ) : row.canceled ? (
            <CancelOutlined
              sx={{
                color: "red",
              }}
            />
          ) : (
            <HourglassBottom
              sx={{
                color: "#1976d2",
              }}
            />
          )}
        </TableCell>
        <TableCell align="center">
          <Button onClick={onCopy}>
            <ContentCopy
              sx={{
                color: "#4788C7",
              }}
            />
          </Button>
        </TableCell>
      </TableRow>

      {/* 
      collapsible table row
      <TableRow
        sx={{
          transition: "all 0.3s",

          left: 0,
        }}
      >
        <TableCell
          colSpan={9}
          sx={{
            // width: "90vw",
            padding: 0,
            position: isSmallScreen ? "static" : "sticky",
            left: 0,
            zIndex: 2,
            background: "inherit",
          }}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{
              paddingBlock: "5px",
              paddingInline: "10px",
              width: isSmallScreen ? "100%" : "100vw",
              background: open ? "rgba(209, 227, 246, 0.2)" : "",
            }}
          >
            <Box
              sx={{
                margin: 1,
              }}
            >
              <Typography gutterBottom component="div">
                Order Details
              </Typography>
              <OrderItemsTable
                orderItems={row.items}
                totalPayments={row.totalPayments}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </>
  );
};
