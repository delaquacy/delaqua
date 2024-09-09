import styled from "@emotion/styled";
import { Tab } from "@mui/material";

export const GoodTab = styled(Tab)(
  ({ is_current_tab }: { is_current_tab: string }) => ({
    flex: 1,
    maxWidth: "100%",
    borderRadius: "10px",
    transition: "all 0.3s",
    background: is_current_tab === "true" ? "#F1F1F1" : "",
    ":hover": {
      background: "#F1F1F1",
    },
  })
);
