import { useMediaQuery } from "@mui/material";

export enum DeviceWidth {
  Small,
  Normal,
  Large,
}

export const maxWidthInPx = 1200;
export const minWidthInPx = 600;

export const useDeviceWidth = (): DeviceWidth => {
  const isLarge = useMediaQuery(`(min-width:${maxWidthInPx}px)`);
  const isNormal = useMediaQuery(`(min-width:${minWidthInPx}px)`);

  if (isLarge) {
    return DeviceWidth.Large;
  }

  if (isNormal) {
    return DeviceWidth.Normal;
  }

  return DeviceWidth.Small;
};
