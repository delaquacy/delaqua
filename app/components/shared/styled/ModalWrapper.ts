import { theme } from "@/app/ui/themeMui";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ModalWrapper = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  overflow: "scroll",
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
  [theme.breakpoints.up("sm")]: {
    width: 850,
  },
});
