"use client";
import { GOODS_INVOICES_HEAD } from "@/app/constants/GoodsInvoicesHead";
import { useScreenSize } from "@/app/hooks";
import { getGoodsArray } from "@/app/utils/getGoodsArray";
import { getGoodsIncomingInvoices } from "@/app/utils/getGoodsIncomingInvoices";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { GoodsValues } from "../GoodsIncomingForm";

interface Goods {
  id: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: number;
  unitPrice: string;
}

export const GoodsInvoicesTable = () => {
  const { isSmallScreen } = useScreenSize();

  const [goods, setGoods] = useState<GoodsValues[]>([]);
  const getGoodsRows = async () => {
    try {
      const data = await getGoodsIncomingInvoices();
      console.log(data);
      setGoods(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getGoodsRows();
  }, []);
  return (
    <>
      <Table
        size="small"
        sx={{
          padding: "20px",
        }}
      >
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
          {goods.map((good, index) =>
            good.items.map((item) => (
              <TableRow key={`${good.id}-${item.id}`}>
                <TableCell
                  component="th"
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
                  {item.netBuyWorth}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {item.buyPriceVAT}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.total}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
