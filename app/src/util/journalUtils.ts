import { IJournal } from "../serverApi/IJournal";
import { IJournalUiSettings } from "../components/details/edit/IJournalUiSettings";
import { JournalType } from "../serverApi/JournalType";
import { IJournalAttributeValues } from "../serverApi/IJournalAttributeValues";
import { IJournalAttributes } from "../serverApi/IJournalAttributes";

export function getUiSettings(journal: IJournal): IJournalUiSettings {
  return journal.customProps?.uiSettings
    ? JSON.parse(journal.customProps.uiSettings)
    : {};
}

export function getValueHeaderLabel(journal: IJournal): string {
  const unit = getUiSettings(journal)?.yAxisUnit;
  return unit || "Value";
}

export function isTypeThatCanShowAddEntryRow(journalType: JournalType) {
  return (
    journalType === JournalType.Gauge || journalType === JournalType.Counter
  );
}

export function countAttributes(journal: IJournal) {
  return Object.keys(journal?.attributes || {}).length;
}

export function hasAttributes(journal: IJournal): boolean {
  return countAttributes(journal) > 0;
}

export function showAttributeSearch(journal: IJournal): boolean {
  return countAttributes(journal) > 1;
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
