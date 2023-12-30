import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import { IJournalAttribute } from "../../../serverApi/IJournalAttribute";
import { IAttributeSearchResult } from "../../../serverApi/IAttributeSearchResult";

export function searchJournalAttributes(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const results: IAttributeSearchResult[] = [];

  for (const attributeKey of Object.keys(attributes)) {
    const attribute: IJournalAttribute = attributes[attributeKey];

    for (const valueKey of Object.keys(attribute.values)) {
      if (attribute.values[valueKey].toLowerCase().includes(searchText)) {
        results.push({
          values: { [attributeKey]: [valueKey] },
          score: 123,
          occurrenceCount: 123,
        });
      }
    }
  }

  return results;
}
