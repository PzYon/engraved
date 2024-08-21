import { ThresholdScope } from "./ThresholdScope";
import { IThresholdDefinition } from "../../../serverApi/IJournalThresholds";

export interface IThresholdValues {
  [attributeKey: string]: {
    [valueKey: string]: NewThresholdValue;
  };
}

export class NewThresholdValue {
  get thresholdValue(): number {
    return this.definition.value;
  }

  get remainingValue(): number {
    return this.thresholdValue - this.currentValue;
  }

  get isReached(): boolean {
    return this.remainingValue <= 0;
  }

  get scope(): ThresholdScope {
    return this.definition.scope;
  }

  constructor(
    private definition: IThresholdDefinition,
    public currentValue: number,
  ) {}
}
