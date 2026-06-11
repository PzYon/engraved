import { differenceInSeconds } from "date-fns";
import { round } from "./utils";

export function getDurationAsHhMmSsFromSeconds(totalSeconds: number): string {
  const isNegative = totalSeconds < 0;
  const absoluteSeconds = Math.abs(totalSeconds);

  const hours = Math.floor(absoluteSeconds / (60 * 60));
  const minutes = Math.floor((absoluteSeconds - hours * 60 * 60) / 60);
  const seconds = round(absoluteSeconds - hours * 60 * 60 - minutes * 60, 3);

  const sign = isNegative ? "-" : "";

  return `${sign}${padZeros(hours)}:${padZeros(minutes)}:${padZeros(seconds)}`;
}

export function getDurationAsHhMmSs(start: Date, end: Date): string {
  const totalSeconds = differenceInSeconds(end, start);

  return getDurationAsHhMmSsFromSeconds(totalSeconds);
}

function padZeros(n: number): string {
  return n.toString().padStart(2, "0");
}
