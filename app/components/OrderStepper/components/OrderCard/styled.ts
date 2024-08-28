import { theme } from "@/app/ui/themeMui";
import { Box, Card, FormHelperText, styled } from "@mui/material";

export const CardWrapper = styled(Card)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  gap: "10px",
  alignContent: "center",
  cursor: "pointer",
  border: "1px solid lightgray",
  paddingBottom: "5px",

  transition: "all 0.2s",

  [theme.breakpoints.up("sm")]: {
    paddingBottom: "10px",
  },

  ":hover": {
    [theme.breakpoints.up("sm")]: {
      transform: "scale(1.1)",
    },
  },
}));

export const DescriptionBox = styled(Box)({
  justifySelf: "flex-end",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
});

export const MinOrderBox = styled(FormHelperText)({
  paddingInline: "10px",
  fontSize: "10px",

  [theme.breakpoints.up("sm")]: {
    fontSize: "11px",
  },
});
