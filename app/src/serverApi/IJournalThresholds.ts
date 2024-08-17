import { ThresholdScope } from "../components/details/thresholds/ThresholdRow";

export interface IJournalThresholds {
  [attributeKey: string]: {
    [attributeValueKey: string]: {
      scope: ThresholdScope;
      value: number;
    };
  };
}
