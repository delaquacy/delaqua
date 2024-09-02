import { theme } from "@/app/ui/themeMui";
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
  width: "100%",
  alignSelf: "left",

  [theme.breakpoints.up("sm")]: {
    width: "fit-content",
    justifyContent: "left",
  },
});

export const ToggleButtonGroupWrap = styled(ToggleButtonGroup)({
  "& .Mui-selected": {
    backgroundColor: "rgba(25,118,210, 0.2) !important",
    ":hover": {
      backgroundColor: "rgba(25,118,210, 0.2) !important",
    },
  },
});
