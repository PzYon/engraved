import { ThresholdScope } from "../components/details/thresholds/ThresholdScope";

export interface IThresholdValue {
  thresholdDefinition: {
    scope: ThresholdScope;
    value: number;
  };
  actualValue: number;
}

export interface IThresholdValues {
  [attributeKey: string]: {
    [valueKey: string]: IThresholdValue;
  };
}
