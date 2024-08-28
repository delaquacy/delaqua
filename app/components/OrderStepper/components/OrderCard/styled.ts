import { theme } from "@/app/ui/themeMui";
import { Box, Card, styled } from "@mui/material";

export const CardWrapper = styled(Card)(() => ({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  gap: "10px",
  alignContent: "center",
  cursor: "pointer",
  border: "1px solid lightgray",

  paddingBlock: "10px",
  transition: "all 0.2s",

  ":hover": {
    [theme.breakpoints.up("sm")]: {
      transform: "scale(1.1)",
    },
  },
}));

export const Marker = styled(Box)({
  position: "absolute",
  fontSize: "10px",
  background: "#5195DC",
  paddingBlock: "5px",
  paddingInline: "10px",
  borderRadius: "0px 14px 14px 0px",
  color: "#fff",
  fontWeight: 700,
  left: -1,
  top: 0,
  boxShadow: "rgba(145,188,233, 10) 0px 5px 10px",
});

export const DescriptionBox = styled(Box)({
  justifySelf: "flex-end",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
});
