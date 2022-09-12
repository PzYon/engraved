import { IMetricAttributeValues } from "./IMetricAttributeValues";

export function stringifyAttributeValues(
  attributeValues: IMetricAttributeValues
): string {
  let result = "";

  for (const attributeKey in attributeValues) {
    const values = attributeValues[attributeKey];
    if (!values?.length) {
      continue;
    }

    result += `${attributeKey}:${values.join(",")};`;
  }

  return result;
}
