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

  get durationInDays(): number {
    const diff = differenceInDays(this.to, this.from);

    if (this.scope === ThresholdScope.Month && diff < 30) {
      return 30;
    }

    return diff;
  }

  get thresholdForDuration(): number {
    if (this.scope === ThresholdScope.Overall) {
      return this.thresholdValue;
    }

    if (this.scope === ThresholdScope.Month) {
      return (
        (Math.round((this.thresholdValue / 30) * 1000) / 1000) *
        this.durationInDays
      );
    }

    return this.thresholdValue * this.durationInDays;
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

  constructor(
    private definition: IThresholdDefinition,
    public currentValue: number,
    private from: Date,
    private to: Date,
  ) {}
}
