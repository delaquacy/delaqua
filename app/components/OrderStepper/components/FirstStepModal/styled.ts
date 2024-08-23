import { theme } from "@/app/ui/themeMui";
import { Box, styled } from "@mui/material";

export const Wrapper = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: "20px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});
