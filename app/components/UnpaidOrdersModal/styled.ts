import { Box, Card, Typography, styled } from "@mui/material";

export const CardsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  paddingTop: "5px",
});

export const CardWrapper = styled(Card)({
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
