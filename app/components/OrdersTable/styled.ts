import { theme } from "@/app/ui/themeMui";
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  styled,
} from "@mui/material";

interface StickyTableCellProps {
  left: number;
}

export const FlexRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "5px",
  alignItems: "centers",
  justifyContent: "space-between",
});

export const Container = styled(Box)({
  width: "100vw",
  maxHeight: "calc(100dvh - 123px)",

  [theme.breakpoints.up("sm")]: {
    maxHeight: "calc(100dvh - 85px)",
  },
});

export const StyledPaper = styled(Paper)({
  width: "100%",
  mb: 2,
});

export const StyledTableContainer = styled(TableContainer)({
  width: "100vw",
  maxHeight: "calc(100dvh - 240px)",

  [theme.breakpoints.up("sm")]: {
    maxHeight: "calc(100dvh - 205px)",
  },
});

export const StyledTable = styled(Table)({
  paddingBottom: "10px",
  overflowY: "scroll",
  width: "100vw",
});

export const StickyTableCell = styled(TableCell)<StickyTableCellProps>(
  ({ left }) => ({
    background: "inherit",
    zIndex: 2,
    textAlign: "center",

    [theme.breakpoints.up("sm")]: {
      left: `${left}px`,
      position: "sticky",
    },
  })
);

export const StandardTableCell = styled(TableCell)({
  textAlign: "center",
});

export const EditBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "5px",
  transition: "all 0.3s",
  padding: "20px",
  borderRadius: "12px",

  ":hover": {
    background: "lightgray",
  },
});
