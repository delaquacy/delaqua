import { theme } from "@/app/ui/themeMui";
import { Box, Card, styled } from "@mui/material";

export const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "10px",
});

export const FormInternalWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  height: "100%",
});

export const DetailsCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  padding: "5px",
  marginTop: "20px",
  marginInline: "4px",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
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
