import * as chrono from "chrono-node";
import { format } from "date-fns";

export interface IParsedDate {
  recurrence?: IParsedRecurrence;
  date?: Date;
  text?: string;
}

export interface IParsedRecurrence {
  days: DayOfWeek[];
  time: string;
}

export enum DayOfWeek {
  Mon = "Mon",
  Tue = "Tue",
  Wed = "Wed",
  Thu = "Thu",
  Fri = "Fri",
  Sat = "Sat",
  Sun = "Sun",
}

const allDaysOfWeek: DayOfWeek[] = [
  DayOfWeek.Mon,
  DayOfWeek.Tue,
  DayOfWeek.Wed,
  DayOfWeek.Thu,
  DayOfWeek.Fri,
  DayOfWeek.Sat,
  DayOfWeek.Sun,
];

const every = "every";

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

  if (parsed.length > 1) {
    throw new Error(
      `"${value}" is not a valid string, parses to too many segments (${parsed.length})."`,
    );
  }

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

    // todo: time here must be utc!!
    // problem: what if time is actually on a different day, e.g.:
    // every sat at 01 (AM) is actually every fri at 23
    // -> if this is a problem.. then what about zeitumstellung and co.?

    result.recurrence = {
      time: format(result.date, "HH:mm"),
      days: days,
    };
  }

  return result;
};

const parseDaysOfWeek = (input: string): DayOfWeek[] => {
  const trimmedInput = removeLeadingChars(input, [",", " ", "and"]);

  const day = allDaysOfWeek.find((d) =>
    trimmedInput.toLowerCase().startsWith(d.toLowerCase()),
  );

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
