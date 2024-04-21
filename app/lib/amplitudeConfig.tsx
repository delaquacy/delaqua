"use client";
import React, {
  createContext,
  useEffect,
  ReactNode,
  FC,
} from "react";
import { init, track } from "@amplitude/analytics-browser";

interface AmplitudeContextType {
  trackAmplitudeEvent: (
    eventName: string,
    eventProperties?: Record<string, any>
  ) => void;
}

// const API_KEY = "5facbe9a2068497964a3316947ed914d";
const API_KEY = "cf2c41a14d1a53777092d427d9a2e834";

const defaultContextValue: AmplitudeContextType = {
  trackAmplitudeEvent: () => {},
};

export const AmplitudeContext = createContext<AmplitudeContextType>(
  defaultContextValue
);

interface AmplitudeContextProviderProps {
  children: ReactNode;
}

export const AmplitudeContextProvider: FC<
  AmplitudeContextProviderProps
> = ({ children }) => {
  useEffect(() => {
    init(API_KEY, undefined, {
      defaultTracking: {
        sessions: true,
      },
    });
  }, []);

  const trackAmplitudeEvent = (
    eventName: string,
    eventProperties?: Record<string, any>
  ) => {
    track(eventName, eventProperties);
  };

  const value = { trackAmplitudeEvent };

  return (
    <AmplitudeContext.Provider value={value}>
      {children}
    </AmplitudeContext.Provider>
  );
};
