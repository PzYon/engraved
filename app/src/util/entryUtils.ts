import { IJournalAttributeValues } from "../serverApi/IJournalAttributeValues";
import { IJournal } from "../serverApi/IJournal";
import { IJournalAttributes } from "../serverApi/IJournalAttributes";

export function countAttributes(journal: IJournal) {
  return Object.keys(journal?.attributes || {}).length;
}

export function hasAttributes(journal: IJournal): boolean {
  return countAttributes(journal) > 0;
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

export function getDefaultAttributeValues(
  attributes: IJournalAttributes | undefined,
): IJournalAttributeValues {
  if (!attributes) {
    return {};
  }

  return Object.entries(attributes).reduce(
    (acc: IJournalAttributeValues, [key, attribute]) => {
      if (attribute.defaultValue) {
        acc[key] = [attribute.defaultValue];
      }
      return acc;
    },
    {},
  );
}
