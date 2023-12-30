import { searchJournalAttributes } from "./searchJournalAttributes";
import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import { IAttributeSearchResult } from "../../../serverApi/IAttributeSearchResult";

describe("searchJournalAttributes", () => {
  it("returns matches for one term search from one attribute", () => {
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

    expect(searchResults.length).toBe(2);
    expect(Object.keys(searchResults[0].values).length).toBe(1);
    expect(searchResults[0].values.color[0]).toBe("gray");
    expect(Object.keys(searchResults[1].values).length).toBe(1);
    expect(searchResults[1].values.color[0]).toBe("blue");
  });

  it("returns matches for one term search from multiple attributes", () => {
    const attributes: IJournalAttributes = {
      color: {
        name: "Farbe",
        values: {
          red: "Rot",
          black: "Black",
        },
      },
      status: {
        name: "XXX",
        values: {
          alive: "Dead",
          dead: "Tot",
        },
      },
    };

    const searchResults: IAttributeSearchResult[] = searchJournalAttributes(
      attributes,
      "ot",
    );

    expect(searchResults.length).toBe(2);
    expect(Object.keys(searchResults[0].values).length).toBe(1);
    expect(searchResults[0].values.color[0]).toBe("red");
    expect(Object.keys(searchResults[1].values).length).toBe(1);
    expect(searchResults[1].values.status[0]).toBe("dead");
  });

  it("returns (distinct) matches for two term search from one attribute", () => {
    const attributes: IJournalAttributes = {
      country: {
        name: "Land",
        values: {
          ch: "Switzerland",
          de: "Germany",
          us: "United States of America",
        },
      },
    };

    const searchResults: IAttributeSearchResult[] = searchJournalAttributes(
      attributes,
      "an er",
    );

    expect(searchResults.length).toBe(3);
    expect(Object.keys(searchResults[0].values).length).toBe(1);
    expect(searchResults[0].values.country[0]).toBe("ch");
    expect(Object.keys(searchResults[1].values).length).toBe(1);
    expect(searchResults[1].values.country[0]).toBe("de");
    expect(Object.keys(searchResults[2].values).length).toBe(1);
    expect(searchResults[2].values.country[0]).toBe("us");
  });

  it("returns unified matches for two different attributes", () => {
    const attributes: IJournalAttributes = {
      player: {
        name: "Player",
        values: {
          hurts: "Jalen Hurts",
          cousins: "Kirk Cousins",
          mahomes: "Patrick Mahomes",
        },
      },
      team: {
        name: "Team",
        values: {
          eagles: "Philadelphia Eagles",
          vikings: "Minnesota Vikings",
          chiefs: "Kansas City Chiefs",
        },
      },
    };

    const searchResults: IAttributeSearchResult[] = searchJournalAttributes(
      attributes,
      "mahomes chiefs",
    );

    expect(searchResults.length).toBe(1);
    expect(Object.keys(searchResults[0].values).length).toBe(2);
  });
});
