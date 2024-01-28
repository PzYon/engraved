import { IPropertyDefinition } from "../common/IPropertyDefinition";
import { DateFormat, FormatDate } from "../common/FormatDate";
import { isBefore, isSameDay } from "date-fns";

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
    highlightStyle: () => {
      if (!isBefore(new Date(), nextOccurrence)) {
        return "red";
      }

      if (isSameDay(new Date(), nextOccurrence)) {
        return "yellow";
      }

      return "green";
    },
  };
}
