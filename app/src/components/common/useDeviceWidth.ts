import { useEffect, useState } from "react";

export enum DeviceWidth {
  Small,
  Normal,
}

const thresholdInPx = 600;

export const useDeviceWidth = (): DeviceWidth => {
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>();

  useEffect(() => {
    onResize();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  function onResize() {
    const deviceWidth =
      window.innerWidth >= thresholdInPx
        ? DeviceWidth.Normal
        : DeviceWidth.Small;

    setDeviceWidth(deviceWidth);
  }

  function onOrientationChange() {
    onResize();
  }

  return deviceWidth;
};
