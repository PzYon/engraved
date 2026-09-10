import { ScrapType } from "../../../serverApi/IScrapEntry";
import { IScrapListItem } from "./list/IScrapListItem";

const emptyListNotes = JSON.stringify([]);

// While editing, a list always keeps at least one (possibly blank) line so the
// user has something to type into. When that lone line is still empty on save,
// the list is effectively empty and is persisted as such rather than storing a
// meaningless blank item.
export function getNotesToPersist(
  scrapType: ScrapType,
  notes: string | undefined,
) {
  if (scrapType !== ScrapType.List || !notes) {
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
