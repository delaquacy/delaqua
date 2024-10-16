import { theme } from "@/app/ui/themeMui";
import { Box, Button, MenuItem, Tooltip, styled } from "@mui/material";

export const StyledTooltip = styled(Tooltip)({
  width: "20px",
  height: "20px",

  [theme.breakpoints.up("sm")]: {
    width: "50px",
    height: "50px",
  },
});

export const StyledMenuItemBox = styled(MenuItem)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",

  "& .MuiSelect-select": {
    paddingRight: "17px !important",
    paddingLeft: "10px !important",
    fontSize: "10px",
  },

  "& .MuiFormLabel-root": {
    fontSize: "10px",
  },

  "& .MuiInputBase-root": {
    height: "31px",
    fontSize: "10px",
  },

  [theme.breakpoints.up("sm")]: {
    "& .MuiSelect-select": {
      paddingRight: "unset",
      paddingLeft: "unset",
      fontSize: "inherit",
    },

    "& .MuiFormLabel-root": {
      fontSize: "inherit",
    },

    "& .MuiInputBase-root": {
      height: "56px",
      fontSize: "inherit",
    },
  },
});

export const StyledButton = styled(Button)({
  boxShadow: "none",
  padding: 0,
  background: "inherit",
  color: "#777777",
  height: "31px",
  border: "1px solid rgba(118, 118, 118, 0.5)",
  textTransform: "none",
  fontSize: "10px",
  marginInline: 0,
  display: "block",
  minWidth: "35px",
  width: 40,

  ":hover": {
    background: "inherit",
    color: "inherit",
    boxShadow: "none",
  },

  [theme.breakpoints.up("sm")]: {
    padding: 1,
    height: "56px",
    fontSize: "inherit",
    marginInline: "8px",
    display: "flex",
    minWidth: "",
    width: 231,
  },
});

export const FlexCenterRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});
