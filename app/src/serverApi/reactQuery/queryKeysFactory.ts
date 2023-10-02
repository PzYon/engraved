import { IDateConditions } from "../../components/details/JournalDetailsContext";
import { JournalType } from "../JournalType";

const journals = "journals";

export const queryKeysFactory = {
  journals(searchText?: string, metricTypes?: JournalType[]) {
    return [journals, "all", searchText ?? "", metricTypes?.join() ?? ""];
  },

  journal(journalId: string) {
    return [journals, journalId];
  },

  addJournal() {
    return [journals, "add"];
  },

  editMetric(journalId: string) {
    return [journals, journalId, "edit"];
  },

  deleteMetric(journalId: string) {
    return [journals, journalId, "delete"];
  },

  journalThresholdValues(journalId: string, dateConditions: IDateConditions) {
    return [journals, journalId, "threshold-values", dateConditions];
  },

  entries(
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

  updateMeasurement(journalId: string, entryId: string) {
    return [journals, journalId, "entry", "update", entryId];
  },

  deleteMeasurement(journalId: string, entryId: string) {
    return [journals, journalId, "entry", "delete", entryId];
  },

  moveMeasurement(entryId: string, journalId: string) {
    return [journals, journalId, entryId];
  },

  activeEntry(journalId: string, metricType: JournalType) {
    return [journals, journalId, "entries", metricType, "get-active"];
  },

  activities(searchText?: string, metricTypes?: JournalType[]) {
    return [
      journals,
      "activities",
      searchText ?? "",
      metricTypes?.join() ?? "",
    ];
  },

  systemInfo() {
    return ["system-info"];
  },

  appVersion() {
    return ["app-version"];
  },
};
