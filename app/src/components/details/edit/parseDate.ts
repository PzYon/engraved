import * as chrono from "chrono-node";

export interface IParsedDate {
  recurrence?: IParsedRecurrence;
  date?: Date;
  text?: string;
}

type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface IParsedRecurrence {
  days: DayOfWeek[];
  time: string;
}

export const parseDate = (value: string, referenceDate?: Date): IParsedDate => {
  if (!value) {
    return {};
  }

  const preparedValue = value
    .replace(/(\d\d)(\d\d)/, "$1:$2")
    .replace("tom", "tomorrow");

  const parsed = chrono.parse(preparedValue, referenceDate, {
    forwardDate: true,
  });

  const parsedElement = parsed[0];

  if (!parsedElement?.date) {
    return { text: value };
  }

  const result: IParsedDate = {
    date: parsedElement.date(),
    text: preparedValue
      .replace(parsedElement.text, "")
      .replace("  ", " ")
      .trim(),
  };

  const match: RegExpMatchArray = preparedValue.match(/every (.*?) /);
  if (match?.[1]) {
    result.recurrence = {
      time: "15:00",
      days: match[1].split(",").map((e) => e.trim()) as DayOfWeek[],
    };
  }

  return result;
};
