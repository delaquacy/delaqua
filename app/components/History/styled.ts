import { theme } from "@/app/ui/themeMui";
import { Box, Card, TableCell, Typography, styled } from "@mui/material";

export const HistoryTableHeadCell = styled(TableCell)({
  alignItems: "center",
  padding: "none",
  paddingBlock: "10px",
  fontWeight: 600,
});
export const HistoryTableCell = styled(TableCell)({
  alignItems: "center",
  padding: "none",
});

export const HistoryTableWidthCell = styled(TableCell)({
  padding: "none",
  width: "100px",
  maxWidth: "120px",
  textAlign: "center",
  paddingInline: "5px",
});

export const HeaderWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

export const HistoryCardsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
});

export const HistoryCardWrapper = styled(Card)({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  padding: "10px",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
});

export const CardRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "5px",
  alignItems: "center",
});

export const CardCol = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const TitleTypo = styled(Typography)({
  fontWeight: "bold",
  fontSize: "16px",
});
export const TextTypo = styled(Typography)({
  fontSize: "14px",
});
export const CancelTitle = styled(Typography)({
  fontSize: "28px",
  fontWeight: "bold",
});

export const ModalWrapper = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 350,

  transform: "translate(-50%, -50%)",
  border: "2px solid #000",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: "20px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",

  [theme.breakpoints.up("sm")]: {
    width: 500,
  },
});
