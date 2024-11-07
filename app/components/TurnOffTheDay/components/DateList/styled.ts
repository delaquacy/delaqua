import { theme } from "@/app/ui/themeMui";
import styled from "@emotion/styled";
import { Box, ListItem } from "@mui/material";

export const StyledListContainer = styled(Box)({
  marginTop: "20px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "400px",
  },
});

export const StyledListItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ccc",
  paddingBottom: "5px",
  paddingTop: "5px",
  cursor: "pointer",
  marginBottom: "5px",
  transition: "all .3s",
  "&:last-child": {
    borderBottom: "none",
    marginBottom: 0,
  },
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});
