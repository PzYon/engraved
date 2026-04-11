import { JournalType } from "../serverApi/JournalType";
import { CounterJournalType } from "./CounterJournalType";
import { GaugeJournalType } from "./GaugeJournalType";
import { TimerJournalType } from "./TimerJournalType";
import { IJournalType } from "./IJournalType";
import { ScrapsJournalType } from "./ScrapsJournalType";
import { LogBookJournalType } from "./LogBookJournalType";

export class JournalTypeFactory {
  static create(type: JournalType): IJournalType {
    switch (type) {
      case JournalType.Counter:
        return new CounterJournalType();
      case JournalType.Gauge:
        return new GaugeJournalType();
      case JournalType.Timer:
        return new TimerJournalType();
      case JournalType.Scraps:
        return new ScrapsJournalType();
      case JournalType.LogBook:
        return new LogBookJournalType();
    }
  }
}
