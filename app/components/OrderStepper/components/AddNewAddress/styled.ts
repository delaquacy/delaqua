import { Box, styled } from "@mui/material";

export const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "20px",
  height: "100%",
});

export const FieldWrapper = styled(Box)(
  ({ is_small_screen }: { is_small_screen?: string }) => ({
    display: "flex",
    flexDirection: is_small_screen === "true" ? "column" : "row",
    gap: "20px",
  })
);

export const ButtonsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  paddingTop: 2,
  justifyContent: "space-between",
});
