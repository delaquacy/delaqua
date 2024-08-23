import styled from "@emotion/styled";
import { Tab } from "@mui/material";

export const GoodTab = styled(Tab)(
  ({ isCurrentTab }: { isCurrentTab: boolean }) => ({
    flex: 1,
    maxWidth: "100%",
    borderRadius: "10px",
    transition: "all 0.3s",
    background: isCurrentTab ? "#F1F1F1" : "",
    ":hover": {
      background: "#F1F1F1",
    },
  })
);
