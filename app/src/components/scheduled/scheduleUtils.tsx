import { IPropertyDefinition } from "../common/IPropertyDefinition";
import { DateFormat, FormatDate } from "../common/FormatDate";
import { isBefore } from "date-fns";

export function getScheduleProperty(
  nextOccurrence?: string,
): IPropertyDefinition {
  return {
    key: "schedule",
    node: () => (
      <FormatDate
        value={nextOccurrence}
        dateFormat={DateFormat.relativeToNow}
      />
    ),
    label: "Scheduled",
    hideWhen: () => !nextOccurrence,
    highlightStyle: () =>
      isBefore(new Date(), nextOccurrence) ? "regular" : "warning",
  };
}
