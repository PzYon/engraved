import * as chrono from "chrono-node";

export interface IParsedDate {
  date?: Date;
  text: string;
}

export const parseDate = (value: string, referenceDate?: Date): IParsedDate => {
  const parsed = chrono.parse(value, referenceDate, { forwardDate: true });

  if (parsed[0].date) {
    return {
      date: parsed[0].date(),
      text: value.replace(parsed[0].text, "").trim(),
    };
  }

  return {
    text: value,
  };
};
