import { theme } from "@/app/ui/themeMui";
import {
  Box,
  Card,
  Table,
  TableCell,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";

export const StyledWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
});

export const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  padding: "15px",
  gap: "12px",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
});

export const CardBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const CardTypoBold = styled(Typography)({
  fontWeight: "bold",
});

export const StyledTable = styled(Table)({
  padding: "20px",
});

export const StyledHeadCell = styled(TableCell)<{ border: string }>(
  ({ border }) => ({
    fontWeight: "bold",
    borderRight: border === "border" ? "1px solid #ddd" : "none",
    alignItems: "center",
    padding: "none",
  })
);

export const StyledCell = styled(TableCell)({
  borderRight: "1px solid #ddd",
});

export const StyledTooltip = styled(Tooltip)({
  transform: "translateY(5px)",
  cursor: "pointer",
  color: "gray",
  width: "20px",
  height: "20px",

  [theme.breakpoints.up("sm")]: {
    width: "30px",
    height: "30px",
  },
});
