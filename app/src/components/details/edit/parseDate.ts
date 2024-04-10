import * as chrono from "chrono-node";

export interface IParsedDate {
  recurrence?: IParsedRecurrence;
  date?: Date;
  text?: string;
}

type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const allDaysOfWeek: DayOfWeek[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

const every = "every";

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

  const indexOfEvery = preparedValue.indexOf(every);

  if (indexOfEvery > -1) {
    const days = parseDaysOfWeek(
      preparedValue.substring(indexOfEvery + every.length),
    );

    result.recurrence = {
      time: "15:00",
      days: days,
    };
  }

  return result;
};

const parseDaysOfWeek = (input: string): DayOfWeek[] => {
  const trimmedInput = removeLeadingChars(input, [",", " ", "and"]);

  const day = allDaysOfWeek.find((d) => trimmedInput.startsWith(d));
  if (!day) {
    return [];
  }

  return [day, ...parseDaysOfWeek(trimmedInput.substring(day.length))];
};

const removeLeadingChars = (input: string, chars: string[]): string => {
  const char = chars.find((c) => input.startsWith(c));
  if (!char) {
    return input;
  }

  return removeLeadingChars(input.replace(char, ""), chars);
};
