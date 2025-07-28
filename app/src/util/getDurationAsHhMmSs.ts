import { differenceInSeconds } from "date-fns";
import { round } from "./utils";

export function getDurationAsHhMmSsFromSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / (60 * 60));
  const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
  const seconds = round(totalSeconds - hours * 60 * 60 - minutes * 60, 3);

  return `${padZeros(hours)}:${padZeros(minutes)}:${padZeros(seconds)}`;
}

export function getDurationAsHhMmSs(start: Date, end: Date): string {
  const totalSeconds = differenceInSeconds(end, start);

  return getDurationAsHhMmSsFromSeconds(totalSeconds);
}

function padZeros(n: number): string {
  return n.toString().padStart(2, "0");
}
