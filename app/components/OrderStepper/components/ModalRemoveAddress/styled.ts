import { Box, styled } from "@mui/material";

export const Wrapper = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "350px",
  border: "2px solid #000",
  padding: "32px",
  background: "#fff",
});
