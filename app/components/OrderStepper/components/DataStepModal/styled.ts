import { theme } from "@/app/ui/themeMui";
import { Box, IconButton, Typography, styled } from "@mui/material";

export const Wrapper = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 330,
  border: "2px solid #000",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: "20px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",

  [theme.breakpoints.up("sm")]: {
    width: 500,
  },
});

export const CloseButton = styled(IconButton)({
  position: "absolute",
  cursor: "pointer",
  right: "10px",
  top: "10px",
});

export const TypoWithPadding = styled(Typography)({
  paddingInline: "20px",
});
