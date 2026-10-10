import { IParsedDate } from "./parseDate";

// parseDate brings chrono-node along, which is of no use until there is a date
// to parse. Importing it here, and not at the top of the file that needs it,
// keeps it out of what the app loads at start.
export async function parseDateOnDemand(
  value: string | null | undefined,
): Promise<IParsedDate> {
  const { parseDate } = await import("./parseDate");

  return parseDate(value);
}
