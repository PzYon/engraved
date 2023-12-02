import { useMediaQuery } from "@mui/material";

export enum DeviceWidth {
  Small,
  Normal,
}

export const minWidthInPx = 600;

export const useDeviceWidth = (): DeviceWidth => {
  return useMediaQuery(`(min-width:${minWidthInPx}px)`)
    ? DeviceWidth.Normal
    : DeviceWidth.Small;
};
