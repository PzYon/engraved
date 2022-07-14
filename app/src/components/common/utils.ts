import { lighten } from "@mui/material";

export function getCoefficient(currentIndex: number, instanceCount: number) {
  return currentIndex * (0.5 / Math.max(instanceCount - 1, 1));
}

export function getColorShades(length: number, color: string) {
  const colors: string[] = [];
  for (let i = 0; i < length; i++) {
    colors.push(lighten(color, getCoefficient(i, length)));
  }
  return colors;
}
