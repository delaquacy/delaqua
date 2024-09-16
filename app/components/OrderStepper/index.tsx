import { useEffect, useState } from "react";

import sessionService from "@/app/lib/SessionService";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CardShadow } from "../shared";
import {
  AddressStep,
  ButtonsGroup,
  DateStep,
  FinishStep,
  OrderDetailsStep,
  StoreStep,
} from "./components";
import { FirstStepModal } from "./components/FirstStepModal";

const STEP_KEYS = [
  "address",
  "products",
  "dateAndTime",
  "orderDetails",
  "done",
];

const STEPS_COMPONENTS = [
  (props: any) => <AddressStep {...props} />,
  (props: any) => <StoreStep {...props} />,
  (props: any) => <DateStep {...props} />,
  (props: any) => <OrderDetailsStep {...props} />,
  (props: any) => <FinishStep {...props} />,
];

export default function OrderStepper() {
  const { t } = useTranslation("form");

  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onConfirm = () => {
    setOpen(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  useEffect(() => {
    const step = sessionService.getStep();
    setActiveStep(step);
  }, []);

  return (
    <>
      <CardShadow>
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
            }}
          >
            {STEPS_COMPONENTS[activeStep]({
              handleNext,
              renderButtonsGroup: () => (
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />

                  <Button onClick={handleBack}>Back</Button>
                </Box>
              ),
            })}
          </Box>
        ) : (
          <Box
            sx={{
              paddingTop: 4,
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
              activeStep,
            })}
          </Box>
        )}
      </CardShadow>
      <FirstStepModal open={open} setOpen={setOpen} onConfirm={onConfirm} />
    </>
  );
}
