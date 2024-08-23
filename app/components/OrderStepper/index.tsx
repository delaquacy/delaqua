import { useState } from "react";

import { useTranslation } from "react-i18next";
import {
  ButtonsGroup,
  FifthStep,
  FirstStep,
  FourthStep,
  SecondStep,
  ThirdStep,
} from "./components";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { FirstStepModal } from "./components/FirstStepModal";

const STEP_KEYS = [
  "products",
  "dateAndTime",
  "address",
  "orderDetails",
  "done",
];

const STEPS_COMPONENTS = [
  (props: any) => <FirstStep {...props} />,
  (props: any) => <SecondStep {...props} />,
  (props: any) => <ThirdStep {...props} />,
  (props: any) => <FourthStep {...props} />,
  (props: any) => <FifthStep {...props} />,
];

export default function OrderStepper() {
  const { t } = useTranslation("form");

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
        {
          <Stepper
            activeStep={activeStep}
            sx={{
              overflow: "scroll",
            }}
          >
            {STEP_KEYS.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{t(label)}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        }

        {activeStep === STEP_KEYS.length - 1 ? (
          <Box
            sx={{
              paddingBlock: 4,
              minHeight: "calc(100vh - 200px)",
            }}
          >
            {STEPS_COMPONENTS[activeStep]({
              handleNext,
              renderButtonsGroup: (errorMessage: string) => (
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />

                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              ),
            })}
          </Box>
        ) : (
          <Box
            sx={{
              paddingBlock: 4,
              height: "calc(100dvh - 200px)",
              overflow: "scroll",
            }}
          >
            {STEPS_COMPONENTS[activeStep]({
              handleNext,
              renderButtonsGroup: (errorMessage: string) => (
                <ButtonsGroup
                  activeStep={activeStep}
                  handleBack={handleBack}
                  steps={STEP_KEYS}
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
