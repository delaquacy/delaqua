const sessionService = {
  saveStep(step: number) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("activeStep", step.toString());
    }
  },

  getStep(): number {
    if (typeof window !== "undefined") {
      const savedStep = sessionStorage.getItem("activeStep");
      return savedStep ? Number(savedStep) : 0;
    }
    return 0;
  },

  saveFormData(formData: any) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("formData", JSON.stringify(formData));
    }
  },

  getFormData(): any | null {
    if (typeof window !== "undefined") {
      const savedFormData = sessionStorage.getItem("formData");
      return savedFormData ? JSON.parse(savedFormData) : null;
    }
    return null;
  },

  clearAll() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("activeStep");
      sessionStorage.removeItem("formData");
    }
  },
};

export default sessionService;
