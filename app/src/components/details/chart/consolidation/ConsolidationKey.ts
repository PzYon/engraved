import { GroupByTime } from "./GroupByTime";

export class ConsolidationKey {
  private static readonly separator = "::";

  private constructor(
    public year: number,
    public month: number,
    public day: number,
  ) {}

  static build(dateTime: string, groupByTime: GroupByTime): ConsolidationKey {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    switch (groupByTime) {
      case GroupByTime.Day:
        return new ConsolidationKey(year, month, day);
      case GroupByTime.Month:
        return new ConsolidationKey(year, month, 0);
      default:
        throw new Error(`GroupBy ${groupByTime} is not yet supported.`);
    }
  }

  static deserialize(s: string): ConsolidationKey {
    const segments = s.split(ConsolidationKey.separator);
    if (segments.length !== 3) {
      throw new Error(`${s} is not a valid ConsolidationKey.`);
    }

    return new ConsolidationKey(
      parseInt(segments[0]),
      parseInt(segments[1]),
      parseInt(segments[2]),
    );
  }

  serialize(): string {
    return [this.year, this.month, this.day].join(ConsolidationKey.separator);
  }
}
