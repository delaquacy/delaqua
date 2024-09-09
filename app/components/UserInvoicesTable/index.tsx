"use client";

import { useScreenSize, useToast } from "@/app/hooks";
import { FilterItem, Invoices } from "@/app/types";
import { getComparator, stableSort } from "@/app/utils";
import { getClipboardInvoiceRowData } from "@/app/utils/getClipboardInvoiceRowData";
import { getFilteredInvoices } from "@/app/utils/getFilteredInvoices";
import { getUserInvoices } from "@/app/utils/getUserInvoices";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { InvoiceTableRow } from "./components";
import { InvoicesTableHead } from "./components/InvoicesTableHead";
import { InvoicesTableToolbar } from "./components/InvoicesTableToolbar";

interface OrderItemsTableProps {
  orderItems: any[];
  totalPayments: string;
}

export const UserInvoicesTable = () => {
  const { isSmallScreen } = useScreenSize();
  const { showSuccessToast } = useToast();
  const { t } = useTranslation("orderTable");

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Invoices[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof Invoices>("deliveryDate");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [filteredRows, setFilteredRows] = useState<Invoices[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [applyFilters, setApplyFilters] = useState<boolean>(false);

  const getInvoicesRows = async () => {
    try {
      setLoading(true);
      const data = await getUserInvoices();
      const sorted = stableSort(data as any, getComparator(order, orderBy));

      setRows(sorted as any);
      setFilteredRows(sorted as any);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleApplyFilters = () => {
    setApplyFilters(true);
  };

  const handleClearFilters = () => {
    setFilteredRows(rows);
    setFilters([]);
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

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Invoices
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  useEffect(() => {
    getInvoicesRows();
  }, []);

  useEffect(() => {
    if (applyFilters) {
      const filteredInvoices = getFilteredInvoices(filters, rows);

      setFilteredRows(filteredInvoices);
      setApplyFilters(false);
    }
  }, [filters, applyFilters]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={100} thickness={2} />
      </Box>
    );
  }

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
        <Paper sx={{ width: "100%" }}>
          <InvoicesTableToolbar
            selected={selected}
            filters={filters}
            filteredRows={filteredRows as any}
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
              margin: "10px",
            }}
          >
            <Table
              stickyHeader
              sx={{
                paddingInline: "10px",
                paddingBottom: "10px",
                overflowY: "scroll",
                width: "100vw",
              }}
              size="small"
            >
              <TableHead>
                <InvoicesTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
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
                          .writeText(getClipboardInvoiceRowData(row as any))
                          .then(() => showSuccessToast("Copied!"));
                      };
                      return (
                        <InvoiceTableRow
                          key={row.id as string}
                          row={row}
                          isItemSelected={isItemSelected}
                          handleClick={handleClick}
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
};
