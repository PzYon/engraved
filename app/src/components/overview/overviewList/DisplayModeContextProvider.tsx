import React, { useState } from "react";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { DisplayModeContext } from "./DisplayModeContext";

export const DisplayModeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const deviceWidth = useDeviceWidth();

  const [isCompact, setIsCompact] = useState(deviceWidth === DeviceWidth.Small);

  return (
    <DisplayModeContext.Provider value={{ setIsCompact, isCompact }}>
      {children}
    </DisplayModeContext.Provider>
  );
};
