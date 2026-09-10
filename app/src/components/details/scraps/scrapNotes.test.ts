import { getComparableNotes, getNotesToPersist } from "./scrapNotes";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { IScrapListItem } from "./list/IScrapListItem";

describe("scrapNotes", () => {
  describe("getNotesToPersist", () => {
    it("should drop a lone blank item", () => {
      expect(getNotesToPersist(ScrapType.List, asNotes(item("")))).toBe("[]");
    });

    it("should drop a lone whitespace-only item", () => {
      expect(getNotesToPersist(ScrapType.List, asNotes(item("   ")))).toBe(
        "[]",
      );
    });

    it("should drop a lone item without a label", () => {
      expect(getNotesToPersist(ScrapType.List, JSON.stringify([{}]))).toBe(
        "[]",
      );
    });

    it("should keep a lone item that has content", () => {
      const notes = asNotes(item("milk"));
      expect(getNotesToPersist(ScrapType.List, notes)).toBe(notes);
    });

    it("should keep a blank item when it is not the only one", () => {
      const notes = asNotes(item("milk"), item(""));
      expect(getNotesToPersist(ScrapType.List, notes)).toBe(notes);
    });

    it("should leave an already empty list alone", () => {
      expect(getNotesToPersist(ScrapType.List, "[]")).toBe("[]");
    });

    it("should not touch markdown notes", () => {
      expect(getNotesToPersist(ScrapType.Markdown, "  ")).toBe("  ");
    });

    it("should not touch undefined notes", () => {
      expect(getNotesToPersist(ScrapType.List, undefined)).toBe(undefined);
    });

    it("should not touch notes that are not valid json", () => {
      expect(getNotesToPersist(ScrapType.List, "not json")).toBe("not json");
    });
  });

  describe("getComparableNotes", () => {
    it("should treat a lone blank item, an empty list and no notes as equal", () => {
      const blankItem = getComparableNotes(ScrapType.List, asNotes(item("")));

      expect(blankItem).toBe(getComparableNotes(ScrapType.List, "[]"));
      expect(blankItem).toBe(getComparableNotes(ScrapType.List, undefined));
    });

    it("should not treat a list with content as empty", () => {
      expect(
        getComparableNotes(ScrapType.List, asNotes(item("milk"))),
      ).not.toBe(getComparableNotes(ScrapType.List, "[]"));
    });

    it("should not collapse markdown notes that happen to read as an empty list", () => {
      expect(getComparableNotes(ScrapType.Markdown, "[]")).toBe("[]");
    });
  });
});

function item(label: string): IScrapListItem {
  return { label, isCompleted: false, depth: 0 };
}

function asNotes(...items: IScrapListItem[]) {
  return JSON.stringify(items);
}
