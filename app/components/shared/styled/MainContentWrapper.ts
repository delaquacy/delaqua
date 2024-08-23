import { Box, styled } from "@mui/material";
import { theme } from "../../../ui/themeMui";

export const MainContentWrapper = styled(Box)(
  ({ admin }: { admin?: boolean }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    height: admin ? `calc(100dvh - 134px)` : `calc(100dvh - 134px - 167px)`, //height Header and Footer
    overflow: "scroll",
    [theme.breakpoints.up("sm")]: {
      height: admin ? `calc(100dvh - 84px - 129px)` : `calc(100dvh - 84px)`,
    },
  })
);
