import styled from "@emotion/styled";
import { Box, FormHelperText } from "@mui/material";

export const Wrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  paddingTop: 2,
  justifyContent: "space-between",
});
export const HelperText = styled(FormHelperText)({
  color: "#d32f2f",
  textAlign: "center",
  fontWeight: 600,
  fontSize: "14px",
});
