"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  FC,
} from "react";
interface ToggleContextType {
  isToggled: boolean;
  setToggle: (
    value: boolean | ((prevState: boolean) => boolean)
  ) => void;
}
const ToggleContext = createContext<ToggleContextType>({
  isToggled: false,

  setToggle: () => {},
});
interface ToggleProviderProps {
  children: ReactNode;
}

export const ToggleProvider: FC<ToggleProviderProps> = ({
  children,
}) => {
  const [isToggled, setToggle] = useState(false);

  return (
    <ToggleContext.Provider value={{ isToggled, setToggle }}>
      {children}
    </ToggleContext.Provider>
  );
};

export const useToggle = () => useContext(ToggleContext);
