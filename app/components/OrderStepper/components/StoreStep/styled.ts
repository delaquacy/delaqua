import { theme } from "@/app/ui/themeMui";
import { Box, FormHelperText, styled } from "@mui/material";

export const WaterWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "20px",

  [theme.breakpoints.up("sm")]: {
    alignItems: "stretch",
    height: "100%",
    flexDirection: "row",
    paddingInline: "50px",
  },
});

export const BigCardWrapper = styled(Box)({
  width: "100%",
  minHeight: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "65%",
    minHeight: "100%",
  },
});

export const SmallWaterWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  justifyContent: "space-between",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "column",
    height: "100%",
    width: "25%",
  },
});

export const TextWrapper = styled(Box)({
  marginBlock: "20px",

  [theme.breakpoints.up("sm")]: {
    marginTop: "10px",
    marginLeft: "50px",
  },
});

export const CustomGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "20px",
  marginBottom: "20px",

  [theme.breakpoints.up("md")]: {
    justifyContent: "space-between",
    display: "flex",

    flexDirection: "row",
  },

  [theme.breakpoints.up("sm")]: {
    paddingInline: "50px",
  },
});

export const HelperText = styled(FormHelperText)({
  marginTop: "30px",
  fontSize: "14px",
});
