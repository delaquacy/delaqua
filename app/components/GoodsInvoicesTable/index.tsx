"use client";
import { GOODS_INVOICES_HEAD } from "@/app/constants/GoodsInvoicesHead";
import { useGoodsContext } from "@/app/contexts/GoodsContext";
import { useScreenSize } from "@/app/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const GoodsInvoicesTable = () => {
  const { invoices } = useGoodsContext();
  const { isSmallScreen } = useScreenSize();

  return (
    <TableContainer
      sx={{
        height: isSmallScreen ? `calc(100dvh - 260px)` : `calc(100dvh - 205px)`,
        width: "calc(100vw - 40px)",
        paddingInline: "20px",
        boxSizing: "border-box",
        overflow: "scroll",
      }}
    >
      <Table size="small" sx={{ width: "100%" }} stickyHeader>
        <TableHead>
          <TableRow>
            {GOODS_INVOICES_HEAD.map((good, index) => (
              <TableCell
                key={index}
                scope="row"
                padding="none"
                variant="head"
                align="center"
                sx={{
                  fontWeight: "bold",
                  borderRight:
                    index < GOODS_INVOICES_HEAD.length - 1
                      ? "1px solid #ddd"
                      : "none",
                }}
              >
                {good.value}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {invoices.map((good) =>
            good.items.map((item) => (
              <TableRow key={`${good.id}-${item.id}`}>
                <TableCell
                  scope="row"
                  padding="none"
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.formFillDate}
                </TableCell>
                <TableCell
                  scope="row"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.date}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.invoiceNumber}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {item.itemCode}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {item.itemName}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {item.quantity}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.buyPriceVAT}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.netBuyWorth}
                </TableCell>
                <TableCell align="center">{good.total}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
