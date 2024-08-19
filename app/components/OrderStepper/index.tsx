import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { FirstStep } from "./FirstStep";
import { useScreenSize } from "@/app/hooks";
import { Tooltip, useTheme } from "@mui/material";
import { SecondStep } from "./SecondStep";
import { FirstStepModal } from "./FirstStepModal";
import { ThirdStep } from "./ThirdStep";
import { FourthStep } from "./FourthStep";
import { FifthStep } from "./FifthStep";

const STEPS = [
  "Choose products",
  "Choose the date and time of delivery",
  "Enter your address details",
  "Check the order details",
];

const STEPS_COMPONENTS = [
  (props: any) => <FirstStep {...props} />,
  (props: any) => <SecondStep {...props} />,
  (props: any) => <ThirdStep {...props} />,
  (props: any) => <FourthStep {...props} />,
];

export default function OrderStepper() {
  const { isSmallScreen } = useScreenSize();

  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    if (activeStep === 0) {
      setOpen(true);
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onConfirm = () => {
    setOpen(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Box sx={{ width: "100%", marginTop: "20px", minHeight: "100%" }}>
        {!isSmallScreen && (
          <Stepper
            activeStep={activeStep}
            sx={{
              overflow: "scroll",
            }}
          >
            {STEPS.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        )}

        {activeStep === STEPS.length ? (
          <Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </Fragment>
        ) : (
          <Box
            sx={{
              paddingBlock: 4,
              minHeight: "calc(100vh - 200px)",
            }}
          >
            {STEPS_COMPONENTS[activeStep]({
              handleNext,
              renderButtonsGroup: (errorMessage: string) => (
                <ButtonsGroup
                  activeStep={activeStep}
                  handleBack={handleBack}
                  handleNext={handleNext}
                  steps={STEPS}
                  errorMessage={errorMessage}
                />
              ),
            })}
          </Box>
        )}
      </Box>
      <FirstStepModal open={open} setOpen={setOpen} onConfirm={onConfirm} />
    </>
  );
}

interface ButtonsGroupProps {
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  steps: any[];
  errorMessage?: string;
}

const ButtonsGroup = ({
  activeStep,
  handleBack,
  handleNext,
  steps,
  errorMessage,
}: ButtonsGroupProps) => {
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
        Back
      </Button>
      <Box sx={{ flex: "1 1 auto" }} />

      <Tooltip title={errorMessage}>
        <Button
          type="submit"
          sx={{ border: "1px solid lightgray" }}
          color="primary"
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Tooltip>
    </Box>
  );
};
