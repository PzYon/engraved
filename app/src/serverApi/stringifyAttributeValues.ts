import { IJournalAttributeValues } from "./IJournalAttributeValues";

export function stringifyAttributeValues(
  attributeValues: IJournalAttributeValues,
): string {
  return Object.keys(attributeValues)
    .map((attributeKey) => {
      const values = attributeValues[attributeKey];
      return !values?.length ? null : `${attributeKey}:${values.join(",")}`;
    })
    .filter((s) => !!s)
    .join(";");
}
