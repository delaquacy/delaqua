import { Box, Typography, styled } from "@mui/material";

export const TurnOffTheDayWrapper = styled(Box)({
  margin: "10px",
});

export const StyledTitle = styled(Typography)({
  marginTop: "10px",
  marginLeft: "10px",
  fontWeight: "bold",
  fontSize: "32px",
});

export const StyledTabsContainer = styled(Box)({
  padding: "10px",
  marginInline: "20px",
});

export const StyledTabPanel = styled(Box)(({ hidden }) => ({
  display: hidden ? "none" : "block",
  marginTop: "10px",
}));
