import { Box, Card, styled } from "@mui/material";

export const Wrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  gap: "15px",
});

export const CardWrapper = styled(Card)({
  display: "flex",
  flexDirection: "column",
  padding: "10px",
});

export const CardRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  padding: "10px",
});
