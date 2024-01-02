import { IAttributeSearchResult } from "../../../../serverApi/IAttributeSearchResult";
import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";
import { AttributeSearchMatch, doesMatch } from "./searchJournalAttributes";

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
