export interface IAttributeSearchResult {
  values: Record<string, string[]>;
  occurrenceCount: number;
  score: number;
}
