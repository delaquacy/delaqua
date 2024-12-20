"use client";
import { init, track } from "@amplitude/analytics-browser";
import { FC, ReactNode, createContext, useEffect } from "react";

interface AmplitudeContextType {
  trackAmplitudeEvent: (
    eventName: string,
    eventProperties?: Record<string, any>
  ) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string;

const defaultContextValue: AmplitudeContextType = {
  trackAmplitudeEvent: () => {},
};

export const AmplitudeContext =
  createContext<AmplitudeContextType>(defaultContextValue);

interface AmplitudeContextProviderProps {
  children: ReactNode;
}

export const AmplitudeContextProvider: FC<AmplitudeContextProviderProps> = ({
  children,
}) => {
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
