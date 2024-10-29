"use client";
import { GOODS_CALCULATION_HEAD } from "@/app/constants/GoodsCalculation";
import { useScreenSize } from "@/app/hooks";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useGoodsContext } from "@/app/contexts/GoodsContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { DateRangePicker } from "../OrdersTable/components/DateRangePicker";
import { SharedButton } from "../shared";
import { DatePickWrapper } from "./styled";

export interface GoodsAvailable {
  id: string;
  lastInvoiceDate: string;
  lastInvoiceNumber: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

export const GoodsCalculationTable = () => {
  const {
    inventoryGoods,
    filter,
    stats,
    handleFilterFieldsChange,
    setApplyGoodsCalculationFilter,
  } = useGoodsContext();

  const { isSmallScreen } = useScreenSize();

  const [appliedFilter, setAppliedFilter] = useState({
    value1: dayjs(filter.value1).format("DD.MM.YYYY"),
    value2: dayjs(filter.value2).format("DD.MM.YYYY") || "",
  });

  const handleApply = () => {
    setApplyGoodsCalculationFilter(true);
    setAppliedFilter({
      value1: dayjs(filter.value1).format("DD.MM.YYYY"),
      value2: dayjs(filter.value2).format("DD.MM.YYYY") || "",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {isSmallScreen ? (
          <Box display="flex" flexDirection="column" gap="15px">
            <DatePickWrapper>
              <DateRangePicker
                filter={filter}
                onChange={handleFilterFieldsChange}
                notUseSmallScreen
              />
              <SharedButton
                text="Apply"
                onClick={handleApply}
                fontSize="14px"
                width="90px"
                sx={{
                  alignSelf: "center",
                }}
              />
            </DatePickWrapper>

            <Typography fontSize="24px" paddingBottom="30px">
              Goods calculation for the period{" "}
              <Box component="span" fontWeight="bold">
                {`${appliedFilter.value1} - ${appliedFilter.value2}`}
              </Box>
            </Typography>

            {inventoryGoods.map((good, goodIndex) => {
              return (
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
                  {GOODS_CALCULATION_HEAD.map((head, index) => (
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
                        {head.key === "sold"
                          ? (stats?.sold && stats?.sold[goodIndex]?.quantity) ||
                            "0"
                          : head.key === "received"
                          ? (stats?.received &&
                              stats?.received[goodIndex]?.quantity) ||
                            "0"
                          : head.key === "current"
                          ? good.quantity
                          : good[head.key as keyof GoodsAvailable] || "0"}
                      </Typography>
                    </Box>
                  ))}
                </Card>
              );
            })}
          </Box>
        ) : (
          <>
            <DatePickWrapper>
              <DateRangePicker
                filter={filter}
                onChange={handleFilterFieldsChange}
              />
              <SharedButton text="Apply" size="small" onClick={handleApply} />
            </DatePickWrapper>

            <Typography fontSize="24px" paddingBottom="30px">
              Goods calculation for the period{" "}
              <Box component="span" fontWeight="bold">
                {`${appliedFilter.value1} - ${appliedFilter.value2}`}
              </Box>
            </Typography>
            <Table
              size="small"
              sx={{
                padding: "20px",
              }}
            >
              <TableHead>
                <TableRow>
                  {GOODS_CALCULATION_HEAD.map((good, index) => (
                    <TableCell
                      key={index}
                      scope="row"
                      padding="none"
                      variant="head"
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        borderRight:
                          index < GOODS_CALCULATION_HEAD.length - 1
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
                {inventoryGoods.map((good, index) => (
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
                      {stats?.sold[index]?.quantity}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #ddd",
                      }}
                    >
                      {stats?.received &&
                        stats.received[index] &&
                        stats.received[index].quantity}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderRight: "1px solid #ddd",
                      }}
                    >
                      {good?.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};
