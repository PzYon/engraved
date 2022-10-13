export interface IAttributeSearchResult {
  values: { [key: string]: string[] };
  occurrenceCount: number;
  score: number;
}
