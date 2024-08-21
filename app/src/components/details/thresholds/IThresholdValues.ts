import { ThresholdScope } from "./ThresholdScope";
import { IThresholdDefinition } from "../../../serverApi/IJournalThresholdDefinitions";

export interface IThresholdValues {
  [attributeKey: string]: {
    [valueKey: string]: ThresholdValue;
  };
}

export class ThresholdValue {
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
