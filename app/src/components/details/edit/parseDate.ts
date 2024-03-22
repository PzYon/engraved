import * as chrono from "chrono-node";

export interface IParsedDate {
  date?: Date;
  text: string;
}

export const parseDate = (value: string, referenceDate?: Date): IParsedDate => {
  const parsed = chrono.parse(value, referenceDate);

  if (parsed[0].date) {
    return {
      date: parsed[0].date(),
      text: value.substring(0, parsed[0].index).trim(),
    };
  }

  return {
    text: value,
  };
};
