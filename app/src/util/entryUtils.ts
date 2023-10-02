import { IJournalAttributeValues } from "../serverApi/IJournalAttributeValues";
import { IJournal } from "../serverApi/IJournal";

export function hasAttributes(journal: IJournal): boolean {
  return Object.keys(journal?.attributes || {}).length > 0;
}

export function hasValues(
  journal: IJournalAttributeValues,
  selectedValues: Record<string, string[]>,
): boolean {
  const keys = Object.keys(selectedValues).filter(
    (k) => selectedValues[k].length,
  );

  for (const key of keys) {
    const selectedValue = selectedValues[key];
    const appliedValue = journal[key];

    if (
      !appliedValue?.length ||
      appliedValue.indexOf(selectedValue[0]) === -1
    ) {
      return false;
    }
  }

  return true;
}
