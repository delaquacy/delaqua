import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "react-i18next";
import { Invoices, OrdersData } from "@/app/types";
import { useScreenSize } from "@/app/hooks";
import { InvoicesTableHeadCells } from "@/app/constants/UserInvoicesTable";

interface InvoicesTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Invoices
  ) => void;
  // onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: "asc" | "desc";
  orderBy: string;
  rowCount: number;
}

export function InvoicesTableHead(props: InvoicesTableHeadProps) {
  const {
    // onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler =
    (property: keyof Invoices) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const { t } = useTranslation("orderTable");

  const { isSmallScreen } = useScreenSize();

  return (
    <TableRow
      sx={{
        position: isSmallScreen ? "static" : "sticky",
        top: 0,
        zIndex: 3,
        width: "100vw",
      }}
    >
      {/* <TableCell
        variant="head"
        sx={{
          position: isSmallScreen ? "" : "sticky",
          left: isSmallScreen ? "" : 0,
          zIndex: 2,
        }}
      >
        <Checkbox
          color="primary"
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={rowCount > 0 && numSelected === rowCount}
          onChange={onSelectAllClick}
          inputProps={{
            "aria-label": "select all desserts",
          }}
        />
      </TableCell> */}

      {InvoicesTableHeadCells.map((headCell, index) =>
        headCell.sortable ? (
          <TableCell
            key={headCell.id as string}
            variant="head"
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: "bold",

              borderRight:
                index !== InvoicesTableHeadCells.length - 1
                  ? "solid 1px rgba(38, 40, 82, 0.1)"
                  : "",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id as keyof Invoices)}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Box textAlign="center" textTransform={"capitalize"}>
                  {t(`${headCell.label}`)}
                </Box>
              </Box>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ) : (
          <TableCell
            key={headCell.id as string}
            variant="head"
            sx={{
              fontWeight: "bold",

              textAlign: "center",
              borderRight:
                index !== InvoicesTableHeadCells.length - 1
                  ? "solid 1px rgba(38, 40, 82, 0.1)"
                  : "",
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box textAlign="center" textTransform={"capitalize"}>
                {t(`${headCell.label}`)}
              </Box>
            </Box>
          </TableCell>
        )
      )}
      <TableCell />
    </TableRow>
  );
}
