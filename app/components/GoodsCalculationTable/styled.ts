import { theme } from "@/app/ui/themeMui";
import { Box, styled } from "@mui/material";

export const DatePickWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  marginBottom: "30px",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
});
