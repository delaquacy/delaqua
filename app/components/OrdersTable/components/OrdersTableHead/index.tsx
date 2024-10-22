import { useOrdersTableContext } from "@/app/contexts/OrdersTableContext";
import { useScreenSize } from "@/app/hooks";
import { OrdersData } from "@/app/types";
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "react-i18next";
import { TableHeadCells } from "../../../../constants/TableHeadCells";
import { StyledTableCell } from "./styled";

export function OrdersTableHead() {
  const {
    handleRequestSort,
    handleSelectAllClick,
    selected,
    rows,
    orderBy,
    order,
  } = useOrdersTableContext();

  const { t } = useTranslation("orderTable");
  const { isSmallScreen } = useScreenSize();

  const numSelected = selected.length;
  const rowCount = rows.length;

  const createSortHandler =
    (property: keyof OrdersData) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  return (
    <TableRow
      sx={{
        position: isSmallScreen ? "static" : "sticky",
        top: 0,
        zIndex: 3,
        width: "100vw",
      }}
    >
      <TableCell
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
          onChange={handleSelectAllClick}
          inputProps={{
            "aria-label": "select all desserts",
          }}
        />
      </TableCell>
      {TableHeadCells.map((headCell) =>
        headCell.sortable ? (
          <TableCell
            key={headCell.id as string}
            variant="head"
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              minWidth: headCell.id === "paymentStatus" ? "130px" : "100px",
              zIndex: 0,
              overflow: "hidden",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id as keyof OrdersData)}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                {headCell.image}
                <Box textAlign="center">{t(`${headCell.label}`)}</Box>
              </Box>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ) : (
          <StyledTableCell
            head_cell_id={headCell.id}
            key={headCell.id as string}
            variant="head"
            sx={{
              position:
                !isSmallScreen &&
                (headCell.id === "index" ||
                  headCell.id === "phoneNumber" ||
                  headCell.id === "firstAndLast")
                  ? "sticky"
                  : "",
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              {headCell.image}
              <Box textAlign="center">{t(`${headCell.label}`)}</Box>
            </Box>
          </StyledTableCell>
        )
      )}
    </TableRow>
  );
}
