"use client";
import { GOODS_AVAILABLE_HEAD } from "@/app/constants/GoodsAvaliableHead";
import { useScreenSize } from "@/app/hooks";
import { getGoodsArray } from "@/app/utils/getGoodsArray";
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
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Goods {
  id: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: number;
  unitPrice: string;
}

export const GoodsAvailableTable = () => {
  const { isSmallScreen } = useScreenSize();
  const [goods, setGoods] = useState<Goods[]>([]);
  const getGoodsRows = async () => {
    try {
      const data = await getGoodsArray();
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
      {isSmallScreen ? (
        <Box display="flex" flexDirection="column" gap="15px">
          {goods.map((good) => (
            <Card
              key={good.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "15px",
                gap: "12px",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              {GOODS_AVAILABLE_HEAD.map((head, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {head.value}
                  </Typography>
                  <Typography>{good[head.key as keyof Goods]}</Typography>
                </Box>
              ))}
            </Card>
          ))}
        </Box>
      ) : (
        <Table
          size="small"
          sx={{
            padding: "20px",
          }}
        >
          <TableHead>
            <TableRow>
              {GOODS_AVAILABLE_HEAD.map((good, index) => (
                <TableCell
                  key={index}
                  scope="row"
                  padding="none"
                  variant="head"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    borderRight:
                      index < GOODS_AVAILABLE_HEAD.length - 1
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
            {goods.map((good, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.id}
                </TableCell>
                <TableCell
                  scope="row"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.name}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.lastInvoiceDate}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.lastInvoiceNumber}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                  }}
                >
                  {good.quantity}
                </TableCell>
                {/* <TableCell align="center">{good.unitPrice}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};
