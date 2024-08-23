import { Box, styled } from "@mui/material";

export const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const FieldWrapper = styled(Box)(
  ({ isSmallScreen }: { isSmallScreen?: boolean }) => ({
    display: "flex",
    flexDirection: isSmallScreen ? "column" : "row",
    gap: "20px",
  })
);

export const ButtonsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  paddingTop: 2,
  justifyContent: "space-between",
});
