import { DateType } from "../filters/DateType";
import { DateRange } from "../filters/DateRange";

export type DateFilterConfig = {
  dateType: DateType;
  value: DateRange | number;
};
