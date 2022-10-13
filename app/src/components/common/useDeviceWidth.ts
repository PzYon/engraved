import { useMediaQuery } from "@mui/material";

export enum DeviceWidth {
  Small,
  Normal,
}

const thresholdInPx = 600;

export const useDeviceWidth = (): DeviceWidth => {
  const isMatch = useMediaQuery(`(min-width:${thresholdInPx}px)`);

  return isMatch ? DeviceWidth.Normal : DeviceWidth.Small;
};
