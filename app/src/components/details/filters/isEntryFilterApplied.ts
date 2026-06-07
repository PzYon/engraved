import { IDateConditions } from "../JournalContext";

export function isEntryFilterApplied(
  dateConditions: IDateConditions | null | undefined,
  selectedAttributeValues: Record<string, string[]> | null | undefined,
  searchText: string | null | undefined,
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

  return Object.values(selectedAttributeValues).some(
    (values) => values?.length,
  );
}
