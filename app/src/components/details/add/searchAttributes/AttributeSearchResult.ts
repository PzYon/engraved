import {
  IAttributeSearchMatch,
  IAttributeSearchResult,
} from "./searchJournalAttributes";

export class AttributeSearchResult implements IAttributeSearchResult {
  readonly values: Record<string, string[]> = {};

  // todo: can be deleted after getting rid of server side stuff
  occurrenceCount?: number;
  score?: number;

  private readonly matches: IAttributeSearchMatch[] = [];

  private constructor() {}

  static create(
    match: IAttributeSearchMatch,
    allMatches: IAttributeSearchMatch[],
  ): AttributeSearchResult {
    const result = new AttributeSearchResult();
    result.ensureMatch(match);
    result.ensureMatches(
      ...allMatches.filter((m) => m.attributeKey !== match.attributeKey),
    );

    return result;
  }

  ensureMatches(...matches: IAttributeSearchMatch[]) {
    for (const match of matches) {
      this.ensureMatch(match);
    }
  }

  ensureMatch(match: IAttributeSearchMatch) {
    if (this.hasMatchForAllTerms(...match.matchingTerms)) {
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

  hasMatchForAllTerms(...terms: string[]) {
    return !terms.some((t) => !this.hasMatchForTerm(t));
  }

  private hasMatchForTerm(term: string) {
    return (
      this.matches.filter((m) => m.matchingTerms.indexOf(term) > -1).length > 0
    );
  }
}
