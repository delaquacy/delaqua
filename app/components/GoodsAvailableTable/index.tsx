"use client";
import { GOODS_AVAILABLE_HEAD } from "@/app/constants/GoodsAvaliableHead";
import { useGoodsContext } from "@/app/contexts/GoodsContext";
import { useScreenSize } from "@/app/hooks";
import { Delete } from "@mui/icons-material";
import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import RemoveItemModalWindow from "../RemoveItemModalWindow";
import {
  CardBox,
  CardTypoBold,
  StyledCard,
  StyledCell,
  StyledHeadCell,
  StyledTable,
  StyledTooltip,
  StyledWrapper,
} from "./styled";

export interface GoodsAvailable {
  id: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

export const GoodsAvailableTable = () => {
  const {
    inventoryGoods,
    openDeleteWindow,
    setOpenDeleteWindow,
    handleRemoveGoodsInventoryItem,
  } = useGoodsContext();
  const { isSmallScreen } = useScreenSize();

  const [itemDetails, setItemDetails] = useState({
    details: "",
    id: "",
  });

  const handleRemoveClick = (good: GoodsAvailable) => {
    setItemDetails({
      details: `${good.id} - ${good.name}`,
      id: good.id,
    });
    setOpenDeleteWindow(true);
  };

  return (
    <Box>
      {isSmallScreen ? (
        <StyledWrapper>
          {inventoryGoods.map((good) => (
            <StyledCard key={good.id}>
              {GOODS_AVAILABLE_HEAD.map((head, index) => (
                <CardBox key={index}>
                  <CardTypoBold>{head.value}</CardTypoBold>

                  <Typography>
                    {good[head.key as keyof GoodsAvailable]}
                  </Typography>
                </CardBox>
              ))}
            </StyledCard>
          ))}
        </StyledWrapper>
      ) : (
        <StyledTable size="small">
          <TableHead>
            <TableRow>
              {GOODS_AVAILABLE_HEAD.map((good, index) => (
                <StyledHeadCell
                  key={index}
                  scope="row"
                  variant="head"
                  border={
                    index < GOODS_AVAILABLE_HEAD.length - 1 ? "border" : ""
                  }
                >
                  {good.value}
                </StyledHeadCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {inventoryGoods.map((good, index) => (
              <TableRow key={index}>
                <StyledCell>{good.id}</StyledCell>

                <StyledCell>{good.name}</StyledCell>

                <StyledCell>{good.lastInvoiceDate}</StyledCell>

                <StyledCell>{good.lastInvoiceNumber}</StyledCell>

                <StyledCell>{good.quantity}</StyledCell>

                <TableCell align="center">
                  <StyledTooltip
                    title={"Remove Item"}
                    onClick={() => handleRemoveClick(good)}
                  >
                    <Delete fontSize={isSmallScreen ? "small" : "medium"} />
                  </StyledTooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      )}

      <RemoveItemModalWindow
        open={openDeleteWindow}
        setOpen={setOpenDeleteWindow}
        itemDetails={itemDetails.details}
        itemId={itemDetails.id}
        onRemove={handleRemoveGoodsInventoryItem}
      />
    </Box>
  );
};
