import { theme } from "@/app/ui/themeMui";
import styled from "@emotion/styled";
import { Box, Toolbar, Typography } from "@mui/material";

export const StyledToolbar = styled(Toolbar)<{ show_bg: string }>(
  ({ show_bg }) => ({
    flexDirection: "column",
    boxShadow: "0px 4px 7px -3px rgba(66, 68, 90, 1)",
    marginBottom: "5px",
    paddingBlock: "5px",
    pl: { sm: 2 },
    pr: { xs: 1, sm: 1 },
    background: show_bg ? "#D1E3F6" : "",

    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  })
);

export const Title = styled(Typography)({
  flex: "1 1 100%",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "24px",

  [theme.breakpoints.up("sm")]: {
    textAlign: "left",
    fontSize: "30px",
  },
});

export const SelectedMenuWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "10px",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
});

export const TitleButtonsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "10px",
  alignItems: "center",
});

export const FilterButtonsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingInline: "20px",

  [theme.breakpoints.up("sm")]: {
    paddingInline: "40px",
  },
});
