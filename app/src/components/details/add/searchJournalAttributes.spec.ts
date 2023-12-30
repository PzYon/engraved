import { searchJournalAttributes } from "./searchJournalAttributes";
import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import { IAttributeSearchResult } from "../../../serverApi/IAttributeSearchResult";

describe("searchJournalAttributes", () => {
  it("...", () => {
    const attributes: IJournalAttributes = {
      color: {
        name: "Farbe",
        values: {
          gray: "Grau",
          blue: "Blau",
          red: "Rot",
        },
      },
    };

    const searchResults: IAttributeSearchResult[] = searchJournalAttributes(
      attributes,
      "au",
    );

    // todo:
    // - should we return key or value (Grau vs gray)?

    // required tests:
    // - search string with multiple words (for multiple attributes)
    // - case insensitivity

    expect(searchResults.length).toBe(2);
    expect(Object.keys(searchResults[0].values).length).toBe(1);
    expect(searchResults[0].values.color[0]).toBe("Grau");
    expect(Object.keys(searchResults[1].values).length).toBe(1);
    expect(searchResults[1].values.color[0]).toBe("Blau");
  });
});
