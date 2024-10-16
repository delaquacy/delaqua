"use client";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import { OrdersTableHead } from "@/app/components/OrdersTable/components/OrdersTableHead";
import { useScreenSize, useToast } from "@/app/hooks";
import { getClipboardOrderRowData } from "@/app/utils";
import {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import { useOrdersTableContext } from "@/app/contexts/OrdersTableContext";
import { useTranslation } from "react-i18next";
import { Loader } from "../Loader";
import { OrderRow } from "./components/OrderRow";
import { OrdersTableToolbar } from "./components/OrdersTableToolbar";
import {
  Container,
  StyledPaper,
  StyledTable,
  StyledTableContainer,
} from "./styled";

dayjs.extend(customParseFormat);

export default function OrdersTable() {
  const {
    selected,
    tableRef,
    visibleRows,
    emptyRows,
    loading,
    filteredRows,
    rowsPerPage,
    page,
    editRowId,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useOrdersTableContext();
  const { t } = useTranslation("orderTable");

  const { isSmallScreen } = useScreenSize();
  const { showSuccessToast } = useToast();

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <>
      <Container>
        <StyledPaper>
          <OrdersTableToolbar />

          <StyledTableContainer>
            <StyledTable stickyHeader size="small">
              <TableHead>
                <OrdersTableHead />
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
                      {!loading &&
                        !visibleRows.length &&
                        t("table_no_orders_yet")}
                      {loading && <Loader />}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </StyledPaper>
      </Container>
    </>
  );
}
