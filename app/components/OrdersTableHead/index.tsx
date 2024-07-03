import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { OrdersData } from "../OrdersTable";
import { TableHeadCells } from "../../constants/TableHeadCells";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "react-i18next";

interface OrdersTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof OrdersData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: "asc" | "desc";
  orderBy: string;
  rowCount: number;
}

export function OrdersTableHead(props: OrdersTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof OrdersData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const { t } = useTranslation("orderTable");

  return (
    <TableRow
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 3,
        width: "100vw",
      }}
    >
      <TableCell
        variant="head"
        sx={{
          position: "sticky",
          left: 0,
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
      </TableCell>
      {TableHeadCells.map((headCell) =>
        headCell.sortable ? (
          <TableCell
            key={headCell.id}
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
              onClick={createSortHandler(headCell.id)}
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
          <TableCell
            key={headCell.id}
            variant="head"
            sx={{
              borderRight:
                headCell.id === "firstAndLast"
                  ? "solid 1px rgba(38, 40, 82, 0.1)"
                  : "",
              position:
                headCell.id === "index" ||
                headCell.id === "phoneNumber" ||
                headCell.id === "firstAndLast"
                  ? "sticky"
                  : "static",
              left:
                headCell.id === "index"
                  ? "74px"
                  : headCell.id === "phoneNumber"
                  ? "154px"
                  : headCell.id === "firstAndLast"
                  ? "289px"
                  : "",
              zIndex:
                headCell.id === "index" ||
                headCell.id === "phoneNumber" ||
                headCell.id === "firstAndLast"
                  ? 3
                  : 0,
              minWidth:
                headCell.id === "comments" ||
                headCell.id === "deliveryAddress" ||
                headCell.id === "firstAndLast"
                  ? "150px"
                  : "80px",
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
          </TableCell>
        )
      )}
    </TableRow>
  );
}
