import { IDateConditions } from "../JournalContext";

export function isEntryFilterApplied(
  dateConditions: IDateConditions,
  selectedAttributeValues: Record<string, string[]>,
  searchText: string,
) {
  if (dateConditions?.from || dateConditions?.to) {
    return true;
  }

  if (searchText) {
    return true;
  }

  if (!selectedAttributeValues) {
    return false;
  }

  return Object.values(selectedAttributeValues).some((values) => values?.length);
}
