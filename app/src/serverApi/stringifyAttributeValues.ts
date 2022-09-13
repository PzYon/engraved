import { IMetricAttributeValues } from "./IMetricAttributeValues";

export function stringifyAttributeValues(
  attributeValues: IMetricAttributeValues
): string {
  return Object.keys(attributeValues)
    .map((attributeKey) => {
      const values = attributeValues[attributeKey];
      return !values?.length ? null : `${attributeKey}:${values.join(",")};`;
    })
    .join(";");
}
