"use client";
import { GOODS_AVAILABLE_HEAD } from "@/app/constants/GoodsAvaliableHead";
import { useScreenSize, useToast } from "@/app/hooks";
import { getGoodsArray } from "@/app/utils/getGoodsArray";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { useEffect, useState } from "react";
import RemoveItemModalWindow from "./RemoveItemModalWindow";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/config";

export interface GoodsAvailable {
  id: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

export const GoodsAvailableTable = () => {
  const { isSmallScreen } = useScreenSize();
  const { showSuccessToast, showErrorToast } = useToast();

  const [goods, setGoods] = useState<GoodsAvailable[]>([]);
  const [openDeleteWindow, setOpenDeleteWindow] = useState(false);

  const [itemDetails, setItemDetails] = useState({
    details: "",
    id: "",
  });

  const getGoodsRows = async () => {
    try {
      const data = await getGoodsArray();
      console.log(data);
      setGoods(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRemoveItem = async (documentId: string) => {
    await deleteDoc(doc(db, "goods", documentId));
    await deleteDoc(doc(db, "goodsInventory", documentId));
    setOpenDeleteWindow(false);
    showSuccessToast("Item successfully removed");
    getGoodsRows();
  };

  useEffect(() => {
    getGoodsRows();
  }, []);
  return (
    <Box>
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
                  <Typography>
                    {good[head.key as keyof GoodsAvailable]}
                  </Typography>
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
                <TableCell align="center" sx={{}}>
                  <Tooltip
                    title={"Remove Item"}
                    onClick={() => {
                      setItemDetails({
                        details: `${good.id} - ${good.name}`,
                        id: good.id,
                      });
                      setOpenDeleteWindow(true);
                    }}
                    sx={{
                      transform: "translateY(5px)",
                      width: isSmallScreen ? "20px" : "30px",
                      height: isSmallScreen ? "20px" : "30px",
                      cursor: "pointer",
                      color: "gray",
                    }}
                  >
                    <Delete fontSize={isSmallScreen ? "small" : "medium"} />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <RemoveItemModalWindow
        open={openDeleteWindow}
        setOpen={setOpenDeleteWindow}
        itemDetails={itemDetails.details}
        itemId={itemDetails.id}
        onRemove={handleRemoveItem}
      />
    </Box>
  );
};
