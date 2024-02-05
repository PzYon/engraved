import { IJournal } from "../serverApi/IJournal";
import { IJournalUiSettings } from "../components/details/edit/IJournalUiSettings";

export function getUiSettings(journal: IJournal): IJournalUiSettings {
  return journal.customProps?.uiSettings
    ? JSON.parse(journal.customProps.uiSettings)
    : {};
}

export function getValueHeaderLabel(journal: IJournal): string {
  const unit = getUiSettings(journal)?.yAxisUnit;
  return unit ? `Value (${unit})` : "Value";
}
