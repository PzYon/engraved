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
    journalIds?: string[],
  ) {
    return [
      journals,
      "all",
      searchText ?? "",
      journalTypes?.join() ?? "",
      favoritesOnly ?? false,
      journalIds?.join() ?? "",
    ];
  },

  journal(journalId: string | undefined) {
    return [journals, journalId ?? ""];
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

  relatedEntities(entityId: string, entityType: "Journal" | "Entry") {
    return ["search", "related", entityType, entityId];
  },

  entities(
    searchText = "",
    scheduledOnly = false,
    onlyEntriesOfTypes: JournalType[] = [],
    executeWithoutConditions = false,
    onlyConsiderTitle = false,
  ) {
    return [
      "search",
      "entities",
      searchText,
      scheduledOnly,
      onlyEntriesOfTypes?.join(","),
      executeWithoutConditions,
      onlyConsiderTitle,
    ];
  },

  systemInfo() {
    return ["system-info"];
  },

  adminUsers() {
    return ["admin", "users"];
  },

  deleteAdminUser(userId: string) {
    return ["admin", "users", userId, "delete"];
  },

  appVersion() {
    return ["app-version"];
  },

  modifyUser() {
    return ["user"];
  },
};
