import { theme } from "@/app/ui/themeMui";
import { Box, styled } from "@mui/material";

export const Grid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "30px",
  marginBottom: "20px",

  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
});

export const FormWrapper = styled(Box)({
  paddingInline: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});
