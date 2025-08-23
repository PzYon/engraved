import { createContext, useContext } from "react";

interface IDisplayModeContext {
  isCompact: boolean;
  setIsCompact: (value: boolean) => void;
}

export const DisplayModeContext = createContext<IDisplayModeContext>({
  isCompact: false,
  setIsCompact: null,
});

export const useDisplayModeContext = () => {
  return useContext(DisplayModeContext);
};
