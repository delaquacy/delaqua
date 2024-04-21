import { useContext } from "react";
import { AmplitudeContext } from "../lib/amplitudeConfig";

const useAmplitudeContext = () => {
  const context = useContext(AmplitudeContext);
  if (context === undefined)
    throw new Error(
      "useAmplitudeContext must be used within a AmplitudeContextProvider"
    );
  return context;
};

export default useAmplitudeContext;
