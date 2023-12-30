import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import { IJournalAttribute } from "../../../serverApi/IJournalAttribute";
import { IAttributeSearchResult } from "../../../serverApi/IAttributeSearchResult";

export function searchJournalAttributes(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const results: IAttributeSearchResult[] = [];

  for (const term of searchText.split(" ")) {
    for (const attributeKey of Object.keys(attributes)) {
      const attribute: IJournalAttribute = attributes[attributeKey];

      for (const valueKey of Object.keys(attribute.values)) {
        if (attribute.values[valueKey].toLowerCase().includes(term)) {
          if (
            !results.find((r) => r.values[attributeKey]?.indexOf(valueKey) > -1)
          )
            results.push({
              values: { [attributeKey]: [valueKey] },
              score: undefined,
              occurrenceCount: undefined,
            });
        }
      }
    }
  }

  return results;
}
