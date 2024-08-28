import { theme } from "@/app/ui/themeMui";
import { Box, Card, styled } from "@mui/material";

export const Wrapper = styled(Card)({
  display: "flex",
  flexDirection: "row",
  gap: "10px",
  alignContent: "center",
  border: "1px solid lightgray",

  padding: "10px",
  transition: "all 0.2s",

  [theme.breakpoints.up("sm")]: {
    width: "65%",
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
  gap: "40px",
});

export const InternalCountWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
});
