import { IDateConditions } from "../../components/details/JournalDetailsContext";
import { JournalType } from "../JournalType";

const journals = "journals";

export const queryKeysFactory = {
  journals(
    searchText?: string,
    journalTypes?: JournalType[],
    favoritesOnly?: boolean,
  ) {
    return [
      journals,
      "all",
      searchText ?? "",
      journalTypes?.join() ?? "",
      favoritesOnly ?? false,
    ];
  },

  journal(journalId: string) {
    return [journals, journalId];
  },

  addJournal() {
    return [journals, "add"];
  },

  editJournal(journalId: string) {
    return [journals, journalId, "edit"];
  },

  deleteJournal(journalId: string) {
    return [journals, journalId, "delete"];
  },

  journalThresholdValues(journalId: string, dateConditions: IDateConditions) {
    return [journals, journalId, "threshold-values", dateConditions];
  },

  journalEntries(
    journalId: string,
    dateConditions?: IDateConditions,
    attributeValues?: Record<string, string[]>,
  ) {
    return [
      journals,
      journalId,
      "entries",
      { filters: { dateConditions: dateConditions, attributeValues } },
    ];
  },

  updateEntries(journalId: string, entryId: string) {
    return [journals, journalId, "entry", "update", entryId];
  },

  deleteEntry(journalId: string, entryId: string) {
    return [journals, journalId, "entry", "delete", entryId];
  },

  moveEntry(entryId: string, journalId: string) {
    return [journals, journalId, entryId];
  },

  activeEntry(journalId: string, journalType: JournalType) {
    return [journals, journalId, "entries", journalType, "get-active"];
  },

  entries(searchText?: string, journalTypes?: JournalType[]) {
    return [journals, "entries", searchText ?? "", journalTypes?.join() ?? ""];
  },

  systemInfo() {
    return ["system-info"];
  },

  appVersion() {
    return ["app-version"];
  },

  modifyUser() {
    return ["user"];
  },

  entities(searchText: string) {
    return ["search", "entities", searchText];
  },
};
