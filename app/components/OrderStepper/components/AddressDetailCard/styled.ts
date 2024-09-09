import { theme } from "@/app/ui/themeMui";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const CardWrapper = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export const CardBlock = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",

  [theme.breakpoints.up("sm")]: {
    width: "45%",
  },
});

export const CardBlockRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "10px",
});

export const RemoveButtonWrapper = styled(Box)({
  width: "35px",
  height: "35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  transition: "all 0.15s ",

  ":hover": {
    background: "rgba(0, 0, 0, 0.05)",
  },
});
