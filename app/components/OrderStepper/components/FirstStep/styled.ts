import { theme } from "@/app/ui/themeMui";
import { Box, FormHelperText, styled } from "@mui/material";

export const CustomGrid = styled(Box)({
  display: "grid",
  gap: "25px",
  [theme.breakpoints.down(350)]: {
    gridTemplateColumns: "repeat(1, 1fr)",
  },
  [theme.breakpoints.between("xs", "sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(5, 1fr)",
  },
});

export const HelperText = styled(FormHelperText)({
  marginTop: "30px",
  fontSize: "14px",
});
