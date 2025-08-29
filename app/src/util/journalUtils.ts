import { IJournal } from "../serverApi/IJournal";
import { IJournalUiSettings } from "../components/details/edit/IJournalUiSettings";
import { JournalType } from "../serverApi/JournalType";

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
