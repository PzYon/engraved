import { IEntity } from "../../../serverApi/IEntity";
import { filterOverviewItems } from "./filterOverviewItems";

describe("filterOverviewItems", () => {
  const journal = { id: "journal", name: "Groceries" } as IEntity;
  const scrap = { id: "scrap", title: "Grocery list" } as IEntity;
  const entry = { id: "entry" } as IEntity;

  const items = [journal, scrap, entry];

  function getIds(filteredItems: IEntity[]) {
    return filteredItems.map((i) => i.id);
  }

  describe("without search text", () => {
    it("should return all items when there is no filter", () => {
      const result = filterOverviewItems(items, undefined, false);

      expect(getIds(result)).toEqual(["journal", "scrap", "entry"]);
    });

    it("should treat an empty search text as no search text", () => {
      const result = filterOverviewItems(items, "", false);

      expect(getIds(result)).toEqual(["journal", "scrap", "entry"]);
    });

    it("should apply the filter", () => {
      const result = filterOverviewItems(
        items,
        undefined,
        false,
        (item) => item.id !== "scrap",
      );

      expect(getIds(result)).toEqual(["journal", "entry"]);
    });

    it("should skip the filter when all items are to be shown", () => {
      const result = filterOverviewItems(items, undefined, true, () => false);

      expect(getIds(result)).toEqual(["journal", "scrap", "entry"]);
    });
  });

  describe("with search text", () => {
    it("should match the name of a journal", () => {
      const result = filterOverviewItems(items, "ceries", false);

      expect(getIds(result)).toEqual(["journal"]);
    });

    it("should match the title of a scrap", () => {
      const result = filterOverviewItems(items, "list", false);

      expect(getIds(result)).toEqual(["scrap"]);
    });

    it("should ignore casing", () => {
      const result = filterOverviewItems(items, "GROCER", false);

      expect(getIds(result)).toEqual(["journal", "scrap"]);
    });

    it("should not match items without a name or title", () => {
      const result = filterOverviewItems([entry], "e", false);

      expect(result).toEqual([]);
    });

    it("should search in the items the filter would hide", () => {
      const result = filterOverviewItems(items, "grocer", false, () => false);

      expect(getIds(result)).toEqual(["journal", "scrap"]);
    });
  });
});
