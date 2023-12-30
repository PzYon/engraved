export interface IAttributeSearchResult {
  values: Record<string, string[]>;
  // todo: can be deleted after getting rid of server side stuff
  occurrenceCount?: number;
  score?: number;
}
