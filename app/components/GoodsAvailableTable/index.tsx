"use client";
import { GOODS_AVAILABLE_HEAD } from "@/app/constants/GoodsAvaliableHead";
import { useGoodsAvailableTable, useScreenSize } from "@/app/hooks";
import { Goods } from "@/app/types";
import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Switch,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RemoveItemModalWindow from "../RemoveItemModalWindow";
import { SharedButton } from "../shared";
import {
  CardBox,
  CardTypoBold,
  EditBox,
  IconBox,
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
  const { isSmallScreen } = useScreenSize();

  const {
    inventoryGoods,
    displayDelete,
    editGoodItem,
    itemDetails,
    openDeleteWindow,
    goods,
    handleRemoveClick,
    handleDeleteToggle,
    handleToggleAvailableEditGood,
    handleUpdateGood,
    setEditGoodItem,
    setOpenDeleteWindow,
    handleRemoveGoodsInventoryItem,
  } = useGoodsAvailableTable();

  const iconStyle = {
    width: "15px",
    height: "15px",
  };

  return (
    <Box>
      {isSmallScreen ? (
        <StyledWrapper>
          {inventoryGoods.map((good) => {
            const correspondingGood = goods.find(({ id }) => id === good.id);
            const isEditGood = good.id === editGoodItem?.id;

            const toggleEditItem = () => {
              setEditGoodItem(isEditGood ? null : (correspondingGood as Goods));
            };
            return (
              <StyledCard key={good.id}>
                {GOODS_AVAILABLE_HEAD.map(
                  (head, index) =>
                    head.key !== "available" && (
                      <CardBox key={index}>
                        <CardTypoBold>{head.value}</CardTypoBold>

                        <Typography>
                          {good[head.key as keyof GoodsAvailable]}
                        </Typography>
                      </CardBox>
                    )
                )}
                <EditBox>
                  {isEditGood ? (
                    <>
                      Not available
                      <Switch
                        checked={editGoodItem?.available}
                        color="success"
                        onChange={handleToggleAvailableEditGood}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      Available
                    </>
                  ) : correspondingGood?.available ? (
                    <CardTypoBold>Available</CardTypoBold>
                  ) : (
                    <CardTypoBold>Not available</CardTypoBold>
                  )}

                  <IconBox>
                    {isEditGood && (
                      <IconButton onClick={handleUpdateGood}>
                        <Save sx={iconStyle} />
                      </IconButton>
                    )}
                    <IconButton onClick={toggleEditItem}>
                      {isEditGood ? (
                        <Cancel sx={iconStyle} />
                      ) : (
                        <Edit sx={iconStyle} />
                      )}
                    </IconButton>
                  </IconBox>
                </EditBox>
              </StyledCard>
            );
          })}
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
                  border={"border"}
                >
                  {good.value}
                </StyledHeadCell>
              ))}
              <StyledHeadCell border="">
                <SharedButton
                  text="Delete mode"
                  width="100%"
                  onClick={handleDeleteToggle}
                />
              </StyledHeadCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventoryGoods.map((good, index) => {
              const correspondingGood = goods.find(({ id }) => id === good.id);
              const isEditGood = good.id === editGoodItem?.id;

              const toggleEditItem = () => {
                setEditGoodItem(
                  isEditGood ? null : (correspondingGood as Goods)
                );
              };

              return (
                <TableRow key={index}>
                  <StyledCell>{good.id}</StyledCell>

                  <StyledCell>{good.name}</StyledCell>

                  <StyledCell>{good.lastInvoiceDate}</StyledCell>

                  <StyledCell>{good.lastInvoiceNumber}</StyledCell>

                  <StyledCell>{good.quantity}</StyledCell>
                  <StyledCell>
                    <EditBox>
                      {isEditGood ? (
                        <>
                          Not available
                          <Switch
                            checked={editGoodItem?.available}
                            color="success"
                            onChange={handleToggleAvailableEditGood}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          Available
                        </>
                      ) : correspondingGood?.available ? (
                        "Available"
                      ) : (
                        "Not available"
                      )}

                      <IconBox>
                        {isEditGood && (
                          <IconButton onClick={handleUpdateGood}>
                            <Save sx={iconStyle} />
                          </IconButton>
                        )}
                        <IconButton onClick={toggleEditItem}>
                          {isEditGood ? (
                            <Cancel sx={iconStyle} />
                          ) : (
                            <Edit sx={iconStyle} />
                          )}
                        </IconButton>
                      </IconBox>
                    </EditBox>
                  </StyledCell>

                  <TableCell align="center">
                    {displayDelete && (
                      <StyledTooltip
                        title={"Remove Item"}
                        onClick={() => handleRemoveClick(good)}
                      >
                        <Delete
                          sx={iconStyle}
                          fontSize={isSmallScreen ? "small" : "medium"}
                        />
                      </StyledTooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
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
