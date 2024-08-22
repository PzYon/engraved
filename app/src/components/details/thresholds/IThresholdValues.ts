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
    if (
      this.scope === ThresholdScope.Overall ||
      this.scope === ThresholdScope.Day
    ) {
      return this.thresholdValue;
    }

    if (!this.to || !this.from) {
      return this.thresholdValue;
    }

    const durationInDays = differenceInDays(this.to, this.from);
    return durationInDays * (this.thresholdValue / 30);
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
