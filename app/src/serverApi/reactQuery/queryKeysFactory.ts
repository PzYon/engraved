import { IDateConditions } from "../../components/details/JournalContext";
import { JournalType } from "../JournalType";

const journals = "journals";

export const queryKeysFactory = {
  prefixes: {
    journals: () => [journals],
    entities: () => ["search", "entities"],
  },

  entry(entryId: string) {
    return ["entry", entryId];
  },

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

  journalEntries(
    journalId: string,
    dateConditions?: IDateConditions,
    attributeValues?: Record<string, string[]>,
    searchText?: string,
  ) {
    return [
      journals,
      journalId,
      "entries",
      searchText ?? "",
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

  entries(searchText?: string, journalTypes?: JournalType[]) {
    return [journals, "entries", searchText ?? "", journalTypes?.join() ?? ""];
  },

  entities(
    searchText = "",
    scheduledOnly = false,
    executeWithoutConditions = false,
  ) {
    return [
      "search",
      "entities",
      searchText,
      scheduledOnly,
      executeWithoutConditions,
    ];
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
};
