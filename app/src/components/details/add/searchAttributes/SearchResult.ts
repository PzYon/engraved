import { IAttributeSearchResult } from "../../../../serverApi/IAttributeSearchResult";
import { AttributeSearchMatch } from "./searchJournalAttributes";

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

  doesContainAllTerms(...terms: string[]) {
    for (const term of terms) {
      if (!this.hasMatchForTerm(term)) {
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
    if (this.doesContainAllTerms(...match.matchingTerms)) {
      return;
    }

    this.matches.push(match);
    this.values[match.attributeKey] = [match.valueKey];
  }

  getHashCode(): string {
    return Object.keys(this.values)
      .flatMap((key) => `${key}:${this.values[key][0]}`)
      .sort()
      .join(";");
  }

  private hasMatchForTerm(term: string) {
    return (
      this.matches.filter((m) => m.matchingTerms.indexOf(term) > -1).length > 0
    );
  }
}
