import { IJournalAttributes } from "../../../serverApi/IJournalAttributes";
import { IJournalAttribute } from "../../../serverApi/IJournalAttribute";
import { IAttributeSearchResult } from "../../../serverApi/IAttributeSearchResult";

export function searchJournalAttributes(
  attributes: IJournalAttributes,
  searchText: string,
): IAttributeSearchResult[] {
  const results: IAttributeSearchResult[] = [];

  let isFirstTerm = true;

  for (const term of searchText.split(" ")) {
    for (const attributeKey of Object.keys(attributes)) {
      const attribute: IJournalAttribute = attributes[attributeKey];

      for (const valueKey of Object.keys(attribute.values)) {
        if (
          attribute.values[valueKey].toLowerCase().includes(term) &&
          !results.find((r) => r.values[attributeKey]?.indexOf(valueKey) > -1)
        ) {
          if (isFirstTerm) {
            results.push({ values: { [attributeKey]: [valueKey] } });
          } else {
            for (const result of results) {
              result.values[attributeKey] = [valueKey];
            }
          }
        }
      }
    }

    isFirstTerm = false;
  }

  return results;
}
