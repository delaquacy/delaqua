import { theme } from "@/app/ui/themeMui";
import { Box, FormHelperText, styled } from "@mui/material";

export const CustomGrid = styled(Box)({
  width: "63.5%",
  display: "flex",
  flexDirection: "row",
  marginBlock: "20px",
  paddingLeft: "50px",
  justifyContent: "space-between",
});

export const HelperText = styled(FormHelperText)({
  marginTop: "30px",
  fontSize: "14px",
});

export const WaterWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "stretch",
  gap: "20px",
  height: "100%",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    paddingInline: "50px",
  },
});

export const BigCardWrapper = styled(Box)({
  width: "65%",
  minHeight: "100%",
});

export const SmallWaterWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  justifyContent: "space-between",
  height: "100%",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "column",
    width: "25%",
  },
});
