import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";
import { IAttributeSearchResult } from "../../../../serverApi/IAttributeSearchResult";
import { AttributeSearchResult } from "./AttributeSearchResult";

export interface IAttributeSearchMatch {
  attributeKey: string;
  valueKey: string;
  matchingTerms: string[];
}

export function doesMatch(text: string, searchTerm: string) {
  return searchTerm
    ? text.toLowerCase().includes(searchTerm.toLowerCase())
    : false;
}

export function extractTerms(searchText: string) {
  return (searchText ?? "").split(" ").filter((t) => !!t);
}

export function searchJournalAttributes(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const searchTerms = extractTerms(searchText);

  const allMatches: IAttributeSearchMatch[] = getAllBasicMatches(
    attributes,
    searchTerms,
  );

  const results = allMatches.map((m) =>
    AttributeSearchResult.create(m, allMatches),
  );

  return filterIncompleteAndDuplicates(results, searchTerms);
}

function getAllBasicMatches(
  attributes: IJournalAttributes,
  searchTerms: string[],
): IAttributeSearchMatch[] {
  const matches: IAttributeSearchMatch[] = [];

  for (const attributeKey of Object.keys(attributes)) {
    for (const valueKey of Object.keys(attributes[attributeKey].values)) {
      const match: IAttributeSearchMatch = {
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
  results: AttributeSearchResult[],
  searchTerms: string[],
) {
  return results.reduce(
    (
      acc: {
        hashCodes: string[];
        results: AttributeSearchResult[];
      },
      result: AttributeSearchResult,
    ) => {
      const hashCode = result.getHashCode();

      if (
        acc.hashCodes.indexOf(hashCode) === -1 &&
        result.hasMatchForAllTerms(...searchTerms)
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
