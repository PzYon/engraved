import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import { IAttributeSearchResult } from "../../../serverApi/IAttributeSearchResult";
import { IJournalAttribute } from "../../../serverApi/IJournalAttribute";

export type AttributeSearchMatch = {
  attributeKey: string;
  valueKey: string;
  matchingTerms: string[];
};

export function searchJournalAttributes(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const allMatches: AttributeSearchMatch[] = [];

  const searchTerms = searchText.split(" ");

  for (const attributeKey of Object.keys(attributes)) {
    for (const valueKey of Object.keys(attributes[attributeKey].values)) {
      const match: AttributeSearchMatch = {
        attributeKey: attributeKey,
        valueKey: valueKey,
        matchingTerms: [],
      };

      for (const searchTerm of searchTerms) {
        if (doesMatch(attributes[attributeKey].values[valueKey], searchTerm)) {
          match.matchingTerms.push(searchTerm);
        }
      }

      if (match.matchingTerms.length) {
        allMatches.push(match);
      }
    }
  }

  const results: SearchResult[] = [];

  for (const match of allMatches) {
    const result = SearchResult.createFromMatch(match);
    results.push(result);

    for (const innerMatch of allMatches.filter(
      (m) => m.attributeKey !== match.attributeKey,
    )) {
      result.addMatch(innerMatch);
    }
  }

  const finalResults: IAttributeSearchResult[] = [];
  const finalResultHashes: string[] = [];

  for (const result of results) {
    if (!result.doesContainAllTerms(attributes, ...searchTerms)) {
      continue;
    }

    const hashCode = result.getHashCode();

    if (finalResultHashes.indexOf(hashCode) > -1) {
      continue;
    }

    finalResults.push(result);
    finalResultHashes.push(hashCode);
  }

  return finalResults;
}

export function searchJournalAttributesNew(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const matchingValuesBySearchTerm: {
    [searchTerm: string]: Record<string, string[]>;
  } = {};

  const searchTerms = searchText.split(" ");

  for (const searchTerm of searchTerms) {
    for (const attributeKey of Object.keys(attributes)) {
      for (const valueKey of Object.keys(attributes[attributeKey].values)) {
        if (doesMatch(attributes[attributeKey].values[valueKey], searchTerm)) {
          if (!matchingValuesBySearchTerm[searchTerm]) {
            matchingValuesBySearchTerm[searchTerm] = {};
          }

          if (!matchingValuesBySearchTerm[searchTerm][attributeKey]) {
            matchingValuesBySearchTerm[searchTerm][attributeKey] = [];
          }

          matchingValuesBySearchTerm[searchTerm][attributeKey].push(valueKey);
        }
      }
    }
  }

  let isFirstTerm = true;
  const results: SearchResult[] = [];

  for (const searchTerm of searchTerms) {
    if (!matchingValuesBySearchTerm[searchTerm]) {
      // no match for a specific search term
      return [];
    }

    for (const attributeKey of Object.keys(
      matchingValuesBySearchTerm[searchTerm],
    )) {
      for (const valueKey of matchingValuesBySearchTerm[searchTerm][
        attributeKey
      ]) {
        if (isFirstTerm) {
          results.push(SearchResult.create(attributeKey, valueKey));
        } else {
          for (const result of results) {
            result.values[attributeKey] = [valueKey];
          }
        }
      }
    }

    isFirstTerm = false;
  }

  return results.filter((r) =>
    r.doesContainAllTerms(attributes, ...searchTerms),
  );
}

function doesMatch(text: string, searchTerm: string) {
  return text.toLowerCase().includes(searchTerm.toLowerCase());
}

export function searchJournalAttributesX(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const results: SearchResult[] = [];

  let isFirstTerm = true;

  const searchTerms = searchText.split(" ");

  for (const term of searchTerms) {
    for (const attributeKey of Object.keys(attributes)) {
      const attribute: IJournalAttribute = attributes[attributeKey];

      for (const valueKey of Object.keys(attribute.values)) {
        if (
          doesMatch(attribute.values[valueKey], term) &&
          !results.find((r) => r.values[attributeKey]?.indexOf(valueKey) > -1)
        ) {
          if (isFirstTerm) {
            results.push(SearchResult.create(attributeKey, valueKey));
          } else {
            for (const result of results) {
              result.values[attributeKey] = [valueKey];
            }
          }
        }
      }
    }

    isFirstTerm = false;
  }

  return results.filter((r) =>
    r.doesContainAllTerms(attributes, ...searchTerms),
  );
}

export class SearchResult implements IAttributeSearchResult {
  readonly values: Record<string, string[]> = {};
  occurrenceCount?: number;
  score?: number;
  private matches: AttributeSearchMatch[] = [];

  getHashCode(): string {
    return Object.keys(this.values)
      .flatMap((key) => `${key}:${this.values[key][0]}`)
      .sort()
      .join(";");
  }

  doesMatch(searchTerm: string): boolean {
    return (
      this.matches.filter((m) => m.matchingTerms.indexOf(searchTerm) > -1)
        .length > 0
    );
  }

  addMatch(match: AttributeSearchMatch) {
    this.matches.push(match);
    this.values[match.attributeKey] = [match.valueKey];
  }

  static createFromMatch(match: AttributeSearchMatch): SearchResult {
    const foo = new SearchResult();
    foo.values[match.attributeKey] = [match.valueKey];
    foo.matches.push(match);
    return foo;
  }

  static create(attributeKey: string, valueKey: string): SearchResult {
    const foo = new SearchResult();
    foo.values[attributeKey] = [valueKey];
    return foo;
  }

  doesContainAllTerms(attributes: IJournalAttributes, ...terms: string[]) {
    for (const term of terms) {
      let hasMatchForTerm = false;
      for (const attributeKey of Object.keys(this.values)) {
        for (const valueKey of this.values[attributeKey]) {
          if (doesMatch(attributes[attributeKey].values[valueKey], term)) {
            hasMatchForTerm = true;
          }
        }
      }

      if (!hasMatchForTerm) {
        return false;
      }
    }

    return true;
  }
}
