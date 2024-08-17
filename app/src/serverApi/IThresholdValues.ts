import { ThresholdScope } from "../components/details/thresholds/ThresholdRow";

export interface IThresholdValues {
  [attributeKey: string]: {
    [valueKey: string]: {
      thresholdDefinition: {
        scope: ThresholdScope;
        value: number;
      };
      actualValue: number;
    };
  };
}
