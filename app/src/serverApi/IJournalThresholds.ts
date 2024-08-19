import { ThresholdScope } from "../components/details/thresholds/ThresholdScope";

export interface IJournalThresholds {
  [attributeKey: string]: {
    [attributeValueKey: string]: {
      scope: ThresholdScope;
      value: number;
    };
  };
}
