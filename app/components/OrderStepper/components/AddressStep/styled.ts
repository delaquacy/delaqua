import { Box, Button, ToggleButtonGroup, styled } from "@mui/material";

export const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "20px",
  height: "100%",
});

export const FormHeaderWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const FormHeaderButton = styled(Button)({
  textTransform: "none",
  display: "flex",
  flexDirection: "row",
  gap: "5px",
});

export const ToggleButtonGroupWrap = styled(ToggleButtonGroup)({
  "& .Mui-selected": {
    backgroundColor: "rgba(25,118,210, 0.2) !important",
    ":hover": {
      backgroundColor: "rgba(25,118,210, 0.2) !important",
    },
  },
});
