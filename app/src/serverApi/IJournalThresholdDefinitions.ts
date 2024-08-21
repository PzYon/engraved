import { ThresholdScope } from "../components/details/thresholds/ThresholdScope";

export interface IThresholdDefinition {
  scope: ThresholdScope;
  value: number;
}

export interface IJournalThresholdDefinitions {
  [attributeKey: string]: {
    [attributeValueKey: string]: IThresholdDefinition;
  };
}
