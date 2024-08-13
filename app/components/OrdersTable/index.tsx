"use client";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link.js";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { useToast, useScreenSize } from "@/app/hooks";
import { FilterItem, OrdersData } from "@/app/types";
import {
  getComparator,
  getFilteredOrders,
  stableSort,
  getOrdersArray,
  getClipboardOrderRowData,
} from "@/app/utils";
import { OrdersTableHead } from "@/app/components/OrdersTableHead";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TablePagination,
  TableHead,
  Button,
} from "@mui/material";
import { OrdersTableToolbar } from "../OrdersTableToolbar.tsx";
import {
  CancelOutlined,
  ContentCopy,
  CheckCircle,
  HourglassBottom,
} from "@mui/icons-material";

dayjs.extend(customParseFormat);

type Order = "asc" | "desc";

export default function OrdersTable() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof OrdersData>("deliveryDate");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<OrdersData[]>([]);
  const [filteredRows, setFilteredRows] = useState<OrdersData[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [applyFilters, setApplyFilters] = useState<boolean>(false);

  const { t } = useTranslation("orderTable");

  const { showSuccessToast } = useToast();
  const { isSmallScreen } = useScreenSize();

  const getOrdersRows = async () => {
    try {
      const data = await getOrdersArray();
      const sorted = stableSort(data as any, getComparator(order, orderBy));
      setRows(sorted as OrdersData[]);
      setFilteredRows(sorted as OrdersData[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleApplyFilters = () => {
    setApplyFilters(true);
  };

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof OrdersData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleUpdateStatus = () => {
    setSelected([]);
    getOrdersRows();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(filteredRows as any, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const handleSelectAllClick = () => {
    if (selected.length < visibleRows.length) {
      const newSelected = visibleRows.map((n) => n.id) as string[];
      setSelected((prev) => [...prev, ...newSelected]);
      return;
    }

    setSelected([]);
  };

  const handleClearFilters = () => {
    setFilteredRows(rows);
    setFilters([]);
  };

  useEffect(() => {
    getOrdersRows();
  }, []);

  useEffect(() => {
    if (applyFilters) {
      const filteredOrders = getFilteredOrders(filters, rows);
      setFilteredRows(filteredOrders);
      setApplyFilters(false);
    }
  }, [filters, applyFilters]);

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          maxHeight: isSmallScreen
            ? `calc(100dvh - 123px)`
            : `calc(100dvh - 85px)`,
        }}
      >
        <Paper sx={{ width: "100%", mb: 2 }}>
          <OrdersTableToolbar
            selected={selected}
            onStatusUpdate={handleUpdateStatus}
            filters={filters}
            filteredRows={filteredRows}
            onFilterChange={setFilters}
            onFiltersApply={handleApplyFilters}
            onFiltersClear={handleClearFilters}
          />

          <TableContainer
            sx={{
              height: isSmallScreen
                ? `calc(100dvh - 240px)`
                : `calc(100dvh - 205px)`,
              width: "100vw",
            }}
          >
            <Table
              stickyHeader
              sx={{
                paddingBottom: "10px",
                overflowY: "scroll",
                width: "100vw",
              }}
              size="small"
            >
              <TableHead>
                <OrdersTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
              </TableHead>

              {
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id as string);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    const onCopy = (event: any) => {
                      event.stopPropagation();

                      navigator.clipboard
                        .writeText(getClipboardOrderRowData(row as OrdersData))
                        .then(() => showSuccessToast("Copied!"));
                    };
                    return (
                      <TableRow
                        onClick={(event: any) =>
                          handleClick(event, row.id as string)
                        }
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
                            background:
                              !row.completed && !row.expire ? "#E8F1FA" : "",
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
                        <TableCell align="center">
                          {row.bottlesNumberToBuy}
                        </TableCell>
                        <TableCell align="center">
                          {row.bottlesNumberToReturn}
                        </TableCell>
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
                                    row.deliveryAddress
                                      ? `, ${row.deliveryAddress}`
                                      : ""
                                  }`
                                : row.deliveryAddress}
                            </Box>
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          {row.addressDetails}
                        </TableCell>
                        <TableCell align="center">{row.deliveryDate}</TableCell>
                        <TableCell align="center">{row.deliveryTime}</TableCell>
                        <TableCell align="center">
                          {row.totalPayments}
                        </TableCell>
                        {/* <TableCell align="center">{row.paymentMethod}</TableCell> */}
                        <TableCell align="center">
                          {row.paymentStatus}
                        </TableCell>
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
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 33 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              }
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
}
