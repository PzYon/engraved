import { createDateConditions } from "./createDateConditions";
import { journalDefaultUiSettings } from "../journalDefaultUiSettings";

export const getDefaultDateConditions = () => {
  return createDateConditions(journalDefaultUiSettings.dateFilter, new Date());
};
