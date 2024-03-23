import * as chrono from "chrono-node";

export interface IParsedDate {
  date?: Date;
  text: string;
}

export const parseDate = (value: string, referenceDate?: Date): IParsedDate => {
  const preparedValue = value
    .replace(/(\d\d)(\d\d)/, "$1:$2")
    .replace("tom", "tomorrow");

  const parsed = chrono.parse(preparedValue, referenceDate, {
    forwardDate: true,
  });

  if (parsed[0].date) {
    return {
      date: parsed[0].date(),
      text: preparedValue.replace(parsed[0].text, "").replace("  ", " ").trim(),
    };
  }

  return {
    text: preparedValue,
  };
};
