import { Box, Card, styled } from "@mui/material";

export const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "20px",
  height: "100%",
});

export const DetailsCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  padding: "20px",
  marginTop: "20px",
});

export const DetailsCardItem = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "15px",
});

export const DetailsCardItemColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  flex: 1,
});

export const DetailsCardItemRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "10px",
});
