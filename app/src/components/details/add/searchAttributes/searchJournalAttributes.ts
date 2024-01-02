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
      let doesNotMatch = true;

      for (const matchingTerm of innerMatch.matchingTerms) {
        if (result.doesMatch(matchingTerm)) {
          doesNotMatch = false;
        }
      }

      if (doesNotMatch) {
        result.addMatch(innerMatch);
      }
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
