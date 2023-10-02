import { IJournalAttributeValues } from "../serverApi/IJournalAttributeValues";
import { IJournal } from "../serverApi/IJournal";

export function hasAttributes(metric: IJournal): boolean {
  return Object.keys(metric?.attributes || {}).length > 0;
}

export function hasValues(
  metricAttributeValues: IJournalAttributeValues,
  selectedValues: Record<string, string[]>,
): boolean {
  const keys = Object.keys(selectedValues).filter(
    (k) => selectedValues[k].length,
  );

  for (const key of keys) {
    const selectedValue = selectedValues[key];
    const appliedValue = metricAttributeValues[key];

    if (
      !appliedValue?.length ||
      appliedValue.indexOf(selectedValue[0]) === -1
    ) {
      return false;
    }
  }

  return true;
}
