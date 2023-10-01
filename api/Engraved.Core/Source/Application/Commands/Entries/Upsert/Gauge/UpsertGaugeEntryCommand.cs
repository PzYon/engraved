using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Gauge;

public class UpsertGaugeEntryCommand : BaseUpsertEntryCommand
{
  public double? Value { get; set; }

  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Gauge;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertGaugeEntryCommandExecutor(this);
  }
}
