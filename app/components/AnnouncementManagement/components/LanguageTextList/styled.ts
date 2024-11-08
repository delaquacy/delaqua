import styled from "@emotion/styled";
import { List, ListItem } from "@mui/material";

export const StyledList = styled(List)({
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
});

export const StyledListItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
  "&:last-child": {
    borderBottom: "none",
  },
});
