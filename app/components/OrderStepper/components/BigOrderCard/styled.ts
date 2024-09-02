import { theme } from "@/app/ui/themeMui";
import { Box, Card, Typography, styled } from "@mui/material";

export const Wrapper = styled(Card)({
  display: "flex",
  gap: "10px",
  flexDirection: "column",
  alignContent: "center",
  border: "1px solid lightgray",
  width: "100%",

  padding: "10px",
  transition: "all 0.2s",

  [theme.breakpoints.up("sm")]: {
    width: "65%",
    flexDirection: "row",
  },
  ":hover": {
    [theme.breakpoints.up("sm")]: {
      transform: "scale(1.05)",
    },
  },
});

export const ExternalCountWrapper = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "10px",

  [theme.breakpoints.up("sm")]: {
    justifyContent: "space-between",
  },
});

export const InternalCountWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const Title = styled(Typography)({
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "14px",

  [theme.breakpoints.up("sm")]: {
    fontSize: "16px",
  },
});
