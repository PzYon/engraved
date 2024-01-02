import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";
import { IAttributeSearchResult } from "../../../../serverApi/IAttributeSearchResult";
import { SearchResult } from "./SearchResult";

export type AttributeSearchMatch = {
  attributeKey: string;
  valueKey: string;
  matchingTerms: string[];
};

export function doesMatch(text: string, searchTerm: string) {
  return text.toLowerCase().includes(searchTerm.toLowerCase());
}

export function extractTerms(searchText: string) {
  return searchText.split(" ").filter((t) => !!t);
}

function transformMatchToResults(allMatches: AttributeSearchMatch[]) {
  return allMatches.reduce((acc: SearchResult[], match) => {
    const result = SearchResult.createFromMatch(match);
    acc.push(result);

    for (const subMatch of allMatches.filter(
      (m) => m.attributeKey !== match.attributeKey,
    )) {
      result.addMatch(subMatch);
    }

    return acc;
  }, []);
}

export function searchJournalAttributes(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const searchTerms = extractTerms(searchText);

  const allMatches: AttributeSearchMatch[] = getAllMatches(
    attributes,
    searchTerms,
  );

  const results = transformMatchToResults(allMatches);

  return filterIncompleteAndDuplicates(results, attributes, searchTerms);
}

function getAllMatches(
  attributes: IJournalAttributes,
  searchTerms: string[],
): AttributeSearchMatch[] {
  const matches: AttributeSearchMatch[] = [];

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
        matches.push(match);
      }
    }
  }

  return matches;
}

function filterIncompleteAndDuplicates(
  results: SearchResult[],
  attributes: IJournalAttributes,
  searchTerms: string[],
) {
  return results.reduce(
    (
      acc: {
        hashCodes: string[];
        results: SearchResult[];
      },
      result: SearchResult,
    ) => {
      const hashCode = result.getHashCode();

      if (
        acc.hashCodes.indexOf(hashCode) === -1 &&
        result.doesContainAllTerms(attributes, ...searchTerms)
      ) {
        acc.results.push(result);
        acc.hashCodes.push(hashCode);
      }

      return acc;
    },
    {
      results: [],
      hashCodes: [],
    },
  ).results;
}
