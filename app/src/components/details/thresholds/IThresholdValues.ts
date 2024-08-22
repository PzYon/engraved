import { ThresholdScope } from "./ThresholdScope";
import { IThresholdDefinition } from "../../../serverApi/IJournalThresholdDefinitions";
import { differenceInDays } from "date-fns";

export interface IThresholdValues {
  [attributeKey: string]: {
    [valueKey: string]: ThresholdValue;
  };
}

export class ThresholdValue {
  get thresholdValue(): number {
    return this.definition.value;
  }

  get thresholdForDuration(): number {
    return differenceInDays(this.to, this.from) * this.dailyThreshold;
  }

  get remainingValueForDuration(): number {
    return this.thresholdForDuration - this.currentValue;
  }

  get isReached(): boolean {
    return this.remainingValueForDuration <= 0;
  }

  get scope(): ThresholdScope {
    return this.definition.scope;
  }

  get dailyThreshold(): number {
    switch (this.definition.scope) {
      case ThresholdScope.Day:
        return this.definition.value;
      case ThresholdScope.Month:
        return this.definition.value / 30;
      case ThresholdScope.Overall:
        throw new Error("No whuat!?!??");
    }
  }

  constructor(
    private definition: IThresholdDefinition,
    public currentValue: number,
    private from: Date,
    private to: Date,
  ) {}
}
