import { useScreenSize } from "@/app/hooks";
import { Box, Button, FormHelperText, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ButtonsGroupProps {
  activeStep: number;
  handleBack: () => void;
  steps: any[];
  errorMessage?: string;
}

export const ButtonsGroup = ({
  activeStep,
  handleBack,
  steps,
  errorMessage,
}: ButtonsGroupProps) => {
  const { t } = useTranslation("form");
  const { isSmallScreen } = useScreenSize();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        paddingTop: 2,
        justifyContent: "space-between",
      }}
    >
      <Button
        color="inherit"
        disabled={activeStep === 0}
        onClick={handleBack}
        sx={{ mr: 1, border: "1px solid lightgray" }}
      >
        {t("back")}
      </Button>

      {isSmallScreen ? (
        <Box>
          <FormHelperText
            sx={{
              color: "#d32f2f",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {errorMessage}
          </FormHelperText>
        </Box>
      ) : (
        <Box sx={{ flex: "1 1 auto" }} />
      )}

      <Tooltip title={errorMessage}>
        <Button
          type="submit"
          sx={{ border: "1px solid lightgray" }}
          color="primary"
        >
          {activeStep === steps.length - 1 ? t("finish") : t("next")}
        </Button>
      </Tooltip>
    </Box>
  );
};
