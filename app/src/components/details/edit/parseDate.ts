import * as chrono from "chrono-node";

export interface IParsedDate {
  input: string;
  recurrence?: IParsedRecurrence;
  date?: Date;
  text?: string;
}

export interface IParsedRecurrence {
  dateString: string;
}

const every = "every";

export const parseDate = (value: string, referenceDate?: Date): IParsedDate => {
  if (!value) {
    return { input: value };
  }

  const preparedValue = value
    .replace(/(\d\d)(\d\d)/, "$1:$2")
    .replace(/tom/i, "tomorrow");

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
    return { text: value, input: value };
  }

  const result: IParsedDate = {
    input: value,
    date: parsedElement.date(),
    text: preparedValue
      .replace(parsedElement.text, "")
      .replace("  ", " ")
      .trim(),
  };

  const indexOfEvery = preparedValue.toLowerCase().indexOf(every.toLowerCase());

  if (indexOfEvery > -1) {
    result.recurrence = {
      dateString: parsedElement.text,
    };

    result.text = (
      preparedValue.substring(0, indexOfEvery) +
      " " +
      preparedValue.substring(
        indexOfEvery + every.length + 1 + parsedElement.text.length,
      )
    ).trim();
  }

  return result;
};
