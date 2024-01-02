import { IAttributeSearchResult } from "../../../../serverApi/IAttributeSearchResult";
import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";
import { AttributeSearchMatch, doesMatch } from "./searchJournalAttributes";

export class SearchResult implements IAttributeSearchResult {
  readonly values: Record<string, string[]> = {};

  // todo: can be deleted after getting rid of server side stuff
  occurrenceCount?: number;
  score?: number;

  private readonly matches: AttributeSearchMatch[] = [];

  static create(
    match: AttributeSearchMatch,
    allMatches: AttributeSearchMatch[],
  ): SearchResult {
    const result = new SearchResult();
    result.addMatch(match);
    result.addMatches(
      ...allMatches.filter((m) => m.attributeKey !== match.attributeKey),
    );

    return result;
  }

  getHashCode(): string {
    return Object.keys(this.values)
      .flatMap((key) => `${key}:${this.values[key][0]}`)
      .sort()
      .join(";");
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

  addMatches(...matches: AttributeSearchMatch[]) {
    for (const match of matches) {
      this.addMatch(match);
    }
  }

  addMatch(match: AttributeSearchMatch) {
    for (const matchingTerm of match.matchingTerms) {
      if (this.hasMatchForTerm(matchingTerm)) {
        return;
      }
    }

    this.matches.push(match);
    this.values[match.attributeKey] = [match.valueKey];
  }

  private hasMatchForTerm(term: string) {
    return (
      this.matches.filter((m) => m.matchingTerms.indexOf(term) > -1).length > 0
    );
  }
}
