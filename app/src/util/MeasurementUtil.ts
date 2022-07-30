import { IMetricAttributeValues } from "../serverApi/IMetricAttributeValues";

export function hasValues(
  metricAttributeValues: IMetricAttributeValues,
  selectedValues: { [p: string]: string[] }
): boolean {
  const keys = Object.keys(selectedValues).filter(
    (k) => selectedValues[k].length
  );

  for (const key of keys) {
    const selectedValue = selectedValues[key];
    const appliedValue = metricAttributeValues[key];

    if (
      !appliedValue?.length ||
      appliedValue.indexOf(selectedValue[0]) === -1
    ) {
      return false;
    }
  }

  return true;
}
