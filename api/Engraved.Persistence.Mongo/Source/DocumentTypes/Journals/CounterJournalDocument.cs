﻿using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class CounterJournalDocument : JournalDocument
{
  public override JournalType Type => JournalType.Counter;
}
