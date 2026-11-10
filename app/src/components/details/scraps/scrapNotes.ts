import { ScrapType } from "../../../serverApi/IScrapEntry";
import { IScrapListItem } from "./list/IScrapListItem";

const emptyListNotes = JSON.stringify([]);

const emptyMarkdownListItem = /^\s*([-*+]|\d+[.)])?\s*$/;

// Notes are persisted without meaningless content: a list whose lone line (which
// edit mode always keeps so the user has something to type into) is still blank
// becomes an empty list, and markdown holding nothing but empty list items (e.g.
// an untouched log book template) becomes empty instead of rendering a blank bullet.
export function getNotesToPersist(
  scrapType: ScrapType,
  notes: string | undefined,
) {
  if (!notes) {
    return notes;
  }

  if (scrapType === ScrapType.Markdown) {
    return notes.split("\n").every((line) => emptyMarkdownListItem.test(line))
      ? ""
      : notes;
  }

  if (scrapType !== ScrapType.List) {
    return notes;
  }

  let items: IScrapListItem[];
  try {
    items = JSON.parse(notes);
  } catch {
    return notes;
  }

  if (items.length === 1 && !items[0]?.label?.trim()) {
    return emptyListNotes;
  }

  return notes;
}

// The persisted form of a list holding nothing is "[]", while a scrap that was
// never given any content has no notes at all. Both mean "empty", so they have
// to compare equal - otherwise the blank line edit mode adds would count as a
// change all on its own.
export function getComparableNotes(
  scrapType: ScrapType,
  notes: string | undefined,
) {
  const notesToPersist = getNotesToPersist(scrapType, notes) ?? "";

  return scrapType === ScrapType.List && notesToPersist === emptyListNotes
    ? ""
    : notesToPersist;
}

// A scrap with neither notes nor a title has nothing worth storing. A brand-new one is judged on
// the comparable form: holding nothing but the blank line edit mode adds does not make it worth
// creating. An existing scrap is judged on the raw notes instead, because emptiness there has to
// be persisted - the user may have just cleared the last item.
export function hasSomethingToSave(
  scrapType: ScrapType,
  notes: string | undefined,
  title: string | undefined,
  isNew: boolean,
) {
  if (title) {
    return true;
  }

  return isNew ? !!getComparableNotes(scrapType, notes) : !!notes;
}
