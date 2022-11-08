export interface IThresholdValues {
  [attributeKey: string]: {
    [valueKey: string]: {
      thresholdValue: number;
      actualValue: number;
    };
  };
}
