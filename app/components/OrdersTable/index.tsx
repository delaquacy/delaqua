"use client";
import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import { OrdersTableHead } from "@/app/components/OrdersTableHead";
import { useScreenSize, useToast } from "@/app/hooks";
import { FilterItem, OrdersData } from "@/app/types";
import {
  getClipboardOrderRowData,
  getComparator,
  getFilteredOrders,
  getOrdersArray,
  stableSort,
} from "@/app/utils";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import { OrdersTableToolbar } from "../OrdersTableToolbar.tsx";
import { OrderRow } from "./OrdersRow";

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

  const tableRef = useRef<any | null>(null);

  const getOrdersRows = async () => {
    try {
      const data = await getOrdersArray();
      const sorted = stableSort(data as any, getComparator(order, orderBy));
      setRows(sorted as any);
      setFilteredRows(sorted as any);
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
    if (tableRef.current) {
      tableRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
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
            ref={tableRef}
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

              <TableBody>
                {visibleRows.length ? (
                  <>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row.id as string);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      const onCopy = (event: any) => {
                        event.stopPropagation();

                        navigator.clipboard
                          .writeText(getClipboardOrderRowData(row as any))
                          .then(() => showSuccessToast("Copied!"));
                      };
                      return (
                        <OrderRow
                          key={`${row.id}-${index}`}
                          row={row}
                          handleClick={handleClick}
                          isItemSelected={isItemSelected}
                          labelId={labelId}
                          onCopy={onCopy}
                        />
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
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      {t("table_no_orders_yet")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
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
